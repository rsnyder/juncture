<template>

  <div ref="root" class="image">

    <img v-if="static && staticImage" 
      :src="staticImage" 
      :style="{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        objectFit: props.cover && 'cover' || fit
      }"
    />
    <div v-else-if="tileSources" ref="osdEl" style="height:100%;"
      id="osd" role="img" :aria-label="caption" :alt="caption">
      <div v-if="coords"
        class="coords"
        v-html="coords" 
        @click="copyTextToClipboard(coords || '')">
      </div>
    </div>

    <div v-if="manifests.length && !noCaption" class="status">

      <div v-if="annotations.length" class="annotations-indicator" @click="toggleAnnotations">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
        <sl-badge v-if="!annotationsVisible" variant="primary" pill>{{annotations.length}}</sl-badge>
      </div>

      <ve-caption
        :manifest="manifests[selected]" 
        :caption="caption"
        :description="src && description"
        :annoid="annoid">
      </ve-caption>
    </div>
  </div>
  
  </template>
  
  <script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import OpenSeadragon, { TileSource } from 'openseadragon'
  import { default as Annotorious } from '@recogito/annotorious-openseadragon'

  import { iiifServer, getManifest, isNumeric, mwImage, sha256 } from '../utils'
  
  const root = ref<HTMLElement>()
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const shadowRoot = computed(() => (root.value?.getRootNode() as ShadowRoot | null))
  // const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  watch(shadowRoot, (shadowRoot) => { shadowRoot?.children[1].classList.remove('sticky') })

  const props = defineProps({
    active: { type: Boolean, default: false },
    base: { type: String, default: '' },
    caption: { type: String },
    cover: { type: Boolean, default: false },
    data: { type: String },
    fit: { type: String, default: 'contain' },
    format: { type: String },
    height: { type: String },
    manifest: { type: String },
    noCaption: { type: Boolean, default: false },
    options: { type: String },
    refresh: { type: Boolean, default: false },
    region: { type: String },
    repoIsWritable: { type: Boolean, default: false },
    quality: { type: String },
    rotation: { type: Number },
    seq: { type: Number, default: 1},
    size: { type: String },
    slot: { type: String },
    src: { type: String },
    static: { type: Boolean, default: false},
    width: { type: String },
    zoomOnScroll: { type: Boolean, default: false },

    // for ad-hoc manifest creation
    attribution: { type: String },
    description: { type: String },
    label: { type: String },
    license: { type: String },
    owner: { type: String },
    summary: { type: String },
    title: { type: String },
    url: { type: String }
  })
  watch(props, () => { evalProps() })

  const window = (self as any).window
  const config = ref<any>(window.config || {})
  const source = computed(() => {
    if (config.value.source?.owner) return config.value.source
    else if (props.base) {
      let [owner, repository, branch, ...dir] = props.base.split('/')
      return { owner, repository, branch, dir: dir ? `/${dir.join('/')}/` : '/'}
    } 
    return null
  })
  const ghBaseurl = computed(() => `https://raw.githubusercontent.com/${source.value?.owner}/${source.value?.repository}/${source.value?.branch}/${source.value?.dir.replace(/\/(README|index)\.md$/,'')}`)

  const osdEl = ref<HTMLElement | null>(null)
  
  const definedWidth = ref<number>()
  const definedHeight = ref<number>()

  const width = computed(() => definedWidth.value || host.value?.clientWidth)
  const height = computed(() => definedHeight.value || host.value?.clientHeight)

  watch(host, (host) => {
    if (host) {
      // add component getter functions
      host.getManifest = () => manifests.value[selected.value]
      host.getLabel = () => manifests.value[selected.value]?.label?.en?.[0]

      let computedStyle = window.getComputedStyle(host)
      definedWidth.value  = (isNumeric(props.width) && parseInt(props.width || '0')) || computedStyle.width.slice(-2) === 'px' && parseInt(window.getComputedStyle(host).width.slice(0,-2)) || 0
      definedHeight.value  = (isNumeric(props.height) && parseInt(props.height || '0')) || computedStyle.height.slice(-2) === 'px' && parseInt(window.getComputedStyle(host).height.slice(0,-2)) || 0
    }
  })

  const staticImage = computed(() => {
    let itemInfo = manifests.value[selected.value] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[selected.value], imageDefs.value[selected.value].seq || 1).body
    if (!itemInfo) return ''
    let url
    let [region, size, rotation, ...rest] = props.options?.split('/') || []
    let [quality, format] = rest
    region = props.region || region || 'full'
    size = props.size
      ? props.size
      : size
        ? size
        : width.value
          ? height.value
            ? `${width.value},${height.value}`
            : `${width.value},`
          : height.value
            ? `,${height.value}`
            : '400,'
    let rotationDegrees = props.rotation || parseInt(rotation) || 0
    quality = props.quality || quality || 'default'
    format = props.format || format || 'jpg'
    url =`${itemInfo.service[0].id || itemInfo.service[0]['@id']}/${region}/${size}/${rotationDegrees}/${quality}.${format}`
    return url
  })

  const refresh = computed(() => {
    let refreshArg = new URLSearchParams(window.location.search).get('refresh')
    return props.refresh || refreshArg === 'true' || refreshArg === ''
  })

  const osdWidth = ref<number>(0)
  watch(osdWidth, () => {
    resize()
    if (osdWidth.value > 0 && (!tileSources.value.length || props.static)) init()
    if (osdWidth.value > 0 && !osd.value) initOpenSeadragon()
  })

  const imageDefs = ref<any[]>([])
  watch(imageDefs, async (imageDefs) => {
    manifests.value = await Promise.all(imageDefs.map(def => 
      (def.src || def.manifest)
        ? getManifest(def.src || def.manifest, refresh.value)
        : fetch(`https://${iiifServer}/manifest/${refresh.value ? '?refresh' : ''}`, {
          method: 'POST', 
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(def)
              .filter(([k,v]) => ['attribution', 'caption', 'description', 'fit', 'label', 'license', 'summary', 'title', 'url'].includes(k))
              .map(([k,v]) => {
                if (k === 'url' && (v as string).indexOf('http') < 0) {
                  v = (v as string).indexOf('wc:') === 0
                    ? mwImage((v as string).slice(3), 0)
                    : (v as string).indexOf('gh:') === 0
                      ? `${ghBaseurl.value}/${(v as string).slice(3)}`
                      : `${ghBaseurl.value}/${v}`
                }
                return [k, v]
              })
            )) 
        }).then(resp => resp.json())
    )).then((responses) => responses.flat().filter((r:any) => r))
  })

  const manifests = ref<any[]>([])

  const tileSources = computed(() => {
    return manifests.value.map((manifest, idx) => {
      let itemInfo = findItem({type:'Annotation', motivation:'painting'}, manifest, imageDefs.value[idx].seq || 1)?.body
      return itemInfo.service
        ? `${(itemInfo.service[0].id || itemInfo.service[0]['@id'])}/info.json` as unknown as TileSource
        : { url: itemInfo.id, type: 'image', buildPyramid: true } as unknown as TileSource
     
    })
  })
  watch(tileSources, (tileSources) => { osd.value?.open(tileSources) })

  const selected = ref<number>(0)
  
  watch(manifests, () => { host.value?.setAttribute('manifest', JSON.stringify(manifests.value[selected.value])) })
  watch(selected, () => { host.value?.setAttribute('manifest', JSON.stringify(manifests.value[selected.value])) })

  const selectedItemInfo = computed(() => 
    manifests.value[selected.value] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[selected.value], imageDefs.value[selected.value].seq || 1).body
  )
  
  const imageSize = computed(() => selectedItemInfo.value && { width: selectedItemInfo.value.width, height: selectedItemInfo.value.height} )
  const aspectRatio = computed(() => Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )
  watch(aspectRatio, () => { resize() })

  const annoid = computed(() => {
    let _annoid = selectedItemInfo.value && sha256(decodeURIComponent(selectedItemInfo.value.id?.split('/').pop().toLowerCase().replace('.jpeg','.jpg'))).slice(0,8)
    return _annoid
  })
  watch(annoid, () => { annotator.value?.loadAnnotations(annoid.value).then(annos => annotations.value = annos) })

  const annotator = ref<any>()
  const annotations = ref<any[]>([])
  const annotationsVisible = ref<boolean>(false)
  watch(annotationsVisible, () => annotator.value.setVisible(annotationsVisible.value) )
  function toggleAnnotations() { annotationsVisible.value = !annotationsVisible.value }

  function init() {
    function parseImageDefStr(s:String): Object {
      let tokens: string[] = []
      // s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
      s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/^\s*-\s+/g,'')
      s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
        if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
        else tokens.push(token)
      })
      let parsed:any = {}
      let positionalArgs = ['src', 'caption', 'options', 'fit', 'rotation', 'seq' ]
      tokens.filter(t => t !== 'image').forEach((token, idx) => {
        if (token.indexOf('=') > 0) {
          let i = token.indexOf('=')
          let key = token.slice(0, i)
          let value = token.slice(i+1)
          parsed[key] = value[0] === '"' ? value.slice(1,-1) : value 

        } else {
          parsed[positionalArgs[idx]] = token[0] === '"' ? token.slice(1,-1) : token 
        }
      })
      return parsed
    }

    function getImageDefs () {
      let imageProps = new Set(['attribution', 'caption', 'description', 'fit', 'label', 'license', 'manifest', 'noCaption', 'region', 'rotation', 'seq', 'src', 'summary', 'title', 'url'])
      let imageDefFromProps = (props.src || props.url || props.manifest) ? Object.fromEntries(Object.entries(props).filter(([k,v]) => imageProps.has(k) && v)) : null
      let _imageDefs: any[] = imageDefFromProps ? [imageDefFromProps] : []
      Array.from(host.value.querySelectorAll('li') as HTMLLIElement[])
        .map((li:HTMLLIElement) => parseImageDefStr(li.textContent || ''))
        .filter((def:any) => def.src || def.manifest || def.url)
        .forEach((def:any, idx) => _imageDefs.push({...def, idx}))

      _imageDefs.forEach(def => {
        if (def.src && def.src.indexOf('http') < 0) {
          if (!/^[\w-]+:/.test(def.src)) def.src = `gh:${source.value.owner}/${source.value.repository}${source.value.dir}/${def.src}`
        }
      })
      imageDefs.value = _imageDefs
    }

    new MutationObserver((mutationsList:any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') getImageDefs()       
      }
    }).observe(host.value, { childList: true, subtree: true, characterData: true })
    getImageDefs()
  }

  watch(osdEl, () => {
    if (osdEl.value  && !width.value) {
      new ResizeObserver(() => {
        osdWidth.value = osdEl.value?.clientWidth || osdWidth.value
      }).observe(osdEl.value)
      osdWidth.value = osdEl.value?.clientWidth

      new ResizeObserver(() => setOsdHeight()).observe(host.value.parentElement)
    }
  })

  // const width = ref<number>(0)
  watch(width, (width) => {
    let widthValue = isNumeric(props.width) ? `${props.width}px` : props.width
    root.value?.setAttribute('style', `width: ${widthValue}; margin: auto;`)
    osdWidth.value = width
   })

  // const height = ref<number>(0)
  watch(height, (height) => { 
    host.value.style.height = height ? `${height}px` : 'unset'
    setOsdHeight()
    osd.value?.viewport?.goHome(true)
   })

  // OpenSeadragon - https://openseadragon.github.io/docs/
  const osd = ref<OpenSeadragon.Viewer>()

  const caption = computed(() => props.caption || imageDefs.value[selected.value]?.caption || (manifests.value[selected.value] && manifests.value[selected.value]?.label?.en?.[0]))

  const coords = ref<string>()

  const interactionsHandlersInitialized = ref<boolean>(false)

  function evalProps() {
    if (props.active && !interactionsHandlersInitialized.value) {
      // addInteractionHandlers()
      interactionsHandlersInitialized.value = true
    }
    definedWidth.value = (isNumeric(props.width) && parseInt(props.width || '0')) || 0
    definedHeight.value = (isNumeric(props.width) && parseInt(props.width || '0')) || 0
  }

  onMounted(() => {
    evalProps()
  })

  // find an item in a IIIF manifest
  function findItem(toMatch: object, current: object, seq: number = 1): any {
    const found = _findItems(toMatch, current)
    return found.length >= seq ? found[seq-1] : null
  }

  // recursive helper for finding items in a IIIF manifest
  function _findItems(toMatch: object, current: any, found: object[] = []) {
    found = found || []
    if (current?.items) {
      for (let i = 0; i < current.items.length; i++ ) {
        let item = current.items[i]
        let isMatch = !Object.entries(toMatch).find(([attr, val]) => item[attr] && item[attr] !== val)
        if (isMatch) found.push(item)
        else _findItems(toMatch, item, found)
      }
    }
    return found
  }

  function setOsdHeight() {
    if (osdEl.value?.clientWidth) {
      let captionEl = host.value.querySelector('ve-caption')
      console.log(captionEl)
      let parentHeight = host.value.parentElement.clientHeight
      let imageViewerHeight = parentHeight - 124
      if (height.value) osdEl.value?.setAttribute('style', 'flex: 1 1 0%; position: relative')
      // else osdEl.value?.setAttribute('style', `height: ${Number(osdEl.value?.clientWidth / aspectRatio.value).toFixed(0)}px;`)
      else osdEl.value?.setAttribute('style', `height: ${imageViewerHeight}px`)

    
    }
  }

  // resize OSD viewer
  function resize() {
    setOsdHeight()
    osd.value?.viewport?.goHome(true)
  }

  function initOpenSeadragon() {
    if (osd.value || !osdEl.value) return
    setOsdHeight()
    const osdOptions: OpenSeadragon.Options = { // https://openseadragon.github.io/docs/OpenSeadragon.html#.Options
      element: osdEl.value,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      // tileSources: tileSources.value,
      homeFillsViewer: props.cover || props.fit === 'cover',
      // showNavigationControl: true,
      // minZoomImageRatio: 1,
      maxZoomPixelRatio: 10,
      // showRotationControl: true,
      // showHomeControl: true,
      // showZoomControl: true,
      // showFullPageControl: true,
      // showNavigator: false,
      sequenceMode: true,
      showReferenceStrip: true,
      
      // animationTime: 0.5,
      // springStiffness: 10,
      
      // visibilityRatio: 1.0,
      // constrainDuringPan: true
      gestureSettingsMouse: {
        dragToPan: true,
        scrollToZoom: true,
        clickToZoom: true,
        dblClickToZoom: false,
        dblClickDragToZoom: false,
        pinchToZoom: true,
        zoomToRefPoint: true,
        flickEnabled: false,
        flickMinSpeed: 120,
        flickMomentum: 0.25,
        pinchRotate: false
      },
      gestureSettingsTouch: {
        dragToPan: true,
        scrollToZoom: false,
        clickToZoom: true,
        dblClickToZoom: true,
        dblClickDragToZoom: true,
        pinchToZoom: true,
        zoomToRefPoint: true,
        flickEnabled: false,
        flickMinSpeed: 120,
        flickMomentum: 0.25,
        pinchRotate: false
      }
      
    }
    osd.value = OpenSeadragon(osdOptions)
    osd.value.addHandler('viewport-change', () => watchCoords())
    osd.value.addHandler('page', (e) => { selected.value = e.page })
    osd.value.world.addHandler('add-item', (e) => {
      let currentItem = imageDefs.value[selected.value]
      if (currentItem?.rotation) e.item.setRotation(parseInt(currentItem.rotation), true)

      if (currentItem?.region && osd.value) {
        let rect = parseRegionString(currentItem.region, osd.value)
        setTimeout(() => osd.value?.viewport.fitBounds(rect, false), 500)
      }
    })

    let annoBase = `${source.value.owner}/${source.value.repository}/${source.value.branch}${source.value.dir.slice(0,-1)}`
    annotator.value = new Annotator(osd.value, annoBase)
    annotator.value.addChangeListener((annos) => annotations.value = annos)
    if (annoid.value) annotator.value?.loadAnnotations(annoid.value).then(annos => annotations.value = annos)
    
    addInteractionHandlers()

    setTimeout(() => setViewportCoords(), 500)
    if (tileSources.value.length) osd.value?.open(tileSources.value)
    let owner = source.value?.owner
    let repository = source.value?.repository
    let branch
    let path = source.value?.dir.split('/').filter(pe => pe)
    let src = new URL(location.href).searchParams.get('source')?.split('/').filter(pe => pe).filter(pe => !/\.md$/.test(pe))
    if (src) {
      [owner, repository, branch, ...path] = src
    }
  }

  function addInteractionHandlers() {

    let scope = host.value?.parentElement
    let added = new Set()
    while (scope?.parentElement && scope.tagName !== 'MAIN') {
      (Array.from(scope.querySelectorAll('[enter],[exit]')) as HTMLElement[]).forEach(el => {
        if (!added.has(el)) {
          addMutationObserver(el)
          added.add(el)
        }
      })
      scope = scope.parentElement
    }

    scope = host.value?.parentElement
    while (scope) {
      (Array.from(scope.querySelectorAll('a')) as HTMLAnchorElement[])
        .filter(anchorElem => anchorElem.href !== 'javascript:;')
        .forEach( async (anchorElem) => {
        let link = new URL(anchorElem.href)
        let path = link.pathname.split('/').filter((p:string) => p).map(p => p.toLowerCase()).map(p => p === 'zoomto' ? 'zoom' : p)
        let idx = path.indexOf('zoom')
        if (idx >= 0) {
          let region = /^(pct:|pixel:|px:)?[-+\d.]+,[-+\d.]+,[-+\d.]+,[-+\d.]+$/.test(path[idx+1]) ? path[idx+1] : ''
          let annoId = path.slice(idx+1).find(val => val.length === 8 && /^[0-9a-f]+$/.test(val))
          let trigger = path.slice(idx+2).filter(val => val === 'click' || val === 'mouseover')[0] || 'click'
          let targetId = path.slice(idx+2).filter(val => val !== 'click' && val !== 'mouseover' && val !== annoId)[0]

          let target

          let paraDataId
          let parent = anchorElem.parentElement
          while (parent && !paraDataId) {
            paraDataId = parent.dataset.id
            parent = parent.parentElement
          }
          if (paraDataId) {
            let mapDataId = host.value?.dataset.id
            if (mapDataId && mapDataId !== paraDataId) return
          }

          if (targetId) {
            target = document.getElementById(targetId)
            if (!target) return
          }

          target = findClosestImageViewer(anchorElem, 've-image')
          if (target !== host.value) return

          anchorElem.classList.add('zoom')
          anchorElem.href = 'javascript:;'
          if (region) anchorElem.setAttribute('data-region', region)
          if (annoId) anchorElem.setAttribute('data-annoid', annoId)
          anchorElem.addEventListener(trigger, (evt:Event) => {
            let target = anchorElem
            let region = target.getAttribute('data-region') || target?.parentElement?.getAttribute('data-region')
            let annoId = target.getAttribute('data-annoId') || target?.parentElement?.getAttribute('data-annoId')
            if (annoId) annotator.value?.select(annoId)
            if (region) zoomto(region)
          })
        }
      })
      scope = scope.parentElement;
    }
  }

  function addMutationObserver(el: HTMLElement) {
    let prevClassState = el.classList.contains('active')
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName == 'class') {
          let currentClassState = (mutation.target as HTMLElement).classList.contains('active')
          if (prevClassState !== currentClassState) {
            prevClassState = currentClassState
            let attr = el.attributes.getNamedItem(currentClassState ? 'enter' : 'exit')
            if (attr) {
              const [action, ...args] = attr.value.replace(/:/g,'/').split('/')
              if (action === 'zoomto') {
                let region = args[0]
                zoomto(region)
              }
            }
          }
        }
      })
    })
    observer.observe(el, { attributes: true, childList: true, subtree: true, characterData: true })
  }

  function findClosestImageViewer(anchorElem: HTMLElement, tag) {
    let found
    let scope = anchorElem.parentElement
    while (scope && !found) {
      let matches = Array.from(scope.querySelectorAll(tag))
      if (matches.length) {
        if (scope === anchorElem.parentElement?.parentElement) {
          let priorSib = anchorElem.parentElement.previousElementSibling
          while (priorSib) {
            if (matches.find(m => m === priorSib)) {
              found = priorSib
              break
            } else {
              priorSib = priorSib.previousElementSibling
            }
          }
        } else {
          found = matches[0]
        }
      }
      scope = scope.parentElement
    }
    return found
  }

  let zoomedToRegion:string = ''
  function zoomto(arg: string) {
    arg = arg.replace(/^zoom\|/i,'')
    const match = arg?.match(/^(?<region>(pct:|pixel:|px:)?[+-\d.]+,[+-\d.]+,[+-\d.]+,[+-\d.]+)?$/)
    if (match) {
      let region = match?.groups?.region
      if (region) {
        if (zoomedToRegion === region) {
          osd.value?.viewport.goHome()
          zoomedToRegion = ''
        } else {
          zoomedToRegion = region
          if (osd.value) {
            let rect = parseRegionString(region, osd.value)
            osd.value.viewport.fitBounds(rect, false)
          }
        }
      }
    }
  }

  function parseRegionString(region: string, viewer: OpenSeadragon.Viewer) {
  let viewportRect
  const s1 = region.split(':')
  let [x,y,w,h] = s1[s1.length-1].split(',').map(v => parseInt(v))
  const size = viewer.world.getItemAt(0).getContentSize()
  if (s1.length === 2 && (s1[0] === 'pct' || s1[0] === 'percent')) {
    x = Math.round(size.x * x/100),
    y = Math.round(size.y * y/100),
    w = Math.round(size.x * w/100), 
    h = Math.round(size.y * h/100)
  }
  // viewportRect = viewer.viewport.imageToViewportRectangle(rect)
  viewportRect = viewer.viewport.imageToViewportRectangle(x,y,w,h)
  return viewportRect
}

function setViewportCoords() {
  const tiledImage = osd.value?.world.getItemAt(0)
  if (tiledImage) {
    let bounds = osd.value?.viewport.getBounds()
    const imageBounds = bounds ? tiledImage.viewportToImageRectangle(bounds) : null
    coords.value = imageBounds
      ? `${Math.ceil(imageBounds.x)},${Math.ceil(imageBounds.y)},${Math.ceil(imageBounds.width)},${Math.ceil(imageBounds.height)}`
      : ''
  }
}

let coordsDebounce: any = null
  function watchCoords() {
    if (coordsDebounce !== null) {
      clearTimeout(coordsDebounce)
      coordsDebounce = null
    }
    coordsDebounce = window.setTimeout(() => setViewportCoords(), 100)
  }

function copyTextToClipboard(text: string) {
  if (navigator.clipboard) navigator.clipboard.writeText(text)
}

class Annotator {

  osd: any
  base: string
  listeners: any[] = []
  imageId: string
  annotorious: any
  selected: string | undefined
  shas: any = {}
  readOnly: boolean = true
  visible: boolean

  authToken = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
  username = window.localStorage.getItem('gh-username')

  constructor(osd:any, base:string, readOnly=undefined) {
    this.osd = osd
    this.base = base
    if (readOnly === undefined) {
      this.repoIsWritable(this.base).then((isWritable) => {
        this.readOnly = !isWritable
        this.init()
      })
    } else {
      this.init()
    }
  }

  init() {
    this.annotorious = Annotorious(this.osd, {readOnly: this.readOnly})
    this.annotorious.on('createAnnotation', async (anno:any) => this.createAnnotation(anno))
    this.annotorious.on('updateAnnotation', async (anno:any) => this.updateAnnotation(anno))
    this.annotorious.on('deleteAnnotation', async (anno:any) => this.deleteAnnotation(anno))
    this.annotorious.on('selectAnnotation', async (anno:any) => this.onSelect(anno))
  }

  addChangeListener(listener) {
    this.listeners.push(listener)
  }

  setVisible(visible:boolean) {
    this.visible = visible
    let el = this.osd.element.querySelector('.a9s-annotationlayer') as HTMLElement
    if (el) {
      el.style.visibility = visible ? 'visible' : 'hidden'
      el.style.display = visible ? 'inline' : 'none'
    };
    (Array.from(this.osd.element.querySelectorAll(`.a9s-annotation`)) as HTMLElement[])
      .forEach(el => el.style.visibility = visible ? 'visible' : 'hidden')
  }

  async loadAnnotations(imageId) {
    this.imageId = imageId
    const annotationsLocation = `${this.base}/${this.imageId}.json`
    let annotations = await this.getFile(annotationsLocation)
    if (annotations) annotations.content.forEach(anno => this.annotorious.addAnnotation(anno))
    this.setVisible(!annotations?.content.length && !this.readOnly)
    for (let listener of this.listeners) listener(annotations || [])
    return annotations?.content || []
  }

  async saveAnnotations() {
    let annotations = this.annotorious.getAnnotations()
    for (let listener of this.listeners) listener(annotations || [])
    return this.putFile(`${this.base}/${this.imageId}.json`, JSON.stringify(annotations, null, 2))
  }

  async createAnnotation(anno) {
    anno.id = sha256(anno.id).slice(0,8)
    anno.target.id = this.imageId
    if (navigator.clipboard) navigator.clipboard.writeText(anno.id)
    this.saveAnnotations()
  }
  async updateAnnotation(anno) {
    anno.target.id = this.imageId
    if (navigator.clipboard) navigator.clipboard.writeText(anno.id)
    this.saveAnnotations()
  }
  async deleteAnnotation(anno) { this.saveAnnotations() }

  adjustPopupPosition(annoId) { //TODO: fix this
    let selection = (Array.from(this.osd.element.querySelectorAll(`.a9s-annotation`)) as HTMLElement[]).find(el => el.dataset.id === annoId)
    let selectionRect = selection?.getBoundingClientRect()
    let article
    let tmp: any = host.value
    while (tmp && !article) {
      if (tmp.tagName === 'ARTICLE') article = tmp
      tmp = tmp.parentElement
    }
    let articleRect = article?.getBoundingClientRect()
    let container = selection?.parentElement
    let containerRect = container?.getBoundingClientRect()
    let popup = this.osd.element.querySelector(`.r6o-editor`)
    if (popup && selectionRect && containerRect) {
      let left = containerRect.left >= articleRect.width/2 ? articleRect.width/2 + 20 : 0
      popup.style.transform = `translate(${left}px, 60px)`
    }
  }

  onSelect(anno:any) {
    this.selected = anno.id;
    // this.adjustPopupPosition(anno.id)
    if (navigator.clipboard) navigator.clipboard.writeText(anno.id)
  }

  annoEl(annoId:string) {
    return this.osd.element.querySelector(`[data-id="${annoId}"]`) as HTMLElement
  }

  select(annoId:string) {
    if (annoId !== this.selected) {
      this.setVisible(true)
      this.selected = annoId

      this.osd.element.querySelectorAll('.a9s-annotation').forEach((el:HTMLElement) => {
        if (el.dataset.id === annoId) {
          el.style.visibility = 'visible'
          el.classList.add('selected')
          this.annotorious.selectAnnotation(annoId)
        } else el.style.visibility = 'hidden'
      })

      if (this.selected) {
        let annoEl = this.annoEl(annoId)
        if (annoEl) annoEl.style.visibility = 'visible'
      }
    } else {
      this.setVisible(false)
      this.deselect() 
    }
  }

  deselect() {
    (Array.from(this.osd.element.querySelectorAll(`.a9s-annotation`)) as HTMLElement[])
    .forEach(el => el.style.visibility = this.visible ? 'visible' : 'hidden')
    this.annotorious.cancelSelected()
    this.selected = undefined
  }
  async getFile(location) {
    let [ acct, repo, branch, ...path ] = location.split('/')
    path = path.join('/')
    let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}?ref=${branch}`
    let resp:any = this.authToken ? await fetch(url, { headers: {Authorization: `Token ${this.authToken}`} }) : await fetch(url)
    if (resp.status === 200) {
      resp = await resp.json()
      this.shas[location] = resp.sha
      return { sha: resp.sha, content: JSON.parse(decodeURIComponent(escape(atob(resp.content)))) }
    } else if (resp.status === 403 || resp.status === 401) { // access problem, possibly api rate limit exceeded
      url = `https://raw.githubusercontent.com/${acct}/${repo}/${branch}/${path}`
      resp = await fetch(url)
      return resp.ok ? { sha: null, content: await resp.json() } : null
    } else return null
  }

  async putFile(location, content, sha=null) {
    let [ acct, repo, branch, ...path ] = location.split('/')
    path = path.join('/')
    let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}`
    sha = sha || this.shas[location] || await this.getSha(location)
    let payload:any = { branch, content: this.b64EncodeUnicode(content), message: 'API commit'}
    if (sha) payload.sha = sha
    let resp:any = this.authToken 
      ? await fetch(url, { method: 'PUT', body: JSON.stringify(payload), headers: {Authorization: `Token ${this.authToken}`} }) 
      : await fetch(url, { method: 'PUT', body: JSON.stringify(payload) }) 
    if (resp.ok) this.shas[location] = (await resp.json()).content.sha
    return {status:resp.status, statusText:resp.statusText, sha}
  }

  async getSha(location) {
    if (this.shas[location]) return this.shas[location]
    let [ acct, repo, branch, ...path ] = location.split('/')
    path = path.join('/')
    let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}?ref=${branch}`
    let resp:any = this.authToken ? await fetch(url, { headers: {Authorization: `Token ${this.authToken}`} }) : await fetch(url)
    if (resp.ok) {
      resp = await resp.json()
      this.shas[location] = resp.sha
      return resp.sha
    } else return null
  }

  async repoIsWritable(location) {
    let [ acct, repo, ...rest ] = location.split('/')
    if (!this.username) return false
    if (acct === this.username) return true
    // Not account owner, check if user is a collaborator
    let url = `https://api.github.com/repos/${acct}/${repo}/collaborators/${this.username}`
    let headers:any = { Accept: 'application/vnd.github+json' }
    if (this.authToken) headers.Authorization = `token ${this.authToken}`
    let resp = await fetch(url, { headers })
    return resp.ok && resp.status === 204
  }

  b64EncodeUnicode(str) { // Encoding UTF8 ⇢ base64
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(_, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }
    
  b64DecodeUnicode(str) { // Decoding base64 ⇢ UTF8
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

}

</script>

<style>
  @import 'https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2.7.14/dist/annotorious.min.css';

  .image {
    display: flex;
    flex-direction: column;
    /* box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important; */
  }

  .osd {
    position: relative;
    width: 100%;
    background-color: black;
    /* border: 1px solid #ddd; */
  }

  .coords {
    opacity: 0;
    position: absolute;
    /* bottom: 0; */
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    padding: 0.5em;
    z-index: 10;
    transition: all 0.5s ease-out;
  }

  .coords:hover {
    opacity: 1;
    cursor: copy;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 0.2em;
    background-color: white;
  } 
  .annotations-indicator {
    display: flex;
    position: relative;
    width: 1.8em;
    padding: 0.5em;
    cursor: pointer;
  }
  .annotations-indicator svg {
    width: 1.3em;
    height: 1.3em;
  }
  .annotations-indicator sl-badge {
    position: absolute;
    top: 0;
    right: 0;
  }

  /** New style for the annotation outlines **/
  svg.a9s-annotationlayer .a9s-selection .a9s-inner,
  svg.a9s-annotationlayer .a9s-annotation .a9s-inner  {
    stroke-width: 3;
    stroke: rgba(255,255,0,1.0);
  }

  .a9s-selection-mask {
    stroke: none;
    fill: rgba(0,0,0,0.4);
    pointer-events: none
  }

</style>

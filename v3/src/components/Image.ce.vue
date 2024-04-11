<template>

  <div ref="root" class="image">

    <div v-if="tileSources" ref="osdEl" class="osd" id="osd" role="img" :aria-label="caption" :alt="caption">
      <div v-if="coords"
        class="coords"
        v-html="coords" 
        @click="copyTextToClipboard(coords || '')">
      </div>
    </div>
    <mdp-caption v-if="manifests.length && !noCaption" :manifest="manifests[selected]" :caption="caption"></mdp-caption>
  </div>
  
  </template>
  
  <script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import OpenSeadragon, { TileSource } from 'openseadragon'

  import { iiifServer, getManifest } from '../utils'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  watch(shadowRoot, (shadowRoot) => { shadowRoot.children[1].classList.remove('sticky') })
  
  const props = defineProps({
    caption: { type: String },
    data: { type: String },
    fit: { type: String, default: 'contain' },
    height: { type: Number },
    noCaption: { type: Boolean, default: false },
    region: { type: String },
    seq: { type: Number, default: 1},
    src: { type: String },
    width: { type: Number },

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
  const ghBaseurl = computed(() => `https://raw.githubusercontent.com/${config.value.source?.owner}/${config.value.source?.repository}/${config.value.source?.branch}${config.value.source?.dir}`)

  const osdEl = ref<HTMLElement | null>(null)

  const osdWidth = ref<number>(0)
  watch(osdWidth, () => {
    resize()
    if (osdWidth.value > 0 && !tileSources.value.length) init()
    if (osdWidth.value > 0 && !osd.value) initOpenSeadragon()
  })

  const imageDefs = ref<any[]>([])
  watch(imageDefs, async (imageDefs) => {
    // console.log(toRaw(imageDefs))
    manifests.value = await Promise.all(imageDefs.map(def => 
      (def.src || def.manifest)
        ? getManifest(def.src || def.manifest)
        : fetch(`https://${iiifServer}/manifest/`, {
          method: 'POST', 
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(def)
              .filter(([k,v]) => ['attribution', 'caption', 'description', 'label', 'license', 'summary', 'title', 'url'].includes(k))
              .map(([k,v]) => {
                if (k === 'url' && v.indexOf('http') < 0) v = `${ghBaseurl.value}/${v}`
                return [k, v]
              })
            )) 
        }).then(resp => resp.json())
    )).then((responses) => responses.flat() )
  })

  const manifests = ref<any[]>([])

  const tileSources = computed(() => {
    return manifests.value.map((manifest, idx) => {
      let itemInfo = findItem({type:'Annotation', motivation:'painting'}, manifest, imageDefs.value[idx].seq || 1).body
      return itemInfo.service
        ? `${(itemInfo.service[0].id || itemInfo.service[0]['@id'])}/info.json` as unknown as TileSource
        : { url: itemInfo.id, type: 'image', buildPyramid: true } as unknown as TileSource
     
    })
  })
  watch(tileSources, (tileSources) => { osd.value?.open(tileSources) })

  const selected = ref<number>(0)

  const selectedItemInfo = computed(() => 
    manifests.value[selected.value] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[selected.value], imageDefs.value[selected.value].seq || 1).body
  )
  const imageSize = computed(() => selectedItemInfo.value && { width: selectedItemInfo.value.width, height: selectedItemInfo.value.height} )
  const aspectRatio = computed(() => Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )
  watch(aspectRatio, () => { resize() })

  function init() {
    function parseImageDefStr(s:String): Object {
      let tokens: String[] = []
      s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
      s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
        if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
        else tokens.push(token)
      })
      let parsed:any = {}
      tokens.forEach(token => {
        let idx = token.indexOf('=')
        let key = token.slice(0, idx)
        let value = token.slice(idx+1)
        parsed[key] = value[0] === '"' ? value.slice(1,-1) : value 
      })
      return parsed
    }

    function getImageDefs () {
      let imageProps = new Set(['attribution', 'caption', 'description', 'fit', 'label', 'license', 'manifest', 'noCaption', 'seq', 'src', 'summary', 'title', 'url'])
      let imageDefFromProps = props.src ? Object.fromEntries(Object.entries(props).filter(([k,v]) => imageProps.has(k) && v)) : null
      let _imageDefs: any[] = imageDefFromProps ? [imageDefFromProps] : []
      Array.from(host.value.querySelectorAll('li') as HTMLLIElement[])
        .map((li:HTMLLIElement) => parseImageDefStr(li.textContent || ''))
        .filter((def:any ) => def.src || def.manifest || def.url)
        .forEach((def:any, idx) => _imageDefs.push({...def, idx}))
      imageDefs.value = _imageDefs
    }

    new MutationObserver((mutationsList:any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && Array.from(mutation.target.classList).indexOf('hydrated') >= 0) {
          getImageDefs()       
        }
      }
    }).observe(host.value, { childList: true, subtree: true, characterData: true })
    getImageDefs()
  }

  watch(osdEl, () => {
    if (osdEl.value  && !width.value) {
      new ResizeObserver(() => osdWidth.value = osdEl.value?.clientWidth || osdWidth.value).observe(osdEl.value)
      osdWidth.value = osdEl.value?.clientWidth 
    }
  })

  const width = ref<number>(0)
  watch(width, (width) => { 
    root.value?.setAttribute('style', `width: ${props.width}px; margin: auto;`)
    osdWidth.value = width
   })

  const height = ref<number>(0)
  watch(height, (height) => { 
    host.value.style.height = `${height}px`
    osd.value?.viewport?.goHome(true)
   })

  // OpenSeadragon - https://openseadragon.github.io/docs/
  const osd = ref<OpenSeadragon.Viewer>()

  const caption = computed(() => props.caption || (manifests.value[selected.value] && manifests.value[selected.value]?.label?.en?.[0]))

  const coords = ref<string>()

  function evalProps() {
    if (props.width) width.value = props.width
    if (props.height) height.value = props.height
  }

  onMounted(() => {
    evalProps()
    addInteractionHandlers()
  })

  // find an item in a IIIF manifest
  function findItem(toMatch: object, current: object, seq: number = 1): any {
    const found = _findItems(toMatch, current)
    return found.length >= seq ? found[seq-1] : null
  }

  // recursive helper for finding items in a IIIF manifest
  function _findItems(toMatch: object, current: any, found: object[] = []) {
    found = found || []
    if (current.items) {
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
      if (height.value) osdEl.value.style.flex = '1'
      else osdEl.value?.setAttribute('style', `height: ${Number(osdEl.value?.clientWidth / aspectRatio.value).toFixed(0)}px;`)
    } 
  }

  // resize OSD viewer
  function resize() {
    setOsdHeight()
    setTimeout(() => osd.value?.viewport?.goHome(true), 100)
  }

  function initOpenSeadragon() {
    if (osd.value || !osdEl.value) return
    // console.log(`initOpenSeadragon() osdEl: ${osdEl.value?.clientWidth}x${osdEl.value?.clientHeight} image: ${imageSize.value?.width}x${imageSize.value?.height} tileSource: ${tileSource.value}`)
    console.log(`initOpenSeadragon: osdEl=${osdEl.value?.clientWidth}x${osdEl.value?.clientHeight} tileSources=${tileSources.value.length}`)
    setOsdHeight()
    const osdOptions: OpenSeadragon.Options = {
      element: osdEl.value,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      // tileSources: tileSources.value,
      homeFillsViewer: props.fit === 'cover',
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
      
    }
    osd.value = OpenSeadragon(osdOptions)
    osd.value.addHandler('viewport-change', () => watchCoords())
    osd.value.addHandler('page', (e) => { selected.value = e.page })
    setTimeout(() => setViewportCoords(), 500)
    if (tileSources.value.length) osd.value.open(tileSources.value)
  }

  function addInteractionHandlers() {
    let el = host.value.parentElement
    while (el?.parentElement && el.tagName !== 'MAIN') {
      (Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[]).forEach(anchorElem => {
        let link = new URL(anchorElem.href)
        let path = link.pathname.split('/').filter((p:string) => p)
        let zoomIdx = path.indexOf('zoom')
        if (zoomIdx >= 0 && path.length > zoomIdx+1) {
          let imageEl = findImageEl(anchorElem)
          if (imageEl) {
            let region = path[zoomIdx+1]
            anchorElem.classList.add('zoom')
            anchorElem.href = 'javascript:;'
            anchorElem.setAttribute('data-region', region)
            anchorElem.addEventListener('click', (evt:Event) => {
              let region = (evt.target as HTMLElement).getAttribute('data-region')
              if (region) zoomto(region) 
            })
          }
        }
      })
      el = el.parentElement;
    }
  }

  function findImageEl(el:any) {

    function checkSibs(el:any) {
      let sib = el.previousSibling
      while (sib) {
        if (sib.nodeName === 'MDP-IMAGE') return sib === host.value ? sib : null
        sib = sib.previousSibling
      }
    }
  
    checkSibs(el)
    while (el.parentElement && el.tagName !== 'BODY') {
      el = el.parentElement
      let imageEl = el.querySelector(':scope mdp-image')
      if (imageEl) return imageEl === host.value ? imageEl : null
    }
  }

  let zoomedToRegion:string = ''
  function zoomto(arg: string) {
    arg = arg.replace(/^zoom\|/i,'')
    const match = arg?.match(/^(?<region>(pct:|pixel:|px:)?[\d.]+,[\d.]+,[\d.]+,[\d.]+)?$/)
    if (match) {
      let region = match?.groups?.region
      // console.log(`mdp-image.zoom: region=${region}`)
      if (region) {
        if (zoomedToRegion === region) {
          osd.value?.viewport.goHome()
          zoomedToRegion = ''
        } else {
          zoomedToRegion = region
          osd.value?.viewport.fitBounds(parseRegionString(region, osd.value), false)
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
  console.log('copyTextToClipboard', text)
  if (navigator.clipboard) navigator.clipboard.writeText(text)
}

</script>

<style>
  .image {
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important;
  }

  .osd {
    width: 100%;
    background-color: black;
    /* border: 1px solid #ddd; */
  }

  .coords {
    opacity: 0;
    position: absolute;
    bottom: 72px;
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

</style>

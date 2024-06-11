<template>

  <div ref="root" class="image">

    <div v-if="tileSources" ref="osdEl" :class="annotationsEditable ? 'osd edit' : 'osd view'" id="osd" role="img" :aria-label="caption" :alt="caption">
      <div v-if="coords"
        class="coords"
        v-html="coords" 
        @click="copyTextToClipboard(coords || '')">
      </div>
    </div>

    <div class="status">
      <div v-if="annotations.length === 0 && repoIsWritable" class="annotations-indicator" @click="toggleAnnotations">
        <svg v-if="annotationsVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg> -->
      </div>
      <div v-else-if="annotations.length > 0" class="annotations-indicator" @click="toggleAnnotations">
        <!-- <svg v-if="repoIsWritable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg> -->
        <svg v-if="repoIsWritable && annotationsVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
        <svg v-else-if="repoIsWritable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
        <sl-badge variant="primary" pill>{{annotations.length}}</sl-badge>
      </div>
      <ve-caption v-if="manifests.length && !noCaption" :manifest="manifests[selected]" :caption="caption" :annoid="annoid"></ve-caption>
    </div>
  </div>
  
  </template>
  
  <script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import OpenSeadragon, { TileSource } from 'openseadragon'
  import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'

  import { iiifServer, getManifest, sha256 } from '../utils'

  import { Annotator } from '../annotator'

  const root = ref<HTMLElement>()
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  watch(shadowRoot, (shadowRoot) => { shadowRoot.children[1].classList.remove('sticky') })
  
  const props = defineProps({
    active: { type: Boolean, default: false },
    base: { type: String },
    caption: { type: String },
    data: { type: String },
    fit: { type: String, default: 'contain' },
    height: { type: Number },
    noCaption: { type: Boolean, default: false },
    region: { type: String },
    repoIsWritable: { type: Boolean, default: false },
    rotate: { type: Number },
    seq: { type: Number, default: 1},
    src: { type: String },
    slot: { type: String },
    width: { type: Number },
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
    if (config.value.source) return config.value.source
    else if (props.base) {
      let [owner, repository, branch, ...dir] = props.base.split('/')
      return { owner, repository, branch, dir: dir ? `/${dir.join('/')}/` : '/'}
    }
    return null
  })
  const ghBaseurl = computed(() => `https://raw.githubusercontent.com/${source.value?.owner}/${source.value?.repository}/${source.value?.branch}/${source.value?.dir.replace(/\/(README|index)\.md$/,'')}`)

  const osdEl = ref<HTMLElement | null>(null)

  const annotator = ref<any>()

  // watch(host, (host) => { if (host) init() })

  function ancestors() {
    let ancestors: any[] = []
    let el = host.value
    // while (el && el.className.indexOf('content') < 0) {
    while (el) {
      ancestors.push(el)
      el = el.parentElement;
    }
    return ancestors
  }

  const osdWidth = ref<number>(0)
  watch(osdWidth, () => {
    resize()
    if (osdWidth.value > 0 && !tileSources.value.length) init()
    if (osdWidth.value > 0 && !osd.value) initOpenSeadragon()
  })

  const imageDefs = ref<any[]>([])
  watch(imageDefs, async (imageDefs) => {
    // console.log (toRaw(imageDefs))
    manifests.value = await Promise.all(imageDefs.map(def => 
      (def.src || def.manifest)
        ? getManifest(def.src || def.manifest)
        : fetch(`https://${iiifServer}/manifest/`, {
          method: 'POST', 
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(def)
              .filter(([k,v]) => ['attribution', 'caption', 'description', 'fit', 'label', 'license', 'summary', 'title', 'url'].includes(k))
              .map(([k,v]) => {
                if (k === 'url' && (v as string).indexOf('http') < 0) v = `${ghBaseurl.value}/${v}`
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
  
  const selectedItemInfo = computed(() => 
    manifests.value[selected.value] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[selected.value], imageDefs.value[selected.value].seq || 1).body
  )

  const annoid = computed(() => selectedItemInfo.value && sha256(decodeURIComponent(selectedItemInfo.value.id?.split('/').pop().toLowerCase().replace('.jpeg','.jpg'))).slice(0,8))
  watch(annoid, async(annoid) =>
    annotations.value = annotator.value
      ? await annotator.value.loadAnnotations(annoid) || []
      : 0
  )

  const annotationsEditable = ref<boolean>(false)
  const annotationsVisible = ref<boolean>(false)
  watch(annotationsVisible, () => annotator.value.setVisible(annotationsVisible.value) )

  const annotations = ref<any[]>([])
  // watch(annotations, (annotations) => { console.log('annotations', toRaw(annotations)) })
  function toggleAnnotations() { annotationsVisible.value = !annotationsVisible.value }

  const imageSize = computed(() => selectedItemInfo.value && { width: selectedItemInfo.value.width, height: selectedItemInfo.value.height} )
  const aspectRatio = computed(() => Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )
  watch(aspectRatio, () => { resize() })

  function init() {
    function parseImageDefStr(s:String): Object {
      let tokens: string[] = []
      s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
      s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
        if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
        else tokens.push(token)
      })
      let parsed:any = {}
      let positionalArgs = ['src', 'caption', 'options', 'fit', 'rotate', 'seq' ]
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
      let imageProps = new Set(['attribution', 'caption', 'description', 'fit', 'label', 'license', 'manifest', 'noCaption', 'rotate', 'seq', 'src', 'summary', 'title', 'url'])
      let imageDefFromProps = (props.src || props.url) ? Object.fromEntries(Object.entries(props).filter(([k,v]) => imageProps.has(k) && v)) : null
      let _imageDefs: any[] = imageDefFromProps ? [imageDefFromProps] : []
      Array.from(host.value.querySelectorAll('li') as HTMLLIElement[])
        .map((li:HTMLLIElement) => parseImageDefStr(li.textContent || ''))
        .filter((def:any ) => def.src || def.manifest || def.url)
        .forEach((def:any, idx) => _imageDefs.push({...def, idx}))
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
    }
  })

  const width = ref<number>(0)
  watch(width, (width) => {
    root.value?.setAttribute('style', `width: ${props.width}px; margin: auto;`)
    osdWidth.value = width
   })

  const height = ref<number>(0)
  watch(height, (height) => { 
    host.value.style.height = height ? `${height}px` : 'unset'
    setOsdHeight()
    setTimeout(() => osd.value?.viewport?.goHome(false), 250)
   })

  // OpenSeadragon - https://openseadragon.github.io/docs/
  const osd = ref<OpenSeadragon.Viewer>()

  const caption = computed(() => props.caption || (manifests.value[selected.value] && manifests.value[selected.value]?.label?.en?.[0]))

  const coords = ref<string>()

  const interactionsHandlersInitialized = ref<boolean>(false)

  function evalProps() {
    if (props.active && !interactionsHandlersInitialized.value) {
      addInteractionHandlers()
      interactionsHandlersInitialized.value = true
    }
    width.value = props.width || 0
    height.value = props.height || 0
  }

  onMounted(() => {
    // const rootNode = root.value?.getRootNode?.({composed: false})
    // const host = (rootNode as ShadowRoot).host as HTMLElement
    // console.log('host', host)
    // console.log('parent', host.parentElement)

    // console.log('onMounted', ancestors())
    // addInteractionHandlers()
    // addInteractionHandlers()

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
    // console.log(`setOsdHeight: height=${height.value} osdWidth=${osdEl.value?.clientWidth} aspectRatio=${aspectRatio.value}`)
    if (osdEl.value?.clientWidth) {
      if (height.value) osdEl.value?.setAttribute('style', 'flex: 1 1 0%; position: relative')
      else osdEl.value?.setAttribute('style', `height: ${Number(osdEl.value?.clientWidth / aspectRatio.value).toFixed(0)}px;`)
    }
  }

  // resize OSD viewer
  function resize() {
    setOsdHeight()
    setTimeout(() => osd.value?.viewport?.goHome(false), 250)
  }

  function initOpenSeadragon() {
    if (osd.value || !osdEl.value) return
    // console.log(`initOpenSeadragon: osdEl=${osdEl.value?.clientWidth}x${osdEl.value?.clientHeight} tileSources=${tileSources.value.length}`, osdEl.value)
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
    osd.value.world.addHandler('add-item', (e) => {
      let currentItem = imageDefs.value[selected.value]
      if (currentItem?.rotate) e.item.setRotation(parseInt(currentItem.rotate), true)
    })
    configureImageViewerBehavior()
    // console.log('initOpenSeadragon', ancestors())
    addInteractionHandlers()

    setTimeout(() => setViewportCoords(), 500)
    if (tileSources.value.length) osd.value?.open(tileSources.value)
    let owner = source.value?.owner
    let repository = source.value?.repository
    let branch
    let path = source.value?.dir.slice(0,-1).split('/').filter(pe => pe)
    let src = new URL(location.href).searchParams.get('source')?.split('/').filter(pe => pe).filter(pe => !/\.md$/.test(pe))
    if (src) {
      [owner, repository, branch, ...path] = src
    }
    annotator.value = new Annotator(osd.value, `${owner}/${repository}${path.length ? '/' : ''}${path.join('/')}`, props.repoIsWritable)
    if (annoid.value) annotator.value.loadAnnotations(annoid.value).then(annos => annotations.value = annos)
  }

  function configureImageViewerBehavior() {
    /* This is intended to provide touch-based scrolling of OSD images in mobile mode.  Pan/zoom is
    disabled to permit scrolling.  The technique for doing this is as described in this
    OSD Github issue - https://github.com/openseadragon/openseadragon/issues/1791#issuecomment-1000045888
    Unfortunately, this only works with OSD v2.4.2, which is not compatible with the latest version of the
    Annotorious plugin (requires 3.0).  As a result, the current configuration is pinned 
    to OSD 2.4.2 and annotorious 2.6.0
    */
    //const canvas: any = this.el.shadowRoot.querySelector('.openseadragon-canvas')
    //canvas.style.touchAction = 'pan-y'

    if (!props.zoomOnScroll) {

      new OpenSeadragonViewerInputHook({ viewer: osd.value, hooks: [
        {tracker: 'viewer', handler: 'scrollHandler', hookHandler: (event:any) => {
          if (!osd.value?.isFullPage() && !event.originalEvent.ctrlKey) {
            event.preventDefaultAction = true
            event.stopHandlers = true
          }
          return true
        }}
      ]})
    }
  }

  function addInteractionHandlers() {
    // console.log('addInteractionHandlers')

      let el = host.value.parentElement
      while (el?.className.indexOf('content') < 0) {
        (Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[]).forEach(anchorElem => {
          let link = new URL(anchorElem.href)
          let path = link.pathname.split('/').filter((p:string) => p).map(p => p.toLowerCase()).map(p => p === 'zoomto' ? 'zoom' : p)
          let zoomIdx = path.indexOf('zoom')
          if (zoomIdx >= 0) {
            let region = path[path.length-1]
            let trigger = path.length > zoomIdx + 2 ? path[zoomIdx+1] : 'click'
            console.log(`zoomto: region=${region} trigger=${trigger}`)
            anchorElem.classList.add('zoom')
            anchorElem.href = 'javascript:;'
            anchorElem.setAttribute('data-region', region)
            anchorElem.addEventListener(trigger, (evt:Event) => {
              let target = evt.target as HTMLElement
              let region = target.getAttribute('data-region') || target?.parentElement?.getAttribute('data-region')
              if (region) zoomto(region) 
            })
          }
        })
        el = el.parentElement;
      }
    //}
  }

  function findImageEl(el:any) {

    function checkSibs(el:any) {
      let sib = el.previousSibling
      while (sib) {
        if (sib.nodeName === 'VE-IMAGE') return sib === host.value ? sib : null
        sib = sib.previousSibling
      }
    }
  
    checkSibs(el)
    while (el.parentElement && el.tagName !== 'BODY') {
      el = el.parentElement
      let imageEl = el.querySelector(':scope ve-image')
      if (imageEl) return imageEl === host.value ? imageEl : null
    }
  }

  let zoomedToRegion:string = ''
  function zoomto(arg: string) {
    arg = arg.replace(/^zoom\|/i,'')
    const match = arg?.match(/^(?<region>(pct:|pixel:|px:)?[\d.]+,[\d.]+,[\d.]+,[\d.]+)?$/)
    if (match) {
      let region = match?.groups?.region
      // console.log(`ve-image.zoom: region=${region}`)
      if (region) {
        if (zoomedToRegion === region) {
          osd.value?.viewport.goHome()
          zoomedToRegion = ''
        } else {
          // console.log(`zoomTo: region=${region}`)
          zoomedToRegion = region
          if (osd.value) {
            let rect = parseRegionString(region, osd.value)
            // console.log(host.value)
            // console.log(rect)
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

</script>

<style>
  @import '../annotator/annotorious.css';

  .image {
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important;
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
    bottom: 0;
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

  .view .r6o-footer {
    /* display: none; */
  }
  .r6o-readonly-comment {
    display: inline;
    padding: 0 !important;
    line-height: 1 !important;
  }
  .view .r6o-editor, 
  .view .r6o-editor-inner, 
  .view .r6o-widget {
    display: inline-block;
    min-height: unset !important;
    font-size: 1.0em;
    line-height: 1.2;
    /* padding: 9px; */
    border-bottom: none;
  }

  .view .r6o-widget.comment {
    padding: 10px;
  }

  /*
  .view .r6o-icon.r6o-arrow-down,
  .view .r6o-btn.delete-annotation,
  .view .r6o-btn.outline {
    display: none !important;
  }
  */

  .r6o-tag,
  .comment.editable:nth-of-type(2) {
    display: none !important;
  }
  .edit .r6o-editor {
    width: 216px;
  }

  /** New style for the annotation outlines **/
  svg.a9s-annotationlayer .a9s-selection .a9s-inner,
  svg.a9s-annotationlayer .a9s-annotation .a9s-inner  {
    stroke-width: 3;
    stroke: rgba(255,255,0,1.0);
  }

</style>

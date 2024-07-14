<template>

  <div ref="root" class="compare" style="width:100%;">

    <div ref="wrapper" class="wrapper">
      <sl-image-comparer ref="compare" position="50">
        <img v-for="src, idx in scaledImages" :key="`img-${idx}`" :slot="idx === 0 ? 'before' : 'after'" :src="src" :alt="label(manifests[idx])" />
      </sl-image-comparer>
      <div ref="captionEl" class="caption">{{ caption }}</div>
    </div>

  </div>
  
  </template>
  
  <script setup lang="ts">

  import { computed, getCurrentScope, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  import { iiifServer, getManifest } from '../utils'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const wrapper = ref<HTMLElement | null>(null)
  const compare = ref<HTMLElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)
  
  const props = defineProps({
    caption: { type: String },
    height: { type: Number },
    width: { type: Number },
  })
  watch(props, () => { evalProps() }) 

  watch(compare, (compare) => {
    // console.log(compare?.clientWidth, compare?.clientHeight)
    if (compare) new ResizeObserver(() => {
      // console.log(`props.height=${props.height} width=${compare?.clientWidth} height=${compare?.clientHeight}`)
      if (!width.value) width.value = compare?.clientWidth
      if (!height.value) height.value = compare?.clientHeight || width.value
    }).observe(compare)
    init() 
  })

  watch(captionEl, (captionEl) => {
    // console.log('caption', captionEl?.clientWidth, captionEl?.clientHeight)
    if (captionEl) new ResizeObserver(() => {
      // console.log('caption', captionEl?.clientWidth, captionEl?.clientHeight)
    }).observe(captionEl)
  })

  const imageDefs = ref<any[]>([])
  watch(imageDefs, async (imageDefs) => {
    // console.log(toRaw(imageDefs))
    manifests.value = await Promise.all(imageDefs.map(def => 
      def.src || def.manifest
        ? getManifest(def.src || def.manifest)
        : fetch(`https://${iiifServer}/manifest/`, { method: 'POST', body: JSON.stringify(def) }).then(resp => resp.json())
    )).then((responses) => responses.flat() )
  })

  const manifests = ref<any[]>([])
  // watch (manifests, (manifests) => { console.log(toRaw(manifests)) })

  const imageSize = computed(() => {
    if (!manifests.value.length) return { width: 0, height: 0 }
    let firstImageInfo = manifests.value[0] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[0], imageDefs.value[0].seq || 1).body
    return { width: firstImageInfo.width, height: firstImageInfo.height} 
  })
  const aspectRatio = computed(() => Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )
  watch (aspectRatio, (aspectRatio) => { 
    // if (width.value && !height.value) height.value = Math.round(width.value / aspectRatio)
    // console.log(`imageSize=${imageSize.value.width}x${imageSize.value.height} aspectRatio=${aspectRatio}`)
  })

  const scaledImages = computed(() => (manifests.value.length && height.value && width.value) ? scaleImages() : [] )
  // watch (scaledImages, (scaledImages) => { console.log(toRaw(scaledImages)) })

  const caption = computed(() => props.caption || imageDefs.value.filter(def => def.caption).map(def => def.caption).join(' ') )
  
  function init() {
    
    evalProps()

    function parseImageDefStr(s:String): Object {
      let tokens: string[] = []
      // s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
      s = s.replace(/”/g,'"').replace(/”/g,'"')
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
      imageDefs.value = Array.from(host.value.querySelectorAll('li') as HTMLLIElement[])
        .map((li:HTMLLIElement) => parseImageDefStr(li.textContent || ''))
        .filter((def:any) => def.src || def.manifest || def.url)
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

  const width = ref<number>(0)
  // watch (width, (width) => { console.log(`width=${width}`) })
  const height = ref<number>(0)
  // watch (height, (height) => { console.log(`height=${height}`) })
  // watch (width, () => {if (width.value && height.value) console.log(`size: ${width.value}x${height.value}`) })
  // watch (height, () => {if (width.value && height.value) console.log(`size: ${width.value}x${height.value}`) })

  function _value(langObj: any, language='en') {
    return typeof langObj === 'object'
      ? langObj[language] || langObj.none || langObj[Object.keys(langObj).sort()[0]]
      : langObj
  }

  function label(manifest:any, language:string = 'en') {
    return manifest ? _value(manifest.label, language) : null
  }

  function evalProps() {
    if (props.width) {
      width.value = props.width
      host.value.style.width = `${width.value}px`
    } else {
      width.value = wrapper.value?.clientWidth || 0
    }
    if (props.height) {
      // height.value = props.height
      host.value.style.height = `${props.height}px`
      // console.log(host.value.style.height)
    }
  }

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

function scaleImages() {
    let targetWidth = width.value
    let targetHeight = height.value
    // let targetAspectRatio = aspectRatio.value
    let targetAspectRatio = width.value / height.value

    // console.log(`scaleImages: targetWidth=${targetWidth} targetHeight=${targetHeight} targetAspectRatio=${targetAspectRatio}`)

    return imageDefs.value.map((img, idx) => {
      getCurrentScope

      let imgInfo = findItem({type:'Annotation', motivation:'painting'}, manifests.value[idx], imageDefs.value[idx].seq || 1).body

      let x,y,w,h
      if (img.region) {
        [x,y,w,h] = img.region.split(':').pop().split(',').map((s:string) => parseFloat(s))
        let isPct = img.region.split(':')[0] === 'pct'
        if (isPct) {
          x = Math.round(x * imgInfo.width / 100)
          y = Math.round(y * imgInfo.height / 100)
          w = Math.round(w * imgInfo.width / 100)
          h = Math.round(h * imgInfo.height / 100)
        }
      }

      const inputWidth = w || imgInfo.width
      const inputHeight = h || imgInfo.height
      const inputImageAspectRatio = Number((inputWidth/inputHeight).toFixed(4))

      // console.log(`image ${idx}: ${inputWidth}x${inputHeight} (${inputImageAspectRatio})`)

      let outputWidth = inputWidth
      let outputHeight = inputHeight

      if (inputImageAspectRatio > targetAspectRatio) {
        outputWidth = Math.round(inputHeight * targetAspectRatio)
        outputHeight = Math.round(outputWidth / targetAspectRatio)
      } else {
        outputHeight = Math.round(inputWidth / targetAspectRatio)
        outputWidth = Math.round(outputHeight * targetAspectRatio)
      }

      let tileSource = imgInfo.service[0].id || imgInfo.service[0]['@id']

      const outputX = (x || 0) + Math.abs(Math.round((outputWidth - inputWidth) * 0.5))
      const outputY = (y || 0) + Math.abs(Math.round((outputHeight - inputHeight) * 0.5))

      let region = `${outputX},${outputY},${outputWidth},${outputHeight}`
      let widthRatio = targetWidth / outputWidth

      let size = widthRatio > 1
        ? `^pct:${Math.round(widthRatio * 100)}`
        : `${targetWidth},${targetHeight}`

      // console.log(`${targetWidth}x${targetHeight} ${widthRatio} ${region} ${size}`)
      let imgUrl = `${tileSource}/${region}/${size}/${img.mirror ? '!' : ''}${img.rotation || 0}/${img.quality || 'default'}.${img.format || 'jpg'}`

      // console.log(imgUrl)
      return imgUrl
    })
  }

</script>

<style>

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  sl-image-comparer {
    width: 100%;
    flex: 1;
  }

  .caption {
    background-color: white;
    margin-top: -0.5em;
    padding: 0.3em;
    width: 100%;
    font-size: 1em;
    font-weight: 400;
    text-align: center;
    margin-bottom: 0.3em;
    line-height: 1.3;
  }

</style>

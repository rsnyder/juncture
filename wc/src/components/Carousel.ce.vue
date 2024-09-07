<template>

  <div ref="main" class="main" style="width:100%;">

      <sl-carousel
        :autoplay="autoplay ? '' : null" 
        :loop="loop ? '' : null" 
        :navigation="navigation ? '' : null" 
        :pagination="pagination ? '' : null"
        :style="{
          '--aspect-ratio': aspectRatio
        }"
      >
        <sl-carousel-item v-for="img, idx in scaledImages" :key="`img-${idx}`" style="display: flex; flex-direction: column;">
          <img alt="" :src="img.src" :style="{objectFit: img.fit}"/>
          <div style="height:50px;">Caption</div>
        </sl-carousel-item>
      </sl-carousel>

      <div ref="captionEl" class="caption">{{ caption }}</div>
    </div>

  </template>
  
  <script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  import { iiifServer, getManifest } from '../utils'


  const main = ref<HTMLElement | null>(null)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)
  watch(host, (host) => { new ResizeObserver(() => setDimensions()).observe(host) })

  const captionEl = ref<HTMLElement | null>(null)
  
  const props = defineProps({
    aspectRatio: { type: String, default: '1/1' }, // 16/9, 3/2, 1/1
    caption: { type: String },
    autoplay: { type: Boolean, default: false },
    height: { type: Number },
    loop: { type: Boolean, default: false },
    navigation: { type: Boolean, default: false },
    pagination: { type: Boolean, default: false },
    width: { type: Number },
  })

  watch(props, () => { setDimensions() })

  const definedWidth = ref(props.width || (host.value?.style.width && host.value.clientWidth))
  const definedHeight = ref(props.height || (host.value?.style.height && host.value.clientHeight))

  const width = ref(definedWidth.value || host.value?.clientWidth)
  const height = ref(definedHeight.value || width.value)

  watch(width, () => { if (width.value && height.value) console.log(`${width.value}x${height.value}`) })
  watch(height, () => { if (width.value && height.value) console.log(`${width.value}x${height.value}`) })

  watch(width, () => { console.log(`width=${width.value}`) })
  watch(height, () => { console.log(`height=${height.value}`) })

  function setDimensions() {
    console.log('setDimensions', props.width, main.value?.style.width, main.value?.clientWidth, props.height, main.value?.style.height, main.value?.clientHeight)
    console.log(main.value)
    definedWidth.value = props.width || (main.value?.style.width && main.value.clientWidth)
    definedHeight.value = props.height || (main.value?.style.height && main.value.clientHeight)
    width.value = definedWidth.value || main.value?.clientWidth
    height.value  = (definedHeight.value || width.value)
    if (definedWidth.value && main.value) main.value.style.width = `${definedWidth.value}px`
    if (definedHeight.value && main.value) main.value.style.height = `${definedHeight.value}px`
  }

  watch(captionEl, (captionEl) => {
    // console.log('caption', captionEl?.clientWidth, captionEl?.clientHeight)
    if (captionEl) new ResizeObserver(() => {
      // console.log('caption', captionEl?.clientWidth, captionEl?.clientHeight)
    }).observe(captionEl)
  })

  const imageDefs = ref<any[]>([])
  watch(imageDefs, async (imageDefs) => {
    console.log(toRaw(imageDefs))
    manifests.value = await Promise.all(imageDefs.map(def => 
      def.src || def.manifest
        ? getManifest(def.src || def.manifest)
        : fetch(`https://${iiifServer}/manifest/`, { method: 'POST', body: JSON.stringify(def) }).then(resp => resp.json())
    )).then((responses) => responses.flat() )
  })

  onMounted(() => {
    getImageDefs()
  })

  const manifests = ref<any[]>([])
  watch (manifests, (manifests) => { console.log(toRaw(manifests)) })

  const imageSize = computed(() => {
    if (!manifests.value.length) return { width: 0, height: 0 }
    let firstImageInfo = manifests.value[0] && findItem({type:'Annotation', motivation:'painting'}, manifests.value[0], imageDefs.value[0].seq || 1).body
    return { width: firstImageInfo.width, height: firstImageInfo.height} 
  })
  // const aspectRatio = computed(() => Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )

  const scaledImages = computed(() => manifests.value.length ? scaleImages() : [] )
  watch (scaledImages, (scaledImages) => { console.log(toRaw(scaledImages)) })

  const caption = computed(() => props.caption || imageDefs.value.filter(def => def.caption).map(def => def.caption).join(' ') )

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
    
    if (host.value) imageDefs.value = Array.from(host.value.querySelectorAll('li') as HTMLLIElement[])
      .map((li:HTMLLIElement) => parseImageDefStr(li.textContent || ''))
      .filter((def:any) => def.src || def.manifest || def.url)

    if (host.value) new MutationObserver((mutationsList:any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && Array.from(mutation.target.classList).indexOf('hydrated') >= 0) {
          getImageDefs()       
        }
      }
    }).observe(host.value, { childList: true, subtree: true, characterData: true })
  }

  function _value(langObj: any, language='en') {
    return typeof langObj === 'object'
      ? langObj[language] || langObj.none || langObj[Object.keys(langObj).sort()[0]]
      : langObj
  }

  function label(manifest:any, language:string = 'en') {
    return manifest ? _value(manifest.label, language).join('; ') : null
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

    console.log(`scaleImages: targetWidth=${targetWidth} targetHeight=${targetHeight} targetAspectRatio=${targetAspectRatio}`)

    return imageDefs.value.map((img, idx) => {

      let manifest = manifests.value[idx]
      console.log(toRaw(manifest))
      console.log(label(manifest))

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

      /*
      let size = widthRatio > 1
        ? `^pct:${Math.round(widthRatio * 100)}`
        : `${targetWidth},${targetHeight}`
      */

      let size = inputImageAspectRatio < 1 ? `${targetWidth},` : `,${targetHeight}`
      size = `,${targetHeight}`
      // console.log(`${targetWidth}x${targetHeight} ${widthRatio} ${region} ${size}`)
      //let imgUrl = `${tileSource}/${region}/${size}/${img.mirror ? '!' : ''}${img.rotation || 0}/${img.quality || 'default'}.${img.format || 'jpg'}`

      let imgUrl = `${tileSource}/full/${size}/${img.mirror ? '!' : ''}${img.rotation || 0}/${img.quality || 'default'}.${img.format || 'jpg'}`

      // console.log(imgUrl)
      let resp = {
        src: imgUrl, 
        aspectRatio: inputImageAspectRatio,
        caption: img.caption || label(manifest),
        fit: img.fit || 'contain',
      }
      console.log(`image ${idx}: ${inputWidth}x${inputHeight} (${inputImageAspectRatio})`, resp)

      return resp
    })

  }

</script>

<style>

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .main {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    border: 1px solid red;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  sl-carousel {
    width: 100%;
    flex: 1;
    border: 1px solid blue;
  }

  img {
    object-fit: contain;
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
    border: 1px solid green;
  }

</style>

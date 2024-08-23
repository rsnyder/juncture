<template>

  <div ref="main" class="main">
    <sl-animated-image
      :src="src"
      :play="props.autoplay"
      :alt="caption"
      :style="{width: `${width}px`, height: `${height}px`}"
    ></sl-animated-image>
    <div v-if="caption" ref="captionEl" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { onMounted, ref, watch } from 'vue'
  import { Md5 } from '../utils'

  const props = defineProps({
    autoplay: { type: Boolean, default: false },
    caption: { type: String },
    height: { type: String},
    src: { type: String, required: true }, // URL
    width: { type: String },
  })

  const main = ref<HTMLElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)

  const width = ref(0)
  const height = ref(0)

  const src = ref()
  // watch(src, (src) => { console.log(`src=${src}`) })

  onMounted(() => {
    src.value = props.src.indexOf('wc:') === 0 ? mwURL(props.src.slice(3)) : props.src
    if (props.width) width.value = Number(props.width)
    if (props.height) height.value = Number(props.height)
    if (!props.width && !props.height) width.value = main.value?.clientWidth || 0
    if (!props.width || !props.height) {
      getImageSize(src.value).then((size) => {
        if (width.value) height.value = Math.round(width.value / size.aspect_ratio)
        else width.value = size.width
        if (height.value) width.value = Math.round(height.value * size.aspect_ratio)
        else height.value = size.height
      })
    }
  })

  async function getImageSize(src:any): Promise<{ width: number, height: number, aspect_ratio: number }> {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        resolve({width:img.width, height:img.height, aspect_ratio:Number((img.width/img.height).toFixed(4))})
      }
      img.onerror = () => reject()
      img.src = src
    })
  }

  function mwURL(file:string) {
    file = decodeURIComponent(file).replace(/ /g,'_')
    const _md5 = Md5(file)
    let url = `https://upload.wikimedia.org/wikipedia/commons`
    url += `/${_md5.slice(0,1)}/${_md5.slice(0,2)}/${file}`
    return url
  }

</script>

<style>

  * { box-sizing: border-box; }

  .main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  
  .caption {
    padding: 0.3em;
    width: 100%;
    font-size: 1em;
    font-weight: 500;
    text-align: left;
    margin-bottom: 0.3em;
    line-height: 1.3;
  }

</style>
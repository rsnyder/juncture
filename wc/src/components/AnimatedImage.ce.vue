<template>

  <div ref="main" class="main">
    <sl-animated-image
      :src="src"
      :alt="caption"
      :style="{width: `${width}px`, height: `${height}px`}"
    ></sl-animated-image>
    <div v-if="caption" ref="captionEl" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  
  const props = defineProps({
    caption: { type: String },
    height: { type: String},
    src: { type: String }, // URL
    width: { type: String },
  })

  const main = ref<HTMLElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)

  const width = ref(0)
  const height = ref(0)

  onMounted(() => {
    if (props.width) width.value = Number(props.width)
    if (props.height) height.value = Number(props.height)
    if (!props.width && !props.height) width.value = main.value?.clientWidth || 0
    console.log('width', width.value)
    if (!props.width || !props.height) {
      getImageSize(props.src).then((size) => {
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
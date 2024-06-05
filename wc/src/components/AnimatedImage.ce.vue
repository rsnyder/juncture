<template>

  <div ref="main" class="main">
    <sl-animated-image
      :src="src"
      :alt="caption"
      :style="{width, height}"
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
  const host = computed(() => (main.value?.getRootNode() as any)?.host)
  const captionEl = ref<HTMLElement | null>(null)

  const width = computed(() => props.width || (host.value?.parentElement.clientWidth || 0) + 'px' )
  // const height = computed(() => props.height || (host.value?.parentElement.clientHeight || 0) + 'px')
  const height = computed(() => props.height || '100%')

  watch((width), (width) => { console.log(`width=${width}`) })  
  watch((height), (height) => { console.log(`height=${height}`) })
  
  onMounted(() => {
    console.log('onMounted', toRaw(props))
  })

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
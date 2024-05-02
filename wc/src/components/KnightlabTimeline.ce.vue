<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  const props = defineProps({
    hashBookmark: { type: Boolean, default: false},
    initialZoom: { type: Number, default: 1},
    height: { type: Number, default: 650},
    source: { type: String },
    timenavPosition: { type: String, default: 'bottom' },
  })
  watch(props, () => { setHeight() })

  const main = ref<HTMLElement | null>(null)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)

  const containerHeight = ref(0)
  watch(containerHeight, () => setHeight() )

  watch(host, (host) => {
    if (host.parentElement.clientHeight) containerHeight.value = host.parentElement.clientHeight
    else new ResizeObserver(() => containerHeight.value = host.parentElement.clientHeight).observe(host.parentElement)
  })

  const height = ref(0)

  function setHeight() {
    // console.log(`setHeight: props=${props.height} main=${main.value?.clientHeight} container=${containerHeight.value}`)
    height.value = props.height <= containerHeight.value ? props.height : containerHeight.value
  }

</script>

<template>
  <div class="main" ref="main" :style="{height: `${height}px`}">
    <iframe 
      :src="`https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=${source}&font=Default&lang=en&timenav_position=${timenavPosition}&hash_bookmark=${hashBookmark}&initial_zoom=${initialZoom}&height=${height}`"
      width="100%" 
      height="100%" 
      webkitallowfullscreen mozallowfullscreen allowfullscreen 
      frameborder="0">
    </iframe>
  </div>  
</template>

<style>
  
  .main {
    display: flex;
  }

</style>
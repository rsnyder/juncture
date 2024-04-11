<template>

  <div ref="main" class="main">
     <iframe :src="src" :width="width" :height="height"></iframe>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  
  const props = defineProps({
    allow: { type: String },
    allowfullscreen: { type: Boolean },
    allowpaymentrequest: { type: Boolean },
    height: { type: Number, default: 650},
    loading: { type: String }, // eager or lazy
    name: { type: String },
    referrerpolicy: { type: String }, // no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin-when-cross-origin, or unsafe-url 
    sandbox: { type: String }, // allow-forms, allow-pointer-lock, allow-popups, allow-same-origin, allow-scripts, or allow-top-navigation 
    src: { type: String }, // URL
    srcdoc: { type: String }, // HTML
    width: { type: Number },

    // Positioning props
    position: { type: String },
    full: { type: Boolean },
    left: { type: Boolean  },
    right: { type: Boolean },
    sticky: { type: Boolean  }
  })
  watch(props, () => { setHeight() })

  const main = ref<HTMLElement | null>(null)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)

  const width = ref(0)
  const height = ref(0)

  const containerHeight = ref(0)
  watch(containerHeight, () => setHeight() )

  function setHeight() {
    // console.log(`setHeight: props=${props.height} main=${main.value?.clientHeight} container=${containerHeight.value}`)
    height.value = props.height <= containerHeight.value ? props.height : containerHeight.value
    width.value = props.width || main.value?.clientWidth || 0
  }

  watch(host, (host) => {
    console.log(toRaw(props))
    if (host.parentElement.clientHeight) containerHeight.value = host.parentElement.clientHeight
    else new ResizeObserver(() => containerHeight.value = host.parentElement.clientHeight).observe(host.parentElement)
  })

</script>

<style>

  * { box-sizing: border-box; }

  .main {
    display: flex;
    width: 100%;
  }
  
</style>
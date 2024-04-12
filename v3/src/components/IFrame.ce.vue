<template>

  <div ref="main" class="main">
    <iframe v-if="height && width"
      :allow="allow" 
      :allowfullscreen="allowfullscreen" 
      :allowtransparency="allowtransparency" 
      :frameborder="frameborder" 
      :height="height" 
      :loading="loading"
      :mozallowfullscreen="allowfullscreen" 
      :msallowfullscreen="allowfullscreen" 
      :name="name" 
      :referrerpolicy="referrerpolicy"
      :src="src" 
      :webkitallowfullscreen="allowfullscreen" 
      :width="width" 
    ></iframe>
    <div v-if="caption" ref="captionEl" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  
  const props = defineProps({
    allow: { type: String },
    allowfullscreen: { type: Boolean },
    allowpaymentrequest: { type: Boolean },
    allowtransparency: { type: Boolean, default: true },
    caption: { type: String },
    frameborder: { type: Number, default: 0 },
    height: { type: Number, default: 650},
    loading: { type: String, default: 'eager' }, // eager or lazy
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
  const captionEl = ref<HTMLElement | null>(null)
  watch (captionEl, () => setHeight() )

  const referrerpolicy = ref<any>(props.referrerpolicy)
  const width = ref(0)
  const height = ref(0)

  const containerHeight = ref(0)
  watch(containerHeight, () => setHeight() )

  function setHeight() {
    // console.log(`setHeight: props=${props.height} main=${main.value?.clientHeight} container=${containerHeight.value} caption=${captionEl.value?.clientHeight || 0}`)
    height.value = (props.height <= containerHeight.value ? props.height : containerHeight.value) - (captionEl.value?.clientHeight || 0)
    width.value = props.width || main.value?.clientWidth || 0
  }

  watch(host, (host) => {
    if (host.parentElement.clientHeight) containerHeight.value = host.parentElement.clientHeight
    else new ResizeObserver(() => containerHeight.value = host.parentElement.clientHeight).observe(host.parentElement)
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
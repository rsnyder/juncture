<template>

  <div ref="main" class="main">
    <iframe
      ref="iframeEl"
      :allow="allow" 
      :allowfullscreen="allowfullscreen" 
      :allowtransparency="allowtransparency" 
      :frameborder="frameborder" 
      :height="height - (captionEl?.clientHeight || 0)" 
      :loading="loading"
      :mozallowfullscreen="allowfullscreen" 
      :msallowfullscreen="allowfullscreen" 
      :name="name" 
      :referrerpolicy="referrerpolicy"
      :src="src" 
      :webkitallowfullscreen="allowfullscreen" 
      :width="width" 
    ></iframe>
    <div v-if="caption" ref="captionEl" class="caption" v-html="htmlFromMarkdown(caption)"></div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { marked } from 'marked'

  const props = defineProps({
    allow: { type: String },
    allowfullscreen: { type: Boolean },
    allowpaymentrequest: { type: Boolean },
    allowtransparency: { type: Boolean, default: true },
    caption: { type: String },
    frameborder: { type: Number, default: 0 },
    height: { type: Number },
    loading: { type: String, default: 'eager' }, // eager or lazy
    name: { type: String },
    referrerpolicy: { type: String }, // no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin-when-cross-origin, or unsafe-url 
    sandbox: { type: String }, // allow-forms, allow-pointer-lock, allow-popups, allow-same-origin, allow-scripts, or allow-top-navigation 
    src: { type: String }, // URL
    srcdoc: { type: String }, // HTML
    width: { type: Number }
  })

  watch(props, () => { setDimensions() })

  const main = ref<HTMLElement | null>(null)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)
  watch(host, (host) => { new ResizeObserver(() => setDimensions()).observe(host) })

  const src = ref(props.src)

  const captionEl = ref<HTMLElement | null>(null)

  const definedWidth = ref(props.width || (host.value?.style.width && host.value.clientWidth))
  const definedHeight = ref(props.height || (host.value?.style.height && host.value.clientHeight))

  const width = ref(definedWidth.value || host.value?.clientWidth)
  const height = ref(definedHeight.value || width.value)

  function setDimensions() {
    let srcWidth, srcHeight
    if (src.value?.startsWith('http')) {
      let srcParams = new URL (src.value).searchParams
      let srcParamsObj = Object.fromEntries(Array.from(srcParams.keys()).map(param => [param.replace(/&?amp;/g,''), srcParams.get(param)]))
      srcWidth = /^\d+$/.test(srcParamsObj.width || '') ? parseInt(srcParamsObj.width || '') : null
      srcHeight = /^\d+$/.test(srcParamsObj.height || '') ? parseInt(srcParamsObj.height || '') : null
      console.log({ srcWidth, srcHeight })
    }
    definedWidth.value = srcWidth || props.width || (host.value.style.width && host.value.clientWidth)
    definedHeight.value = srcHeight || props.height || (host.value.style.height && host.value.clientHeight)
    width.value = definedWidth.value || host.value.clientWidth
    height.value  = definedHeight.value || Math.max((window.innerHeight - Math.round(host.value.getBoundingClientRect().top) - 20), width.value)
    console.log('setDimensions', { definedWidth: definedWidth.value, definedHeight: definedHeight.value, width: width.value, height: height.value })
  }

  function htmlFromMarkdown(md) { return md ? marked.parse(md).slice(3,-5) : '' }

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .main {
    display: flex;
    flex-direction: column;
    background-color: white;
    /* width: 100% !important; */
  }
  
  .caption {
    padding: 0.3em;
    width: 100%;
    font-size: 1em;
    font-weight: 500;
    text-align: left;
    line-height: 1.3;
    margin-bottom: 0.3em;
  }

</style>
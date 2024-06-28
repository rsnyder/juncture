<template>

  <article ref="article" v-html="html" :class="classes"></article>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  import { elFromHtml, observeVisible } from '../../../index.js'

  const props = defineProps({
    owner: { type: String },
    repo: { type: String },
    branch: { type: String, default: 'main' },
    path: { type: String, default: 'README.md'},
    repoIsWritable: { type: Boolean, default: false }
  })

  const article = ref<HTMLElement | null>(null)
  const host = computed(() => (article.value?.getRootNode() as any)?.host)
  
  watch(host, (host) => {
    host.parentElement.addEventListener('scroll', () => setViewersPosition())
  })

  watch(article, () => {
    setTimeout(() => setViewersPosition(), 200)
  })

  const html = ref()
  
  const parsed = computed(() => elFromHtml(html.value)?.firstElementChild)
  // watch(parsed, () => { console.log(parsed.value) })

  const classes = computed(() => `article ${parsed.value?.className}`)
  watch(html, () => { nextTick(() => { observeVisible(article.value, true, 612) }) })
  // watch(html, () => { console.log(html.value) })

  const repoIsWritable = ref(props.repoIsWritable)
  watch(props, () => { repoIsWritable.value = props.repoIsWritable })
  // watch(repoIsWritable, () => { console.log(`repoIsWritable=${repoIsWritable.value}`) })
  
  function setViewersPosition() {
    let header = article.value?.querySelector('ve-header') as HTMLElement
    let viewers = article.value?.querySelector('.viewers.active') as HTMLElement
    if (header && viewers) {
      let top = header.getBoundingClientRect().top
      let height = header.getBoundingClientRect().height
      let offset = top + height
      viewers.style.top = `${offset}px`
      viewers.style.height = `calc(100dvh - ${offset+32}px)`
      // console.log(offset, parseInt(window.getComputedStyle(viewers).height.replace(/px/,'')))
    }
  }

  onMounted(async() => {
    html.value = decodeURIComponent(host.value.innerHTML.trim())
  })

</script>

<style>
  @import '../../../index.css';
  :host {
    display: block;
    height: 100%;
  }

  /*
  ul[data-id] {
    display: none;
  }
  */
</style>
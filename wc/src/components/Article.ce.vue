<template>

  <article ref="article" v-html="html" :class="classes" style="width:100%;"></article>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  import { elFromHtml, observeVisible } from '../ghp.js'

  const props = defineProps({
    base: { type: String },
    branch: { type: String, default: 'main' },
    owner: { type: String },
    path: { type: String, default: 'README.md'},
    repo: { type: String },
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
  
  //const parsed = computed(() => elFromHtml(html.value)?.firstElementChild)
  // watch(parsed, () => { console.log(parsed.value) })

  // const classes = computed(() => `article ${parsed.value?.className}`)
  const classes = computed(() => `article markdown-body`)
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
    let el = new DOMParser().parseFromString(host.value.textContent, 'text/html').body
    el.querySelectorAll('ve-image, ve-map').forEach((veComponent) => {
      veComponent.setAttribute('base', props.base as string)
      if (repoIsWritable) veComponent.setAttribute('repo-is-writable', '')
    })  
    html.value = el.innerHTML

    // html.value = host.value.innerHTML
  })

</script>

<style>
  @import '../index.css';
  :host {
    display: block;
    height: 100%;
  }

  /*
  ul[data-id] {
    display: none;
  }
  */


  table[id] {
    display: none;
  }

</style>
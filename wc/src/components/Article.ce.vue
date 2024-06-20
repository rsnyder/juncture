<template>

  <article ref="article" v-html="html" :class="classes"></article>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, onUpdated, ref, toRaw, watch } from 'vue'

  import { elFromHtml, getMarkdown, structureContent, markdownToHtml, observeVisible } from '../../../index.js'

  const props = defineProps({
    owner: { type: String },
    repo: { type: String },
    branch: { type: String, default: 'main' },
    path: { type: String, default: 'README.md'},
    repoIsWritable: { type: Boolean, default: false }
  })
  const ghSource = computed(() => `${props.owner}/${props.repo}/${props.branch}/${props.path}`)

  const article = ref<HTMLElement | null>(null)
  const host = computed(() => (article.value?.getRootNode() as any)?.host)
  
  watch(host, (host) => {
    host.parentElement.addEventListener('scroll', () => setViewersPosition())
  })

  watch(article, (article) => {
    setTimeout(() => setViewersPosition(), 200)
  })

  const markdown = ref()
  const parsed = computed(() => markdown.value && elFromHtml(structureContent(markdownToHtml(markdown.value), repoIsWritable.value))?.firstElementChild)
  const html = computed(() => parsed.value?.innerHTML)
  const classes = computed(() => `article ${parsed.value?.className}`)
  watch(html, () => { nextTick(() => { observeVisible(article.value, true, 612) }) })

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
    markdown.value = host.value.innerHTML
      ? host.value.innerHTML
      : await getMarkdown(ghSource.value)
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
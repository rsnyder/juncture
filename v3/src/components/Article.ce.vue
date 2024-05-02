<template>

  <article ref="article" v-html="html" :class="classes"></article>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  import { elFromHtml, getMarkdown, structureContent, markdownToHtml, observeVisible } from '../../../index.js'

  const props = defineProps({
    owner: { type: String },
    repo: { type: String },
    branch: { type: String, default: 'main' },
    path: { type: String, default: 'README.md'}
  })
  const ghSource = computed(() => `${props.owner}/${props.repo}/${props.branch}/${props.path}`)

  const article = ref<HTMLElement | null>(null)
  const host = computed(() => (article.value?.getRootNode() as any)?.host)
  
  const markdown = ref()
  const parsed = computed(() => markdown.value && elFromHtml(structureContent(markdownToHtml(markdown.value))).firstElementChild)
  const html = computed(() => parsed.value?.innerHTML)
  const classes = computed(() => parsed.value?.className)
  watch(html, () => { nextTick(() => { observeVisible(article.value, true) }) })

  onMounted(async() => {
    markdown.value = host.value.textContent
      ? host.value.firstChild.innerHTML
      : await getMarkdown(ghSource.value)
  })

</script>

<style>
  @import '../../../index.css';
</style>
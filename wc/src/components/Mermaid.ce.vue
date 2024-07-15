<template>

  <div ref="root" class="content">
    <div class="diagram" ref="diagram"></div>
    <div v-if="caption" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, watch } from 'vue'
  import mermaid from 'mermaid'

  const props = defineProps({
    caption: { type: String },
    height: { type: String },
    width: { type: String }
  })
  watch(props, () => {
    if (props.width) host.value.style.width = `${props.width}px`
    if (props.height) host.value.style.height = `${props.height}px`
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const diagram = ref<HTMLElement | null>(null)

  watch(host, () => {
    if (props.width) host.value.style.width = `${props.width}px`
    if (props.height) host.value.style.height = `${props.height}px`
    mermaid.initialize({ startOnLoad: false }) 
  })

  const diagramText = computed(() => host.value?.textContent.trim() )
  // watch(diagramText, (diagramText) => { console.log(diagramText)})
  const caption = computed(() => props.caption )

  watch(diagramText, async(diagramText) => {
    const { svg } = await mermaid.render('diagram', diagramText)
    if (diagram.value) diagram.value.innerHTML = svg
  })

</script>

<style>

  * { box-sizing: border-box; }

  .content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important;
  }

  .diagram {
    display: block;
    margin: auto;
    padding: 12px 0;
    text-align: center;
    width: 100%;
  }

  .caption {
    text-align: start;
    padding: 6px 12px;
    font-size: 1.2em;
    border: 1px solid #ddd;
  }

</style>
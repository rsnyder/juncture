<template>

  <sl-tab-group ref="root">

    <sl-tab slot="nav" panel="j3">Juncture v3</sl-tab>
    <sl-tab slot="nav" panel="j2">Juncture v2</sl-tab>
    <sl-tab slot="nav" panel="j1">Juncture v1</sl-tab>
    <sl-tab slot="nav" panel="html">HTML</sl-tab>

    <sl-tab-panel name="j3" v-html="j3Markup"></sl-tab-panel>
    <sl-tab-panel name="j2" v-html="j2Markup"></sl-tab-panel>
    <sl-tab-panel name="j1" v-html="j1Markup"></sl-tab-panel>
    <sl-tab-panel name="html" v-html="html"></sl-tab-panel>
    
  </sl-tab-group>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)

  const props = defineProps({
  })

  const rawText = ref<string>()
  watch(rawText, () => console.log(`"${rawText.value}"`))

  watch(host, () => {
    rawText.value = host.value?.textContent?.trim()
  })
  
  const jobj = computed(() => {
    return {}
  })
  
  const j1Markup = computed(() => {
    return 'Juncture 1 markup will go here...'
  })

  const j2Markup = computed(() => {
    return 'Juncture 2 markup will go here...'
  })

  const j3Markup = computed(() => {
    return rawText.value
  })

  const html = computed(() => {
    return 'HTML will go here...'
  })

</script>

<style>

* { box-sizing: border-box; }

.main {
  font-size: .8em;
  position: relative;
}

</style>

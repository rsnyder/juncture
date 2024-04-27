<script setup lang="ts">

  import { computed, onMounted, ref, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadowRoot = computed(() => root?.value?.parentNode)

  const props = defineProps({
    file: { type: String },
    language: { type: String, default: 'en' },
    qid: { type: String },
    text: { type: String }
  })
  const qid = ref()
  const file = ref()

  // watch(qid, (qid) => { console.log('entityInfobox', qid, host.value?.textContent) })

  const text = ref (props.text)

  watch(props, (props) => {
    qid.value = props.qid
    text.value = props.text
  })

  onMounted(() => {
    text.value = props.text || host.value?.textContent;
    (shadowRoot.value?.querySelector('sl-dropdown') as any).addEventListener('sl-show', (evt:CustomEvent) => { 
      if (props.qid) qid.value = props.qid
      if (props.file) file.value = props.file
    })
  })

</script>

<template>

<sl-dropdown ref="root" distance="12" placement="top" hoist>
  <div slot="trigger" v-html="text"></div>
  <mdp-entity-card v-if="qid || file" :qid="qid" :file="file" :language="props.language"></mdp-entity-card>
</sl-dropdown>

</template>

<style>

  :host {
    cursor: pointer;
  }

  sl-dropdown svg {
    width: 1.2em;
    height: 1.2em;
    cursor: pointer;
  }

</style>

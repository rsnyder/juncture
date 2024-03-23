<script setup lang="ts">

  import { computed, onMounted, ref, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const props = defineProps({
    language: { type: String, default: 'en' },
    qid: { type: String },
    text: { type: String }
  })
  const qid = ref(props.qid)
  // watch(qid, (qid) => { console.log('entityInfobox', qid, host.value?.textContent) })

  const text = ref (props.text)

  watch(props, (props) => {
    qid.value = props.qid
    text.value = props.text
  })

  onMounted(() => {
    text.value = props.text || host.value?.textContent
  })

</script>

<template>

<sl-dropdown ref="root" distance="12" placement="top">
  <div slot="trigger" v-html="text"></div>
  <mdp-entity-card :qid="qid" :language="props.language"></mdp-entity-card>
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

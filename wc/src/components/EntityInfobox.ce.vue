<script setup lang="ts">

  import { computed, ref } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const text = computed(() => host.value?.textContent)

  const props = defineProps({
    language: { type: String, default: 'en' },
    qid: { type: String }
  })

</script>

<template>

<sl-dropdown ref="root" distance="12" placement="top">
  <div slot="trigger" v-html="text"></div>
  <mdp-entity-card :qid="props.qid" :language="props.language"></mdp-entity-card>
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

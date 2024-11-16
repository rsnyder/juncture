<template>

  <main ref="main">
    <slot v-cloak name="trigger" @click="show"></slot>

    <sl-dialog ref="dialog" label="Dialog" :style="{'--width': `${dialogWidth}`}">
      <slot name="content"></slot>
      <div slot="footer">
        <sl-button variant="primary" class="close" style="margin-right:1em;">Close</sl-button>
      </div>
    </sl-dialog>

  </main>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, watch } from 'vue'
  import type SLDIalog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'

  const main = ref<HTMLElement | null>(null)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)

  const props = defineProps({
    viewers: { type: String }
  })
 
  const dialog = ref<SLDIalog | null>(null)
  const dialogWidth = ref(400)
  const dialogHeight = ref('9vdvw')
  watch(dialog, (dialog) => {
    dialog?.addEventListener('sl-overlay-dismiss', () => dialog.hide())
    dialog?.addEventListener('sl-hide', () => {
      document.body.classList.toggle('close')
      dialog.hide()
    })
    dialog?.querySelector('.close')?.addEventListener('click', () => dialog.hide())
  })

  function show() {
    document.body.classList.toggle('close')
    dialog.value?.show()
  }

</script>

<style>

  [v-cloak] {
    display: none;
  }
</style>
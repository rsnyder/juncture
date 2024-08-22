<template>

  <div ref="root" id="card" class="card">
    
    <div class="label" v-html="label"></div>
    <div class="description" v-html="description"></div>
    <div class="image" :style="{backgroundImage, width: thumbnailWidth}" @click="imageSelected"></div>
  
  </div>
  
  <!--
  <sl-dialog class="dialog" no-header :style="{'--width':dialogWidth, '--body-spacing':0, '--footer-spacing':'0.5em'}">
    <ve-image v-if="showDialog" no-caption :src="src" fit="cover"></ve-image>
    <sl-button slot="footer" variant="primary" @click="showDialog = false">Close</sl-button>
  </sl-dialog>
  -->

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import EventBus from './EventBus'

  function imageSelected() { 
    // EventBus.emit('imageSelected', {src:src.value})
  }

  const props = defineProps({
    data: { type: String },
    description: { type: String },
    dialogWidth: { type: String, default: '100vw' },
    image: { type: String },
    href: { type: String },
    label: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadowRoot = computed(() => root?.value?.parentNode)

  const data = computed(() => props.data ? JSON.parse(props.data) : {})

  const src = computed(() => data.value.id)
  const label = computed(() => data.value.label || props.label)
  const description = computed(() => data.value.description || props.description)
  const image = computed(() => data.value.image || props.image)
  const href = computed(() => data.value.href || props.href)

  // const backgroundImage = computed(() => image.value && `url('${encodeUrl(image.value)}')`)
  const backgroundImage = computed(() => image.value && `url('${image.value}')`)
  const thumbnailWidth = computed(() => `${host.value?.clientWidth * .33}px`)

  let dialog: any
  const showDialog = ref(false)
  watch(showDialog, () => { dialog.open = showDialog.value })

  function encodeUrl(url:string) {
    let parts = url.split('/')
    let encoded = `${parts.slice(0,-1).join('/')}/${encodeURIComponent(parts[parts.length-1])}`
    return encoded
  }

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display:inline-block;
    width: 100%;
  }

  .card {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto 1fr auto;
    /* border: 1px solid #444; */
    border-radius: 6px;
    min-height: 80px;
    max-height: 100px;
    overflow-y: hidden;
    background-color: white;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  .label, .description, .summary, .links {
    margin: 6px;
    font-size: 1rem;
  }

  .label {
    grid-area: 1 / 1 / 2 / 2;
    font-size: 130%;
    font-weight: bold;
  }

  .description {
    grid-area: 2 / 1 / 3 / 2;
    font-size: 110%;
    font-weight: 400;
    height: 100%;
  }

  .summary {
    grid-area: 3 / 1 / 4 / 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    line-height: 1.2rem;
    font-weight: 300;
  }

  .spacer {
    grid-area: 4 / 1 / 5 / 2;
    height: 100%
  }

  .links {
    grid-area: 5 / 1 / 6 / 2;
  }

  .image {
    grid-area: 1 / 2 / 6 / 3;
    height: 100%;
    max-height: 100px;
    object-fit: cover;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .logo img {
    height: 24px;
    margin-right: 12px;
    cursor: pointer;
  }

  sl-dialog::part(panel) {
    max-width: unset;
    max-height: unset;
    height: 100dvh;
  }

  sl-dialog::part(overlay) {
    --sl-overlay-background-color: rgba(100, 100, 100, 0.8);
  }

  sl-dialog::part(footer) {
    background-color: rgba(100, 100, 100, 0.5);
  }

</style>
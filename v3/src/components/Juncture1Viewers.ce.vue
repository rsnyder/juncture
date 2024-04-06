<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { isMobile } from '../utils'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const tabs = ref<HTMLElement | null>(null)

  watch(host, (host) => {
    console.log(`isMobile=${isMobile()}`)
    if (!isMobile()) {
      function setPanelHeight(el: HTMLElement) {
        let isActive = el && el.previousElementSibling?.classList.contains('active')
        if (isActive) {
          let _panelHeight = el.clientHeight
          let _tabsHeight = tabs.value?.querySelector('sl-tab')?.clientHeight || 0
          panelHeight.value = _panelHeight - _tabsHeight
        }
      }
      new ResizeObserver(e => setPanelHeight(e[0].target as HTMLElement)).observe(host)
      setPanelHeight(host.value)
    }
  
    getViewerData() 
  })

  const panelHeight = ref()
  // watch(panelHeight, (panelHeight) => { console.log(`panelHeight=${panelHeight}`) })

  const params = ref<any[]>([])
  // watch(params, (params) => { console.log(toRaw(params)) })

  const images = computed(() => {
    return params.value
      .filter(p => p['ve-image'] !== undefined)
      .map(p => toRaw(p))
  })
  // watch(images, (images) => { if (images.length) console.log('images', toRaw(images)) })

  const maps = computed(() => {
    return params.value
      .filter(p => p['ve-map'] !== undefined)
      .map(p => toRaw(p))
  })
  // watch(maps, (maps) => { if (maps.length) console.log('maps', toRaw(maps)) })

  const props = defineProps({
    dataId: { type: String },
    // style: { type: String }
  })

  function getViewerData() {
    function parseSlot() {
      params.value = Array.from(host.value.querySelectorAll('param') as HTMLElement[])
      .map(el => Object.fromEntries(Array.from(el.attributes).map(a => [a.name, a.value])))
    }
    parseSlot()
    new MutationObserver(
      (mutationsList:any) => {
        for (let mutation of mutationsList) { if (mutation.type === 'childList') parseSlot() }      
      }
    ).observe(host.value, { childList: true, subtree: true })
  }

</script>

<template>
  <div ref="root" id="main">
    <!-- <div v-html="dataId"></div> -->
    <!--
    <mdp-image v-if="images[0]?.src" :src="images[0].src || images[0].manifest"></mdp-image>
    -->

    <sl-tab-group ref="tabs">

      <sl-tab v-if="images.length" slot="nav" panel="image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
      </sl-tab>
      <sl-tab v-if="maps.length" slot="nav" panel="map">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      </sl-tab>
      <sl-tab slot="nav" panel="data">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm64 0v64h64V96H64zm384 0H192v64H448V96zM64 224v64h64V224H64zm384 0H192v64H448V224zM64 352v64h64V352H64zm384 0H192v64H448V352z"/></svg>
      </sl-tab>
      
      <sl-tab-panel v-if="images.length && (images[0].src || images[0].manifest || images[0].url)" name="image" :style="`height:${panelHeight}px`">
        <mdp-image 
          :height="panelHeight"
          :label="images[0].label"
          :src="images[0].src || images[0].manifest" 
          :url="images[0].url" 
        ></mdp-image>
      </sl-tab-panel>

      <sl-tab-panel v-if="maps.length" name="map">
        <mdp-map :center="maps[0].center" :zoom="maps[0].zoom"></mdp-map>
      </sl-tab-panel>

      <sl-tab-panel name="data">
        <div v-if="params" v-for="param, idx in params" :key="`param-${idx}`">
          <pre v-html="JSON.stringify(param, null, 2)"></pre>
        </div>
      </sl-tab-panel>
    
    </sl-tab-group>
  </div>
</template>

<style>

  sl-tab-panel {
    /* border: 1px solid red; */
  }

  sl-tab-panel::part(base) {
    padding: 0;
  }

  svg { width: 1.5em; height: 1.5em; }

  pre {
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
   }

</style>
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const tabs = ref<HTMLElement | null>(null)
  
  const props = defineProps({
    breakpoint: { type: Number, default: 800 },
    dataId: { type: String }
  })

  const isWide = computed(() => documentWidth.value >= props.breakpoint)

  watch(host, () => { getViewerData() })

  function setPanelHeight() {
    // console.log(`setPanelHeight: documentWidth=${documentWidth.value}`)
    if (isWide.value) {
      let _panelHeight = host.value.parentElement?.clientHeight
      let _tabsHeight = tabs.value?.querySelector('sl-tab')?.clientHeight || 36
      panelHeight.value = _panelHeight - _tabsHeight
    } else {
      panelHeight.value = undefined
    }
  }

  const documentWidth = ref(document.body.getBoundingClientRect().width)
  watch (documentWidth, () => { setPanelHeight() })

  onMounted(() => {
    setPanelHeight()
    new ResizeObserver(() => { documentWidth.value = document.body.getBoundingClientRect().width }).observe(document.body)
  })

  const panelHeight = ref()
  // watch (panelHeight, (panelHeight) => { console.log(`panelHeight=${panelHeight}`) })

  const params = ref<any[]>([])
  // watch (params, () => { console.log(toRaw(params.value)) })

  const compare = computed(() => params.value.filter(p => p['ve-compare'] !== undefined).map(p => toRaw(p)))
  const diagrams = computed(() => params.value.filter(p => p['ve-d3plus-ring-network'] !== undefined).map(p => toRaw(p)))
  const iframes = computed(() => params.value.filter(p => p['ve-iframe'] !== undefined).map(p => toRaw(p)))
  const images = computed(() => params.value.filter(p => p['ve-image'] !== undefined).map(p => toRaw(p)))
  const maps = computed(() => params.value.filter(p => p['ve-map'] !== undefined).map(p => toRaw(p)))
  const mapLayers = computed(() => params.value.filter(p => p['ve-map-layer'] !== undefined || p['ve-map-marker'] !== undefined).map(p => toRaw(p)))
  const plantSpecimens = computed(() => params.value.filter(p => p['ve-plant-specimen'] !== undefined).map(p => toRaw(p)))
  const timelinejs = computed(() => params.value.filter(p => p['ve-knightlab-timeline'] !== undefined).map(p => toRaw(p)))
  const videos = computed(() => params.value.filter(p => p['ve-video'] !== undefined).map(p => toRaw(p)))

  function getViewerData() {
    function parseSlot() {
      params.value = Array.from(host.value.querySelectorAll('param') as HTMLElement[])
      .map((el, idx) => ({...Object.fromEntries(Array.from(el.attributes).map(a => [a.name, a.value])), ...{idx} }) )
    }
    parseSlot()
    new MutationObserver(
      (mutationsList:any) => {
        for (let mutation of mutationsList) { if (mutation.type === 'childList') parseSlot() }      
      }
    ).observe(host.value, { childList: true, subtree: true })
  }

  function serializeProps(props: any) {
    return Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')
  }

</script>

<template>
  <div ref="root" id="main">

    <sl-tab-group ref="tabs">

      <sl-tab v-if="diagrams.length" slot="nav" panel="diagrams" :active="diagrams[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48V96H384V80c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H432c-26.5 0-48-21.5-48-48V160H192v16c0 1.7-.1 3.4-.3 5L272 288h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H272c-26.5 0-48-21.5-48-48V336c0-1.7 .1-3.4 .3-5L144 224H48c-26.5 0-48-21.5-48-48V80z"/></svg>
      </sl-tab>
      <sl-tab v-if="images.length" slot="nav" panel="image" :active="images[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
      </sl-tab>
      <sl-tab v-if="maps.length" slot="nav" panel="map" :active="maps[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      </sl-tab>
      <sl-tab v-if="compare.length" slot="nav" panel="compare" :active="compare[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/></svg>      </sl-tab>
      <sl-tab v-if="timelinejs.length" slot="nav" panel="timelinejs">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z"/></svg>
      </sl-tab>
      <sl-tab v-if="videos.length" slot="nav" panel="videos" :active="videos[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
      </sl-tab>
      <sl-tab v-if="plantSpecimens.length" slot="nav" panel="plantSpecimens" :active="plantSpecimens[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"/></svg>
      </sl-tab>
      <sl-tab v-if="iframes.length" slot="nav" panel="iframes" :active="iframes[0].idx === 0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
      </sl-tab>
      <sl-tab slot="nav" panel="data">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm64 0v64h64V96H64zm384 0H192v64H448V96zM64 224v64h64V224H64zm384 0H192v64H448V224zM64 352v64h64V352H64zm384 0H192v64H448V352z"/></svg>
      </sl-tab>
      
      <sl-tab-panel v-if="images.length && (images[0].src || images[0].manifest || images[0].url)" name="image" :style="`height:${panelHeight}px`">
        <mdp-image :height="panelHeight" :zoom-on-scroll="isWide ? '' : null">
          <ul>
            <li v-for="def, idx in images" :key="`image-${idx}`" v-text="serializeProps(def)"></li>
          </ul>
        </mdp-image>
      </sl-tab-panel>

      <sl-tab-panel v-if="maps.length" name="map">
        <mdp-map 
          :caption="maps[0].caption" 
          :center="maps[0].center" 
          :height="panelHeight" 
          :title="maps[0].title" 
          :zoom="maps[0].zoom" 
        >
          <ul>
            <li v-for="def, idx in mapLayers" :key="`map-layer-${idx}`" v-text="serializeProps(def)"></li>
          </ul>
        </mdp-map>
      </sl-tab-panel>

      <sl-tab-panel v-if="compare.length" name="compare">
        <mdp-compare :height="panelHeight">
          <ul>
            <li v-for="def, idx in compare" :key="`compare-${idx}`" v-text="serializeProps(def)"></li>
          </ul>
        </mdp-compare>
      </sl-tab-panel>

      <sl-tab-panel v-if="timelinejs.length" name="timelinejs" :style="{height:`${panelHeight}px`}">
        <mdp-knightlab-timeline :source="timelinejs[0].source" :height="panelHeight"></mdp-knightlab-timeline>
      </sl-tab-panel>

      <sl-tab-panel v-if="videos.length" name="videos" :style="{height:`${panelHeight}px`}">
        <mdp-video :src="`https://www.youtube.com/watch?v=${videos[0].id || videos[0].vid}`" :height="panelHeight"></mdp-video>
      </sl-tab-panel>
      
      <sl-tab-panel v-if="iframes.length" name="iframes" :style="{height:`${panelHeight || 500}px`}">
        <mdp-iframe 
        :allow="iframes[0].allow" 
        :allowfullscreen="iframes[0].allowfullscreen" 
        :allowtransparency="iframes[0].allowtransparency" 
        :caption="iframes[0].caption" 
        :frameborder="iframes[0].frameborder" 
        :height="panelHeight"
        :name="iframes[0].name" 
        :referrerpolicy="iframes[0].referrerpolicy"
        :src="iframes[0].src" 
      ></mdp-iframe>
      </sl-tab-panel>
      
      <sl-tab-panel v-if="plantSpecimens.length" name="plantSpecimens" :style="{height:`${panelHeight}px`}">
        <mdp-plant-specimen :height="panelHeight"
          :eid="plantSpecimens[0].eid"
          :qid="plantSpecimens[0].qid"
          :jpid="plantSpecimens[0].jpid"
          :wdid="plantSpecimens[0].wdid"
          :taxonName="plantSpecimens[0].taxonName"
          :caption="plantSpecimens[0].caption"
          :max="plantSpecimens[0].max"
        ></mdp-plant-specimen>
      </sl-tab-panel>

      <sl-tab-panel v-if="diagrams.length" name="diagrams" :style="{height:`${panelHeight}px`}">
        <mdp-visjs 
          :height="panelHeight" 
          :url="diagrams[0].url"
        ></mdp-visjs>
      </sl-tab-panel>

      <sl-tab-panel name="data" style="background-color:white;">
        <div v-if="params" v-for="param, idx in params" :key="`param-${idx}`">
          <pre v-html="JSON.stringify(param, null, 2)"></pre>
        </div>
      </sl-tab-panel>

    </sl-tab-group>
  </div>
</template>

<style>

  #main {
    background-color: black;
  }

  sl-tab-group::part(tabs) {
    background-color: #ddd;
  }

  sl-tab-panel::part(base) {
    padding: 0;
  }

  sl-tab::part(base) {
    padding: 0.5em;
  }

  svg { width: 20px; height: 20px; }

  pre {
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */

    overflow-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }

</style>
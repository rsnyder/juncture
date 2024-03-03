<template>

  <div ref="root" :style="{width: '100%', height: '100%'}">
    <ul>
      <li v-for="(item, idx) in images" :key="`img-${idx+1}`">
        <img :src="`https://iiif.mdpress.io/thumbnail/${item}`" @click="imageSelected(item)"/>
      </li>
    </ul>
  </div>

  <div ref="overlayRef">
    <!--
    <div ref="modalRef" id="hs-basic-modal" class="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div class="p-4 overflow-y-auto flex items-center gap-4 text-black">
            <mdp-image :src="selectedImage"></mdp-image>
          </div>
        </div>
      </div>
    </div>
    -->
    
    <div ref="modalRef" id="hs-full-screen-modal" class="w-full h-full hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
      <div class="max-w-full">
        <div class="h-[100vh] flex flex-col bg-white dark:bg-gray-800">
          <div class="flex">
            <button type="button" class="flex ml-auto justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-full-screen-modal">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <mdp-image :src="selectedImage" class="h-[100%] w-[100%] object-contain"></mdp-image>
        </div>
      </div>
    </div>

  </div>

</template>
      
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  
  // @ts-ignore
  import { HSOverlay } from '../lib/preline/components/hs-overlay'

  const props = defineProps({
    data: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)

  const overlayRef = ref<HTMLElement | null>(null)
  const overlayEl = computed(() => overlayRef?.value as HTMLElement)
  const overlay = computed(() =>  new HSOverlay(overlayEl.value) )

  const modalRef = ref<HTMLElement | null>(null)
  const modalEl = computed(() => modalRef?.value as HTMLElement)

  watch(modalEl, (modal) => { 
    overlay.value.init()
    modal.addEventListener('open.hs.overlay', (e:any) => isOpen.value = true)
    modal.addEventListener('close.hs.overlay', (e:any) => isOpen.value = false)
  })

  const isOpen = ref(false)
  watch(isOpen, (isOpen) => {
    if (isOpen) overlay.value.open(modalEl.value)
    else overlay.value.close(modalEl.value)
  })

  const images = ref<any[]>([])
  // watch(images, (images) => { console.log(toRaw(images)) })
  
  const selectedImage = ref('')

  onMounted(() => {
    listenForSlotChanges()
    getImages()
  })

  async function getImages() {
    let dataEl = (props.data ? document.getElementById(props.data) : host.value) as HTMLElement
    console.log('dataEl', dataEl)
    images.value = Array.from(dataEl.querySelectorAll('li')).map((item:any) => item.textContent)
  }

  function listenForSlotChanges() {
    const callback = (mutationsList:any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && Array.from(mutation.target.classList).indexOf('hydrated') >= 0) getImages ()       
      }
    }
    const observer = new MutationObserver(callback);
    observer.observe(host.value, { childList: true, subtree: true, characterData: true })
  }    

  function imageSelected(img:any) {
    selectedImage.value = img
    isOpen.value = !isOpen.value
  }

</script>

<style>

  @import '@shoelace-style/shoelace/dist/themes/light.css';
  @import '../tailwind.css';

  * { box-sizing: border-box; }

  :host {
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;
    background-color: inherit;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

</style>
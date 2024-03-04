<template>

  <div ref="root" id="image-grid">

    <div v-if="layout.length > 0" v-for="img, idx in imageData"
      class="pig-figure"
      :id="imageData.id"
      :style="layout[idx]"
    >
      <img class="image" onload="this.style.opacity = 1" :src="imageData[idx].thumbnail" @click="imageSelected(idx)">
      <div class="caption">
        <div class="icons">
          <img v-if="imageData[idx].logo" class="provider-logo" :src="imageData[idx].logo" alt="Provider Logo">
        </div>
        <div class="size">
          <span v-if="imageData[idx].width">{{ imageData[idx].width.toLocaleString() }} x {{ imageData[idx].height.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>

  <sl-dialog class="dialog" no-header :style="{'--width':dialogWidth, '--body-spacing':0, '--footer-spacing':'0.5em'}">
    <mdp-image v-if="selectedImage" no-caption :src="selectedImage.id" fit="cover"></mdp-image>
    <sl-button slot="footer" variant="primary" @click="selectedImage = null">Close</sl-button>
  </sl-dialog>

</template>

<script setup  lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  watch(host, () => { getImageData() })

  const shadowRoot = computed(() => root?.value?.parentNode)

  const props = defineProps({
    data: { type: String },
    dialogWidth: { type: String, default: '100vw' }
  })

  const imageData = <any>ref([])
  watch(imageData, async () => {
    console.log(toRaw(imageData.value))
    await checkImagesSizes(imageData.value)
    doLayout()
  })

  const selectedImage = ref<any | null>(null)
  watch(selectedImage, () => {
    showDialog.value = selectedImage.value !== null 
  })

  const width = ref(0)
  const layout = ref<any[]>([])
  let doLayoutDebounceTimer:any

  let dialog: any
  const showDialog = ref(false)
  watch(showDialog, () => { dialog.open = showDialog.value })

  function getImageData() {
    if (props.data) {
      let dataEl = document.getElementById(props.data) as HTMLElement
      imageData.value = Array.from(dataEl.querySelectorAll('li'))
        .map((item:any) => item.textContent)
        .map((imageId:string) => {
          return { thumbnail: `https://iiif.mdpress.io/thumbnail/${imageId}`, id: imageId}
        })
    } else {
      let slot = host.value.parentElement
      function parseSlot() {
        imageData.value = Array.from(slot.querySelectorAll('li')).map((li: any) => li.innerText)
      }
      parseSlot()
      new MutationObserver(
        (mutationsList:any) => {
          for (let mutation of mutationsList) { if (mutation.type === 'childList') parseSlot() }      
        }
      ).observe(slot, { childList: true, subtree: true })
    }
  }

  function doLayout() {
    // console.log(`doLayout: width=${width.value} images=${imageData.value.length} layout=${layout.value.length}`)
    if (imageData.value.length === 0) return

    let numImages = imageData.value.length
    const minAspectRatio = width.value <= 640 ? 2
                         : width.value <= 960 ? 3
                         : width.value <= 1280 ? 4
                         : width.value <= 1920 ? 5
                         : 6
    console.log(`width=${width.value} minAspectRatio=${minAspectRatio}`)

    let _layout:any[] = []

    let spaceBetweenImages = 16

    let row:any[] = []
    let translateX = 0
    let translateY = 0
    let rowAspectRatio = 0

    // Loop through all our images, building them up into rows and computing
    // the working rowAspectRatio.
    imageData.value.forEach((image, index) => {
      rowAspectRatio += image.aspect_ratio
      row.push(image)

      if (rowAspectRatio >= minAspectRatio || index + 1 === numImages) {

        rowAspectRatio = Math.max(rowAspectRatio, minAspectRatio)

        // Compute this row's height.
        const totalDesiredWidthOfImages = width.value - spaceBetweenImages * (row.length - 1)
        const rowHeight = totalDesiredWidthOfImages / rowAspectRatio

        row.forEach(img => {
          const imageWidth: number = rowHeight * img.aspect_ratio
          _layout.push( {
            width: `${Math.round(imageWidth)}px`,
            height: `${Math.round(rowHeight)}px`,
            transform: `translate3d(${Math.round(translateX)}px, ${Math.round(translateY)}px, 0)`,
          })
          translateX += imageWidth + spaceBetweenImages
        })

        // Reset our state variables for next row.
        row = []
        rowAspectRatio = 0
        translateY += rowHeight + spaceBetweenImages
        translateX = 0
      }
    })

    if (root.value) root.value.style.height = `${translateY - spaceBetweenImages}px`
    layout.value = _layout
  }

  function imageSelected(index:number) {
    selectedImage.value = imageData.value[index] as any
  }

  onMounted(() => {
    dialog = shadowRoot.value?.querySelector('.dialog')
    dialog.addEventListener('sl-hide', (evt:CustomEvent) => showDialog.value = false )
  })

  watch(root, () => {
    if (root.value) {
      width.value = root.value?.clientWidth || 0
      const resizeObserver = new ResizeObserver(() => {
        if (root.value?.clientWidth && root.value?.clientWidth !== width.value) {
          width.value = root.value?.clientWidth
          clearTimeout(doLayoutDebounceTimer)
          doLayoutDebounceTimer = setTimeout(doLayout, 10)
        }
      })
      resizeObserver.observe(root.value)
    }
  })

  async function checkImagesSizes(images:any[]) {
    let promises = images
      .filter((image:any) => !image.width)
      .map((image:any) => getImageSize(image))

    if (promises.length) {
      let results = await Promise.all(promises)
      results.forEach((result:any) => {
        let found:any = images.find((item:any) => result.id === item.id)
        found.width = result.width
        found.height = result.height
        found.aspect_ratio = result.aspect_ratio
        found.format = result.format
      })
    }
  }

  async function getImageSize(image: any, minWidth=200): Promise<{ image:any, width: number, height: number }> {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        let width = img.width < minWidth ? minWidth : img.width
        let height = img.width < minWidth ? img.height * minWidth/img.width : img.height
        let aspect_ratio = Number((width/height).toFixed(4))
        resolve({...image, aspect_ratio, format: 'image/jpeg'})
      }
      img.onerror = () => reject()
      img.src = image.thumbnail
    })
  }

</script>

<style>

  @import '@shoelace-style/shoelace/dist/themes/light.css';

  * { box-sizing: border-box; }

  #image-grid {
    position: relative;
    margin: 1rem;    
  }

  @media only screen and (max-width: 768px) {
    #image-grid {
      margin: 0;
    }
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

  .pig-figure {
    position: absolute;
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
    width: 100px;
    box-shadow: 2px 2px 4px 0 #ccc;
  }

  .pig-figure:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  .image {
    left: 0;
    top: 0;
    width: 100%;
    opacity: 0;
    background-color: #D5D5D5;
  }

  .image:hover {
    cursor: pointer;
  }

  .caption {
    height: 100%;
    width: 100%;
    z-index: 1;
    padding: 6px 3px 3px 3px;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .size {
    width: 100%;
    font-size: 0.8em;
    margin-top: 3px;
  }

  .provider-logo {
    height: 20px;
  }

  .license {
    cursor: pointer;
    display: inline-block;
  }

  .image-card {
    font-size: 0.85em;
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9em;
  }

  .title img {
    width: 16px;
    opacity: 1;
  }

  .clamp {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    /* margin-bottom: 6px; */
  }

  .text {
    margin: 6px 0;
    height: 50px;
  }

  .text p {
    margin: 0;
    padding: 0;
  }

  .license {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.8em;
    margin-left: 0.5rem;
  }

  a.license {
    color: black;
    text-decoration: none;
    font-size: 0.9rem;
  }

  sl-icon {
    font-size: 1.2rem;
  }

  .push {
    margin-left: auto;
  }

</style>
<template>

  <div ref="root" id="gallery">

    <div v-if="layout.length > 0" v-for="img, idx in images"
      class="gallery-item"
      :id="img.id"
      :style="layout[idx]"
    >
      <img class="image fade-in" 
        onload="this.style.opacity = 1" 
        :src="images[idx].thumbnail" 
        @click="imageSelected(idx)"
        @dragstart="onDragStart(idx, $event)"
        draggable>
      <div v-if="caption" style="height:32px;display:flex;align-items:center;margin-left:0.25em" v-html="images[idx].label"></div>
    </div>
    
  </div>

  <sl-dialog class="dialog" no-header :style="{'--width':dialogWidth, '--body-spacing':0, '--footer-spacing':'0.5em'}">
    <ve-image v-if="selected" no-caption :src="selected.id" fit="contain"></ve-image>
    <div slot="footer" class="footer">
      <ve-caption :manifest="selected"></ve-caption>
      <div class="controls push">
        <div v-if="userCanUpdateRepo" class="toolbar">
          <svg class="push edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
          <svg class="delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
        </div>
        <img src="https://v3.juncture-digital.org/images/iiif.png" class="iiif" alt="IIIF manifest icon"
          @click="copyTextToClipboard(selected.id)" 
        />
        <sl-button variant="primary" @click="selected = null">Close</sl-button>
      </div>
    </div>
  </sl-dialog>

</template>

<script setup  lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { findItem, isMobile, loadManifests } from '../utils'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  watch(host, () => { getImageData() })

  const shadowRoot = computed(() => root?.value?.parentNode)

  const props = defineProps({
    active: { type: Boolean },
    base: { type: String },
    caption: { type: Boolean, default: false },
    class: { type: String },
    data: { type: String },
    dialogWidth: { type: String, default: '100vw' },
    ghDir: { type: String},
    height: { type: Number},
    slot: { type: String}
  })

  const window = (self as any).window
  const config = ref<any>(window.config || {})
  const user = ref<any>(null)
  watch(user, async () => {
    if (config.value?.github && user.value?.token) {
      userCanUpdateRepo.value = await isCollaborator(config.value?.source?.owner, config.value?.source?.repository, user.value.username, user.value.token)
    }
  })
  const userCanUpdateRepo = ref(false)
  // watch (userCanUpdateRepo, () => console.log('userCanUpdateRepo', userCanUpdateRepo.value))

  const source = computed(() => {
    if (config.value.source) return config.value.source
    else if (props.base) {
      let [owner, repository, branch, ...dir] = props.base.split('/')
      return { owner, repository, branch, dir: dir ? `/${dir.join('/')}/` : '/'}
    }
    return null
  })

  const manifestUrls = ref<string[]>([])
  watch(manifestUrls, async (manifestUrls) => {
    // console.log(toRaw(manifestUrls))
    manifests.value = await loadManifests(manifestUrls) 
  })

  function metadata(manifest:any) {
    return Object.fromEntries(
      manifest.metadata?.map((item:any) => [
        (item.label.en || item.label.none || Object.keys(item.label)[0])[0], 
        (item.value.en || item.value.none || Object.keys(item.value)[0])[0]
      ]
    ))
  }

  const manifests = ref<any[]>([])
  watch(manifests, (manifests) => {
    // console.log(toRaw(manifests))
    images.value = manifests.map((manifest:any) => {
      // console.log(toRaw(manifest))
      let meta = metadata(manifest)
      let photoDetails = [meta.camera, meta.exposure, meta.mode].filter((item:any) => item).join(', ')
      let imgInfo = findItem({type:'Annotation', motivation:'painting'}, manifest, 1).body
      let orientation = manifest.metadata?.filter((item:any) => (item.label.en || item.label.none)[0] === 'orientation')
        .map((item) => (item.value.en || item.value.none)[0])[0] || 1
      orientation = Array.isArray(orientation) ? orientation[0] : orientation
      let width = (orientation === 1 || orientation === 3) ? imgInfo.width : imgInfo.height
      let height = (orientation === 1 || orientation === 3) ? imgInfo.height : imgInfo.width
      return {
        id: manifest.id,
        label: manifest.label ? manifest.label.en || manifest.label.none || Object.values(manifest.label)[0] : null,
        summary: manifest.summary ? manifest.summary.en || manifest.summary.none || Object.values(manifest.summary)[0] : null,
        width,
        height,
        format: imgInfo.format,
        orientation,
        aspect_ratio: Number((width/height).toFixed(4)),
        thumbnail: manifest.thumbnail[0].id,
        photoDetails
      }
    })
  })

  const images = ref<any[]>([])
  watch(images, (images) => {
    // console.log(toRaw(images))
    doLayout()
  })

  const selected = ref<any | null>(null)
  watch(selected, () => {
    // console.log(toRaw(selected.value))
    showDialog.value = selected.value !== null 
  })

  const width = ref(0)
  const layout = ref<any[]>([])
  let doLayoutDebounceTimer:any

  let dialog: any
  const showDialog = ref(false)
  watch(showDialog, () => { dialog.open = showDialog.value })

  function imageIdtoUrl(imageId: string) {
    if (imageId.indexOf('http') === 0) return imageId
    let imgSource, imgPath
    if (imageId.indexOf(':') > 0) {
      [imgSource, imgPath] = imageId.split(':')
    } else imgPath = imageId
    let imagePathParts = imgPath.split('/')
    let fname = imagePathParts[imagePathParts.length - 1]
    let extSeparator = fname.lastIndexOf('.')
    let name = fname.slice(0, extSeparator)
    let ext = fname.slice(extSeparator + 1)
    imagePathParts[imagePathParts.length - 1] = `${encodeURIComponent(name)}.${ext}`
    imageId = imagePathParts.join('/')
    imageId = imgSource 
      ? `${imgSource}:${imagePathParts.join('/')}`
      : `gh:${source.value.owner}/${source.value.repository}${source.value.dir}/${imagePathParts.join('/')}`
    return `https://iiif.mdpress.io/${imageId}/manifest.json`
  }

  function parseImageDefStr(s:String): Object {
    let tokens: string[] = []
    // s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
    s = s.replace(/”/g,'"').replace(/”/g,'"')
    s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    let parsed:any = {}
    let positionalArgs = ['src', 'caption', 'options', 'fit', 'rotate', 'seq' ]
    tokens.filter(t => t !== 'image').forEach((token, idx) => {
      if (token.indexOf('=') > 0) {
        let i = token.indexOf('=')
        let key = token.slice(0, i)
        let value = token.slice(i+1)
        parsed[key] = value[0] === '"' ? value.slice(1,-1) : value 

      } else {
        parsed[positionalArgs[idx]] = token[0] === '"' ? token.slice(1,-1) : token 
      }
    })
    return parsed
  }

  function getImageData() {
    if (props.data) {
      let dataEl = document.getElementById(props.data) as HTMLElement
      manifestUrls.value = Array.from(dataEl.querySelectorAll('li'))
        .map((item:any) => item.textContent)
        .map((imageId:string) => imageIdtoUrl(imageId))
    } else if (props.ghDir) {
      let ghDir = (props.ghDir[0] === '/') ? props.ghDir.slice(1) : props.ghDir
      fetch (`https://iiif.mdpress.io/gh-dir/${ghDir}?filter=images`)
      .then(response => response.json())
      .then(data => {
        manifestUrls.value = data.map((item:any) => imageIdtoUrl(`gh:${props.ghDir}/${item.name}`))
      })
    } else {
      let slot = host.value
      function parseSlot() {
        manifestUrls.value = Array.from(slot.querySelectorAll('li'))
        .map((li: any) => li.innerText)
        .map((liText:string) => parseImageDefStr(liText))
        .map((imgObj:any) => {
          // console.log(imgObj)
          // imageIdtoUrl(imageId)
          return imageIdtoUrl(imgObj.src)
        })
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
    // console.log(`doLayout: width=${width.value} images=${images.value.length}`)
    if (images.value.length === 0) return

    let captionHeight = props.caption ? 32 : 0

    let numImages = images.value.length
    const minAspectRatio = width.value <= 640 ? 2
                         : width.value <= 960 ? 3
                         : width.value <= 1280 ? 4
                         : width.value <= 1920 ? 5
                         : 6
    // console.log(`width=${width.value} minAspectRatio=${minAspectRatio}`)

    let _layout:any[] = []

    let spaceBetweenImages = isMobile() ? 8 : 16

    let row:any[] = []
    let translateX = 0
    let translateY = 0
    let rowAspectRatio = 0

    // Loop through all our images, building them up into rows and computing the working rowAspectRatio.
    images.value.forEach((image, index) => {
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
            height: `${Math.round(rowHeight + captionHeight)}px`,
            transform: `translate3d(${Math.round(translateX)}px, ${Math.round(translateY)}px, 0)`,
          })
          translateX += imageWidth + spaceBetweenImages
        })

        // Reset our state variables for next row.
        row = []
        rowAspectRatio = 0
        translateY += rowHeight + spaceBetweenImages + captionHeight
        translateX = 0
      }
    })

    if (root.value) root.value.style.height = `${translateY - spaceBetweenImages}px`
    layout.value = _layout
  }

  function imageSelected(index:number) {
    // console.log(`imageSelected: ${index}`)
    selected.value = manifests.value[index] as any
  }

  onMounted(() => {
    console.log('Gallery mounted')
    user.value = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
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

  async function isCollaborator(owner: string, repo: string, username: string, token: string) {
    // console.log(`GithubClient.isCollaborator: owner=${owner} repo=${repo} username=${username}`)
    let url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`
    let resp = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`
      }
    })
    return resp.ok && resp.status === 204
  }

  function captionText(image:any) {
    return image.label || image.summary || ''
  }

  function copyTextToClipboard(text: string) {
    // console.log('copyTextToClipboard', text)
    if (navigator.clipboard) navigator.clipboard.writeText(text)
  }

  function onDragStart(index:number, event: DragEvent) {
    event.dataTransfer?.setData('text/plain', manifests.value[index].id)
  }

</script>

<style>

  @import '@shoelace-style/shoelace/dist/themes/light.css';

  * { box-sizing: border-box; }

  #gallery {
    position: relative;
    margin: 1rem;    
  }

  @media only screen and (max-width: 768px) {
    #gallery {
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

  .gallery-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
    width: 100px;
    box-shadow: 2px 2px 4px 0 #ccc;
  }

  .gallery-item:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  .image {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: #D5D5D5;
  }

  .fade-in {
    opacity: 0;
    -webkit-transition: all 1s ease; 
    -moz-transition: all 1s ease; 
    -ms-transition: all 1s ease; 
    -o-transition: all 1s ease; 
  } 

  .image:hover {
    cursor: pointer;
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

  .controls {
    display: flex;
    align-items: center;
    gap: 1em;
  }

  .toolbar {
    height: 32px;
    justify-content: flex-end;
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0 0.2em
  }

  .toolbar svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    fill: #777;
  }

  .toolbar svg:hover {
    fill: #444;
  }

  .dialog .footer {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em;
    text-align: left;
  }

  .iiif {
    width: 32px;
    height: 32px;
    cursor: copy;
  }

  .iiif:hover {
    width: 40px;
    height: 40px;
  }


</style>
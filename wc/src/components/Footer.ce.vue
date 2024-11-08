<template>

  <ul ref="footer" id="footer">
    
    <li v-if="!footerElems.length">
      <a href="https://v3.juncture-digital.org">Powered by 
        <img src="https://v3.juncture-digital.org/logo.png" alt="Juncture Logo" style="height:36px; vertical-align:middle;">
      </a>
    </li>
    
    <li v-for="li, idx in footerElems" :key="`li-${idx}`" v-html="li.innerHTML" :class="li.className" :style="li.getAttribute('style') || ''"></li>
    
    <li v-if="pdfDownloadEnabled || !footerElems.length" class="push">
      <sl-tooltip placement="top" content="Generate PDF for page">
        <a href="javascript:;" @click="generatePDF">
          <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 116 116"
            enable-background="new 0 0 100 100"
            xml:space="preserve"
            id="svg30"
            sodipodi:docname="noun_117327_cc.svg"
            width="30"
            height="30"
            fill="#0969da"
            inkscape:version="0.92.2 5c3e80d, 2017-08-06"><metadata
              id="metadata36"><rdf:RDF><cc:Work
                  rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
                    rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs
              id="defs34" /><sodipodi:namedview
              pagecolor="#ffffff"
              bordercolor="#666666"
              borderopacity="1"
              objecttolerance="10"
              gridtolerance="10"
              guidetolerance="10"
              inkscape:pageopacity="0"
              inkscape:pageshadow="2"
              inkscape:window-width="640"
              inkscape:window-height="480"
              id="namedview32"
              showgrid="false"
              fit-margin-top="10"
              fit-margin-left="10"
              fit-margin-right="10"
              fit-margin-bottom="10"
              inkscape:zoom="1.888"
              inkscape:cx="48.5"
              inkscape:cy="45.001"
              inkscape:window-x="0"
              inkscape:window-y="0"
              inkscape:window-maximized="0"
              inkscape:current-layer="svg30" />
              <g id="g24" transform="translate(8.5,8.4990005)"><path d="m 73.104,64.133 c -1.17,0.345 -2.887,0.384 -4.729,0.117 -1.976,-0.287 -3.992,-0.891 -5.973,-1.781 3.533,-0.514 6.274,-0.356 8.618,0.475 0.556,0.197 1.468,0.723 2.084,1.189 M 53.392,60.892 c -0.144,0.039 -0.285,0.076 -0.426,0.115 -0.951,0.259 -1.876,0.511 -2.767,0.736 l -1.202,0.305 c -2.418,0.612 -4.89,1.237 -7.331,1.981 0.928,-2.238 1.79,-4.5 2.634,-6.712 0.625,-1.637 1.263,-3.31 1.923,-4.961 0.335,0.553 0.684,1.106 1.048,1.661 1.656,2.523 3.738,4.856 6.121,6.875 m -6.15,-25.233 c 0.157,2.761 -0.439,5.417 -1.313,7.965 -1.076,-3.151 -1.578,-6.63 -0.232,-9.439 0.345,-0.72 0.628,-1.105 0.811,-1.306 0.283,0.438 0.656,1.416 0.734,2.78 M 34.62,70.635 c -0.605,1.082 -1.222,2.095 -1.855,3.051 -1.527,2.301 -4.024,4.765 -5.307,4.765 -0.126,0 -0.279,-0.02 -0.502,-0.256 -0.144,-0.151 -0.167,-0.259 -0.16,-0.406 0.043,-0.846 1.164,-2.353 2.788,-3.75 1.474,-1.268 3.14,-2.394 5.036,-3.404 m 42.57,-6.383 c -0.196,-2.818 -4.94,-4.626 -4.987,-4.643 -1.834,-0.65 -3.826,-0.966 -6.09,-0.966 -2.424,0 -5.037,0.351 -8.393,1.135 -2.986,-2.117 -5.566,-4.767 -7.493,-7.701 -0.851,-1.296 -1.616,-2.59 -2.283,-3.854 1.628,-3.893 3.094,-8.079 2.828,-12.767 -0.215,-3.759 -1.91,-6.284 -4.215,-6.284 -1.581,0 -2.943,1.171 -4.05,3.484 -1.975,4.122 -1.456,9.396 1.542,15.689 -1.08,2.536 -2.083,5.165 -3.054,7.711 -1.208,3.165 -2.453,6.43 -3.856,9.536 -3.935,1.557 -7.167,3.445 -9.861,5.763 -1.765,1.516 -3.892,3.833 -4.014,6.252 -0.059,1.139 0.331,2.184 1.125,3.021 0.843,0.889 1.903,1.357 3.068,1.358 3.848,0 7.551,-5.287 8.253,-6.347 1.414,-2.131 2.737,-4.508 4.034,-7.25 3.266,-1.18 6.747,-2.061 10.12,-2.913 l 1.208,-0.307 c 0.908,-0.231 1.852,-0.486 2.82,-0.751 1.025,-0.277 2.079,-0.564 3.15,-0.837 3.464,2.203 7.189,3.64 10.822,4.167 3.06,0.445 5.778,0.187 7.617,-0.772 1.656,-0.862 1.748,-2.192 1.709,-2.724 m 7.452,24.232 c 0,5.161 -4.549,5.479 -5.467,5.49 H 20.488 c -5.142,0 -5.452,-4.58 -5.462,-5.49 V 10.517 c 0,-5.166 4.557,-5.479 5.462,-5.49 h 39.645 l 0.021,0.021 v 15.471 c 0,3.105 1.877,8.983 8.986,8.983 h 15.37 l 0.132,0.132 z M 80.998,25.975 H 69.141 C 64,25.975 63.689,21.42 63.682,20.519 V 8.588 Z m 7.17,62.509 V 28.178 L 63.682,3.59 V 3.476 H 63.565 L 61.599,1.5 H 20.488 C 17.379,1.5 11.5,3.385 11.5,10.517 v 77.968 c 0,3.118 1.879,9.016 8.988,9.016 h 58.693 c 3.108,-0.001 8.987,-1.885 8.987,-9.017" id="path22" inkscape:connector-curvature="0" /></g>
            </svg>
          </a>
      </sl-tooltip>
    </li>

    <li v-if="showCodeEnabled || !footerElems.length">
      <sl-tooltip placement="top" content="Show page Markdown code">
        <a href="javascript:;" @click="showCode">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0969da" class="bi bi-markdown" viewBox="0 0 16 16">
            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"></path>
            <path fill-rule="evenodd" d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"></path>
            <path fill-rule="evenodd" d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"></path>
            <path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"></path>
          </svg>
        </a>
      </sl-tooltip>
    </li>

    <!--
    <li>
      <sl-tooltip placement="top" content="Open Juncture Editor">
        <a href="javascript:;" @click="openEditor">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="#777" ><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
        </a>
      </sl-tooltip>
    </li>
    -->
  </ul>

  <!-- Generating PDF dialog -->
  <div ref="pdfOverlayRef">
    <div ref="modalRef" id="hs-basic-modal" class="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div class="p-4 overflow-y-auto flex items-center gap-4">
            <sl-spinner style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner>
            <p v-html="modalText"></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Source code dialog -->
  <sl-dialog ref="codeDialog" label="Markdown Source Code" 
    :style="{
      '--width': `${codeDialogWidth}px`,
    }"
    >

    <ve-markup v-if="markdown" style="height:500px;">{{ markdown }}</ve-markup>

    <div slot="footer">
      <sl-button variant="primary" class="edit hidden" style="margin-right:1em;">Open in Juncture Editor</sl-button>
      <sl-button variant="primary" class="close" style="margin-right:1em;">Close</sl-button>
    </div>
  </sl-dialog>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, watch } from 'vue'
  import { marked } from 'marked'
  import type SLDIalog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  
  // @ts-ignore
  import { HSOverlay } from '../lib/preline/components/hs-overlay'

  const props = defineProps({
    contact: { type: String },
    pdfDownloadEnabled: { type: Boolean, default: false},
    showCodeEnabled: { type: Boolean, default: false}
  })

  const footerElems = ref<HTMLLIElement[]>([])

  const footer = ref<HTMLElement | null>(null)
  const host = computed(() => (footer.value?.getRootNode() as any)?.host)

  const pdfOverlayRef = ref<HTMLElement | null>(null)
  const pdfOverlayEl = computed(() => pdfOverlayRef?.value as HTMLElement)
  const pdfOverlay = computed(() =>  new HSOverlay(pdfOverlayEl.value) )

  const modalRef = ref<HTMLElement | null>(null)
  const modalEl = computed(() => modalRef?.value as HTMLElement)

  const modalText = ref('Generating PDF...')

  watch(modalEl, (modal) => { 
    pdfOverlay.value.init()
    modal.addEventListener('open.hs.overlay', (e:any) => isOpen.value = true)
    modal.addEventListener('close.hs.overlay', (e:any) => isOpen.value = false)
  })

  const isOpen = ref(false)
  watch(isOpen, (isOpen) => {
    if (isOpen) pdfOverlay.value.open(modalEl.value)
    else pdfOverlay.value.close(modalEl.value)
  })

  const markdown = ref<HTMLElement | null>(null)
  const repoIsWritable = ref(false)
  watch (repoIsWritable, (repoIsWritable) => {
    console.log('repoIsWritable', repoIsWritable)
    codeDialog.value?.querySelector('.edit')?.classList[repoIsWritable ? 'remove' : 'add']('hidden')
  })

  const codeDialog = ref<SLDIalog | null>(null)
  const codeDialogWidth = ref(400)
  const codeDialogHeight = ref(400)
  watch(codeDialog, (codeDialog) => {
    codeDialog?.addEventListener('sl-overlay-dismiss', () => codeDialog.hide())
    codeDialog?.addEventListener('sl-show', () => {
      if (!repoIsWritable.value) canUpdateRepo().then(canUpdate => repoIsWritable.value = canUpdate)
    })
    codeDialog?.addEventListener('sl-hide', () => codeDialog.hide())
    codeDialog?.querySelector('.close')?.addEventListener('click', () => codeDialog.hide())
    codeDialog?.querySelector('.edit')?.addEventListener('click', () => {
      codeDialog.hide()
      openEditor()
    })
  })

  watch(host, () => { getFooterItems() })
  onMounted(() => {
    setTimeout(() => {
      // console.log(footer.value?.clientWidth, host.value?.parentElement?.clientHeight)
      codeDialogWidth.value = footer.value ? Math.round(footer.value.clientWidth * .9) : codeDialogWidth.value
      codeDialogHeight.value = footer.value ? Math.round(host.value?.parentElement?.clientHeight * .6) : codeDialogHeight.value
    }, 1)
  })

  function getFooterItems() {
    function parseSlot() {
      return Array.from(host.value.querySelectorAll('li') as HTMLUListElement[])
      .map(li => {
        let newLi = document.createElement('li')
        newLi.innerHTML = marked.parse(li.textContent || '')
        let codeEl = newLi.querySelector('code')
        if (codeEl) {
          let priorEl = codeEl.previousElementSibling
          let target = priorEl ? priorEl : newLi
          let parsed:any = parseCodeEl(codeEl.innerHTML)
          if (parsed.id) target.id = parsed.id
          if (parsed.class) parsed.class.split(' ').forEach(c => target.classList.add(c))
          if (parsed.style) target.setAttribute('style', parsed.style)
          codeEl.remove()
        }
        return newLi
      })
    }
    footerElems.value = parseSlot()
    new MutationObserver(
      (mutationsList:any) => {
        for (let mutation of mutationsList) { if (mutation.type === 'childList') footerElems.value = parseSlot() }      
      }
    ).observe(host.value, { childList: true, subtree: true })
  }

  function parseCodeEl(s:string) {
    let tokens:string[] = []
    s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
    s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach((token:string) => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    let parsed = {}
    let tokenIdx = 0
    while (tokenIdx < tokens.length) {
      let token = tokens[tokenIdx]
      if (token.indexOf('=') > 0) {
        let [key, value] = token.split('=')
        value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
        if (parsed[key]) parsed[key] += ` ${value}`
        else parsed[key] = value
      }
      else if (token[0] === '.') {
        let key = 'class'
        let value = token.slice(1)
        value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
        if (parsed[key]) parsed[key] += ` ${value}`
        else parsed[key] = value
      }
      else if (token[0] === ':') {
        let key = 'style'
        let value
        if (token.length === 1 && tokenIdx < token.length && tokens[tokenIdx+1][0] === '"') {
          value = tokens[tokenIdx+1].slice(1, -1)
          tokenIdx++
        } else {
          value = token.slice(1)
        }
        if (parsed[key]) parsed[key] += ` ${value}`
        else parsed[key] = value
      }
      else if (token[0] === '"') {
        let key = 'args'
        let value = token.slice(1,-1)
        if (parsed[key]) parsed[key].push(value)
        else parsed[key] = [value]
      }
      else if (token[0] === '#') parsed['id'] = token.slice(1)
      else parsed[token] = true
      tokenIdx++
    }
    return parsed
  }

  function showCode() {
    codeDialog.value?.show()
    markdown.value = (window as any).config?.content
  }

  function openEditor() {
    let source = (window as any).config?.source
    window.open(`https://editor.juncture-digital.org/?source=${source.owner}/${source.repository}/${source.branch}/${source.path}`, '_blank')
  }

  async function generatePDF() {
    modalText.value = 'Generating PDF...'
    isOpen.value = !isOpen.value
    let source = (window as any).config?.source
    let loc = new URL(location.href)
    let url = loc.hostname == 'localhost'
      ? `https://v3.juncture-digital.org/${source.owner}/${source.repository}/${source.branch}/${source.path}`.replace(/\/(README\.md|index\.md|\.md)$/g, '')
      : loc.href
    let landscape = document.querySelector('article.j1') ? true : false
    let resp = await fetch(`https://ezsitepdf-drnxe7pzjq-uc.a.run.app/pdf?url=${encodeURIComponent(url)}${landscape ? '&landscape=true' : ''}`)
    if (resp.ok) {
      let fname = source.path.split('/').filter(pe => pe).filter(pe => pe !== 'README.md' && pe !== 'index.md')?.pop().replace('.md', '') || 'document'
      modalText.value = 'Downloading PDF...'
      let pdf = await resp.blob()
      const aElement = document.createElement('a')
      aElement.setAttribute('download', `${fname}.pdf`)
      const href = URL.createObjectURL(pdf)
      aElement.href = href
      aElement.setAttribute('target', '_blank')
      aElement.click()
      aElement.addEventListener
      URL.revokeObjectURL(href)
    }
    setTimeout(() => isOpen.value = false, 2000)
  }

  async function canUpdateRepo() {
    let source = (window as any).config?.source
    let username = window.localStorage.getItem('gh-username')
    if (!username) return false
    if (source.owner === username) return true
    // Not account owner, check if user is a collaborator
    let url = `https://api.github.com/repos/${source.owner}/${source.repository}/collaborators/${username}`
    let headers: any = { Accept: 'application/vnd.github+json' }
    let authToken = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
    if (authToken) headers.Authorization = `token ${authToken}`
    let resp = await fetch(url, { headers })
    return resp.ok && resp.status === 204
  }

</script>

<style>

#footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 9px 12px;
  margin: 36px auto auto;
  font-size: .9rem;
  z-index: 100;
  background-color: #eee;
  color: #444;
  border-radius: 3px;
  gap: 6px;
}

a {
  color: #0969da;
  text-decoration: none;
}

img,
svg {
  height: 36px;
  /* width: 36px; */
}

.push {
  margin-left: auto;
}

@media only screen and (max-width: 768px) {
  #footer {
    font-size: 0.8em;
  }
  li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

pre {
  overflow-y: scroll;
  white-space: pre;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.hidden {
  visibility: hidden;
}

</style>
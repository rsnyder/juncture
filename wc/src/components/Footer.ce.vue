<template>

  <ul ref="footer" id="footer" class="flex bg-slate-100 p-2 gap-3 mt-8 items-center w-full h-8">
    
    <li v-if="!footerElems.length"><a href="https://v3.juncture-digital.org">Powered by <b>Juncture</b></a></li>
    
    <li v-for="li, idx in footerElems" :key="`li-${idx}`" v-html="li.innerHTML" :class="li.className" :style="li.getAttribute('style') || ''"></li>
    
    <li v-if="pdfDownloadEnabled || !footerElems.length" class="push">
      <sl-tooltip placement="top" content="Generate PDF for page">
        <a href="javascript:;" @click="generatePDF">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Noun_Project_PDF_icon_117327_cc.svg" alt="PDF Icon">
        </a>
      </sl-tooltip>
    </li>

    <li v-if="showCodeEnabled || !footerElems.length">
      <sl-tooltip placement="top" content="Show page Markdown code">
        <a href="javascript:;" @click="showCode">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#777" class="bi bi-markdown" viewBox="0 0 16 16">
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
  @import '../tailwind.css';

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
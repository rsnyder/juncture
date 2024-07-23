<template>

  <div ref="root" id="main">
    <sl-details v-if="collapsible" class="custom-icons" :open="props.open" :draggable="props.disableDrag ? null : ''" @dragstart="onDrag">
      
      <svg slot="expand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
      <svg slot="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-dash-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg>

      <div slot="summary">
        <sl-tooltip content="Show code snippets" placement="top">
            <div :style="{display: 'flex', alignItems: 'center', gap: '9px'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-markdown" viewBox="0 0 16 16"><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"/><path fill-rule="evenodd" d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"/><path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg>
            <span v-html="props.label" class="label"></span>
          </div>
        </sl-tooltip>
      </div>

      <sl-tab-group>
        <sl-tab slot="nav" panel="markdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-markdown" viewBox="0 0 16 16"><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"/><path fill-rule="evenodd" d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"/><path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"/></svg>
          Markdown
        </sl-tab>
        <sl-tab slot="nav" panel="html">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg>
          HTML
        </sl-tab>
        <sl-tab slot="nav" panel="preview">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
          Rendered
        </sl-tab>
        <sl-tab-panel name="markdown">
          <ve-source-viewer v-if="markdown && active === 'markdown'" :draggable="props.disableDrag ? null : ''">{{ markdown }}</ve-source-viewer>
        </sl-tab-panel>
        <sl-tab-panel name="html">
          <ve-source-viewer v-if="active === 'html' && html" v-text="html" language="html" :draggable="props.disableDrag ? null : ''"></ve-source-viewer>    
        </sl-tab-panel>
        <sl-tab-panel name="preview">
          <div id="juncture" style="position:relative;" v-if="active === 'preview' && html" :draggable="props.disableDrag ? null : ''" @dragstart="onDrag">
            <ve-article>
              {{ html }}
            </ve-article>
          </div>
        </sl-tab-panel>
      </sl-tab-group>

    </sl-details>

    <div v-else>
      <sl-tab-group>
        <sl-tab slot="nav" panel="markdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-markdown" viewBox="0 0 16 16"><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"/><path fill-rule="evenodd" d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"/><path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"/></svg>
          Markdown
        </sl-tab>
        <sl-tab slot="nav" panel="html">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg>
          HTML
        </sl-tab>
        <sl-tab slot="nav" panel="preview">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
          Rendered
        </sl-tab>
        <sl-tab-panel name="markdown">
          <ve-source-viewer v-if="markdown && active === 'markdown'" :draggable="props.disableDrag ? null : ''">{{ markdown }}</ve-source-viewer>
        </sl-tab-panel>
        <sl-tab-pane name="html">
          <ve-source-viewer v-if="active === 'html' && html" v-text="html" language="html" :draggable="props.disableDrag ? null : ''"></ve-source-viewer>    
        </sl-tab-pane>
        <sl-tab-panel name="preview">
          <div id="juncture" style="position:relative;" v-if="active === 'preview' && html" :draggable="props.disableDrag ? null : ''" @dragstart="onDrag">
            <ve-article>
              {{ html }}
            </ve-article>
          </div>
        </sl-tab-panel>
      </sl-tab-group>
    </div>

  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, nextTick, ref, toRaw, watch, h } from 'vue'

  import { elFromHtml, structureContent, markdownToHtml } from '../ghp.js'

  import type SlTab from '@shoelace-style/shoelace/dist/components/tab/tab.js'

  const props = defineProps({
    label: { type: String },
    tabs: { type: String, default: 'markdown,html,preview' },
    collapsible: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    prefix: { type: String },
    path: { type: String },
    right: { type: Boolean },
    left: { type: Boolean },
    width: { type: String },
    height: { type: String },
    fill: { type: Boolean },
    showActive: { type: Boolean },
    disableDrag: { type: Boolean },
    src: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  
  const markdown = ref<string>()
  const html = ref<string>()
  const active = ref<string>()
  const tabs = ref<any>({})

  // watch(markdown, () => { console.log(markdown.value) })
  // watch(html, () => { console.log('html', html.value) })

  onMounted(() => {
    if (props.src) {
      fetch(`/${props.src}?fmt=md`)
        .then(resp => resp.text())
        .then(md => {
          markdown.value = md.replace(/>/g,'&gt;').replace(/</g,'&lt;')
        })
    }
  })

  watch(host, () => {
    if (!host.value) return

    tabs.value = Object.fromEntries(props.tabs.split(',').map(tab => [tab, true]))
    let text = host.value.innerHTML
      .replace(/<pre v-pre="" data-lang="markup"><code class="lang-markup">/,'')
      .replace(/<\/code><\/pre>/, '')
    let lines:string[] = text.split('\n')

    let trimmed:string[] = []
    lines.forEach(line => {
      if (line.trim().length > 0 || trimmed.length > 0) trimmed.push(line)
    })
    if (trimmed.length > 0) {
      let firsLineIndent = (trimmed[0].match(/(^\s+)/) || [''])[0].length
      markdown.value = trimmed.map(line => {
        let leadingSpaces = (line.match(/(^\s+)/) || [''])[0].length
        return leadingSpaces >= firsLineIndent
          ? line.slice(firsLineIndent)
          : line
      }).join('\n')
    }
    host.value.innerHTML = ''
    host.value.style.display = 'block'
  })

  watch(active, () => {
    if (active.value !== 'markdown' && html.value === undefined) getHTML()
    if (active.value === 'preview') nextTick(() => {
      // initTippy(shadowRoot.value, true)
      // observeActive(shadowRoot.value?.querySelector('#juncture') as HTMLElement)
    })
    if (props.fill && html.value) nextTick(() => setFill())
    if (props.height) nextTick(() => setHeight())
  })
  
  function addObserver() {
    shadowRoot.value?.querySelectorAll('sl-tab').forEach(el => {
      const observer = new MutationObserver((mutations) => {
        let slTab = mutations[0].target as SlTab
        slTab.disabled = !tabs.value?.[slTab.panel]
        slTab.style.visibility = slTab.disabled ? 'hidden' : 'visible'
        if (slTab.active) active.value = slTab.panel
      })
      observer.observe(el, { childList: true, subtree: true, attributes: true })
    })
  }

  watch(tabs, () => addObserver())

  function setHeight() {
    let container = shadowRoot.value?.querySelector('sl-tab-panel[name="preview"]') as HTMLElement
    if (active.value === 'preview' && props.height) container.style.height = props.height
  }

  function setFill() {
    let container = shadowRoot.value?.querySelector('sl-tab-panel[name="preview"]') as HTMLElement
    if (active.value === 'preview') {
      let main = shadowRoot.value?.querySelector('#juncture') as HTMLElement
      let width = container.clientWidth / 2
      let filler = document.createElement('div')
      filler.style.height = `${width}px`
      let footer = main.querySelector('ve-footer')
      if (footer) main.insertBefore(filler, footer)
      else main.appendChild(filler)
      container.style.height = props.height || `${Math.max(width/2, 500)}px`
      container.style.overflowY = 'scroll'
    } else {
      container.style.height = ''
    }
  }

  function getHTML() {
    let rawHTML = markdownToHtml(markdown.value)
    let structuredHTML = structureContent(rawHTML)
    let el = elFromHtml(structuredHTML);
    (Array.from(el?.querySelectorAll('article > main > p') || []).forEach(p => {
      p.removeAttribute('data-id')
      p.removeAttribute('id')
      p.removeAttribute('class')
    }))
    let main = el?.querySelector('main')
    let firstChild = main?.firstElementChild as HTMLElement
    // if (firstChild.tagName === 'VE-MERMAID') { firstChild.innerHTML = '<pre>' + firstChild.innerHTML + '</pre>'}
    // html.value = (main?.children.length === 1 && firstChild.tagName === 'P' ? firstChild.innerHTML : main?.innerHTML)?.replace(/(wc:.+?)<em>([^<]+)<\/em>([^<]+)/g, '$1_$2_$3')
    html.value = main?.children.length === 1 && firstChild.tagName === 'P' ? firstChild.innerHTML : main?.innerHTML
  }

  function onDrag(evt:DragEvent) {
    let text = markdown.value
    if (text) evt.dataTransfer?.setData('text/plain', text)
  }

</script>

<!-- <style src='../style.css'></style>  -->

<style>

  @import '@shoelace-style/shoelace/dist/themes/light.css';

  * { box-sizing: border-box; }

  :host {
    margin-top: 1.5rem;
    border-radius: 2px;
    border: 0.5px solid #ddd;
    margin-bottom: 2rem;
  }

  :host([collapsible]) {
    border: none;
  }

  #main {
    font-family: Roboto, sans-serif;
    margin-top: 0;
  }

  sl-tab-panel {
    --padding: 0;
  }

  sl-tab::part(base) {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px;
  }

  #juncture {
    padding: 12px;
    font-size: 1.2em;
    line-height: 1.3;;
  }

  sl-details::part(header) {
    /* background: rgba(66,185,131,.1); */
    background-color: rgb(249,249,249);
  }

  sl-details::part(summary) {
    font-size: 1rem;
  }

  sl-details::part(content) {
    border-top: 1px solid #ddd;
    padding: 0;
  }

  sl-details.custom-icons::part(summary-icon) {
    /* Disable the expand/collapse animation */
    rotate: none;
  }

  sl-tab sl-icon {
    font-size: 24px;
    margin-right: 6px;
  }

  .label {
    margin-left: 12px;
    color: #555;
    font-weight: normal;
  }

  pre {
    display: none;
  }

</style>
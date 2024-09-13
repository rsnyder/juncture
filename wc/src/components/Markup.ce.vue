<template>

  <sl-tab-group ref="root">

    <sl-tab slot="nav" panel="j3">Juncture v3</sl-tab>
    <sl-tab slot="nav" panel="j2">Juncture v2</sl-tab>
    <sl-tab slot="nav" panel="j1">Juncture v1</sl-tab>
    <sl-tab slot="nav" panel="html">HTML</sl-tab>

    <sl-tab-panel name="j3">
      <pre
        ref="j3MarkupEl"
        id="j3Markup" 
        class="language-markdown" 
        :style="{
          margin: 0,
          // whiteSpace: 'pre-wrap',
          whiteSpace: 'pre-line',
          wordWrap: 'break-word'
        }">
        <code v-text="j3Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j2">
      <pre
        ref="j2MarkupEl"
        id="j2Markup" 
        class="language-markdown" 
        :style="{
          margin: 0,
          // whiteSpace: 'pre-wrap',
          whiteSpace: 'pre-line',
          wordWrap: 'break-word'
        }">
        <code v-text="j2Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j1">
      <pre
        ref="j1MarkupEl"
        id="j1Markup" 
        class="language-markdown" 
        :style="{
          margin: 0,
          // whiteSpace: 'pre-wrap',
          whiteSpace: 'pre-line',
          wordWrap: 'break-word'
        }">
        <code v-text="j1Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="html">
      <pre
        ref="htmlEl"
        id="html"
        class="language-markup"
        :style="{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }"
      ><code>{{html}}</code></pre>
    </sl-tab-panel>
    
    <sl-tooltip ref="tooltip" content="Text copied to clipboard" placement="top" hoist trigger="manual" style="--sl-tooltip-arrow-size: 0;" >
      <sl-button class="copy-button" @click="copyTextToClipboard">Copy Text</sl-button>
    </sl-tooltip>

  </sl-tab-group>


</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import { marked } from 'marked'

  import SimplyBeautiful from 'simply-beautiful'

  import Prism from 'prismjs'

  import 'prismjs/components/prism-markup'
  import 'prismjs/components/prism-markdown'
  import 'prismjs/components/prism-xml-doc'
  import 'prismjs/themes/prism.css'
  import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js'

  const root = ref<HTMLElement | null>(null)
  const markdownEl = ref<HTMLElement | null>(null)
  const htmlEl = ref<HTMLElement | null>(null)
  const j1MarkupEl = ref<HTMLElement | null>(null)
  const j2MarkupEl = ref<HTMLElement | null>(null)
  const j3MarkupEl = ref<HTMLElement | null>(null)
  const tooltip = ref<SlTooltip | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)
  watch(host, () => { rawText.value = host.value?.textContent?.trim() })

  const version = ref('j3')

  const props = defineProps({
  })

  const rawText = ref<string>()
  watch(rawText, () => {
    // console.log(`${rawText.value}`)
    nextTick(() => { if (j3MarkupEl.value) Prism.highlightElement(j3MarkupEl.value) })
  })
  
  const markupEl = computed(() => {
    let rootEl = rawText.value && new DOMParser().parseFromString(marked.parse(rawText.value), 'text/html').body as HTMLElement
    return rootEl && convertTags(rootEl)
  })
  watch(markupEl, (markupEl) => {
    html.value = styleHTML(markupEl.outerHTML)
  })
  
  const j1Markup = ref<string>()
  watch(j1Markup, () => { nextTick(() => { if (j1MarkupEl.value) Prism.highlightElement(j1MarkupEl.value) }) })

  const j2Markup = ref<string>()
  watch(j2Markup, () =>  { nextTick(() => { if (j2MarkupEl.value) Prism.highlightElement(j2MarkupEl.value) }) })

  const j3Markup = ref<string>()
  watch(j3Markup, () =>  { nextTick(() => { if (j3MarkupEl.value) Prism.highlightElement(j3MarkupEl.value) }) })

  const html = ref<string>()
  watch(html, () => {
    let rootEl = new DOMParser().parseFromString(html.value || '', 'text/html').body as HTMLElement
    // console.log(rootEl)
    // console.log(`version: ${version.value}`)
    j1Markup.value = version.value === 'j1' ? rawText.value : elToMarkdown(rootEl, 'j1')
    j2Markup.value = version.value === 'j2' ? rawText.value : elToMarkdown(rootEl, 'j2')
    j3Markup.value = version.value === 'j3' ? rawText.value : elToMarkdown(rootEl, 'j3')

    nextTick(() => { if (htmlEl.value) Prism.highlightElement(htmlEl.value) })

  })

  function elToMarkdown(el, version) {
    // console.log('elToMarkdown', el)
    let lines: string[] = [];
    (Array.from(el?.querySelectorAll('*') || []) as HTMLElement[])
    // .filter(el => el.tagName.indexOf('VE-') === 0)
    .forEach(c => {
      // console.log(c.tagName)
      if (c.tagName === 'P') {
        if (lines.length) lines.push('')
        lines.push(c.textContent || '')
      } else if ((c.tagName === 'UL' || c.tagName === 'OL') && c.parentElement?.tagName.indexOf('VE-') !== 0) {
        if (lines.length) lines.push('')
      } else if (c.tagName === 'LI' && (version !== 'j1' || c.parentElement?.parentElement?.tagName.indexOf('VE-') !== 0)) {
        lines.push(`- ${c.textContent}`)
      } else if (c.tagName.indexOf('VE-') === 0) {
        if (version === 'j1') {
          if (c.querySelector('ul')) {
            c.querySelectorAll('li').forEach(li => {
              let tag = c.tagName.toLowerCase()
              lines.push(`<param ${tag}>`)
            })
          } else {
            let tag = `${c.tagName.toLowerCase()}`
            c.getAttributeNames().forEach(attr => {
              let value = c.getAttribute(attr)
              if (value === '') tag += ` ${attr}`
              else tag += ` ${attr}="${value}"`
            })
            lines.push(`<param ${tag}>`)
          }
        } else if (version === 'j2') {
          let tag = `.${c.tagName.toLowerCase()}`
          c.getAttributeNames().forEach(attr => {
            let value = c.getAttribute(attr)
            if (value === '') tag += ` ${attr}`
            else tag += ` ${attr}="${value}"`
          })
          lines.push(tag)
        } else if (version === 'j3') {
          let tag = c.tagName.toLowerCase().slice(3)
          c.getAttributeNames().forEach(attr => {
            let value = c.getAttribute(attr)
            if (value === '') tag += ` ${attr}`
            else tag += ` ${attr}="${value}"`
          })
          lines.push("`" + tag + "`")
        }
      }
    })
    return lines.join('\n')
  }

  const classes = new Set('left right full sticky'.split(' '))
  const components = {
    've-animated-image': {
      booleans: 'autoplay',
      positional: 'src caption'
    },
    've-audio': {
      booleans: 'autoplay muted no-caption sync',
      positional: 'src caption'
    },
    've-breadcrumbs': {},
    've-carousel': {
      booleans: 'autoplay gallery loop navigation pagination scroll-hint',
      positional: 'caption'
    },
    've-compare': {
      positional: 'src'
    },
    've-entities': {
      booleans: 'cards'
    },
    've-footer': {
    },
    've-gallery': {
      booleans: 'caption'
    },
    've-header': {
      booleans: 'breadcrumbs no-manifest-popover pdf-download-enabled',
      positional: 'title background subtitle options position'
    },
    've-iframe': {
      booleans: 'allow-full-screen allow-transparency full left right sticky',
      positional: 'src caption'
    },
    've-image': {
      booleans: 'no-caption grid static repo-is-writable zoom-on-scroll',
      positional: 'src caption'
    },
    've-knightlab-timeline': {
      booleans: 'has-bookmark'
    },
    've-map': {
      booleans: 'cards full left marker prefer-geojson popup-on-hover zoom-on-scroll zoom-on-click',
      positional: 'center caption'
    },
    've-media': {
      // booleans: 'no-caption static repo-is-writable zoom-on-scroll',
      positional: 'src caption'
    },
    've-menu': {
      booleans: 'pdf-download-enabled'
    },
    've-mermaid': {},
    've-meta': {},
    've-plant-specimen': {
      booleans: 'full left right sticky',
      positional: 'qid max'
    },
    've-snippet': {},
    've-video': {
      booleans: 'autoplay muted no-caption sync',
      positional: 'src caption'
    },
    've-visjs': {
      booleans: 'hierarchical'
    }
  }
  let tagMap = {}
  Object.entries(components).forEach(([tag, attrs]) => {
    let tagObj = { 
      booleans : new Set(((attrs as any).booleans || '').split(' ').filter(s => s)),
      positional: ((attrs as any).positional || '').split(' ').filter(s => s)
    }
    tagMap[tag] = tagObj
    tagMap[tag.slice(3)] = tagObj
  })
  function camelToKebab(input) { return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}

  function parseHeadline(s: string) {
    let tokens: string[] = []
    s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
    s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    let parsed: any = {}
    let tokenIdx = 0
    while (tokenIdx < tokens.length) {
      let token = tokens[tokenIdx].replace(/<em>/g, '_').replace(/<\/em>/g, '_')
      if (token.indexOf('=') > 0 && /^[\w-:]+=/.test(token)) {
        let idx = token.indexOf('=')
        let key = token.slice(0, idx)
        let value = token.slice(idx+1)
        value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
        if (key[0] === ':') { // style
          key = camelToKebab(key.slice(1))
          if (!parsed.style) parsed.style = {}
          parsed.style[key] = value
        } else { // kwargs
          if (!parsed.kwargs) parsed.kwargs = {}
          if (parsed.kwargs[key]) parsed.kwargs[key] += ` ${value}`
          else parsed.kwargs[key] = value
        }
      }
      else if (token[0] === '.' || classes.has(token)) {
        let className = token.replace(/^\./,'')
        if (parsed.class) parsed.class += ` ${className}`
        else parsed.class = className
      }
      else if (token[0] === '"') {
        if (!parsed.args) parsed.args = []
        parsed.args.push(token.slice(1,-1))
      }
      else if (/#\w+/.test(token)) parsed['id'] = token.slice(1)
      else if (/^Q\d+$/.test(token) && !parsed.tag) { // entity identifier
        if (!parsed.entities) parsed.entities = []
        parsed.entities.push(token)
      }
      else if (tokenIdx === 0 && !parsed.tag && tagMap[token.replace(/^\./,'')]) {
        let tag = token.replace(/^\./,'')
        parsed.tag = tag.indexOf('ve-') === 0 ? tag : `ve-${tag}`
      } else if (token === 'script' || token === 'link') parsed.tag = token
      else {
        if (parsed.tag === 'script' && !parsed.src) parsed.src = token
        else if (parsed.tag === 'link' && !parsed.href) parsed.href= token
        else {
          let tagObj = tagMap[parsed.tag]
          if (tagObj?.booleans.has(token)) {
            if (!parsed.booleans) parsed.booleans = []
            parsed.booleans.push(token)
          } else {
            if (!parsed.args) parsed.args = []
            parsed.args.push(token)
          }
        }
      }
      tokenIdx++
    }

    if (parsed.tag && parsed.args) {
      let tagObj = tagMap[parsed.tag]
      let listArgs: string[] = []
      parsed.args.forEach((value:string, idx) => {
        if (idx >= tagObj.positional?.length) {
          listArgs.push(value)
        } else {
          let key = tagObj.positional[idx]
          value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
          if (!parsed.kwargs) parsed.kwargs = {}
          if (parsed.kwargs[key]) parsed.kwargs[key] += ` ${value}`
          else parsed.kwargs[key] = value  
        }
      })
      if (listArgs.length) parsed.args = listArgs
      else delete parsed.args
    }
    return parsed
  }

  function parseCodeEl(codeEl) {
    let codeElems = codeEl.textContent?.replace(/\s+\|\s+/g,'\n')
      .split('\n')
      .map(l => l.trim())
      // .map(l => l.replace(/<em>/g, '_').replace(/<\/em>/g, '_'))
      .filter(x => x) || []
    let parsed = parseHeadline(codeElems?.[0]) || {}
    if (parsed.tag === 've-mermaid') {
      parsed.raw = codeEl.textContent.split('\n').slice(1).join('\n')
    } else if (parsed.tag === 've-media') {
      parsed.tag = 've-image' //TODO: implement ve-media conversion
    } else if (parsed.tag === 've-vis-network') {
      parsed.tag = 've-visjs'
    } else if (codeElems.length > 1) {
      parsed.args = parsed.args ? [...parsed.args, ...codeElems.slice(1)] : codeElems.slice(1)
    }
    return parsed
  }

  // convert juncture tags to web component elements
  function convertTags(rootEl) {
    // console.log(rootEl);
    
    // Juncture v2 tagging
    (Array.from(rootEl.querySelectorAll(':scope > p')) as HTMLParagraphElement[])
      .filter(p => /^\.ve-\w+\S/.test(p.childNodes.item(0)?.nodeValue?.trim() || ''))
      .forEach(p => {
        // let codeElWrapper = document.createElement('div')
        let codeEl = document.createElement('code')
        // codeElWrapper.appendChild(codeEl)
        codeEl.setAttribute('class', 'language-juncture2')
        let replacementText = p.innerHTML.trim().slice(1)
          .replace(/\n\s*-\s+/g, '\n')
          .replace(/<a href="/g, '')
          .replace(/">[^<]*<\/a>/g, '')
          .replace(/^ve-media/, 've-image')
        codeEl.textContent = replacementText
        p.replaceWith(codeEl)
        version.value = 'j2'
      })
    
    // Juncture v1 tagging
    Array.from(rootEl.querySelectorAll('param') as HTMLParamElement[])
    .filter(param => Array.from(param.attributes).filter(attr => attr.name.indexOf('ve-') === 0).length)
    .filter(param => param.getAttribute('ve-config') === null)
    .forEach(param => {
      let tag = (Array.from(param.attributes) as any[]).find(attr => attr.name.indexOf('ve-') === 0).name
      if (tag) {
        let tagObj = tagMap[tag] || {}
        let parsed: any = { tag }
        Array.from(param.attributes).forEach(attr => {
          if (attr.name !== tag) {
            if (tagObj.booleans?.has(attr.name)) {
              if (!parsed.booleans) parsed.booleans = []
              parsed.booleans.push(attr.name)
            } else {
              if (!parsed.kwargs) parsed.kwargs = {}
              if (parsed.kwargs[attr.name]) parsed.kwargs[attr.name] += ` ${attr.value}`
              else parsed.kwargs[attr.name] = attr.value
            }
          }
        })
        param.replaceWith(makeEl(parsed))
      }
      version.value = 'j1'
    })
    rootEl.querySelectorAll('code').forEach(codeEl => {
      let parsed = parseCodeEl(codeEl)
      if (parsed.tag) {
        if (codeEl.parentElement.tagName === 'PRE') {
          codeEl = codeEl.parentElement
          codeEl.parentElement.removeAttribute('id')
          codeEl.parentElement.removeAttribute('data-id')
          codeEl.parentElement.removeAttribute('class')
          if (codeEl.parentElement.parentElement) codeEl.parentElement.parentElement.className = 'segment'
          if (codeEl.parentElement.tagName === 'DIV' && codeEl.parentElement.children.length === 1) {
            codeEl.parentElement.replaceWith(codeEl)
          }
        } else if (codeEl.parentElement.tagName === 'P') {
          codeEl = codeEl.parentElement
        }
        codeEl.replaceWith(makeEl(parsed))

      } else if (parsed.class || parsed.style || parsed.id || parsed.kwargs) {
        let codeWrapper = codeEl.parentElement
        let target
        let priorEl = codeWrapper.previousElementSibling
        if (priorEl?.tagName === 'EM' || priorEl?.tagName === 'STRONG') {
          target = document.createElement('span')
          target.innerHTML = priorEl.innerHTML
          priorEl.replaceWith(target)
        /*
        } else if (parent?.tagName === 'TD') {
          target = parent?.parentElement?.parentElement?.parentElement // table
          parent?.parentElement?.remove() // row
        } else if (parent?.tagName !== 'UL' && (priorEl?.tagName === 'A' || priorEl?.tagName === 'IMG')) {
          target = priorEl
        */
        } else {
          target = priorEl?.children.length === 1 && priorEl.children[0]?.tagName === 'VE-HEADER'
            ? codeWrapper.parentElement
            : priorEl
        }
        if (target) {
          if (parsed.id) target.id = parsed.id
          if (parsed.class) parsed.class.split(' ').forEach(c => target.classList.add(c))
          if (parsed.style) target.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
          if (parsed.entities) target.setAttribute('data-entities', parsed.entities.join(' '))
          if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) target.setAttribute(k, v === true ? '' : v)
        } else {
          console.log('no target for', parsed)
        }
        codeWrapper.remove()
      }
    })
    // console.log(rootEl)
    return rootEl
  }

  function makeEl(parsed) {
    let el = document.createElement(parsed.tag)
    if (parsed.id) el.id = parsed.id
    if (parsed.class) parsed.class.split(' ').forEach(c => el.classList.add(c))
    if (parsed.style) el.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
    if (parsed.entities) el.setAttribute('entities', parsed.entities.join(' '))
    if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) el.setAttribute(k, v === true ? '' : v)
    if (parsed.booleans) parsed.booleans.forEach(b => el.setAttribute(b, '') )
    if (parsed.args) {
      let ul = document.createElement('ul')
      el.appendChild(ul)
      for (const arg of parsed.args) {
        let argEl = new DOMParser().parseFromString(marked.parse(arg.replace(/^\s*-\s*/, '')), 'text/html').body.firstChild as HTMLElement
        let li = document.createElement('li')
        li.innerHTML = argEl.innerHTML.indexOf('wc:') === 0 ? argEl.innerHTML.replace(/<em>([^<]+)<\/em>/g, '_$1_') : argEl.innerHTML
        ul.appendChild(li)
      }
    }
    if (parsed.raw) el.textContent = parsed.raw
    return el
  }

  function styleHTML(html:string) {
    
    function sanitize(el:HTMLElement) {
      el.querySelectorAll('VE-MERMAID').forEach((el:any) => {
        el.innerHTML = `\n<pre>\n\n${el.innerHTML}</pre>`
      })
      let attrsToRemove = ['data-id']
      let classesToRemove = ['segment', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6']
      attrsToRemove.forEach(attr => el.removeAttribute(attr))
      if (el.tagName !== 'TABLE') el.removeAttribute('id')
      classesToRemove.forEach(cls => el.classList.remove(cls))
    }

    let root = new DOMParser().parseFromString(html.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 'text/html').body as HTMLElement

    sanitize(root)
    root.querySelectorAll('section, p, table').forEach((el:any) => sanitize(el))
    let formatted = SimplyBeautiful.html(root.innerHTML, {indent_size: 2})
    formatted = formatted
      .replace(/\s+<\/li>/g, '</li>')
      .replace(/\s+<ve-entity-infobox/g, ' <ve-entity-infobox')
      // .replace(/(wc:.+)<em>(.+)<\/em>(.+)/g, '$1_$2_$3')
      .replace(/class=""/g, '')
      .replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
    return formatted
  }

  function copyTextToClipboard() {
    if (navigator.clipboard) {
      let text = root.value?.querySelector('sl-tab-panel[active]')?.textContent?.trim() || ''
      navigator.clipboard.writeText(text)
      if (tooltip.value) {
        tooltip.value.open = true
        setTimeout(() => { if (tooltip.value) tooltip.value.open = false}, 1000)
      }
    }
  }

</script>

<style src='prismjs/themes/prism.css'></style> 

<style>

* { box-sizing: border-box; }

.main {
  font-size: .8em;
  position: relative;
}

sl-tab-group {
  position: relative;
}

sl-tab-panel:hover ~ sl-tooltip > .copy-button,
.copy-button:hover {
  opacity: 1;
}

.copy-button {
  position: absolute;
  top: 60px;
  right: 10px;
  opacity: 0;
  transition: all .3s ease-in;
}

</style>

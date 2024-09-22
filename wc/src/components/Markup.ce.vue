<template>

  <sl-tab-group ref="root">

    <sl-tab slot="nav" panel="j3">Juncture v3</sl-tab>
    <sl-tab slot="nav" panel="j2">Juncture v2</sl-tab>
    <sl-tab slot="nav" panel="j1">Juncture v1</sl-tab>
    <sl-tab slot="nav" panel="html">HTML</sl-tab>

    <sl-tab-panel name="j3" :draggable="props.draggable" @dragstart="onDrag">
      <pre
        ref="j3MarkupEl"
        id="j3Markup" 
        class="language-markdown" 
        :style="{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }"><code v-text="j3Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j2" :draggable="props.draggable" @dragstart="onDrag">
      <pre
        ref="j2MarkupEl"
        id="j2Markup" 
        class="language-markdown" 
        :style="{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }"><code v-text="j2Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j1" :draggable="props.draggable" @dragstart="onDrag">
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

    <sl-tab-panel name="html" :draggable="props.draggable" @dragstart="onDrag">
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
  watch(host, () => { rawText.value = host.value?.textContent?.trim().replace(/=""/g, '') })

  const version = ref('j3')

  const props = defineProps({
    draggable: { type: Boolean, default: true }
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
    rootEl.querySelectorAll('li').forEach(li => li.innerHTML = li.innerHTML.replace(/^\s*-\s*/, ''))

    // console.log(`version: ${version.value}`)
    j1Markup.value = version.value === 'j1' ? rawText.value : elToMarkdown(rootEl, 'j1')
    j2Markup.value = version.value === 'j2' ? rawText.value : elToMarkdown(rootEl, 'j2')
    j3Markup.value = version.value === 'j3' ? rawText.value : elToMarkdown(rootEl, 'j3')

    nextTick(() => { if (htmlEl.value) Prism.highlightElement(htmlEl.value) })

  })

  function elToMarkdown(el, version) {
    // console.log('elToMarkdown', el)
    let lines: string[] = [];
    (Array.from(el?.querySelectorAll(':scope > *') || []) as HTMLElement[])
    // .filter(el => el.tagName.indexOf('VE-') === 0)
    .forEach(c => {
      // console.log(c.tagName)
      if (c.tagName === 'P') {
        if (lines.length) lines.push('')
        lines.push(c.textContent || '')
      } else if ((c.tagName === 'UL' || c.tagName === 'OL') && c.parentElement?.tagName.indexOf('VE-') !== 0) {
        if (lines.length) lines.push('')
      } else if (c.tagName === 'LI' && (version !== 'j1' || c.parentElement?.parentElement?.tagName.indexOf('VE-') !== 0)) {
        lines.push(`${((version === 'j2' || version === 'j3') && c.parentElement?.parentElement?.tagName.indexOf('VE-') === 0)  ? '    - ' : '- '}${c.textContent}`)
      } else if (c.tagName.indexOf('VE-') === 0) {
        let isCodeBlock = c.querySelector('ul') !== null
        let tagDef = tagMap[c.tagName.toLowerCase()]
        // console.log('tagDef', tagDef)
        
        if (version === 'j1') {
          if (isCodeBlock) {
            c.querySelectorAll('li').forEach((li, seq) => {
              let tag = c.tagName.toLowerCase()
              if (seq === 0) {
                Array.from(c.attributes).forEach(attr => {
                  if (tagDef.root.has(attr.name)) {
                    let name = tagDef.reverseAliases[attr.name] || attr.name
                    let value = c.getAttribute(attr.name)
                    if (value && value.indexOf(' ') > -1) value = `"${value}"`
                    if (tagDef.booleans.has(attr.name)) tag += ` ${attr.name}`
                    else tag += ` ${name}=${value}`
                  }
                })
              }
              let liObj = parseLi(li, c.tagName.toLowerCase())
              Object.entries(liObj).forEach(([k,v]) => {
                tag += v ? ` ${k}="${v}"` : ` ${k}`
              })
              lines.push(`<param ${tag}>`)
            })
          } else {
            let booleans = tagDef.booleans || new Set()
            let tag = `${c.tagName.toLowerCase()}`
            Array.from(c.attributes).forEach(attr => {
              if (booleans.has(attr.name)) tag += ` ${attr.value}` // add positional attributes
              else { // add keyword attributes
                let value = attr.value.indexOf(' ') > -1 ? `"${attr.value}"` : attr.value
                tag += ` ${attr.name}="${value}"`
              }
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
          if (isCodeBlock) c.querySelectorAll('li').forEach(li => lines.push(`    - ${li.textContent}`))

        } else if (version === 'j3') {
          let tag = c.tagName.toLowerCase().slice(3)
          c.getAttributeNames().forEach(attr => {
            let value = c.getAttribute(attr)
            if (value === '') tag += ` ${attr}`
            else tag += ` ${attr}="${value}"`
          })
          if (isCodeBlock) {
            lines.push("```")
            lines.push(tag)
            c.querySelectorAll('li').forEach(li => lines.push(`    - ${li.textContent}`))
            lines.push("```")
          } else {
            lines.push("`" + tag + "`")
          }
        }
      }
    })
    // console.log(lines.join('\n'))
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
      positional: 'caption',
      argsPositional: 'src caption',
      root: 'autoplay gallery loop navigation pagination scroll-hint viewer-caption viewer-fit',
      aliases: {caption: ['viewer-caption'], fit: ['viewer-fit']}
    },
    've-compare': {
      positional: 'src',
      root: 'caption',
    },
    've-entities': {
      booleans: 'cards'
    },
    've-footer': {
    },
    've-gallery': {
      positional: 'src',
      booleans: 'show-captions',
      root: 'show-captions'
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
      positional: ((attrs as any).positional || '').split(' ').filter(s => s),
      root: new Set(((attrs as any).root || '').split(' ').filter(s => s)),
      aliases: {},
      reverseAliases: {}
    }
    if ((attrs as any).argsPositional) tagObj.argsPositional = (attrs as any).argsPositional.split(' ').filter(s => s)
    if ((attrs as any).aliases) {
      Object.entries((attrs as any).aliases).forEach(([alias, names]) => { (names as string[]).forEach(name => tagObj.aliases[name] = alias) })
      Object.entries((attrs as any).aliases).forEach(([alias, names]) => { (names as string[]).forEach(name => tagObj.reverseAliases[alias] = name) })
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

    function elAttrsToObj(el, tag, ignore) {
      tag = tag || el.tagName.toLowerCase()
      let ignoreSet = new Set(ignore?.split(' ') || [])
      ignoreSet.add(tag)
      ignoreSet.add('data-ignore')
      let obj = {tag, booleans: [], classes: [], kwargs: {}}
      let tagDef = tagMap[obj.tag] || {}
      Array.from(el.attributes).forEach((attr:any) => {
        if (!ignoreSet.has(attr.name)) {
          if (tagDef.booleans?.has(attr.name)) (obj.booleans as string[]).push(attr.name)
          else if (classes.has(attr.name)) (obj.classes as string[]).push(attr.name)
          else obj.kwargs[attr.name] = attr.value
        }
      })
      return obj
    }

    function elAttrsToStr(el, tag, ignore) {
      let attrsObj = elAttrsToObj(el, tag, ignore)
      let tagDef = tagMap[attrsObj.tag] || {}
      let attrsList: string[] = []
      for (let idx = 0; idx < tagDef.positional.length; idx++) {
        let positionalValue = attrsObj.kwargs[tagDef.positional[idx]]
        if (positionalValue) {
          attrsList.push(positionalValue.indexOf(' ') > -1 ? `"${positionalValue}"` : positionalValue)
          delete attrsObj.kwargs[tagDef.positional[idx]]
        }
        else break
      }
      Object.entries(attrsObj.kwargs).forEach(([key, value]) => {
        if ((value as string).indexOf(' ') > -1) attrsList.push(`${key}="${value}"`)
        else attrsList.push(`${key}=${value}`)
      })
      if (attrsObj.booleans.length) attrsList.push(attrsObj.booleans.join(' '))
      return attrsList.join(' ')
    }

    function veAttr(el) {
      return (Array.from(el.attributes).find((attr:any) => attr.name.indexOf('ve-') === 0) as any)?.name
    }

    // Juncture v2 tagging
    (Array.from(rootEl.querySelectorAll(':scope > p')) as HTMLParagraphElement[])
      .filter(p => /^\.ve-\w+\S/.test(p.childNodes.item(0)?.nodeValue?.trim() || ''))
      .forEach(p => {
        let codeEl = document.createElement('code')
        codeEl.setAttribute('class', 'language-juncture2')
        codeEl.innerHTML = p.innerHTML.trim().slice(1)
          .replace(/\n\s*-\s+/g, '\n')
          .replace(/<a href="/g, '')
          .replace(/">[^<]*<\/a>/g, '')
          .replace(/^ve-media/, 've-image')
          .split('\n')
          .map(line => {
            if (/wc:.*/.test(line)) {
              let start = line.indexOf('wc:')
              let end = line.indexOf(' ', start)
              end = end < 0 ? line.length : end
              line = `${line.slice(0, start)}${line.slice(start, end).replace(/<\/?em>/g, '_')}${line.slice(end)}`
            }
            return line
          })
          .join('\n')
        version.value = 'j2'
      })
    
    // Juncture v1 tagging
    Array.from(rootEl.querySelectorAll('param') as HTMLParamElement[])
      .filter(param => Array.from(param.attributes).filter(attr => attr.name.indexOf('ve-') === 0).length)
      .filter(param => param.getAttribute('ve-config') === null)
      .forEach(param => {
        // console.log(param)
        if (param.getAttribute('data-ignore') !== null) return
        let tag = Array.from(param.attributes).find(attr => attr.name.indexOf('ve-') === 0)?.name
        if (tag) {
          let paramAttrs: any = elAttrsToObj(param, tag, '')
          let rootAttrs = Array.from((tagMap[tag]?.root) || []).join(' ')
          let nextSibling = param.nextElementSibling
          while(nextSibling?.tagName === 'PARAM' && veAttr(nextSibling) === tag) {
            nextSibling.setAttribute('data-ignore', '')
            if (!paramAttrs.args) {
              paramAttrs.args = []
              paramAttrs.args.push(elAttrsToStr(param, tag, rootAttrs))
              let rootAttrsSet = new Set(rootAttrs.split(' '))
              Object.keys(paramAttrs.kwargs).forEach(k => { if (!rootAttrsSet.has(k)) delete paramAttrs.kwargs[k] })
            }
            paramAttrs.args.push(elAttrsToStr(nextSibling, tag, rootAttrs))
            nextSibling = nextSibling.nextElementSibling
          }
          // console.log(paramAttrs)
          param.replaceWith(makeEl(paramAttrs))
          version.value = 'j1'
        }
      })
    Array.from(rootEl.querySelectorAll('param[data-ignore]') as HTMLParamElement[])
    .forEach(param => param.remove())

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
        }
        codeEl.replaceWith(makeEl(parsed))
      } else if (parsed.class || parsed.style || parsed.id || parsed.kwargs) {
        let codeWrapper = codeEl.parentElement
        let priorEl = codeWrapper.previousElementSibling
        let parentEl = codeWrapper.parentElement
        let target
        if (priorEl?.tagName === 'EM' || priorEl?.tagName === 'STRONG') {
          target = document.createElement('span')
          target.innerHTML = priorEl.innerHTML
          priorEl.replaceWith(target)
        } else if (codeWrapper?.tagName === 'TD') {
          target = codeWrapper?.parentElement?.parentElement?.parentElement // table
          codeWrapper?.parentElement?.remove() // row
        } else if (codeWrapper?.tagName !== 'UL' && (priorEl?.tagName === 'A' || priorEl?.tagName === 'IMG')) {
          target = priorEl
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
    let tagDef = tagMap[parsed.tag] || {}
    let el = document.createElement(parsed.tag)
    if (parsed.id) el.id = parsed.id
    if (parsed.class) parsed.class.split(' ').forEach(c => el.classList.add(c))
    if (parsed.style) el.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
    if (parsed.entities) el.setAttribute('entities', parsed.entities.join(' '))
    if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) el.setAttribute(tagDef.aliases[k] || k, v === true ? '' : v)
    if (parsed.booleans) parsed.booleans.forEach(b => el.setAttribute(b, '') )
    if (parsed.args) {
      let ul = document.createElement('ul')
      el.appendChild(ul)
      for (const arg of parsed.args) {
        // let argEl = new DOMParser().parseFromString(marked.parse(arg.replace(/^\s*-\s*/, '')), 'text/html').body.firstChild as HTMLElement
        let li = document.createElement('li')
        // li.innerHTML = argEl.innerHTML.indexOf('wc:') === 0 ? argEl.innerHTML.replace(/<em>([^<]+)<\/em>/g, '_$1_') : argEl.innerHTML
        // console.log(arg)
        li.innerText = arg
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
    root.querySelectorAll('li').forEach(li => li.innerHTML = li.innerHTML.replace(/^\s*-\s*/, ''))

    sanitize(root)
    root.querySelectorAll('section, p, table').forEach((el:any) => sanitize(el))
    let formatted = SimplyBeautiful.html(root.innerHTML, {indent_size: 2})
    formatted = formatted
      .replace(/\s+<\/li>/g, '</li>')
      .replace(/\s+<ve-entity-infobox/g, ' <ve-entity-infobox')
      // .replace(/(wc:.+)<em>(.+)<\/em>(.+)/g, '$1_$2_$3')
      .replace(/class=""/g, '')
      .replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
      .replace(/=""/g, '')
    return formatted
  }

  function parseLi(li:HTMLLIElement, tag:string): Object {
    let s = li.textContent || ''
    // console.log(s)
    let tagDef = tagMap[tag]
    // console.log(tagDef)
    let tokens: string[] = []
    s = s.replace(/”/g,'"').replace(/”/g,'"')
    s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    let parsed:any = {}
    let positionalArgs = tagDef.argsPositional ||  tagDef.positional || []
    // console.log(positionalArgs)
    tokens
      .filter(t => t !== 'image')
      .forEach((token, idx) => {
      // console.log(token, token.indexOf('='), token[0], token[token.length-1])
      if (token.indexOf('=') > 0 && (token[0] !== '"' || token[token.length-1] !== '"')) {
        let i = token.indexOf('=')
        let key = token.slice(0, i)
        let value = token.slice(i+1)
        parsed[key] = value[0] === '"' ? value.slice(1,-1) : value 
      } else {
        // console.log(token, idx, positionalArgs[idx])
        parsed[positionalArgs[idx]] = token[0] === '"' ? token.slice(1,-1) : token 
      }
    })
    // console.log(parsed)
    return parsed
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

  function onDrag(evt:DragEvent) {
    console.log('onDrag', evt)

    console.log(evt.dataTransfer?.getData('text/plain'))
    console.log(evt.dataTransfer?.getData('text'))
    console.log(evt.dataTransfer?.getData('text/uri-list'))

    let text = root.value?.querySelector('sl-tab-panel[active]')?.textContent?.trim() || ''
    if (text) evt.dataTransfer?.setData('text', text)
    console.log(evt.dataTransfer?.getData('text'))
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

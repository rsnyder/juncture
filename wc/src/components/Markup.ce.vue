<template>

  <sl-tab-group ref="root">

    <sl-tab slot="nav" panel="j3">Markdown</sl-tab>
    <sl-tab slot="nav" v-if="!latestOnly" panel="j2">v2 syntax</sl-tab>
    <sl-tab slot="nav" v-if="!latestOnly" panel="j1">v1 syntax</sl-tab>
    <sl-tab slot="nav" panel="html">HTML</sl-tab>

    <sl-tab-panel name="j3" :draggable="props.draggable" @dragstart="onDrag">
      <pre
        ref="j3MarkupEl"
        id="j3Markup" 
        class="language-juncture" 
        :style="{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }"
      ><code v-text="j3Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j2" :draggable="props.draggable" @dragstart="onDrag">
      <pre
        ref="j2MarkupEl"
        id="j2Markup" 
        class="language-juncture" 
        :style="{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }"
      ><code v-text="j2Markup"></code>
      </pre>
    </sl-tab-panel>

    <sl-tab-panel name="j1" :draggable="props.draggable" @dragstart="onDrag">
      <pre
        ref="j1MarkupEl"
        id="j1Markup" 
        class="language-juncture" 
        :style="{
          margin: 0,
          // whiteSpace: 'pre-wrap',
          whiteSpace: 'pre-line',
          wordWrap: 'break-word'
        }"
        ><code v-text="j1Markup"></code>
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

  import { computed, nextTick, ref, watch } from 'vue'
  import { convertTags, tagMap } from '../../../ghp-lib.js'

  import { marked } from 'marked'

  import SimplyBeautiful from 'simply-beautiful'

  import Prism from 'prismjs'

  import 'prismjs/components/prism-markup'
  import 'prismjs/components/prism-markdown'
  import 'prismjs/components/prism-xml-doc'
  import 'prismjs/themes/prism.css'
  import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js'

  const root = ref<HTMLElement | null>(null)
  const htmlEl = ref<HTMLElement | null>(null)
  const j1MarkupEl = ref<HTMLElement | null>(null)
  const j2MarkupEl = ref<HTMLElement | null>(null)
  const j3MarkupEl = ref<HTMLElement | null>(null)
  const tooltip = ref<SlTooltip | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)
  watch(host, () => {
    if (props.src) fetch(props.src).then(r => r.text()).then(text => rawText.value = text)
    else rawText.value = host.value?.textContent?.trim().replace(/=""/g, '') 
  })

  const version = ref('j3')

  const props = defineProps({
    draggable: { type: Boolean, default: true },
    latestOnly: { type: Boolean, default: false },
    src: { type: String}
  })

  const rawText = ref<string>()
  watch(rawText, () => {
    if (rawText.value) {
      let el = new DOMParser().parseFromString(marked.parse(rawText.value), 'text/html').body as HTMLElement
      convertTags(el)
      html.value = styleHTML(el.outerHTML)
    }
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

    j1Markup.value = version.value === 'j1' ? rawText.value : elToMarkdown(rootEl, 'j1')
    j2Markup.value = version.value === 'j2' ? rawText.value : elToMarkdown(rootEl, 'j2')
    j3Markup.value = version.value === 'j3' ? rawText.value : elToMarkdown(rootEl, 'j3')

    nextTick(() => { if (htmlEl.value) Prism.highlightElement(htmlEl.value) })

  })

  function elToMarkdown(el, version) {
    let lines: string[] = [];
    (Array.from(el?.querySelectorAll(':scope > *') || []) as HTMLElement[])
    // .filter(el => el.tagName.indexOf('VE-') === 0)
    .forEach(c => {
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
        
        if (version === 'j1') {
          if (isCodeBlock) {
            c.querySelectorAll('li')
              .forEach((li, seq) => {
                let tag = c.tagName.toLowerCase()
                if (seq === 0) {
                  let booleans: string[] = []
                  let kwAttrs = {}
                  Array.from(c.attributes).forEach(attr => {
                    if (tagDef.root?.has(attr.name)) {
                      let name = tagDef.reverseAliases[attr.name] || attr.name
                      let value = c.getAttribute(attr.name)
                      if (value && value.indexOf(' ') > -1) value = `"${value}"`
                      if (tagDef.booleans.has(attr.name)) booleans.push(attr.name )
                      else kwAttrs[name] = value
                    }
                  })
                  booleans.forEach(attr => tag += ` ${attr}`)
                  Object.entries(kwAttrs).forEach(([k,v]) => tag += ` ${k}=${v}`)
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
                let value = attr.value
                tag += ` ${attr.name}="${value}"`
              }
            })
            lines.push(`<param ${tag}>`)
          }

        } else if (version === 'j2') {
          let tag = `.${c.tagName.toLowerCase()}`
          let booleans: string[] = []
          let kwAttrs = {}
          Array.from(c.attributes).forEach(attr => {
              let name = attr.name
              let value = c.getAttribute(attr.name)
              if (value && value.indexOf(' ') > -1) value = `"${value}"`
              if (tagDef.booleans.has(attr.name)) booleans.push(attr.name )
              else kwAttrs[name] = value
          })
          booleans.forEach(attr => tag += ` ${attr}`)
          Object.entries(kwAttrs).forEach(([k,v]) => tag += ` ${k}=${v}`)

          /*
          c.getAttributeNames().forEach(attr => {
            let value = c.getAttribute(attr)
            if (value === '') tag += ` ${attr}`
            else tag += ` ${attr}="${value}"`
          })
          */
          if (isCodeBlock) {
            // lines.push("```")
            lines.push(tag)
            c.querySelectorAll('li').forEach(li => lines.push(`    - ${li.textContent}`))
            // lines.push("```")

            // c.querySelectorAll('li').forEach(li => lines.push(`    - ${li.textContent}`))
          } else {
            lines.push(tag)
          }

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
    return lines.join('\n')
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
    let tagDef = tagMap[tag]
    let tokens: string[] = []
    s = s.replace(/”/g,'"').replace(/”/g,'"')
    s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    let parsed:any = {}
    let positionalArgs = tagDef.argsPositional ||  tagDef.positional || []
    tokens
      .filter(t => t !== 'image')
      .forEach((token, idx) => {
      if (token.indexOf('=') > 0 && (token[0] !== '"' || token[token.length-1] !== '"')) {
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

    let text = root.value?.querySelector('sl-tab-panel[active]')?.textContent?.trim() || ''
    if (text) evt.dataTransfer?.setData('text', text)
  }

  Prism.languages.juncture = Prism.languages.extend('markup', {

  pre: {
    pattern: /```[\s\S]*?```/,
    inside: {
      'list-item' : {
        pattern: /\s*- .+/,
        inside: {
          punctuation: /^-/,
          'attr-value': {
            pattern: /[^-]\"(\\.|[^\"])*\"/,
            alias: 'attr-value'
          }
        }
      },
      block: {
        pattern: /```/,
         alias: 'punctuation',
      },
      tag: [{ 
        // pattern: /\.?ve-\w+[\w-]*/
        pattern: /\n[\w-]+/
      }],
      kvp: {
        pattern: /[\w-_]+=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          string: [
          {
              pattern: /^[\w-_]+/,
              // lookbehind: true,
              alias: 'attr-name'
            },
           {
              pattern: /=/,
              alias: 'punctuation attr-equals'
            },
            {
              pattern: /.+/,
              inside: {
                'attr-value': [
                  {
                    pattern: /^["']|["']$/,
                    alias: 'punctuation attr-quote'
                  },
                  {
                    pattern: /.+/,
                    // lookbehind: true,
                    alias: 'attr-value'
                  }
                ]
              }
            }
          ]
        }
      },
      boolean: { 
        pattern: /\s+(autoplay|allow-full-screen|allow-transparency|breadcrumbs|cards|collapsible|cover|full|gallery|grid|hierarchical|left|loop|marker|muted|navigation|no-caption|no-manifest-popover|pagination|pdf-download-enabled|popup-on-hover|prefer-geojson|repo-is-writable|right|scroll-hint|show-captions|show-code-enabled|static|sticky|sync|zoom-on-click|zoom-on-scroll)/, 
      },
      string: {
        pattern: /.+/,
        inside: {
          'attr-value': [
            {
              pattern: /^["']|["']$/,
              alias: 'punctuation attr-quote'
            },
            {
              pattern: /.+/,
              // lookbehind: true,
              alias: 'attr-value'
            }
          ]
        }
      }
    }
  },

  string: {
    pattern: /\s*-\s+.*/,
    alias: 'list-item'
  },

  code: {
    pattern: /`[\w-]+\s+.+`|\.[\w-]+\s+.+/,
    inside: {
      tag: [{ 
        pattern: /^[`.]\w+[\w-]*/
      }],
      kvp: {
        pattern: /[\w-_]+=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          string: [
          {
              pattern: /^[\w-_]+/,
              // lookbehind: true,
              alias: 'attr-name'
            },
           {
              pattern: /=/,
              alias: 'punctuation attr-equals'
            },
            {
              pattern: /.+/,
              inside: {
                'attr-value': [
                  {
                    pattern: /^["']|["']$/,
                    alias: 'punctuation attr-quote'
                  },
                  {
                    pattern: /.+/,
                    // lookbehind: true,
                    alias: 'attr-value'
                  }
                ]
              }
            }
          ]
        }
      },
      boolean: { 
        pattern: /\s+(autoplay|allow-full-screen|allow-transparency|breadcrumbs|cards|collapsible|cover|full|gallery|grid|hierarchical|left|loop|marker|muted|navigation|no-caption|no-manifest-popover|pagination|pdf-download-enabled|popup-on-hover|prefer-geojson|repo-is-writable|right|scroll-hint|show-captions|show-code-enabled|static|sticky|sync|zoom-on-click|zoom-on-scroll)/, 
      },
      string: {
        pattern: /.+/,
        inside: {
          'attr-value': [
            {
              pattern: /^["']|["']$/,
              alias: 'punctuation attr-quote'
            },
            {
              pattern: /.+/,
              // lookbehind: true,
              alias: 'attr-value'
            }
          ]
        }
      }
    }
  },
  
  tag: {
		pattern: /<\/?(?!\d)param(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
		greedy: true,
    alias: 'juncture juncture1',
    inside: {
      
      tag: {
        pattern: /<param/,
        inside: {
          punctuation: [
            {
              pattern: /^</
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },

      'juncture-tag': [{ 
        pattern: /ve-\w+[\w-]*/
      }],

      position: [],
      'special-attr': [],

      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: 'attr-equals'
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },

      punctuation: /\/?>/,

      boolean: { 
        pattern: /\s+(autoplay|allow-full-screen|allow-transparency|breadcrumbs|cards|collapsible|cover|full|gallery|grid|hierarchical|left|loop|marker|muted|navigation|no-caption|no-manifest-popover|pagination|pdf-download-enabled|popup-on-hover|prefer-geojson|repo-is-writable|right|scroll-hint|show-captions|show-code-enabled|static|sticky|sync|zoom-on-click|zoom-on-scroll)/, 
      },

      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      },

    }
  },

  'marked': [{ pattern: /==[^=]+=={[^}]+}/, alias: 'class-name' }],
  'qid': [{ pattern: /Q[0-9]+/, alias: 'entity' }],
  'reference': [{ pattern: /\[\^[^\]]+\]:?\s*/, alias: 'class-name' }],

  })

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

sl-tab-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
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

/* color palette */

.language-juncture .juncture-tag {
  color: #905;
}

.language-juncture .attr-name,
.language-juncture .boolean {
  color: #690;
}

.language-juncture .attr-value {
  color: #07a;
}

.language-juncture .manifest-prefix {
  color: #07a;
}

.language-juncture .list-item {
  color: #7f8c8d;
}

</style>

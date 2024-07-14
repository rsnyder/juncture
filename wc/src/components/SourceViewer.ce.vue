<template>

<div ref="root" class="main" :style="{width: '100%', height: '100%'}" :draggable="props.draggable" @dragstart="onDrag">

  <pre v-if="language === 'html'"
    id="html"
    class="language-markup"
    :style="{
      margin: 0,
      whiteSpace: 'pre-wrap',
      // whiteSpace: 'pre-line',
      wordWrap: 'break-word',
      // opacity: ready ? '1' : '0',
      // transition: 'opacity .1s linear'
    }"
  ><code>{{rawText}}</code></pre>
    
  <pre v-else 
    id="juncture" 
    class="language-markdown" 
    style="margin:0;white-space:pre; white-space:pre-line; word-wrap:break-word;">
    <code v-html="rawText"></code>
  </pre>

  <sl-tooltip content="Text copied to clipboard" placement="top" hoist trigger="manual" style="--sl-tooltip-arrow-size: 0;" >
    <sl-button class="copy-button" @click="copyTextToClipboard">Copy Text</sl-button>
  </sl-tooltip>

</div>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'

  import '@shoelace-style/shoelace/dist/components/button/button.js'
  import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'

  import SimplyBeautiful from 'simply-beautiful'

  import Prism from 'prismjs'

  import 'prismjs/components/prism-markup'
  import 'prismjs/components/prism-markdown'
  import 'prismjs/components/prism-xml-doc'
  import 'prismjs/themes/prism.css'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)
  const shadowRoot = computed(() => root?.value?.parentNode)

  const props = defineProps({
    src: { type: String },
    language: { type: String, default: 'juncture' },
    draggable: { type: Boolean, default: true }
  })

  // const ready = ref(false)
  const rawText = ref<string>()
  // watch(rawText, () => console.log(`"${rawText.value}"`))
  
  watch(host, () => {
    let text = host.value?.innerHTML.trim()
    if (text) rawText.value = props.language === 'html' ? styleHTML(text) : `\n${text}`
  })

  watch(rawText, () => {
    let el = shadowRoot.value?.querySelector(`#${props.language}`)
    if (el && rawText.value) nextTick(() => {
      Prism.highlightElement(el)
      // ready.value = true
    })
  })

  onMounted(() => {
    if (props.src) {
      fetch(`/${props.src}?fmt=md`)
        .then(resp => resp.text())
        .then(markdown => {
          markdown = markdown.replace(/>/g,'&gt;').replace(/</g,'&lt;')
          rawText.value = props.language === 'html' ? styleHTML(markdown) : `\n${markdown}`
        })
    }
  })

  Prism.languages.juncture = Prism.languages.extend('markdown', {
  'juncture-tag': {
		pattern: /\w-[a-z0-9-]+.+/,
		greedy: true,
		inside: {

      'juncture-tag': {
				pattern: /ve-[a-z0-9-]+/
			},
      
      'string': [{ 
        pattern: /[^=]\"(\\.|[^\"])*\"/,
        alias: 'attr-value'
      }],

      'qid': [{
        pattern: /Q[0-9]+/, 
        alias: 'entity'
      }],
      
      'manifest-url': [{
        pattern: /\s+[a-z]+:[a-z0-9-_,%'\/\.]+/i,
        inside: {
          'url': /\s+[a-z]+:[a-z0-9-_,%'\/\.]+/i,
          'punctuation': /\s+/
        }
      }],

      'position': [{ 
        pattern: /\s+(full|left|right|sticky)/, 
        alias: 'boolean'
      }],

			'special-attr': [],
			'attr-value': {
				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
				inside: {
					'punctuation': [
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

			'punctuation': /\/?>/,
      
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},

  'marked': [{ pattern: /==[^=]+=={[^}]+}/, alias: 'class-name' }],
  'qid': [{ pattern: /Q[0-9]+/, alias: 'entity' }],
  'reference': [{ pattern: /\[\^[^\]]+\]:?\s*/, alias: 'class-name' }],

  })

  function getIndent(level:number) {
    var result = '',
      i = level * 2
    while (i--) result += ' '
    return result
  }

  function styleHTML(html:string) {
    function sanitize(el:HTMLElement) {
      let attrsToRemove = ['id', 'data-id']
      let classesToRemove = ['segment', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6']
      attrsToRemove.forEach(attr => el.removeAttribute(attr))
      classesToRemove.forEach(cls => el.classList.remove(cls))
    }
    let root = new DOMParser().parseFromString(html.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 'text/html').body.firstChild as HTMLElement
    sanitize(root)
    root.querySelectorAll('section, p').forEach((el) => sanitize(el))  
    let formatted = SimplyBeautiful.html(root.outerHTML, {indent_size: 2})
    formatted = formatted
      .replace(/\s+<\/li>/g, '</li>')
      .replace(/\s+<ve-entity-infobox/g, ' <ve-entity-infobox')
      .replace(/(wc:.+)<em>(.+)<\/em>(.+)/g, '$1_$2_$3')
    
    return formatted
  }

  function copyTextToClipboard() {
    if (navigator.clipboard) {
      let text = (rawText.value?.trim() || '').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
      navigator.clipboard.writeText(text)
      const tooltip = shadowRoot.value?.querySelector('sl-tooltip')
      if (tooltip) {
        tooltip.open = true
        setTimeout(() => tooltip.open = false, 1000)
      }
    }
  }

  function onDrag(evt:DragEvent) {
    let text = rawText.value
    if (text) evt.dataTransfer?.setData('text/plain', text)
  }

</script>

<style src='prismjs/themes/prism.css'></style> 

<style>

* { box-sizing: border-box; }

.main {
  font-size: .8em;
  position: relative;
}

.main pre {
  /* background-color: #fff; */
  /* background: rgba(0,0,0,0.03); */
  background-color: rgb(249,249,249);
  font-size: 1rem;
}

.main:hover .copy-button {
  opacity: 1;
}

.copy-button {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: all .3s ease-in;
}

.juncture-tag {
  color: #905;
}

</style>

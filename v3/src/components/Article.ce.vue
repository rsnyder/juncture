<template>

  <article ref="article" v-html="html" :class="{'j1': isJunctureV1}"></article>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import { marked } from 'marked'
  import markedFootnote from 'marked-footnote'

  const window = (globalThis as any).window as any

  /* md5 function from https://stackoverflow.com/questions/14733374/how-to-generate-an-md5-file-hash-in-javascript */
  function md5cycle(f,h){var i=f[0],n=f[1],r=f[2],g=f[3];i=ff(i,n,r,g,h[0],7,-680876936),g=ff(g,i,n,r,h[1],12,-389564586),r=ff(r,g,i,n,h[2],17,606105819),n=ff(n,r,g,i,h[3],22,-1044525330),i=ff(i,n,r,g,h[4],7,-176418897),g=ff(g,i,n,r,h[5],12,1200080426),r=ff(r,g,i,n,h[6],17,-1473231341),n=ff(n,r,g,i,h[7],22,-45705983),i=ff(i,n,r,g,h[8],7,1770035416),g=ff(g,i,n,r,h[9],12,-1958414417),r=ff(r,g,i,n,h[10],17,-42063),n=ff(n,r,g,i,h[11],22,-1990404162),i=ff(i,n,r,g,h[12],7,1804603682),g=ff(g,i,n,r,h[13],12,-40341101),r=ff(r,g,i,n,h[14],17,-1502002290),i=gg(i,n=ff(n,r,g,i,h[15],22,1236535329),r,g,h[1],5,-165796510),g=gg(g,i,n,r,h[6],9,-1069501632),r=gg(r,g,i,n,h[11],14,643717713),n=gg(n,r,g,i,h[0],20,-373897302),i=gg(i,n,r,g,h[5],5,-701558691),g=gg(g,i,n,r,h[10],9,38016083),r=gg(r,g,i,n,h[15],14,-660478335),n=gg(n,r,g,i,h[4],20,-405537848),i=gg(i,n,r,g,h[9],5,568446438),g=gg(g,i,n,r,h[14],9,-1019803690),r=gg(r,g,i,n,h[3],14,-187363961),n=gg(n,r,g,i,h[8],20,1163531501),i=gg(i,n,r,g,h[13],5,-1444681467),g=gg(g,i,n,r,h[2],9,-51403784),r=gg(r,g,i,n,h[7],14,1735328473),i=hh(i,n=gg(n,r,g,i,h[12],20,-1926607734),r,g,h[5],4,-378558),g=hh(g,i,n,r,h[8],11,-2022574463),r=hh(r,g,i,n,h[11],16,1839030562),n=hh(n,r,g,i,h[14],23,-35309556),i=hh(i,n,r,g,h[1],4,-1530992060),g=hh(g,i,n,r,h[4],11,1272893353),r=hh(r,g,i,n,h[7],16,-155497632),n=hh(n,r,g,i,h[10],23,-1094730640),i=hh(i,n,r,g,h[13],4,681279174),g=hh(g,i,n,r,h[0],11,-358537222),r=hh(r,g,i,n,h[3],16,-722521979),n=hh(n,r,g,i,h[6],23,76029189),i=hh(i,n,r,g,h[9],4,-640364487),g=hh(g,i,n,r,h[12],11,-421815835),r=hh(r,g,i,n,h[15],16,530742520),i=ii(i,n=hh(n,r,g,i,h[2],23,-995338651),r,g,h[0],6,-198630844),g=ii(g,i,n,r,h[7],10,1126891415),r=ii(r,g,i,n,h[14],15,-1416354905),n=ii(n,r,g,i,h[5],21,-57434055),i=ii(i,n,r,g,h[12],6,1700485571),g=ii(g,i,n,r,h[3],10,-1894986606),r=ii(r,g,i,n,h[10],15,-1051523),n=ii(n,r,g,i,h[1],21,-2054922799),i=ii(i,n,r,g,h[8],6,1873313359),g=ii(g,i,n,r,h[15],10,-30611744),r=ii(r,g,i,n,h[6],15,-1560198380),n=ii(n,r,g,i,h[13],21,1309151649),i=ii(i,n,r,g,h[4],6,-145523070),g=ii(g,i,n,r,h[11],10,-1120210379),r=ii(r,g,i,n,h[2],15,718787259),n=ii(n,r,g,i,h[9],21,-343485551),f[0]=add32(i,f[0]),f[1]=add32(n,f[1]),f[2]=add32(r,f[2]),f[3]=add32(g,f[3])}function cmn(f,h,i,n,r,g){return h=add32(add32(h,f),add32(n,g)),add32(h<<r|h>>>32-r,i)}function ff(f,h,i,n,r,g,t){return cmn(h&i|~h&n,f,h,r,g,t)}function gg(f,h,i,n,r,g,t){return cmn(h&n|i&~n,f,h,r,g,t)}function hh(f,h,i,n,r,g,t){return cmn(h^i^n,f,h,r,g,t)}function ii(f,h,i,n,r,g,t){return cmn(i^(h|~n),f,h,r,g,t)}function md51(f){var txt="";var h,i=f.length,n=[1732584193,-271733879,-1732584194,271733878];for(h=64;h<=f.length;h+=64)md5cycle(n,md5blk(f.substring(h-64,h)));f=f.substring(h-64);var r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(h=0;h<f.length;h++)r[h>>2]|=f.charCodeAt(h)<<(h%4<<3);if(r[h>>2]|=128<<(h%4<<3),h>55)for(md5cycle(n,r),h=0;h<16;h++)r[h]=0;return r[14]=8*i,md5cycle(n,r),n}function md5blk(f){var h,i=[];for(h=0;h<64;h+=4)i[h>>2]=f.charCodeAt(h)+(f.charCodeAt(h+1)<<8)+(f.charCodeAt(h+2)<<16)+(f.charCodeAt(h+3)<<24);return i}var hex_chr="0123456789abcdef".split("");function rhex(f){for(var h="",i=0;i<4;i++)h+=hex_chr[f>>8*i+4&15]+hex_chr[f>>8*i&15];return h}function hex(f){for(var h=0;h<f.length;h++)f[h]=rhex(f[h]);return f.join("")}function md5(f){return hex(md51(f))}function add32(f,h){return f+h&4294967295}

  const props = defineProps({
    owner: { type: String },
    repo: { type: String },
    branch: { type: String, default: 'main' },
    path: { type: String, default: 'README.md'}
  })

  const article = ref<HTMLElement | null>(null)
  const host = computed(() => (article.value?.getRootNode() as any)?.host)

  const markdown = ref()
  const html = ref()
  const isJunctureV1 = ref(false)

  watch(markdown, (markdown) => {
    html.value = structureContent(marked.use(markedFootnote()).parse(markdown))
    nextTick(() => { if (article.value) observeVisible(article.value, true) })  
  })

onMounted(() => getMarkdown() )

function getMarkdown() {
  if (!host.value) return
  if (host.value.textContent) markdown.value = host.value.textContent
  else
    fetch(`https://raw.githubusercontent.com/${props.owner}/${props.repo}/${props.branch}/${props.path}`)
      .then(response => response.text())
      .then(md => { markdown.value = md })
      .catch(error => { console.error('Error getting markdown from Github:', error) })
}

function camelToKebab(input:string) { return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}
function isNumeric(arg) { return !isNaN(arg) }
function hasTimestamp(s) { return /\d{1,2}:\d{1,2}/.test(s) }

function isMobile() {
  let _isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent) )
  return _isMobile
}

function computeDataId(el) {
  let dataId: number[] = []
  while (el.parentElement) {
    let siblings = (Array.from(el.parentElement.children) as HTMLElement[]).filter(c => c.tagName === el.tagName)
    dataId.push(siblings.indexOf(el) + 1)
    el = el.parentElement
  }
  return dataId.reverse().join('.')
}

function parseHeadline(s) {
  const booleans = {
    'mdp-audio': ['autoplay', 'muted', 'no-caption', 'sync'],
    'mdp-entities': ['cards'],
    'mdp-gallery': ['caption'],
    'mdp-header': ['breadcrumbs', 'pdf-download-enabled'],
    'mdp-iframe': ['allow-full-screen', 'allow-transparency', 'full', 'left', 'right', 'sticky'],
    'mdp-image': ['no-caption', 'zoom-on-scroll'],
    'mdp-knightlab-timeline': ['has-bookmark'],
    'mdp-menu': ['pdf-download-enabled'],
    'mdp-plant-specimen': ['full', 'left', 'right', 'sticky'],
    'mdp-video': ['autoplay', 'muted', 'no-caption', 'sync']
  }
  let tokens: string[] = []
  s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
  s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
    if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
    else tokens.push(token)
  })
  let parsed:any = {}
  let tokenIdx = 0
  while (tokenIdx < tokens.length) {
    let token = tokens[tokenIdx]
    if (token.indexOf('=') > 0) {
      let idx = token.indexOf('=')
      let key = token.slice(0, idx)
      let value = token.slice(idx+1)
      value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
      if (key[0] === ':') { // style
        key = camelToKebab(key.slice(1))
        if (!parsed.style) parsed.style = {}
        parsed.style[key] = value
      } else { // kwargs
        if (parsed.kwargs) {
          if (parsed.kwargs[key]) parsed.kwargs[key] += ` ${value}`
          else parsed.kwargs[key] = value
        }
        else parsed.kwargs = {[key]: value}
      }
    }
    else if (token[0] === '.') {
      let key = 'class'
      let value = token.slice(1)
      value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
      if (parsed[key]) parsed[key] += ` ${value}`
      else parsed[key] = value
    }
    else if (token[0] === '"') {
      let value = token.slice(1,-1)
      if (!parsed.args) parsed.args = []
      parsed.args.push(value)
    }
    else if (token[0] === '#') parsed['id'] = token.slice(1)
    else if (/^Q\d+$/.test(token)) { // entity identifier
      if (!parsed.entities) parsed.entities = []
      parsed.entities.push(token)
    } 
    else if (/^\w+-[-\w]*\w+$/.test(token) && !parsed.tag) parsed['tag'] = token
    else if (token === 'script' || token === 'link') parsed['tag'] = token
    else {
      if (parsed.tag === 'script' && !parsed.src) parsed.src = token
      else if (parsed.tag === 'link' && !parsed.href) parsed.href= token
      else {
        if (booleans[parsed.tag] && booleans[parsed.tag].includes(token)) {
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
  return parsed
}

function parseCodeEl(codeEl) {
  let codeElems = codeEl.textContent?.replace(/\s+\|\s+/g,'\n').split('\n').map(l => l.trim()).filter(x => x) || []
  let parsed = parseHeadline(codeElems?.[0]) || {}
  if (codeElems.length > 1) parsed.args = parsed.args ? [...parsed.args, ...codeElems.slice(1)] : codeElems.slice(1)
  return parsed
}

function handleCodeEl(rootEl:HTMLElement, codeEl:HTMLElement) {
  // console.log(codeEl)
  // console.log(codeEl.parentElement.parentElement)
  // console.log(codeEl.previousElementSibling)
  
  let parentTag = codeEl.parentElement?.tagName || ''
  let previousElTag = codeEl.previousElementSibling?.tagName
  let isInline = false

  if (parentTag === 'P' || 
      parentTag === 'PRE' ||
      parentTag === 'LI' ||
      parentTag === 'TD' ||
      /^H\d/.test(parentTag)) {
    let codeWrapper: HTMLElement | null | undefined
    if (previousElTag === 'IMG' || previousElTag === 'A' || previousElTag === 'EM' || previousElTag === 'STRONG') codeWrapper = codeEl
    else if (parentTag === 'P') {
      let paraText = Array.from(codeEl.parentElement?.childNodes || []).map(c => c.nodeValue?.trim()).filter(x => x).join('')
      codeWrapper = paraText ? codeEl : codeEl.parentElement
      isInline = paraText ? true : false
    } 
    else if (parentTag === 'PRE' || parentTag === 'LI' || parentTag === 'TD') codeWrapper = codeEl
    else if (/^H\d/.test(parentTag)) codeWrapper = codeEl
    else codeWrapper = codeEl.parentElement?.parentElement?.parentElement
  
    // (codeWrapper)
    if (!codeWrapper) return

    let parent = parentTag === 'LI'
      ? codeEl.previousElementSibling
        ? codeEl.parentElement?.parentElement
        : codeEl.parentElement
      : codeWrapper.parentElement

    let codeLang = parentTag === 'PRE' 
      ? Array.from(codeWrapper.classList).find(cls => cls.indexOf('language') === 0)?.split('-').pop() || 'mdpress'
      : 'mdpress'
    // console.log(`codeLang=${codeLang}`)
    
    if (codeLang === 'mermaid') {
      let newEl = document.createElement('mdp-mermaid')
      newEl.textContent = codeEl.textContent
      codeWrapper?.parentElement?.replaceWith(newEl)

    } else if (codeLang === 'mdpress') {
      let parsed = parseCodeEl(codeEl)
      // console.log(parsed)
      if (isInline && (parsed.tag || parsed.class || parsed.style || parsed.id)) {
        if (parsed.style) parsed.style.display = 'inline-block'
        else parsed.style = {display: 'inline-block'}
      }

      if (parsed.tag) {
        let newEl = document.createElement(parsed.tag)
        if (parsed.id) newEl.id = parsed.id
        if (parsed.class) parsed.class.split(' ').forEach(c => newEl.classList.add(c))
        if (parsed.style) newEl.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
        if (parsed.entities) newEl.setAttribute('entities', parsed.entities.join(' '))
        if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) newEl.setAttribute(k, v === true ? '' : v)
        if (parsed.booleans) parsed.booleans.forEach(b => newEl.setAttribute(b, '') )
        if (parsed.args) {
          let ul = document.createElement('ul')
          newEl.appendChild(ul)
          for (const arg of parsed.args) {
            let li = document.createElement('li')
            li.innerHTML = arg
            ul.appendChild(li)
          }
        }
        if (parsed.tag === 'script') {
          document.body.appendChild(newEl)
          codeWrapper.remove()
        } else if (parsed.tag === 'link') {
          document.head.appendChild(newEl)
          codeWrapper.remove()
        } else {
          let componentType = parsed.tag.split('-').slice(1).join('-')
          if (componentType === 'header' || componentType === 'footer') {
            let existing = rootEl.querySelector(parsed.tag)
            if (existing) {
              existing.replaceWith(newEl)
              codeWrapper.remove()
            } else {
              codeWrapper.replaceWith(newEl)
            }
          }
          else codeWrapper.replaceWith(newEl)
        }
      } else if (parsed.class || parsed.style || parsed.id || parsed.kwargs) {
        let target

        
        // let priorEl = codeEl.previousElementSibling
        let priorEl = codeWrapper.previousElementSibling
        if (priorEl?.tagName === 'MDP-MERMAID') {
          target = priorEl
        } else if (priorEl?.tagName === 'EM' || priorEl?.tagName === 'STRONG') {
          target = document.createElement('span')
          target.innerHTML = priorEl.innerHTML
          priorEl.replaceWith(target)
        } else if (parent?.tagName === 'TD') {
          target = parent?.parentElement?.parentElement?.parentElement // table
          parent?.parentElement?.remove() // row
        } else if (parent?.tagName !== 'UL' && (priorEl?.tagName === 'A' || priorEl?.tagName === 'IMG')) {
          target = priorEl
        } else {
          target = parent
        }
        if (parsed.id) target.id = parsed.id
        if (parsed.class) parsed.class.split(' ').forEach(c => target.classList.add(c))
        if (parsed.style) target.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
        if (parsed.entities) target.setAttribute('data-entities', parsed.entities.join(' '))
        if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) target.setAttribute(k, v === true ? '' : v)
        codeWrapper.remove()
        // console.log(target)
      }
    }
  }
}

function elFromHtml(html) {
  // return new DOMParser().parseFromString(html, 'text/html').body.firstChild?.children[1]
  let template = document.createElement('template')
  template.innerHTML = html
  // console.log(template.content)
  return template.content
}

function structureContent(html) {
  let rootEl = (html ? elFromHtml(html) : document.querySelector('main')) as HTMLElement
  // console.log(rootEl)
  console.log('structureContent.input', elFromHtml(rootEl.outerHTML))

  let restructured = document.createElement('main')
  
  restructured.className = 'page-content markdown-body'
  restructured.setAttribute('aria-label', 'Content')
  restructured.setAttribute('data-theme', 'light')
  let currentSection = restructured;
  let sectionParam
  let tabGroup = 0
  let tab = 0
  let cardCtr = 0

  // Converts empty headings (changed to paragraphs by markdown converter) to headings with the correct level
  if (rootEl)
    Array.from(rootEl?.querySelectorAll('p'))
    .filter(p => /^[#*]{1,6}$/.test(p.childNodes.item(0)?.nodeValue?.trim() || ''))
    .forEach(p => {
      let ptext = p.childNodes.item(0).nodeValue?.trim()
      let codeEl = p.querySelector('code')
      let heading = document.createElement(`h${ptext?.length}`)
      p.replaceWith(heading)
      if (codeEl) {
        let codeWrapper = document.createElement('p')
        codeWrapper.appendChild(codeEl)
        heading.parentElement?.insertBefore(codeWrapper, heading.nextSibling)
      }
    })

  // For compatibility with Juncture V2
  Array.from(rootEl?.querySelectorAll('p'))
  .filter(p => /^\.\w+-\w+\S/.test(p.childNodes.item(0).nodeValue?.trim() || ''))
  .forEach(p => {
    let codeEl = document.createElement('code')
    let replacementText = p.innerHTML.trim().slice(1).replace(/\n\s*-\s+/g, '\n')
    codeEl.textContent = replacementText
    p.textContent = ''
    p.appendChild(codeEl)
  })

  Array.from(rootEl?.querySelectorAll('p, li'))
  .filter(p => /==.+=={.+}/.test(p.textContent?.trim() || ''))
  .forEach(el => {
    // console.log(el.innerHTML)
    let replHtml: string[] = []
    let matches = Array.from(el.innerHTML.matchAll(/==(?<text>[^=]+)=={(?<attrs>[^}]+)}/g))
    matches.forEach((match, idx) => {
      if (idx === 0) replHtml.push(el.innerHTML.slice(0, match.index))
      if (match.groups) {
        let {text, attrs} = match.groups
        if (/\s*Q\d+\s*/.test(attrs)) {
          replHtml.push(`<a href="${attrs}">${text}</a>`)
        } else if (attrs.indexOf('=') > 0) {
          let [key, value] = attrs.split('=')
          if (value[0] !== '"') attrs = `${key}="${value}"`
          replHtml.push(`<mark ${attrs}>${text}</mark>`)
        }
        replHtml.push(el.innerHTML.slice(match.index + match[0].length, matches[idx+1]?.index || el.innerHTML.length))
      }
    })
    el.innerHTML = replHtml.join('')
  })

  // For compatibility with Juncture V1
  Array.from(rootEl?.querySelectorAll('param'))
  .filter(param => Array.from(param.attributes).filter(attr => attr.name.indexOf('ve-') === 0).length === 0)
  .forEach(param => {
    let priorEl = param.previousElementSibling
    param.classList.forEach(c => priorEl?.classList.add(c))
    let idAttr = Array.from(param.attributes).find(attr => attr.name === 'id')
    let styleAttr = Array.from(param.attributes).find(attr => attr.name === 'style')
    if (idAttr || styleAttr) {
      if (idAttr) priorEl?.setAttribute('id', idAttr.value)
      if (styleAttr) priorEl?.setAttribute('style', styleAttr.value)
      param.remove()
    }
  })

  Array.from(rootEl?.children || []).forEach(el => {
    if (el.tagName[0] === 'H' && isNumeric(el.tagName.slice(1))) {
      let heading = el
      let sectionLevel = parseInt(heading.tagName.slice(1))
      if (currentSection) {
        (Array.from(currentSection.children))
          .filter(child => !/^H\d/.test(child.tagName))
          .filter(child => !/PARAM/.test(child.tagName))
          .filter(child => !/STYLE/.test(child.tagName))
          .filter(child => !/^MDP-/.test(child.tagName))
          .forEach((child, idx) => { 
            let segId = `${currentSection.getAttribute('data-id') || 0}.${idx+1}`
            child.setAttribute('data-id', segId)
            child.id = segId
            child.classList.add('segment')
          })
      }

      currentSection = document.createElement('section')
      currentSection.classList.add(`section${sectionLevel}`)
      Array.from(heading.classList).forEach(c => currentSection.classList.add(c))
      heading.className = ''
      if (heading.id) {
        currentSection.id = heading.id
        heading.removeAttribute('id')
      }

      currentSection.innerHTML += heading.outerHTML

      let headings: Element[] = []
      for (let lvl = 1; lvl < sectionLevel; lvl++) {
        headings = [...headings, ...restructured.querySelectorAll(`H${lvl}`)]
      }
      //let headings = [...restructured.querySelectorAll(`H${sectionLevel-1}`)]

      let parent = sectionLevel === 1 || headings.length === 0 ? restructured : headings.pop()?.parentElement
      parent?.appendChild(currentSection)
      currentSection.setAttribute('data-id', computeDataId(currentSection))

    } else  {
      if (el.tagName !== 'PARAM') {
        let segId = `${currentSection.getAttribute('data-id') || 0}.${currentSection.children.length}`
        el.setAttribute('data-id', segId)
        el.id = segId
        el.classList.add('segment')
      }
      if (el !== sectionParam) currentSection.innerHTML += el.outerHTML
    }
  })

  Array.from(restructured?.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  .filter(heading => !heading.innerHTML.replace('&nbsp;','').trim())
  .forEach(heading => {
    heading.remove()
  })

  Array.from(restructured?.querySelectorAll('p'))
  .forEach(para => {
    let lines = para.textContent?.split('\n').map(l => l.trim()) || []
    let codeEl = para.querySelector('code')
    if (codeEl) lines = lines.slice(0,-1)
    // console.log(lines)
    if (lines.length > 1 && hasTimestamp(lines[0])) {
      para.setAttribute('data-head', lines[0])
      if (lines.length > 2) para.setAttribute('data-entities', lines[2])
      if (lines.length > 3) para.setAttribute('data-related', lines[3])
      para.innerHTML = lines[1]
      if (codeEl) para.appendChild(codeEl)
    }
  })

  // For Juncture 1/2 compatibility, apply attributes found in paragraphs
  Array.from(restructured?.querySelectorAll('p'))
  .filter(p => /^{.*}$/.test(p.textContent?.trim() || ''))
  .forEach(attrs => {
    let target: Element|undefined|null = attrs.previousElementSibling
    while (target?.tagName !== 'P') target = target?.previousElementSibling
    let parsed = parseHeadline(attrs.textContent?.trim().slice(1,-1))
    if (parsed.id) target.id = parsed.id
    if (parsed.class) parsed.class.split(' ').forEach(c => target.classList.add(c))
    if (parsed.style) target.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
    if (parsed.entities) target.setAttribute('data-entities', parsed.entities.join(' '))
    if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) target.setAttribute(k, v === true ? '' : v as string)
    attrs.remove()
  })

  // console.log('structureContent', new DOMParser().parseFromString( rootEl.outerHTML, 'text/html').firstChild.children[1].firstChild)

  Array.from(restructured?.querySelectorAll('code'))
  .forEach(codeEl => handleCodeEl(restructured, codeEl))

  // console.log('structureContent', new DOMParser().parseFromString( rootEl.outerHTML, 'text/html').firstChild.children[1].firstChild)

  restructured.querySelectorAll('section').forEach(section => {
    
    if (section.classList.contains('cards') && !section.classList.contains('wrapper')) {
      section.classList.remove('cards')
      let wrapper = document.createElement('section')
      wrapper.className = 'cards wrapper'
      Array.from(section.children).slice(1).forEach(card => {
        wrapper.appendChild(card)
        card.classList.add('card')
        let heading = card.querySelector('h1, h2, h3, h4, h5, h6')
        if (heading) heading.remove()
        let img = card.querySelector('p > img')
        if (img) img.parentElement?.replaceWith(img)
        let link = card.querySelector('p > a')
        if (link) link.parentElement?.replaceWith(link)
        card.querySelectorAll('p').forEach(p => {
          ++cardCtr
          let readMoreWrapper = document.createElement('div')
          readMoreWrapper.className = 'read-more'
          let input = document.createElement('input')
          input.setAttribute('type', 'checkbox')
          input.id = `read-more-${cardCtr}`
          readMoreWrapper.appendChild(input)
          let para = document.createElement('p')
          para.innerHTML = p.innerHTML
          readMoreWrapper.appendChild(para)
          let label = document.createElement('label')
          label.setAttribute('for', `read-more-${cardCtr}`)
          label.setAttribute('role', 'button')
          label.innerHTML = 'More'
          readMoreWrapper.appendChild(label)
          p.replaceWith(readMoreWrapper)
        })
      })
      section.appendChild(wrapper)
    }

    if (section.classList.contains('tabs')) {
      let tabGroup = document.createElement('sl-tab-group');
      Array.from(section.classList).forEach(cls => tabGroup.classList.add(cls))
      Array.from(section.attributes).forEach(attr => tabGroup.setAttribute(attr.name, attr.value))
      Array.from(section.querySelectorAll(':scope > section'))
      .forEach((tabSection, idx) => {
        let tab = document.createElement('sl-tab')
        tab.setAttribute('slot', 'nav')
        tab.setAttribute('panel', `tab${idx+1}`)
        tab.innerHTML = tabSection.querySelector('h1, h2, h3, h4, h5, h6')?.innerHTML || ''
        tabGroup.appendChild(tab)      
      })
      Array.from(section.querySelectorAll(':scope > section'))
      .forEach((tabSection, idx) => {
        let tabPanel = document.createElement('sl-tab-panel')
        tabPanel.setAttribute('name', `tab${idx+1}`)
        tabPanel.innerHTML = tabSection.innerHTML || ''
        tabGroup.appendChild(tabPanel)
      })
      section.replaceWith(tabGroup)
    }

    /*
    if (section.classList.contains('tabs')) {
      section.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')?.remove()
      section.classList.remove('tabs')
      section.classList.add('tab-wrap')
      ++tabGroup
      Array.from(section.querySelectorAll(':scope > section'))
      .forEach((tabSection, idx) => {
        ++tab
        tabSection.className = 'tab__content'
        // tabSection.removeAttribute('id')
        
        let label = document.createElement('label')
        label.setAttribute('for', `tab${tab}`)
        label.innerHTML = tabSection.querySelector('h1, h2, h3, h4, h5, h6')?.innerHTML
        section.insertBefore(label, section.children.item(idx*2))

        let input = document.createElement('input')
        input.className = 'tab'
        input.setAttribute('id', `tab${tab}`)
        input.setAttribute('type', 'radio')
        input.setAttribute('name', `tabGroup${tabGroup}`)
        if (idx === 0) input.setAttribute('checked', '')
        section.insertBefore(input, section.children.item(idx*2))
        
      })
      console.log(section)
    }
    */
    
    /*
    if (section.classList.contains('tabs')) {
      // from https://codepen.io/alvarotrigo/pen/GRMbzBR
      ++tabGroup
      let tabsWrap = document.createElement('section')
      tabsWrap.className = 'tab-wrap'
      Array.from(section.querySelectorAll(':scope > section'))
      .forEach((tabSection, idx) => {
        ++tab

        let label = document.createElement('label')
        label.setAttribute('for', `tab${tab}`)
        label.innerHTML = tabSection.querySelector('h1, h2, h3, h4, h5, h6')?.innerHTML
        tabsWrap.insertBefore(label, tabsWrap.children.item(idx*2))

        let input = document.createElement('input')
        input.className = 'tab'
        input.setAttribute('id', `tab${tab}`)
        input.setAttribute('type', 'radio')
        input.setAttribute('name', `tabGroup${tabGroup}`)
        if (idx === 0) input.setAttribute('checked', '')
        tabsWrap.insertBefore(input, tabsWrap.children.item(idx*2))

        tabSection.className = 'tab__content'
        tabsWrap.appendChild(tabSection)
        tabSection.querySelector('h1, h2, h3, h4, h5, h6')?.remove()
        
      })
      section.appendChild(tabsWrap)
    }
    */

    // console.log(section)
    if ((section.classList.contains('columns') || section.classList.contains('mcol')) && !section.classList.contains('wrapper')) {
      let wrapper = document.createElement('section')
      wrapper.className = 'columns wrapper'
      section.classList.remove('columns')
      section.classList.remove('mcol')
      Array.from(section.children)
        .filter(child => child.tagName === 'SECTION')
        .forEach((col, idz) => {
        wrapper.appendChild(col)
        col.classList.add(`col-${idz+1}`)
      })
      section.appendChild(wrapper)
    }
  });

  Array.from(restructured.querySelectorAll('a'))
  .filter(anchorElem => anchorElem.href.indexOf('mailto:') < 0)
  .forEach(anchorElem => {
    let link = new URL(anchorElem.href)
    let path = link.pathname.split('/').filter(p => p)
    if (path.length === 0) return
    let qid = /^Q\d+$/.test(path[path.length-1]) ? path[path.length-1] : null
    let isEntityPath = path.find(pe => pe[0] === '~')
    if (qid || isEntityPath) {
      let mdpEntityInfobox = document.createElement('mdp-entity-infobox')
      mdpEntityInfobox.innerHTML = anchorElem.innerHTML
      if (qid) mdpEntityInfobox.setAttribute('qid', qid)
      else {
        let pathIdx = (window.config?.baseurl && link.pathname.indexOf(window.config?.baseurl) === 0) ? 1 : 0
        mdpEntityInfobox.setAttribute('file', path.slice(pathIdx).map(pe => pe.replace(/~/,'')).filter(pe => pe).join('/'))
      }
      anchorElem.replaceWith(mdpEntityInfobox)
    }
    // if (isGHP && window.config.repo && link.origin === location.origin && link.pathname.indexOf(`/${window.config.repo}/`) !== 0) anchorElem.href = `/${window.config.repo}${link.pathname}`
  })

  /*
  Array.from(restructured.querySelectorAll('img'))
    .forEach(img => {
      if (img.parentElement?.classList.contains('card')) return
      let mdpImage = document.createElement('mdp-image')
      mdpImage.setAttribute('src', img.src)
      mdpImage.setAttribute('alt', img.alt)
      mdpImage.setAttribute('left', '');
      (img.parentNode).replaceWith(mdpImage)
    })
  */
  
  // restructured.style.paddingBottom = '100vh'

  let article = document.createElement('article')
  article.className = ''
  let header

  let veConfig = restructured.querySelector('param[ve-config]')
  isJunctureV1.value = veConfig ? true : false

  if (isJunctureV1.value) { // Juncture 1 style essay
    article.classList.add('j1')
    header = document.createElement('mdp-header')
    header.className = 'sticky'
    article.appendChild(header)

    Array.from(veConfig?.attributes || []).forEach(attr => {
      if (attr.name === 'banner') header.setAttribute('background', attr.value)
      if (attr.name === 'title') header.setAttribute('title', attr.value)
      if (attr.name === 'subtitle' || attr.name === 'author') header.setAttribute('subtitle', attr.value)
    })
    // veConfig.replaceWith(header)
    if (veConfig) veConfig.remove()

    let viewAsButton = Array.from(restructured.querySelectorAll('a > img')).find(img => (img as HTMLImageElement).src.indexOf('ve-button') > -1)
    if (viewAsButton) viewAsButton?.parentElement?.parentElement?.remove()

    let mainWrapper = document.createElement('main')
    mainWrapper.className = 'page-content markdown-body'
    let content = document.createElement('div')
    content.className = 'content'
    content.innerHTML = restructured.innerHTML
    let viewers = document.createElement('div')
    viewers.className = 'viewers sticky'
    mainWrapper.appendChild(content)
    mainWrapper.appendChild(viewers)
    article.appendChild(mainWrapper)
  } else {
    header = restructured.querySelector('mdp-header')
    if (header) article.appendChild(header)
    article.appendChild(restructured)
  }

  let footer = restructured.querySelector('mdp-footer, ve-footer')
  if (footer) {
    Array.from(footer.querySelectorAll('li'))
    .filter(li => /^\s*{.*}$/.test(li.textContent?.trim() || ''))
    .forEach(li => {
      let parsed = parseHeadline(li.textContent?.trim().slice(1,-1))
      if (parsed.id) li.id = parsed.id
      if (parsed.class) parsed.class.split(' ').forEach(c => li.classList.add(c))
      if (parsed.style) li.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
      li.textContent = ''
    })
    article.appendChild(footer)
  }

  article.querySelectorAll('section p').forEach(p => {
    let qids = Array.from(p.querySelectorAll('param[eid]')).map(param => {
      let qid = param.getAttribute('eid')
      let aliases = param.getAttribute('aliases')
      if (aliases) window.customEntityAliases[qid || ''] = aliases.split('|').map(a => a.trim())
      return qid
    })
    let parent = p.parentElement
    while (parent && parent.tagName !== 'ARTICLE') {
      qids = [
        ...qids,
        ...Array.from(parent.querySelectorAll(':scope > param[eid]')).map(param => {
          let qid = param.getAttribute('eid')
          let aliases = param.getAttribute('aliases')
          if (aliases) window.customEntityAliases[qid || ''] = aliases.split('|').map(a => a.trim())
          return qid
        })
      ]
      parent = parent.parentElement
    }
    p.setAttribute('data-entities', qids.join(' '))
  })
  Array.from(article.querySelectorAll('param'))
    .filter(param => !param.getAttributeNames().find(attrName => attrName.indexOf('ve-') === 0 && attrName !== 've-entity'))
    .forEach(param => param.remove())

  // console.log(`isJunctureV1=${isJunctureV1.value}`)
  if (isJunctureV1.value) {
    Array.from(article.querySelectorAll('[data-id]'))
    .forEach(seg => {
      if (seg.tagName === 'SECTION') return
      let id = seg.getAttribute('data-id') || ''
      let wrapper = document.createElement('div')
      wrapper.setAttribute('data-id', id)
      wrapper.id = id
      wrapper.className = seg.className
      seg.removeAttribute('id')
      seg.removeAttribute('data-id')
      seg.className = ''
      wrapper.appendChild(seg.cloneNode(true))
      let viewers = document.createElement('mdp-j1-viewers')
      // viewers.className = 'viewers'
      viewers.setAttribute('entities', seg.getAttribute('data-entities') || '')
      viewers.dataset.id = id
      wrapper.appendChild(viewers)

      function setViewersPosition() {
        let top = header.getBoundingClientRect().top
        let height = header.getBoundingClientRect().height
        let offset = top + height
        viewers.style.top = `${offset}px`
        viewers.style.height = `calc(100dvh - ${offset+2}px)`
      }

      while (seg.nextSibling) {
        let sib = seg.nextSibling
        if (sib.nodeName !== 'PARAM') break
        viewers.appendChild(sib)
      }

      let parent = seg.parentElement
      while (parent && parent.tagName !== 'ARTICLE') {
        parent.querySelectorAll(':scope > param').forEach(param => viewers.appendChild(param.cloneNode(true)))
        parent = parent.parentElement
      }

      if (!isMobile()) {
        document.addEventListener('scroll', () => setViewersPosition())
        setTimeout(() => setViewersPosition(), 0)
      }
  
      seg.replaceWith(wrapper)
    })
  }
  return article.innerHTML
  
}

function setStickyOffsets(root) {

function topIsVisible(el) {
  let bcr = el.getBoundingClientRect()
  return el.tagName === 'MDP-HEADER' || el.tagName === 'MDP-BREADCRUMBS' || (bcr.top >= 0 && bcr.top <= window.innerHeight)
}

let stickyElems: HTMLElement[] = Array.from(root.querySelectorAll('.sticky')) || []
// let stickyElems = Array.from(root.querySelectorAll('.sticky'))
.filter(stickyEl => {
  return topIsVisible(stickyEl)
})
.sort((a:HTMLElement,b:HTMLElement) => {
    let aTop = a.getBoundingClientRect().top
    let bTop = b.getBoundingClientRect().top
    return aTop < bTop ? -1 : 1
  })

// console.log('setStickyOffsets', stickyElems)

if (stickyElems.length === 1) {
  // if (!stickyElems[0].style.top) stickyElems[0].style.top = '0px'
} else if (stickyElems.length > 1) {
  // nextTick(() => {
    stickyElems[0].style.zIndex = `${stickyElems.length}`
    for (let i = 1; i < stickyElems.length; i++) {
      let bcr = stickyElems[i].getBoundingClientRect()
      let left = bcr.x
      let right = bcr.x + bcr.width
      for (let j = i-1; j >= 0; --j) {
        let priorSticky = stickyElems[j]
        let bcrPrior = priorSticky.getBoundingClientRect()
        let leftPrior = bcrPrior.x
        let rightPrior = bcrPrior.x + bcrPrior.width
        if ((leftPrior <= right) && (rightPrior >= left)) {
          let priorTop = parseInt(priorSticky.style.top.replace(/px/,'')) || 0
          // console.log(priorSticky, priorTop)
          // stickyElems[i].style.top = `${Math.floor(priorTop + bcrPrior.y + bcrPrior.height)}px`
          // console.log(stickyElems[i].style)
          if (stickyElems[i].style) {
            stickyElems[i].style.top = `${Math.floor(priorTop + bcrPrior.height)}px`
            //stickyElems[i].style.zIndex = `${stickyElems.length - i}`
          } else {
            // console.log('no style', stickyElems[i])
          }
          break
        }
      }
    }
  //})
}
}

let priorActiveParagraph
let currentActiveParagraph

function observeVisible(rootEl:HTMLElement, setActiveParagraph = false) {

let topMargin = (Array.from(rootEl.querySelectorAll('MDP-HEADER')) as HTMLElement[])
.map(stickyEl => (parseInt(stickyEl.style.top.replace(/px/,'')) || 0) + stickyEl.getBoundingClientRect().height)?.[0] || 0

// console.log(`observeVisible: setActiveParagraph=${setActiveParagraph} topMargin=${topMargin}`)

const visible:any = {}
const observer = new IntersectionObserver((entries, observer) => {
  
  for (const entry of entries) {
    let para = entry.target
    let paraId = para.id || para.parentElement?.id || ''
    let intersectionRatio = entry.intersectionRatio
    if (intersectionRatio > 0) visible[paraId] = {para, intersectionRatio}
    else delete visible[paraId]
  }

  let sortedVisible: any[] = Object.values(visible)
    .sort((a:any,b:any) => b.intersectionRatio - a.intersectionRatio || a.para.getBoundingClientRect().top - b.para.getBoundingClientRect().top)

  // if (sortedVisible.length) console.log(sortedVisible)

  if (setActiveParagraph) {
      currentActiveParagraph = sortedVisible[0]?.para
  } else {
    let found = sortedVisible.find(e => e.para.classList.contains('active'))
    if (found) currentActiveParagraph = found.para
  }
    
  if (currentActiveParagraph !== priorActiveParagraph) {
    // console.log('activeParagraph', currentActiveParagraph)
    priorActiveParagraph = currentActiveParagraph
    if (setActiveParagraph) { 
      rootEl.querySelectorAll('p.active').forEach(p => p.classList.remove('active'))
      currentActiveParagraph?.classList.add('active')
      if (currentActiveParagraph.getAttribute('data-entities') && !currentActiveParagraph.getAttribute('data-entities-tagged')) {
        let qids = currentActiveParagraph.getAttribute('data-entities')?.split(' ') || []
        if (qids.length) {
          getEntityData(qids).then(entities => { 
            let html = currentActiveParagraph.innerHTML
            Object.values(entities).forEach(entity => {
              let toMatch = entity.aliases ? [entity.label, ...entity.aliases] : [entity.label]
              for (let i = 0; i < toMatch.length; i++) {
                let s = toMatch[i]
                let matches = html.match(new RegExp(s, 'i'))
                if (matches) {
                  let idx = matches.index
                  let match = matches[0]
                  html = html.slice(0, idx) + `<mdp-entity-infobox qid="${entity.id}">${match}</mdp-entity-infobox>` + html.slice(idx + match.length)
                  currentActiveParagraph.innerHTML = html
                  break
                }
              }
            })
          })
        }
        currentActiveParagraph.setAttribute('data-entities-tagged', '')
      }

      let currentActiveViewers = currentActiveParagraph?.nextElementSibling
      // console.log(currentActiveViewers)
      if (currentActiveViewers) {
        let viewers = rootEl.querySelector('.viewers')
        if (viewers) viewers.innerHTML = currentActiveViewers?.outerHTML
      }
    }
    setStickyOffsets(rootEl)
  }

}, { root: null, threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], rootMargin: `${topMargin ? -topMargin : 0}px 0px 0px 0px`})

// target the elements to be observed
rootEl.querySelectorAll('p').forEach((paragraph) => observer.observe(paragraph))
}

function mwImage(mwImg, width) {
  // Converts Wikimedia commons image URL to a thumbnail link
  mwImg = (Array.isArray(mwImg) ? mwImg[0] : mwImg).replace(/Special:FilePath\//, 'File:').split('File:').pop()
  mwImg = decodeURIComponent(mwImg).replace(/ /g,'_')
  const _md5 = md5(mwImg)
  const extension = mwImg.split('.').pop()
  let url = `https://upload.wikimedia.org/wikipedia/commons${width ? '/thumb' : ''}`
  url += `/${_md5.slice(0,1)}/${_md5.slice(0,2)}/${mwImg}`
  if (width) {
    url += `/${width}px-${mwImg}`
    if (extension === 'svg') {
      url += '.png'
    } else if (extension === 'tif' || extension === 'tiff') {
      url += '.jpg'
    }
  }
  return url
}

// Creates a GeoJSON file URL from a Who's on First ID 
function whosOnFirstUrl(wof: string) {
  let wofParts: string[] = []
  for (let i = 0; i < wof.length; i += 3) {
    wofParts.push(wof.slice(i,i+3))
  }
  return `https://data.whosonfirst.org/${wofParts.join('/')}/${wof}.geojson`
}

window.entityData = {}
window.pendingEntityData = new Set()
window.customEntityAliases = {}
async function getEntityData(qids, language: string = 'en') {
  language = language || 'en'
  let cached = new Set(qids.filter(qid => window.entityData[qid]))
  let pending = new Set(qids.filter(qid => window.pendingEntityData.has(qid)))
  let toGet = qids
    .filter(qid => !cached.has(qid))
    // .filter(qid => !pending.has(qid))
  // console.log(`getEntityData: entities=${qids.length} cached=${cached.size} pending=${pending.size} toGet=${toGet}`)
  if (toGet.length > 0) {
    Array.from(toGet).forEach(qid => window.pendingEntityData.add(qid))
    let toGetUrls = toGet.map(qid => `(<http://www.wikidata.org/entity/${qid}>)`)
    let query = `
      SELECT ?item ?label ?description ?alias ?image ?logoImage ?coords ?pageBanner ?whosOnFirst ?wikipedia WHERE {
        VALUES (?item) { ${toGetUrls.join(' ')} }
        ?item rdfs:label ?label . 
        FILTER (LANG(?label) = "${language}" || LANG(?label) = "en")
        OPTIONAL { ?item schema:description ?description . FILTER (LANG(?description) = "${language}" || LANG(?description) = "en")}
        OPTIONAL { ?item skos:altLabel ?alias . FILTER (LANG(?alias) = "${language}" || LANG(?alias) = "en")}
        OPTIONAL { ?item wdt:P625 ?coords . }
        OPTIONAL { ?item wdt:P18 ?image . }
        OPTIONAL { ?item wdt:P154 ?logoImage . }
        OPTIONAL { ?item wdt:P948 ?pageBanner . }
        OPTIONAL { ?item wdt:P6766 ?whosOnFirst . }
        OPTIONAL { ?wikipedia schema:about ?item; schema:isPartOf <https://${language}.wikipedia.org/> . }
    }`
    let resp = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(query)}`
    })
    if (resp.ok) {
      let sparqlResp = await resp.json()
      sparqlResp.results.bindings.forEach(rec => {
        let qid = rec.item.value.split('/').pop()
        let _entityData = window.entityData[qid]
        if (!_entityData) {
          _entityData = {id: qid, label: rec.label.value}
          if (rec.description) _entityData.description = rec.description.value
          if (rec.alias) {
            _entityData.aliases = [rec.alias.value]
            if (window.customEntityAliases[qid]) _entityData.aliases = [...window.customEntityAliases[qid], ..._entityData.aliases]
          }
          if (rec.coords) _entityData.coords = rec.coords.value.slice(6,-1).split(' ').reverse().join(',')
          if (rec.wikipedia) _entityData.wikipedia = rec.wikipedia.value
          if (rec.pageBanner) _entityData.pageBanner = rec.pageBanner.value
          if (rec.image) {
            _entityData.image = rec.image.value
            _entityData.thumbnail = mwImage(rec.image.value, 300)
          }
          if (rec.logoImage) {
            _entityData.logoImage = rec.logoImage.value
            if (!_entityData.thumbnail) _entityData.thumbnail = mwImage(rec.logoImage.value, 300)
          }
          if (rec.whosOnFirst) _entityData.geojson = whosOnFirstUrl(rec.whosOnFirst.value)
          window.entityData[qid] = _entityData
        } else {
          if (rec.alias) _entityData.aliases.push(rec.alias.value)
        }
      })
      // return entityData
      Array.from(toGet).forEach(qid => window.pendingEntityData.delete(qid))
      return Object.fromEntries(qids.filter(qid => window.entityData[qid]).map(qid => [qid,window.entityData[qid]]))
    }
  }
  // return entityData
  return Object.fromEntries(qids.filter(qid => window.entityData[qid]).map(qid => [qid,window.entityData[qid]]))
}

function readMoreSetup() {
const ps = document.querySelectorAll('.read-more p')
const observer = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.classList[entry.target.scrollHeight > (entry.contentRect.height + 10) ? 'add' : 'remove']('truncated')
  }
})
ps.forEach(p => observer.observe(p))
}

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display: block;
    width: 100%;
  }

/* From https://github.com/sindresorhus/github-markdown-css */

/*light*/

.markdown-body {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  margin: 0;
  color: #1F2328;
  background-color: #ffffff;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body .octicon {
  display: inline-block;
  fill: currentColor;
  vertical-align: text-bottom;
}

.markdown-body h1:hover .anchor .octicon-link:before,
.markdown-body h2:hover .anchor .octicon-link:before,
.markdown-body h3:hover .anchor .octicon-link:before,
.markdown-body h4:hover .anchor .octicon-link:before,
.markdown-body h5:hover .anchor .octicon-link:before,
.markdown-body h6:hover .anchor .octicon-link:before {
  width: 16px;
  height: 16px;
  content: ' ';
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}

.markdown-body details,
.markdown-body figcaption,
.markdown-body figure {
  display: block;
}

.markdown-body summary {
  display: list-item;
}

.markdown-body [hidden] {
  display: none !important;
}

.markdown-body a {
  background-color: transparent;
  color: #0969da;
  text-decoration: none;
}

.markdown-body abbr[title] {
  border-bottom: none;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

.markdown-body b,
.markdown-body strong {
  font-weight: 600;
}

.markdown-body dfn {
  font-style: italic;
}

.markdown-body h1 {
  margin: .67em 0;
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid hsla(210,18%,87%,1);
}

.markdown-body mark {
  background-color: #fff8c5;
  color: #1F2328;
}

.markdown-body small {
  font-size: 90%;
}

.markdown-body sub,
.markdown-body sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

.markdown-body sub {
  bottom: -0.25em;
}

.markdown-body sup {
  top: -0.5em;
}

.markdown-body img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
  background-color: #ffffff;
}

.markdown-body code,
.markdown-body kbd,
.markdown-body pre,
.markdown-body samp {
  font-family: monospace;
  font-size: 1em;
}

.markdown-body figure {
  margin: 1em 40px;
}

.markdown-body hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid hsla(210,18%,87%,1);
  height: .25em;
  padding: 0;
  margin: 24px 0;
  background-color: #d0d7de;
  border: 0;
}

.markdown-body input {
  font: inherit;
  margin: 0;
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.markdown-body [type=button],
.markdown-body [type=reset],
.markdown-body [type=submit] {
  -webkit-appearance: button;
  appearance: button;
}

.markdown-body [type=checkbox],
.markdown-body [type=radio] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-body [type=number]::-webkit-inner-spin-button,
.markdown-body [type=number]::-webkit-outer-spin-button {
  height: auto;
}

.markdown-body [type=search]::-webkit-search-cancel-button,
.markdown-body [type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.markdown-body ::-webkit-input-placeholder {
  color: inherit;
  opacity: .54;
}

.markdown-body ::-webkit-file-upload-button {
  -webkit-appearance: button;
  appearance: button;
  font: inherit;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body ::placeholder {
  color: #6e7781;
  opacity: 1;
}

.markdown-body hr::before {
  display: table;
  content: "";
}

.markdown-body hr::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-body td,
.markdown-body th {
  padding: 0;
}

.markdown-body details summary {
  cursor: pointer;
}

.markdown-body details:not([open])>*:not(summary) {
  display: none !important;
}

.markdown-body a:focus,
.markdown-body [role=button]:focus,
.markdown-body input[type=radio]:focus,
.markdown-body input[type=checkbox]:focus {
  outline: 2px solid #0969da;
  outline-offset: -2px;
  box-shadow: none;
}

.markdown-body a:focus:not(:focus-visible),
.markdown-body [role=button]:focus:not(:focus-visible),
.markdown-body input[type=radio]:focus:not(:focus-visible),
.markdown-body input[type=checkbox]:focus:not(:focus-visible) {
  outline: solid 1px transparent;
}

.markdown-body a:focus-visible,
.markdown-body [role=button]:focus-visible,
.markdown-body input[type=radio]:focus-visible,
.markdown-body input[type=checkbox]:focus-visible {
  outline: 2px solid #0969da;
  outline-offset: -2px;
  box-shadow: none;
}

.markdown-body a:not([class]):focus,
.markdown-body a:not([class]):focus-visible,
.markdown-body input[type=radio]:focus,
.markdown-body input[type=radio]:focus-visible,
.markdown-body input[type=checkbox]:focus,
.markdown-body input[type=checkbox]:focus-visible {
  outline-offset: 0;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  line-height: 10px;
  color: #1F2328;
  vertical-align: middle;
  background-color: #f6f8fa;
  border: solid 1px rgba(175,184,193,0.2);
  border-bottom-color: rgba(175,184,193,0.2);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 rgba(175,184,193,0.2);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h2 {
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 1.5em;
  border-bottom: 1px solid hsla(210,18%,87%,1);
}

.markdown-body h3 {
  font-weight: 600;
  font-size: 1.25em;
}

.markdown-body h4 {
  font-weight: 600;
  font-size: 1em;
}

.markdown-body h5 {
  font-weight: 600;
  font-size: .875em;
}

.markdown-body h6 {
  font-weight: 600;
  font-size: .85em;
  color: #656d76;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #656d76;
  border-left: .25em solid #d0d7de;
}

.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

.markdown-body ol ol,
.markdown-body ul ol {
  list-style-type: lower-roman;
}

.markdown-body ul ul ol,
.markdown-body ul ol ol,
.markdown-body ol ul ol,
.markdown-body ol ol ol {
  list-style-type: lower-alpha;
}

.markdown-body dd {
  margin-left: 0;
}

.markdown-body tt,
.markdown-body code,
.markdown-body samp {
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
  word-wrap: normal;
}

.markdown-body .octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}

.markdown-body input::-webkit-outer-spin-button,
.markdown-body input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
}

.markdown-body .mr-2 {
  margin-right: 8px !important;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body>*:first-child {
  margin-top: 0 !important;
}

.markdown-body>*:last-child {
  margin-bottom: 0 !important;
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-body .absent {
  color: #d1242f;
}

.markdown-body .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}

.markdown-body .anchor:focus {
  outline: none;
}

.markdown-body p,
.markdown-body blockquote,
.markdown-body ul,
.markdown-body ol,
.markdown-body dl,
.markdown-body table,
.markdown-body pre,
.markdown-body details {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body blockquote>:first-child {
  margin-top: 0;
}

.markdown-body blockquote>:last-child {
  margin-bottom: 0;
}

.markdown-body h1 .octicon-link,
.markdown-body h2 .octicon-link,
.markdown-body h3 .octicon-link,
.markdown-body h4 .octicon-link,
.markdown-body h5 .octicon-link,
.markdown-body h6 .octicon-link {
  color: #1F2328;
  vertical-align: middle;
  visibility: hidden;
}

.markdown-body h1:hover .anchor,
.markdown-body h2:hover .anchor,
.markdown-body h3:hover .anchor,
.markdown-body h4:hover .anchor,
.markdown-body h5:hover .anchor,
.markdown-body h6:hover .anchor {
  text-decoration: none;
}

.markdown-body h1:hover .anchor .octicon-link,
.markdown-body h2:hover .anchor .octicon-link,
.markdown-body h3:hover .anchor .octicon-link,
.markdown-body h4:hover .anchor .octicon-link,
.markdown-body h5:hover .anchor .octicon-link,
.markdown-body h6:hover .anchor .octicon-link {
  visibility: visible;
}

.markdown-body h1 tt,
.markdown-body h1 code,
.markdown-body h2 tt,
.markdown-body h2 code,
.markdown-body h3 tt,
.markdown-body h3 code,
.markdown-body h4 tt,
.markdown-body h4 code,
.markdown-body h5 tt,
.markdown-body h5 code,
.markdown-body h6 tt,
.markdown-body h6 code {
  padding: 0 .2em;
  font-size: inherit;
}

.markdown-body summary h1,
.markdown-body summary h2,
.markdown-body summary h3,
.markdown-body summary h4,
.markdown-body summary h5,
.markdown-body summary h6 {
  display: inline-block;
}

.markdown-body summary h1 .anchor,
.markdown-body summary h2 .anchor,
.markdown-body summary h3 .anchor,
.markdown-body summary h4 .anchor,
.markdown-body summary h5 .anchor,
.markdown-body summary h6 .anchor {
  margin-left: -40px;
}

.markdown-body summary h1,
.markdown-body summary h2 {
  padding-bottom: 0;
  border-bottom: 0;
}

.markdown-body ul.no-list,
.markdown-body ol.no-list {
  padding: 0;
  list-style-type: none;
}

.markdown-body ol[type="a s"] {
  list-style-type: lower-alpha;
}

.markdown-body ol[type="A s"] {
  list-style-type: upper-alpha;
}

.markdown-body ol[type="i s"] {
  list-style-type: lower-roman;
}

.markdown-body ol[type="I s"] {
  list-style-type: upper-roman;
}

.markdown-body ol[type="1"] {
  list-style-type: decimal;
}

.markdown-body div>ol:not([type]) {
  list-style-type: decimal;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li>p {
  margin-top: 16px;
}

.markdown-body li+li {
  margin-top: .25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #d0d7de;
}

.markdown-body table td>:last-child {
  margin-bottom: 0;
}

.markdown-body table tr {
  background-color: #ffffff;
  border-top: 1px solid hsla(210,18%,87%,1);
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body table img {
  background-color: transparent;
}

.markdown-body img[align=right] {
  padding-left: 20px;
}

.markdown-body img[align=left] {
  padding-right: 20px;
}

.markdown-body .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

.markdown-body span.frame {
  display: block;
  overflow: hidden;
}

.markdown-body span.frame>span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid #d0d7de;
}

.markdown-body span.frame span img {
  display: block;
  float: left;
}

.markdown-body span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: #1F2328;
}

.markdown-body span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-center>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center;
}

.markdown-body span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

.markdown-body span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-right>span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body span.align-right span img {
  margin: 0;
  text-align: right;
}

.markdown-body span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden;
}

.markdown-body span.float-left span {
  margin: 13px 0 0;
}

.markdown-body span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden;
}

.markdown-body span.float-right>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body code,
.markdown-body tt {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  white-space: break-spaces;
  background-color: rgba(175,184,193,0.2);
  border-radius: 6px;
}

.markdown-body code br,
.markdown-body tt br {
  display: none;
}

.markdown-body del code {
  text-decoration: inherit;
}

.markdown-body samp {
  font-size: 85%;
}

.markdown-body pre code {
  font-size: 100%;
}

.markdown-body pre>code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 16px;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  color: #1F2328;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body pre code,
.markdown-body pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body .csv-data td,
.markdown-body .csv-data th {
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
}

.markdown-body .csv-data .blob-num {
  padding: 10px 8px 9px;
  text-align: right;
  background: #ffffff;
  border: 0;
}

.markdown-body .csv-data tr {
  border-top: 0;
}

.markdown-body .csv-data th {
  font-weight: 600;
  background: #f6f8fa;
  border-top: 0;
}

.markdown-body [data-footnote-ref]::before {
  content: "[";
}

.markdown-body [data-footnote-ref]::after {
  content: "]";
}

.markdown-body .footnotes {
  font-size: 12px;
  color: #656d76;
  border-top: 1px solid #d0d7de;
}

.markdown-body .footnotes ol {
  padding-left: 16px;
}

.markdown-body .footnotes ol ul {
  display: inline-block;
  padding-left: 16px;
  margin-top: 16px;
}

.markdown-body .footnotes li {
  position: relative;
}

.markdown-body .footnotes li:target::before {
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -24px;
  pointer-events: none;
  content: "";
  border: 2px solid #0969da;
  border-radius: 6px;
}

.markdown-body .footnotes li:target {
  color: #1F2328;
}

.markdown-body .footnotes .data-footnote-backref g-emoji {
  font-family: monospace;
}

.markdown-body .pl-c {
  color: #57606a;
}

.markdown-body .pl-c1,
.markdown-body .pl-s .pl-v {
  color: #0550ae;
}

.markdown-body .pl-e,
.markdown-body .pl-en {
  color: #6639ba;
}

.markdown-body .pl-smi,
.markdown-body .pl-s .pl-s1 {
  color: #24292f;
}

.markdown-body .pl-ent {
  color: #116329;
}

.markdown-body .pl-k {
  color: #cf222e;
}

.markdown-body .pl-s,
.markdown-body .pl-pds,
.markdown-body .pl-s .pl-pse .pl-s1,
.markdown-body .pl-sr,
.markdown-body .pl-sr .pl-cce,
.markdown-body .pl-sr .pl-sre,
.markdown-body .pl-sr .pl-sra {
  color: #0a3069;
}

.markdown-body .pl-v,
.markdown-body .pl-smw {
  color: #953800;
}

.markdown-body .pl-bu {
  color: #82071e;
}

.markdown-body .pl-ii {
  color: #f6f8fa;
  background-color: #82071e;
}

.markdown-body .pl-c2 {
  color: #f6f8fa;
  background-color: #cf222e;
}

.markdown-body .pl-sr .pl-cce {
  font-weight: bold;
  color: #116329;
}

.markdown-body .pl-ml {
  color: #3b2300;
}

.markdown-body .pl-mh,
.markdown-body .pl-mh .pl-en,
.markdown-body .pl-ms {
  font-weight: bold;
  color: #0550ae;
}

.markdown-body .pl-mi {
  font-style: italic;
  color: #24292f;
}

.markdown-body .pl-mb {
  font-weight: bold;
  color: #24292f;
}

.markdown-body .pl-md {
  color: #82071e;
  background-color: #ffebe9;
}

.markdown-body .pl-mi1 {
  color: #116329;
  background-color: #dafbe1;
}

.markdown-body .pl-mc {
  color: #953800;
  background-color: #ffd8b5;
}

.markdown-body .pl-mi2 {
  color: #eaeef2;
  background-color: #0550ae;
}

.markdown-body .pl-mdr {
  font-weight: bold;
  color: #8250df;
}

.markdown-body .pl-ba {
  color: #57606a;
}

.markdown-body .pl-sg {
  color: #8c959f;
}

.markdown-body .pl-corl {
  text-decoration: underline;
  color: #0a3069;
}

.markdown-body g-emoji {
  display: inline-block;
  min-width: 1ch;
  font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 1em;
  font-style: normal !important;
  font-weight: 400;
  line-height: 1;
  vertical-align: -0.075em;
}

.markdown-body g-emoji img {
  width: 1em;
  height: 1em;
}

.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item label {
  font-weight: 400;
}

.markdown-body .task-list-item.enabled label {
  cursor: pointer;
}

.markdown-body .task-list-item+.task-list-item {
  margin-top: 4px;
}

.markdown-body .task-list-item .handle {
  display: none;
}

.markdown-body .task-list-item-checkbox {
  margin: 0 .2em .25em -1.4em;
  vertical-align: middle;
}

.markdown-body .contains-task-list:dir(rtl) .task-list-item-checkbox {
  margin: 0 -1.6em .25em .2em;
}

.markdown-body .contains-task-list {
  position: relative;
}

.markdown-body .contains-task-list:hover .task-list-item-convert-container,
.markdown-body .contains-task-list:focus-within .task-list-item-convert-container {
  display: block;
  width: auto;
  height: 24px;
  overflow: visible;
  clip: auto;
}

.markdown-body ::-webkit-calendar-picker-indicator {
  filter: invert(50%);
}

.markdown-body .markdown-alert {
  padding: 8px 16px;
  margin-bottom: 16px;
  color: inherit;
  border-left: .25em solid #d0d7de;
}

.markdown-body .markdown-alert>:first-child {
  margin-top: 0;
}

.markdown-body .markdown-alert>:last-child {
  margin-bottom: 0;
}

.markdown-body .markdown-alert .markdown-alert-title {
  display: flex;
  font-weight: 500;
  align-items: center;
  line-height: 1;
}

.markdown-body .markdown-alert.markdown-alert-note {
  border-left-color: #0969da;
}

.markdown-body .markdown-alert.markdown-alert-note .markdown-alert-title {
  color: #0969da;
}

.markdown-body .markdown-alert.markdown-alert-important {
  border-left-color: #8250df;
}

.markdown-body .markdown-alert.markdown-alert-important .markdown-alert-title {
  color: #8250df;
}

.markdown-body .markdown-alert.markdown-alert-warning {
  border-left-color: #9a6700;
}

.markdown-body .markdown-alert.markdown-alert-warning .markdown-alert-title {
  color: #9a6700;
}

.markdown-body .markdown-alert.markdown-alert-tip {
  border-left-color: #1f883d;
}

.markdown-body .markdown-alert.markdown-alert-tip .markdown-alert-title {
  color: #1a7f37;
}

.markdown-body .markdown-alert.markdown-alert-caution {
  border-left-color: #cf222e;
}

.markdown-body .markdown-alert.markdown-alert-caution .markdown-alert-title {
  color: #d1242f;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

* { margin: 0; }

@keyframes fadeInAnimation {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

article {
  font-family: Roboto, sans-serif;
  animation: fadeInAnimation ease .3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.page-content {
  width: min(1200px, 100% - 4rem);
  margin-inline: auto;
  background-color: #fff;
}

.page-content > * + * {
  margin-top: 1em;
}

.page-content h1,
.page-content h2 {
  border-bottom: none;
  padding-bottom: 0;
}

.page-content li > p {
  margin: 0;
}

/*********** mobile ***********/

@media only screen and (max-width: 768px) {
  
  .page-content {
    font-size: 1em;
    width: calc(100% - 2em);
  }

  mdp-header {
    width: 100%;
  }

}

/*********** end mobile ***********/

section {
  position: relative;
  clear: both;
  margin-block-start: 0;
  margin-block-end: 0;
  background-color: inherit;
  /* z-index: 0; */
}

.flow-root section {
  display: flow-root;
}

/* reduce heading margins to compensate for spacing added by section display:flow-root */
.flow-root section h1,
.flow-root section h2,
.flow-root section h3,
.flow-root section h4,
.flow-root section h5,
.flow-root section h6 {
  margin-top: 12px; 
  margin-bottom: 12px;
}

mdp-footer ul,
mdp-header ul,
mdp-image ul,
mdp-map ul,
mdp-menu ul,
mdp-navbar ul {
  display: none;
}

mdp-image,
mdp-map {
  margin-bottom: 2em;
}

mdp-image img {
  max-width: 100%;
  height: auto;
}

mdp-entity-infobox {
  position: relative;
  /* z-index: 10; */
  border-bottom: 1px solid #ccc;
}

mdp-header {
  /* z-index: 10; */
  margin-bottom: 1em;
}

.columns { /* multiple columns */
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
}

.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  background-color: inherit;
  z-index: 1;
}

.hide {
  display: none;
}

mdp-footer.sticky {
  bottom: 0;
}

@media only screen and (min-width: 768px) {

  .left {
    float: left;
    padding-right: 1em;
  }

  .right {
    float: right;
    padding-left: 1em;
  }

  .left, .right {
    width: 50%;
    margin-bottom: 1em;
  }

}

  
p audio {
  width: 250px;
  height: 24px;
  vertical-align: middle;
}

.showactive .active {
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

section#references {
  margin-top: 2em;
}

section#references h1 {
  font-size: 1.5em;
}

section#references P {
  font-size: 1em;
  margin-bottom: 0.7em;
}

a.flyto, mark.flyto,
a.play, mark.play,
a.qid, mark.qid,
a.zoom, mark.zoom,
mdp-entity-infobox {
  cursor: pointer;
  background: unset;
  border-bottom: 1px solid #ccc;
  color: #444;
}

a.flyto:hover, mark.flyto:hover,
a.play:hover, mark.play:hover,
a.qid:hover, mark.qid:hover,
a.zoom:hover mark.zoom:hover,
mdp-entity-infobox:hover {
    border-bottom: 2px solid #444;
    background: #eee;
}

a.flyto::after, mark.flyto::after, 
a.play::after, mark.play::after, 
a.qid::after, mark.qid::after, 
a.zoom::after, mark.zoom::after,
mdp-entity-infobox::after {
  /* color: #aaa; */
  font-size: 50%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
  top: -.5em;
  padding-left: 2px;
  padding-right: 4px;
}

a.flyto::after, mark.flyto::after {
  content: "✈";
  font-size: 120%;
  top: 0;
}

a.play::after, mark.play::after {
  content: "▶";
}

/*
a.qid:after, mark.qid::after, mdp-entity-infobox::after {
  content: "ⓘ";
}
*/

a.zoom::after, mark.zoom::after {
  content: "🔎";
}

p span.headline {
  font-weight: 500;
}

table[id] {
  display: none !important;
}

/*********** resume ***********/

.resume > section:first-of-type { /* header */
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
}

.resume > section:first-of-type > section:nth-of-type(2) { /* contact links */
  display: flex;
  margin-left: auto;
  gap: 1em;
}

.resume > section:first-of-type > section:nth-of-type(2) li {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.resume > section:first-of-type > section:nth-of-type(2) li img {
  height: 24px;
  width: 24px;
}

.resume > section:first-of-type > section:nth-of-type(2) > p > img { /* head shot */
  max-width: 120px;
  height: auto;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

/*********** printing ***********/

@media print {
  mdp-footer { display: none; }

  .pagebreak { break-before: always; }
  
  .keep-together { break-inside: avoid; }

  .page-content {
    font-size: 1rem;
    padding-bottom: 4em !important; 
  }
}

.footnote,
.footnotes {
  font-size: 0.8em;
  /* white-space: pre-wrap; */
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}

/*********** Juncture 1 ***********/

/*
.j1 {
  width: 100%;
  padding: 6px;
}

.j1 section {
  margin: 0;
}

.j1 .segment {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5em;
  margin-bottom: 2em;
}

@media only screen and (min-width: 1200px) {

  .j1 {
    width: unset;
    background: #f8f8f8;
  }
  .j1 mdp-header {
    margin-bottom: 0;
  }

  .j1 .active {
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
  .j1 section {
    margin: 0;
  }

  .j1 > section,
  .j1 > div.segment {
    width: calc(50% - 1em);
    margin: 0.5em 1em;
  }

  .j1 p {
    margin-right: 1em;
    padding: 0.5em;
    font-size: 1.2em;
    line-height: 1.6;
    border-radius: 8px;
    border: 1px solid #f8f8f8;
  }

  .j1 .segment {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr ;
    margin-bottom: 0;
  }

  .j1 .viewers {
    display: none;
    height: 100%;
  }

  .j1 p.active {
    background-color: #ffffff;
    box-shadow: 0 0 3px 1px rgb(0 0 0 / 25%);
    border-radius: 8px;
    border: 1px solid #9e9e9e;
  }

  .j1 p.active + .viewers {
    display: block;
    position: fixed;
    left: 50%;
    bottom: 0;
    width: 50%;
    border: 1px solid #ccc;
    background-color: white;
  }

}
*/

article.j1 {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    'header'
    'main'
    'footer';;
}

article.j1 > * {
  width: 100%;
}

.j1 mdp-header {
  grid-area: header;
  position: sticky;
  top: -300px;
  z-index: 10;
  margin-bottom: 0;
}

.j1 main {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 0;
  grid-template-areas: 'content viewers';
  background-color: #f8f8f8 !important;
  font-size: 1.3em !important;
  line-height: 1.6 !important;
  padding: 0.5em;
}

.j1 .content {
  grid-area: content;
}

.j1 .viewers {
  grid-area: viewers;
  display: none;
}

.j1 footer {
  grid-area: footer;
}

.j1 .segment {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin: 1em 0;
}

.j1 .segment > mdp-j1-viewers {      
  width: 100%;
  align-self: center;
}

.j1 .segment > p {
  margin: 0;
  padding: 0;
  border-radius: 8px;
  border: 1px solid #f8f8f8;
}

.j1 .sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
}

.j1 .footnote div, .j1 .footnotes div {
  white-space: unset
}
.j1 .footnote li > p, .j1 .footnotes li > p {
  margin: 0;
  background-color: inherit;
  border-color: inherit;
  box-shadow: none;
}

.j1 .content > section:first-of-type > h1,
.j1 .content > section:first-of-type > h2,
.j1 .content > section:first-of-type > h3 {
  margin-top: 0;
}

@media (min-width: 800px) { /* wide screens */
  
  .j1 main {
    grid-template-columns: 1fr 1fr;
    padding: 1em;
  }

  .j1 .content {
    padding-right: 1em;
    margin-bottom: 80dvh;
  }
  
  .j1 p.active {
    background-color: #ffffff;
    box-shadow: 0 0 3px 1px rgb(0 0 0 / 25%);
    border-color: #9e9e9e;      
  }

  .j1 .segment {
    margin: 0;
  }

  .j1 .segment > p {
    padding: 0.5em;
  }

  .j1 .segment > mdp-j1-viewers {
    display: none;
  }

  .j1 .viewers {
    grid-area: viewers;
    display: block;
    border: 1px solid green;
    height: calc(100dvh - 100px);
    margin-top: 0;
  }

}

</style>


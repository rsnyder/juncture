import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import 'https://cdn.jsdelivr.net/npm/marked-footnote/dist/index.umd.min.js'
import * as yaml from 'https://cdn.jsdelivr.net/npm/yaml@2.3.4/browser/index.min.js'

const mode = location.hostname === 'localhost' || location.pathname === '/editor' ? 'dev' : 'prod'

/* md5 function from https://stackoverflow.com/questions/14733374/how-to-generate-an-md5-file-hash-in-javascript */
function md5cycle(f,h){var i=f[0],n=f[1],r=f[2],g=f[3];i=ff(i,n,r,g,h[0],7,-680876936),g=ff(g,i,n,r,h[1],12,-389564586),r=ff(r,g,i,n,h[2],17,606105819),n=ff(n,r,g,i,h[3],22,-1044525330),i=ff(i,n,r,g,h[4],7,-176418897),g=ff(g,i,n,r,h[5],12,1200080426),r=ff(r,g,i,n,h[6],17,-1473231341),n=ff(n,r,g,i,h[7],22,-45705983),i=ff(i,n,r,g,h[8],7,1770035416),g=ff(g,i,n,r,h[9],12,-1958414417),r=ff(r,g,i,n,h[10],17,-42063),n=ff(n,r,g,i,h[11],22,-1990404162),i=ff(i,n,r,g,h[12],7,1804603682),g=ff(g,i,n,r,h[13],12,-40341101),r=ff(r,g,i,n,h[14],17,-1502002290),i=gg(i,n=ff(n,r,g,i,h[15],22,1236535329),r,g,h[1],5,-165796510),g=gg(g,i,n,r,h[6],9,-1069501632),r=gg(r,g,i,n,h[11],14,643717713),n=gg(n,r,g,i,h[0],20,-373897302),i=gg(i,n,r,g,h[5],5,-701558691),g=gg(g,i,n,r,h[10],9,38016083),r=gg(r,g,i,n,h[15],14,-660478335),n=gg(n,r,g,i,h[4],20,-405537848),i=gg(i,n,r,g,h[9],5,568446438),g=gg(g,i,n,r,h[14],9,-1019803690),r=gg(r,g,i,n,h[3],14,-187363961),n=gg(n,r,g,i,h[8],20,1163531501),i=gg(i,n,r,g,h[13],5,-1444681467),g=gg(g,i,n,r,h[2],9,-51403784),r=gg(r,g,i,n,h[7],14,1735328473),i=hh(i,n=gg(n,r,g,i,h[12],20,-1926607734),r,g,h[5],4,-378558),g=hh(g,i,n,r,h[8],11,-2022574463),r=hh(r,g,i,n,h[11],16,1839030562),n=hh(n,r,g,i,h[14],23,-35309556),i=hh(i,n,r,g,h[1],4,-1530992060),g=hh(g,i,n,r,h[4],11,1272893353),r=hh(r,g,i,n,h[7],16,-155497632),n=hh(n,r,g,i,h[10],23,-1094730640),i=hh(i,n,r,g,h[13],4,681279174),g=hh(g,i,n,r,h[0],11,-358537222),r=hh(r,g,i,n,h[3],16,-722521979),n=hh(n,r,g,i,h[6],23,76029189),i=hh(i,n,r,g,h[9],4,-640364487),g=hh(g,i,n,r,h[12],11,-421815835),r=hh(r,g,i,n,h[15],16,530742520),i=ii(i,n=hh(n,r,g,i,h[2],23,-995338651),r,g,h[0],6,-198630844),g=ii(g,i,n,r,h[7],10,1126891415),r=ii(r,g,i,n,h[14],15,-1416354905),n=ii(n,r,g,i,h[5],21,-57434055),i=ii(i,n,r,g,h[12],6,1700485571),g=ii(g,i,n,r,h[3],10,-1894986606),r=ii(r,g,i,n,h[10],15,-1051523),n=ii(n,r,g,i,h[1],21,-2054922799),i=ii(i,n,r,g,h[8],6,1873313359),g=ii(g,i,n,r,h[15],10,-30611744),r=ii(r,g,i,n,h[6],15,-1560198380),n=ii(n,r,g,i,h[13],21,1309151649),i=ii(i,n,r,g,h[4],6,-145523070),g=ii(g,i,n,r,h[11],10,-1120210379),r=ii(r,g,i,n,h[2],15,718787259),n=ii(n,r,g,i,h[9],21,-343485551),f[0]=add32(i,f[0]),f[1]=add32(n,f[1]),f[2]=add32(r,f[2]),f[3]=add32(g,f[3])}function cmn(f,h,i,n,r,g){return h=add32(add32(h,f),add32(n,g)),add32(h<<r|h>>>32-r,i)}function ff(f,h,i,n,r,g,t){return cmn(h&i|~h&n,f,h,r,g,t)}function gg(f,h,i,n,r,g,t){return cmn(h&n|i&~n,f,h,r,g,t)}function hh(f,h,i,n,r,g,t){return cmn(h^i^n,f,h,r,g,t)}function ii(f,h,i,n,r,g,t){return cmn(i^(h|~n),f,h,r,g,t)}function md51(f){var txt="";var h,i=f.length,n=[1732584193,-271733879,-1732584194,271733878];for(h=64;h<=f.length;h+=64)md5cycle(n,md5blk(f.substring(h-64,h)));f=f.substring(h-64);var r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(h=0;h<f.length;h++)r[h>>2]|=f.charCodeAt(h)<<(h%4<<3);if(r[h>>2]|=128<<(h%4<<3),h>55)for(md5cycle(n,r),h=0;h<16;h++)r[h]=0;return r[14]=8*i,md5cycle(n,r),n}function md5blk(f){var h,i=[];for(h=0;h<64;h+=4)i[h>>2]=f.charCodeAt(h)+(f.charCodeAt(h+1)<<8)+(f.charCodeAt(h+2)<<16)+(f.charCodeAt(h+3)<<24);return i}var hex_chr="0123456789abcdef".split("");function rhex(f){for(var h="",i=0;i<4;i++)h+=hex_chr[f>>8*i+4&15]+hex_chr[f>>8*i&15];return h}function hex(f){for(var h=0;h<f.length;h++)f[h]=rhex(f[h]);return f.join("")}function md5(f){return hex(md51(f))}function add32(f,h){return f+h&4294967295}

function camelToKebab(input) { return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}
function isNumeric(arg) { return !isNaN(arg) }
function hasTimestamp(s) { return /\d{1,2}:\d{1,2}/.test(s) }

const isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent) )

function ghSourceFromLocation() {
  // console.log(location)
  let parsed = new URL(location.href)
  return parsed.searchParams.get('source') || parsed.searchParams.get('src')
}

/*
async function getMarkdown(ghSource) {
  let [owner, repo, branch, ...path] = ghSource.split('/').filter(pe => pe)
  let extension = ghSource.slice(-3)
  console.log(`getMarkdown: ghSource=${ghSource} owner=${owner} repo=${repo} branch=${branch} path=${path} extension=${extension}`)
  if (extension === '.md') {
    return await fetch(`https://raw.githubusercontent.com/${ghSource}`).then(response => response.text())
  } else {
    return await Promise.all([
      fetch(`https://raw.githubusercontent.com/${ghSource}.md`),
      fetch(`https://raw.githubusercontent.com/${ghSource}/README.md`),
      fetch(`https://raw.githubusercontent.com/${ghSource}/index.md`)
    ]).then(resp => resp.find(r => r.ok)?.text())
  }
}
*/

async function getMarkdown(ghSource) {
  let [owner, repo, branch, ...path] = ghSource.split('/').filter(pe => pe)
  path = path.join('/')
  let extension = ghSource.slice(-3)
  // console.log(`getMarkdown: ghSource=${ghSource} owner=${owner} repo=${repo} branch=${branch} path=${path} extension=${extension}`)
  if (extension === '.md') {
    let resp = await getGhFile(owner, repo, branch, path)
    return resp.content
  } else {
    return await Promise.all([
      getGhFile(owner, repo, branch, `${path}.md`),
      getGhFile(owner, repo, branch, `${path}/README.md`),
      getGhFile(owner, repo, branch, `${path}/index.md`)
    ]).then(resp => { 
      let found = resp.find(r => r?.status === 200)
      return found?.content || ''
    })
  }
}

async function getGhFile(acct, repo, branch, path) {
  // console.log(`getFile: acct=${acct} repo=${repo} branch=${branch} path=${path}`)
  let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}?ref=${branch}`
  let resp = await fetch(url, {cache: 'no-cache'})
  if (resp.ok) {
    let payload = await resp.json()
    let content = decodeURIComponent(escape(atob(payload.content)))
    return {status: resp.status, content}
  } else if (resp.status === 403 || resp.status === 401) { // access problem, possibly api rate limit exceeded
    url = `https://raw.githubusercontent.com/${acct}/${repo}/${branch}/${path}`
    resp = await fetch(url)
    if (resp.ok) {
      let content = await resp.text()
      return {status: resp.status, content}
    } else {
      return {status: resp.status, content: null}
    }
  } else {
    return {status: resp.status, content: null}
  }
}
// return Promise.resolve({content, sha: resp.sha})

function markdownToHtml(markdown) {
  return marked.use(window.markedFootnote()).parse(markdown)
}

async function getHtml(ghSource) {
  // console.log(`getHtml: owner=${owner} repo=${repo} branch=${branch} path=${path.join('/')}`)
  return markdownToHtml(await getMarkdown(ghSource))
}

function computeDataId(el) {
  let dataId = []
  while (el.parentElement) {
    let siblings = Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName)
    dataId.push(siblings.indexOf(el) + 1)
    el = el.parentElement
  }
  return dataId.reverse().join('.')
}

const components = {
  juncture3: {
    've-audio': {
      booleans: new Set(['autoplay', 'muted', 'no-caption', 'sync']),
      class: new Set(),
      positional: ['src', 'caption'],
      ignore: new Set()
    },
    've-entities': {
      booleans: new Set(['cards']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-gallery': {
      booleans: new Set(['caption']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-header': {
      booleans: new Set(['breadcrumbs', 'pdf-download-enabled']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-iframe': {
      booleans: new Set(['allow-full-screen', 'allow-transparency', 'full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-image': {
      booleans: new Set(['no-caption', 'zoom-on-scroll']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-knightlab-timeline': {
      booleans: new Set(['has-bookmark']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-menu': {
      booleans: new Set(['pdf-download-enabled']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-plant-specimen': {
      booleans: new Set(['full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-video': {
      booleans: new Set(['autoplay', 'muted', 'no-caption', 'sync']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
  },
  juncture2: {
    've-card': {
      booleans: new Set([]),
      class: new Set(),
      positional: ['label', 'image', 'href', 'description'],
      ignore: new Set()
    },
    've-header': {
      booleans: new Set([]),
      class: new Set(),
      positional: ['label', 'background', 'subtitle', 'options', 'position'],
      ignore: new Set()
    },
    've-entities': {
      booleans: new Set(['full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-footer': {
      booleans: new Set(['sticky']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-iframe': {
      booleans: new Set(['allow', 'allowfullscreen', 'full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: ['src'],
      ignore: new Set()
    },
    've-image': {
      booleans: new Set(['cards', 'compare', 'curtain', 'full', 'grid', 'left', 'right', 'sticky', 'sync', 'zoom-on-scroll']),
      class: new Set(),
      positional: ['src', 'options', 'seq', 'fit'],
      ignore: new Set()
    },
    've-map': {
      booleans: new Set(['cards', 'full', 'left', 'marker', 'prefer-geojson', 'popup-on-hover', 'right', 'sticky', 'zoom-on-scroll', 'zoom-on-click']),
      class: new Set(),
      positional: ['center', 'zoom', 'overlay'],
      ignore: new Set()
    },
    've-media': {
      booleans: new Set(['autoplay', 'cards', 'compare', 'full', 'grid', 'left', 'muted', 'no-caption', 'no-info-icon', 'right', 'small', 'static', 'sticky']),
      class: new Set(),
      positional: ['src'],
      ignore: new Set()
    },
    've-mermaid': {
      booleans: new Set(['full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-meta': {
      booleans: new Set([]),
      class: new Set(),
      positional: ['title', 'description'],
      ignore: new Set()
    },
    've-plant-specimen': {
      booleans: new Set(['full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: ['qid', 'max'],
      ignore: new Set()
    },
    've-spacer': {
      booleans: new Set([]),
      class: new Set(),
      positional: [],
      ignore: new Set()
    },
    've-style': {
      booleans: new Set([]),
      class: new Set(),
      positional: ['src'],
      ignore: new Set()
    },
    've-video': {
      booleans: new Set(['full', 'left', 'right', 'sticky']),
      class: new Set(),
      positional: ['src', 'caption'],
      ignore: new Set()
    }
  }
}
function parseHeadline(s, codeLang) {
  let tokens = []
  s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
  s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
    if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
    else tokens.push(token)
  })
  // console.log(tokens)
  let parsed = {}
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
    else if (token[0] === '.') {
      let key = 'class'
      let value = token.slice(1)
      value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
      if (parsed[key]) parsed[key] += ` ${value}`
      else parsed[key] = value
    }
    else if (token[0] === '"') {
      if (!parsed.args) parsed.args = []
      parsed.args.push(token.slice(1,-1))
    }
    else if (token[0] === '#') parsed['id'] = token.slice(1)
    else if (/^Q\d+$/.test(token) && !parsed.tag) { // entity identifier
      if (!parsed.entities) parsed.entities = []
      parsed.entities.push(token)
    }
    else if (/^\w+-[-\w]*\w+$/.test(token) && !parsed.tag) parsed['tag'] = token
    else if (token === 'script' || token === 'link') parsed['tag'] = token
    else {
      if (parsed.tag === 'script' && !parsed.src) parsed.src = token
      else if (parsed.tag === 'link' && !parsed.href) parsed.href= token
      else {
        if (components[codeLang]?.[parsed.tag] && components[codeLang]?.[parsed.tag].booleans.has(token)) {
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
  if (parsed.tag && components[codeLang]?.[parsed.tag]?.positional && parsed.args) {
    if (!parsed.kwargs) parsed.kwargs = {}
    parsed.args.forEach((value, idx) => {
      let key = components[codeLang][parsed.tag].positional[idx]
      value = value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value
      if (!parsed.kwargs) parsed.kwargs = {}
      if (parsed.kwargs[key]) parsed.kwargs[key] += ` ${value}`
      else parsed.kwargs[key] = value    
    })
    delete parsed.args
  }
  return parsed
}

function parseCodeEl(codeEl, codeLang) {
  let codeElems = codeEl.textContent?.replace(/\s+\|\s+/g,'\n')
    .split('\n')
    .map(l => l.trim())
    .map(l => l.replace(/<em>/g, '_').replace(/<\/em>/g, '_'))
    .filter(x => x) || []
  let parsed = parseHeadline(codeElems?.[0], codeLang) || {}
  if (codeElems.length > 1) parsed.args = parsed.args ? [...parsed.args, ...codeElems.slice(1)] : codeElems.slice(1)
  return parsed
}

function handleCodeEl(rootEl, codeEl) {
  // console.log(codeEl)
  let parentTag = codeEl.parentElement?.tagName || ''
  let previousElTag = codeEl.previousElementSibling?.tagName
  let isInline = false


  if (parentTag === 'P' || 
      parentTag === 'PRE' ||
      parentTag === 'LI' ||
      parentTag === 'TD' ||
      /^H\d/.test(parentTag)) {
    let codeWrapper
    if (previousElTag === 'IMG' || previousElTag === 'A' || previousElTag === 'EM' || previousElTag === 'STRONG') codeWrapper = codeEl
    else if (parentTag === 'P') {
      let paraText = Array.from(codeEl.parentElement?.childNodes || []).map(c => c.nodeValue?.trim()).filter(x => x).join('')
      codeWrapper = paraText ? codeEl : codeEl.parentElement
      isInline = paraText ? true : false
    } 
    else if (parentTag === 'PRE' ) codeWrapper = codeEl.parentElement
    else if (parentTag === 'LI' || parentTag === 'TD') codeWrapper = codeEl
    else if (/^H\d/.test(parentTag)) codeWrapper = codeEl
    else codeWrapper = codeEl.parentElement?.parentElement?.parentElement
  
    if (!codeWrapper) return
    
    let parent = parentTag === 'LI'
      ? codeEl.parentElement?.parentElement
      : codeWrapper.parentElement

    let codeLang = parentTag === 'PRE'
      ? Array.from(codeWrapper.classList).find(cls => cls.indexOf('language') === 0)?.split('-').pop() || 'juncture3'
      : Array.from(codeEl.classList).find(cls => cls.indexOf('language') === 0)?.split('-').pop() || 'juncture3'
        
    if (codeLang === 'mermaid') {
      let newEl = document.createElement('ve-mermaid')
      newEl.textContent = codeEl.textContent
      codeWrapper?.parentElement?.replaceWith(newEl)

    } else if (codeLang.indexOf('juncture') === 0) {
      let parsed = parseCodeEl(codeEl, codeLang)
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
        if (priorEl?.tagName === 'VE--MERMAID') {
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
      }
    }
  }
}

function elFromHtml(html) {
  return new DOMParser().parseFromString(html, 'text/html').querySelector('body')
}

let isJunctureV1 = false

function structureContent(html) {
  let rootEl = html ? elFromHtml(html) : document.querySelector('main')

  let restructured = document.createElement('main')
  
  restructured.className = 'page-content markdown-body'
  restructured.setAttribute('aria-label', 'Content')
  restructured.setAttribute('data-theme', 'light')
  let currentSection = restructured;
  let sectionParam
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
  .filter(p => /^\.ve-\w+\S/.test(p.childNodes.item(0).nodeValue?.trim() || ''))
  .forEach(p => {
    let codeEl = document.createElement('code')
    codeEl.setAttribute('class', 'language-juncture2')
    let replacementText = p.innerHTML.trim().slice(1)
      .replace(/\n\s*-\s+/g, '\n')
      .replace(/<a href="/g, '')
      .replace(/">[^<]*<\/a>/g, '')
    codeEl.textContent = replacementText
    p.textContent = ''
    p.appendChild(codeEl)
  })

  Array.from(rootEl?.querySelectorAll('p, li'))
  .filter(p => /==.+=={.+}/.test(p.textContent?.trim() || ''))
  .forEach(el => {
    let replHtml = []
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
          .filter(child => !/^VE--/.test(child.tagName))
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

      let headings = []
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

  Array.from(restructured.querySelectorAll('a > img'))
  .filter(img => img.src.indexOf('ve-button.png') > -1 || img.src.indexOf('wb.svg') > -1)
  .forEach(viewAsButton => {
    viewAsButton?.parentElement?.parentElement?.remove()
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
    let target = attrs.previousElementSibling
    while (target?.tagName !== 'P') target = target?.previousElementSibling
    let parsed = parseHeadline(attrs.textContent?.trim().slice(1,-1))
    if (parsed.id) target.id = parsed.id
    if (parsed.class) parsed.class.split(' ').forEach(c => target.classList.add(c))
    if (parsed.style) target.setAttribute('style', Object.entries(parsed.style).map(([k,v]) => `${k}:${v}`).join(';'))
    if (parsed.entities) target.setAttribute('data-entities', parsed.entities.join(' '))
    if (parsed.kwargs) for (const [k,v] of Object.entries(parsed.kwargs)) target.setAttribute(k, v === true ? '' : v)
    attrs.remove()
  })

  Array.from(restructured?.querySelectorAll('code'))
  .forEach(codeEl => handleCodeEl(restructured, codeEl))

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
      let mdpEntityInfobox = document.createElement('ve-entity-infobox')
      mdpEntityInfobox.innerHTML = anchorElem.innerHTML
      if (qid) mdpEntityInfobox.setAttribute('qid', qid)
      else {
        let pathIdx = (window.config?.baseurl && link.pathname.indexOf(window.config?.baseurl) === 0) ? 1 : 0
        mdpEntityInfobox.setAttribute('file', path.slice(pathIdx).map(pe => pe.replace(/~/,'')).filter(pe => pe).join('/'))
      }
      anchorElem.replaceWith(mdpEntityInfobox)
    }
  })

  Array.from(restructured.querySelectorAll('span'))
  .filter(span => Array.from(span.attributes).find(attr => /(zoomto|flyto)$/.test(attr.name)))
  .forEach(span => {
    let attr = Array.from(span.attributes).find(attr => /(zoomto|flyto)$/.test(attr.name))
    let [trigger, target, action] = attr.name.split('-').slice(1)
    let value = attr.value
    let link = document.createElement('a')
    link.innerHTML = span.innerHTML
    link.setAttribute('href', `${action}/${trigger}/${value}`)
    span.replaceWith(link)
  })

  let article = document.createElement('article')
  article.className = ''
  let header

  let veConfig = restructured.querySelector('param[ve-config]')
  isJunctureV1 = veConfig ? true : false

  if (isJunctureV1) { // Juncture 1 style essay
    article.classList.add('j1')
    header = document.createElement('ve-header')
    header.className = 'sticky'
    article.appendChild(header)

    Array.from(veConfig?.attributes || []).forEach(attr => {
      if (attr.name === 'banner') header.setAttribute('background', attr.value)
      if (attr.name === 'title') header.setAttribute('title', attr.value)
      if (attr.name === 'subtitle' || attr.name === 'author') header.setAttribute('subtitle', attr.value)
    })
    // veConfig.replaceWith(header)
    if (veConfig) veConfig.remove()


    let mainWrapper = document.createElement('main')
    mainWrapper.className = 'page-content markdown-body'
    let content = document.createElement('div')
    content.className = 'content'
    content.innerHTML = restructured.innerHTML
    let viewers = document.createElement('div')
    viewers.className = 'viewers'
    mainWrapper.appendChild(content)
    mainWrapper.appendChild(viewers)
    article.appendChild(mainWrapper)
  } else {
    header = restructured.querySelector('ve-header')
    if (header) article.appendChild(header)
    article.appendChild(restructured)
  }

  let footer = restructured.querySelector('ve-footer, ve-footer')
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

  article.querySelectorAll('span[eid]').forEach(span => {
    let qid = span.getAttribute('eid')
    let entityInfobox = document.createElement('ve-entity-infobox')
    entityInfobox.innerHTML = span.innerHTML
    entityInfobox.setAttribute('qid', qid)
    span.replaceWith(entityInfobox)
  })

  if (isJunctureV1) {
  
    function serializeProps(props) {
      return Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')
    }

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
      let viewersDiv = document.createElement('div')

      viewersDiv.setAttribute('data-id', id)
      viewersDiv.className = 'viewers'

      let params = []
      let sib = seg.nextSibling
      while (sib && sib.tagName === 'PARAM') {
        params.push(sib)
        sib = sib.nextSibling
      }
      params.forEach(p => viewersDiv.appendChild(p))
      wrapper.appendChild(viewersDiv)

      seg.replaceWith(wrapper)
    })

    Array.from(article.querySelectorAll('[data-id]'))
    .forEach(seg => {
      if (seg.tagName === 'SECTION') return
      let id = seg.getAttribute('data-id') || ''
      let para = seg.querySelector('p')
      let viewersDiv = seg.querySelector('.viewers')
      if (!viewersDiv) return
      
      const params = Array.from(viewersDiv.querySelectorAll(':scope > param'))
        .map((param, idx) => ({ ...Object.fromEntries(Array.from(param.attributes).map(a => [a.name, a.value])), ...{idx} }))
      
      let idx = params.length
      let parent = viewersDiv.parentElement
      while (parent && parent.tagName !== 'ARTICLE') {
        Array.from(parent.querySelectorAll(':scope > param')).forEach(param => {
          params.push({...Object.fromEntries(Array.from(param.attributes).map(a => [a.name, a.value])), ...{idx} })
          idx++
        })
        parent = parent.parentElement
      }

      const veTags = {}
      params.forEach(p => {
        let tag = Object.keys(p).find(k => k.indexOf('ve-') === 0 && !p[k])
        if (!tag) {
          tag = 've-entity'
          p[tag] = ''
        } else if (tag === 've-d3plus-ring-network') {
          tag = 've-visjs'
        }
        if (!veTags[tag]) veTags[tag] = []
        veTags[tag].push(p)
      })

      let entities = []
      Object.values(veTags['ve-entity'] || []).forEach(veEntity => {
        let qid = veEntity.eid || veEntity.qid
        let aliases = veEntity.aliases?.split('|').filter(a => a) || []
        let file = veEntity.file ||veEntity.article
        if (aliases.length || file) {
          if (!window.customEntityData[qid]) window.customEntityData[qid] = {aliases: aliases, file: file}
         }
        entities.push(qid)
      })
      delete veTags['ve-entity']

      para?.setAttribute('data-entities', entities.join(' '))

      function propsList(tagProps) {
        let ul = document.createElement('ul')
        tagProps.forEach(tp => {
          let li = document.createElement('li')
          li.innerHTML = serializeProps(tp)
          ul.appendChild(li)
        })
        return ul
      }

      function setElProps(el, props, nameMap) {
        Object.entries(props)
          .filter(([key, value]) => nameMap[key] !== undefined)
          .forEach(([key, value]) => el.setAttribute(nameMap[key] || key, value === 'false' ? '' : value === 'true' ? null : value))
      }

      function makeViewerEl(tagName, slotName, tagProps) {
        // if (slotName !== 'data') console.log(`makeViewerEL ${slotName} ${Object.keys(tagProps[0] || {})}`)
        let viewerEl = document.createElement(tagName)
        viewerEl.setAttribute('slot', slotName)
        if (slotName === 've-compare') {
          setElProps(viewerEl, tagProps[0], {caption:''})
          viewerEl.appendChild(propsList(tagProps))
        } else if (slotName === 've-iframe') {
          setElProps(viewerEl, tagProps[0], {allow:'', allowfullscreen:'', allowtransparency:'', frameborder:'', loading:'', name:'', src:''})
        } else if (slotName === 've-image') {
          setElProps(viewerEl, tagProps[0], {data:'', 'fit':'', 'zoom-on-scroll':''})
          viewerEl.appendChild(propsList(tagProps))
        } else if (slotName === 've-knightlab-timeline') {
          setElProps(viewerEl, tagProps[0], {caption:'', 'hash-bookmark':'', 'initial-zoom':'', source:'', 'timenav-position':''})
        } else if (slotName === 've-map') {
          setElProps(viewerEl, tagProps[0], {basemap:'basemaps', caption:'', center:'', data:'', entities:'', 'gesture-handling':'', 'gh-dir':'', marker:'', overlay:'', 'prefer-geojson':'', 'scroll-wheel-zoom':'', title:'', zoom:'', 'zoom-on-click':''})
          viewerEl.appendChild(propsList(tagProps.slice(1)))
        } else if (slotName === 've-plant-specimen') {
          setElProps(viewerEl, tagProps[0], {caption:'', eid:'', jpid:'', max:'', qid:'', 'taxon-name':'', wdid:''})
        } else if (slotName === 've-video') {
          setElProps(viewerEl, tagProps[0], {alt:'', autoplay:'', caption:'', end:'', id:'', muted:'', 'no-caption':'', poster:'', src:'', start:'', sync:'', vid:''})
        } else if (slotName === 've-visjs') {
          setElProps(viewerEl, tagProps[0], {caption:'', edges:'', nodes:'', title:'caption', url:''})
        } else if (slotName === 'data') {
          viewerEl.appendChild(propsList(tagProps))
        } else {
          console.log(`makeViewer: slotName ${slotName} not recognized, props=${Object.keys(tagProps[0] || {})}`)
        }
        return viewerEl
      }

      let j1Viewers = document.createElement('ve-j1-viewers-slots')
      j1Viewers.dataset.id = id
      viewersDiv.appendChild(j1Viewers)
      j1Viewers.setAttribute('viewers', [
        ...Object.keys(veTags).filter(tag => tag !== 've-map-marker' && tag !== 've-map-layer'),
        ...(mode === 'dev' ? ['data'] : [])
      ].join(' '))

      Object.entries(veTags).forEach(([tag, tagProps]) => {
        if (tag === 've-map-marker' || tag === 've-map-layer') return
        tagProps[0].entities = entities.join(' ')
        if (tag === 've-map') {
          j1Viewers.appendChild(makeViewerEl('ve-map', tag,
            [...tagProps,
             ...Object.values(veTags['ve-map-marker'] || {}), ...Object.values(veTags['ve-map-layer'] || {})
            ].sort((a,b) => a.idx - b.idx)
          ))
        } else {
          j1Viewers.appendChild(makeViewerEl(tag, tag, tagProps))
        }
      })
      j1Viewers.appendChild(makeViewerEl('div', 'data', params))

    })

    Array.from(article.querySelectorAll('.segment'))
    .forEach(seg => {
      let viewers = seg.children[1]
      let parent = seg.parentElement
      while (parent && parent.tagName !== 'ARTICLE') {
        parent.querySelectorAll(':scope > param').forEach(param => viewers.appendChild(param.cloneNode(true)))
        parent = parent.parentElement
      }
    })

  }
  return article.outerHTML
}

function setStickyOffsets(root) {
  function topIsVisible(el) {
    let bcr = el.getBoundingClientRect()
    return el.tagName === 'VE-HEADER' || el.tagName === 'VE-BREADCRUMBS' || (bcr.top >= 0 && bcr.top <= window.innerHeight)
  }

  let stickyElems = Array.from(root.querySelectorAll('.sticky'))
    // .filter(stickyEl => {stickyEl.tagName !== 'VE-HEADER' && stickyEl.tagName !== 'VE-BREADCRUMBS')
    .filter(stickyEl => topIsVisible(stickyEl))
    .sort((a,b) => {
        let aTop = a.getBoundingClientRect().top
        let bTop = b.getBoundingClientRect().top
        return aTop < bTop ? -1 : 1
      })

  if (stickyElems.length > 1) {
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
          if (stickyElems[i].style) {
            stickyElems[i].style.top = `${Math.floor(priorTop + bcrPrior.height)}px`
          }
          break
        }
      }
    }
  }
}

let priorActiveParagraph
let currentActiveParagraph

function observeVisible(rootEl, setActiveParagraph, offset=0) {
  setActiveParagraph = setActiveParagraph || false
  let topMargin = offset + Array.from(rootEl.querySelectorAll('VE-HEADER'))
  .map(stickyEl => (parseInt(stickyEl.style.top.replace(/px/,'')) || 0) + stickyEl.getBoundingClientRect().height)?.[0] || 0

  // console.log(`observeVisible: setActiveParagraph=${setActiveParagraph} topMargin=${topMargin} isJunctureV1=${isJunctureV1} useSlotBasedViewers=${useSlotBasedViewers}`)

  const visible = {}
  const observer = new IntersectionObserver((entries, observer) => {
    
    for (const entry of entries) {
      let para = entry.target
      let paraId = para.id || para.parentElement?.id || ''
      let intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0) visible[paraId] = {para, intersectionRatio}
      else delete visible[paraId]
    }

    let sortedVisible = Object.values(visible)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio || a.para.getBoundingClientRect().top - b.para.getBoundingClientRect().top)

    // if (sortedVisible.length) console.log(sortedVisible)

    if (setActiveParagraph) {
        currentActiveParagraph = sortedVisible[0]?.para
    } else {
      let found = sortedVisible.find(e => e.para.classList.contains('active'))
      if (found) currentActiveParagraph = found.para
    }
      
    if (currentActiveParagraph !== priorActiveParagraph) {
      // console.log('activeParagraph', currentActiveParagraph)

      let priorViewers, currentViewers
      if (isJunctureV1) {
        priorViewers = priorActiveParagraph?.nextElementSibling
        currentViewers = currentActiveParagraph?.nextElementSibling
        if (priorViewers) priorViewers.classList.remove('active')
      }

      priorActiveParagraph = currentActiveParagraph
      if (setActiveParagraph) { 
        rootEl.querySelectorAll('p.active').forEach(p => p.classList.remove('active'))
        currentActiveParagraph?.classList.add('active')
        // auto entity tagging
        let isTagged = currentActiveParagraph?.getAttribute('data-entities-tagged') === ''
        if (currentActiveParagraph?.getAttribute('data-entities') && !isTagged) {
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
                    html = html.slice(0, idx) + `<ve-entity-infobox qid="${entity.id}" file="${window.customEntityData[entity.id]?.file || ''}">${match}</ve-entity-infobox>` + html.slice(idx + match.length)
                    currentActiveParagraph.innerHTML = html
                    break
                  }
                }
              })
              if (currentViewers) currentViewers.classList.add('active')
            })
          } else {
            if (currentViewers) currentViewers.classList.add('active')
          }
          currentActiveParagraph.setAttribute('data-entities-tagged', '')
        } else {
          if (currentViewers) currentViewers.classList.add('active')
        }

      }

      /*
      if (isJunctureV1) {
        let priorViewers = priorActiveParagraph?.nextElementSibling
        let currentViewers = currentActiveParagraph?.nextElementSibling
        if (priorViewers) priorViewers.classList.remove('active')
        if (currentViewers) currentViewers.classList.add('active')
      }
      */

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
function whosOnFirstUrl(wof) {
  let wofParts = []
  for (let i = 0; i < wof.length; i += 3) {
    wofParts.push(wof.slice(i,i+3))
  }
  return `https://data.whosonfirst.org/${wofParts.join('/')}/${wof}.geojson`
}

window.entityData = {}
window.pendingEntityData = new Set()
window.customEntityData = {}
async function getEntityData(qids, language) {
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
            if (window.customEntityData[qid]) _entityData.aliases = [...window.customEntityData[qid].aliases, ..._entityData.aliases]
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

function setMeta() {
  let meta
  let header
  Array.from(document.getElementsByTagName('*')).forEach(el => {
    if (!/^\w+-\w+/.test(el.tagName)) return
    if (el.tagName.split('-')[1] === 'META') meta = el
    else if (el.tagName.split('-')[1] === 'HEADER') header = el
  })
  if (!meta) meta = document.querySelector('param[ve-config]')

  let firstHeading = document.querySelector('h1, h2, h3')?.innerText.trim()
  let firstParagraph = document.querySelector('p')?.innerText.trim()
  
  let jldEl = document.querySelector('script[type="application/ld+json"]')
  let seo = jldEl ? JSON.parse(jldEl.innerText) : {'@context':'https://schema.org', '@type':'WebSite', description:'', headline:'', name:'', url:''}
  seo.url = location.href

  let title = meta?.getAttribute('title')
    ? meta.getAttribute('title')
    : window.config?.title
      ? window.config.title
      : header?.getAttribute('label')
        ? header.getAttribute('label')
        : firstHeading || ''

  let description =  meta?.getAttribute('description')
    ? meta.getAttribute('description')
    : window.config?.description
      ? window.config.description
      : firstParagraph || ''

  let robots = meta?.getAttribute('robots')
    ? meta?.getAttribute('robots')
    : window.config?.robots
      ? window.config.robots
      : '' 

  if (title) {
    document.title = title
    seo.name = title
    seo.headline = title
    document.querySelector('meta[name="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', title)
    document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', title)
  }
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    seo.description = description
  }
  if (robots) {
    let robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    robotsMeta.setAttribute('content', robots)
    document.head.appendChild(robotsMeta)
  }

  if (meta && meta.getAttribute('ve-config') === null) meta.remove()
  if (jldEl) jldEl.innerText = JSON.stringify(seo)

  window.config = {...window.config, ...{meta: {title, description, robots, seo}}}
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

function setViewersPosition() {
  let header = document.querySelector('ve-header')
  let viewers = document.querySelector('.viewers')
  let top = header.getBoundingClientRect().top
  let height = header.getBoundingClientRect().height
  let offset = top + height
  viewers.style.top = `${offset}px`
  viewers.style.height = `calc(100dvh - ${offset+2}px)`
  // console.log(offset, parseInt(window.getComputedStyle(viewers).height.replace(/px/,'')))
}

function mount(root, html) {  
  window.config = {...yaml.parse(window.options || ''), ...(window.jekyll || {}), ...(window.config || {})}
  setMeta()
  root = root || document.body.firstChild
  html = html || root.innerHTML
  let articleWrapper = elFromHtml(structureContent(html))
  let article = articleWrapper.firstChild
  root.replaceWith(articleWrapper)

  if (isJunctureV1 && !isMobile) {
    document.addEventListener('scroll', () => setViewersPosition())
    setTimeout(() => setViewersPosition(), 100)
  }

  // console.log(article.querySelector('ve-video[sync]'))
  observeVisible(article, article.querySelector('ve-video[sync]') ? false : true)
  readMoreSetup()
  return article
}

export { elFromHtml, getMarkdown, getGhFile, getHtml, ghSourceFromLocation, markdownToHtml, mount, observeVisible, readMoreSetup, setMeta, structureContent, yaml }
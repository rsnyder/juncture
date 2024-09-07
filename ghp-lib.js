import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import 'https://cdn.jsdelivr.net/npm/marked-footnote/dist/index.umd.min.js'
import * as yaml from 'https://cdn.jsdelivr.net/npm/yaml@2.3.4/browser/index.min.js'

const mode = location.hostname === 'localhost'
  ? 'local'
  : import.meta.url.indexOf('https://cdn.jsdelivr.net/npm/juncture-digital') === 0
    ? 'prod'
    : 'dev'
    
const isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent) )

window.customEntityData = {}

function addLink(attrs) {
  // console.log('addLink', attrs)
  let stylesheet = document.createElement('link')
  Object.entries(attrs).map(([key, value]) => stylesheet.setAttribute(key, value))
  document.head.appendChild(stylesheet)
}

function addScript(attrs) {
  // console.log('addScript', attrs)
  let script = document.createElement('script')
  Object.entries(attrs).map(([key, value]) => script.setAttribute(key, value))
  document.head.appendChild(script)
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
    booleans: 'autoplay loop navigation pagination',
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
    booleans : new Set((attrs.booleans || '').split(' ').filter(s => s)),
    positional: (attrs.positional || '').split(' ').filter(s => s)
  }
  tagMap[tag] = tagObj
  tagMap[tag.slice(3)] = tagObj
})

function parseHeadline(s) {
  let tokens = []
  s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
  s?.match(/[^\s"]+|"([^"]*)"/gmi)?.filter(t => t).forEach(token => {
    if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
    else tokens.push(token)
  })
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
    let listArgs = []
    parsed.args.forEach((value, idx) => {
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
      let argEl = new DOMParser().parseFromString(marked.parse(arg.replace(/^\s*-\s*/, '')), 'text/html').body.firstChild
      let li = document.createElement('li')
      li.innerHTML = argEl.innerHTML.indexOf('wc:') === 0 ? argEl.innerHTML.replace(/<em>([^<]+)<\/em>/g, '_$1_') : argEl.innerHTML
      ul.appendChild(li)
    }
  }
  if (parsed.raw) el.textContent = parsed.raw
  return el
}

function deleteAllComments(rootEl) {
  var iterator = document.createNodeIterator(rootEl, NodeFilter.SHOW_COMMENT, () => { return NodeFilter.FILTER_ACCEPT}, false);
  var curNode
  while (curNode = iterator.nextNode()) { curNode.remove() }
}

function isNumeric(arg) { return !isNaN(arg) }
function camelToKebab(input) { return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}

function computeDataId(el) {
  let dataId = []
  while (el.parentElement) {
    let siblings = Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName)
    dataId.push(siblings.indexOf(el) + 1)
    el = el.parentElement
  }
  return dataId.reverse().join('.')
}

// convert juncture tags to web component elements
function convertTags(rootEl) {
  // remove "view as" buttons
  Array.from(rootEl.querySelectorAll('a > img'))
  .filter(img => img.src.indexOf('ve-button.png') > -1 || img.src.indexOf('wb.svg') > -1)
  .forEach(viewAsButton => viewAsButton?.parentElement?.parentElement?.remove())

  Array.from(rootEl.querySelectorAll('p'))
    .filter(p => /^\.ve-\w+\S/.test(p.childNodes.item(0)?.nodeValue?.trim() || ''))
    .forEach(p => {
      let codeElWrapper = document.createElement('div')
      let codeEl = document.createElement('code')
      codeElWrapper.appendChild(codeEl)
      codeEl.setAttribute('class', 'language-juncture2')
      let replacementText = p.innerHTML.trim().slice(1)
        .replace(/\n\s*-\s+/g, '\n')
        .replace(/<a href="/g, '')
        .replace(/">[^<]*<\/a>/g, '')
        .replace(/^ve-media/, 've-image')
      codeEl.textContent = replacementText
      p.replaceWith(codeElWrapper)
    })
  Array.from(rootEl.querySelectorAll('param'))
  .filter(param => Array.from(param.attributes).filter(attr => attr.name.indexOf('ve-') === 0).length)
  .filter(param => param.getAttribute('ve-config') === null)
  .forEach(param => {
    let tag = Array.from(param.attributes).find(attr => attr.name.indexOf('ve-') === 0).name
    if (tag) {
      let tagObj = tagMap[tag] || {}
      let parsed = { tag }
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
      if (!isJunctureV1(rootEl)) param.replaceWith(makeEl(parsed))
    }
  })
  rootEl.querySelectorAll('code').forEach(codeEl => {
    let parsed = parseCodeEl(codeEl)
    // console.log(parsed)
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
      let target
      let priorEl = codeWrapper.previousElementSibling
      if (priorEl?.tagName === 'EM' || priorEl?.tagName === 'STRONG') {
        target = document.createElement('span')
        target.innerHTML = priorEl.innerHTML
        priorEl.replaceWith(target)
      } else if (parent?.tagName === 'TD') {
        target = parent?.parentElement?.parentElement?.parentElement // table
        parent?.parentElement?.remove() // row
      } else if (parent?.tagName !== 'UL' && (priorEl?.tagName === 'A' || priorEl?.tagName === 'IMG')) {
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
}

// Restructure the content to have hierarchical sections and segments
function restructure(rootEl) {
  let styleSheet = rootEl.querySelector('style')
  deleteAllComments(rootEl)

  // Move child params to be siblings with parent element
  rootEl.querySelectorAll('ul, ol').forEach(list => {
    let ref = list
    list.querySelectorAll('param').forEach(param => {
      ref.parentNode.insertBefore(param, ref.nextSibling)
      ref = param
    })
  })

  let main = document.createElement('main')
  if (styleSheet) main.appendChild(styleSheet.cloneNode(true))
  
  main.className = 'page-content markdown-body'
  main.setAttribute('aria-label', 'Content')
  main.setAttribute('data-theme', 'light')
  if (rootEl.style) main.setAttribute('style', rootEl.style.cssText)
  let currentSection = main;
  let sectionParam

  // Converts empty headings (changed to paragraphs by markdown converter) to headings with the correct level
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
        headings = [...headings, ...Array.from(main.querySelectorAll(`H${lvl}`)).filter(h => h.parentElement.tagName === 'SECTION')]
      }

      let parent = (sectionLevel === 1 || headings.length === 0) 
        ? main 
        : headings.pop()?.parentElement
      parent?.appendChild(currentSection)
      currentSection.setAttribute('data-id', computeDataId(currentSection))

    } else  {
      if (el.tagName !== 'PARAM') {
        let segId = `${currentSection.getAttribute('data-id') || 0}.${currentSection.children.length}`
        el.setAttribute('data-id', segId)
        el.id = segId
        el.classList.add('segment')
      }
      if (el !== sectionParam) {
        currentSection.innerHTML += el.outerHTML
      }
    }
  })

  Array.from(main.querySelectorAll('a'))
    .filter(anchorElem => anchorElem.href.indexOf('mailto:') < 0)
    .forEach(anchorElem => {
      let link
      try {
        link = new URL(anchorElem.href)
      } catch (e) {
        console.log(e)
        console.log(anchorElem.href)
        return
      }
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

  configCustomClasses(main)

  let header, footer
  let article = document.createElement('article')

  if (isJunctureV1(rootEl)) {
    article.classList.add('j1')
    let veConfig = main.querySelector('param[ve-config]')
    header = document.createElement('ve-header')
    header.className = 'sticky'
    Array.from(veConfig?.attributes || []).forEach(attr => {
      if (attr.name === 'banner') header.setAttribute('background', attr.value)
      if (attr.name === 'title') header.setAttribute('title', attr.value)
      if (attr.name === 'subtitle' || attr.name === 'author') header.setAttribute('subtitle', attr.value)
    })
    article.appendChild(header)
    veConfig?.remove()
  } else {
    header = main.querySelector('ve-header')
    if (header) {
      // let toRemove = header
      // while (toRemove.parentElement.tagName !== 'MAIN') toRemove = toRemove.parentElement 
      article.appendChild(header)
      // toRemove.remove()
    }
  }

  article.appendChild(main)

  footer = main.querySelector('ve-footer')
  if (footer) {
    // let toRemove = footer
    // while (toRemove.parentElement.tagName !== 'MAIN') toRemove = toRemove.parentElement 
    article.appendChild(footer)
    // toRemove.remove()
  }

  return article
}

function configCustomClasses(rootEl) {
  let cardCtr = 0

  rootEl.querySelectorAll('section').forEach(section => {
    
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
        let tabContent = Array.from(tabSection.children).slice(1).map(el => el.outerHTML).join(' ')
        tabPanel.innerHTML = tabContent
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
  })
}

function restructureForJ1(article) {

  function serializeProps(props) {
    return  Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ').replace(/“/g, '&quot;').replace(/”/g, '&quot;')
  }

  Array.from(article.querySelectorAll('[data-id]')).forEach(seg => {
    if (seg.tagName === 'SECTION') return

    if (!seg.innerHTML.trim()) { // remove empty segments
      seg.remove()
      return
    }

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

  Array.from(article.querySelectorAll('[data-id]')).forEach(seg => {
    if (seg.tagName === 'SECTION') return
    let id = seg.getAttribute('data-id') || ''
    let para = seg.querySelector('p, ol, ul')
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
        li.innerText = serializeProps(tp)
        ul.appendChild(li)
      })
      return ul
    }

    function setElProps(el, props, nameMap) {
      Object.entries(props)
        .filter(([key, value]) => nameMap[key] !== undefined)
        .forEach(([key, value]) => {
          el.setAttribute(nameMap[key] || key, value === 'false' ? '' : value === 'true' ? null : value)
        })
    }

    function makeViewerEl(tagName, slotName, tagProps) {
      let viewerEl = document.createElement(tagName)
      viewerEl.setAttribute('slot', slotName)
      if (slotName === 've-carousel') {
        setElProps(viewerEl, tagProps[0], {autoplay:'', caption:'', loop:'', navigation:'', pagination:''})
        viewerEl.appendChild(propsList(tagProps))
      } else if (slotName === 've-compare') {
        setElProps(viewerEl, tagProps[0], {caption:''})
        viewerEl.appendChild(propsList(tagProps))
      } else if (slotName === 've-iframe') {
        setElProps(viewerEl, tagProps[0], {allow:'', allowfullscreen:'', allowtransparency:'', caption:'', frameborder:'', loading:'', name:'', src:''})
      } else if (slotName === 've-image' || slotName === 've-gallery') {
        if (tagProps.length === 1) {
          setElProps(viewerEl, tagProps[0], {attribution:'', caption:'', data:'', 'data-id':'', description:'', 'fit':'', label:'', license:'', manifest:'', refresh:'', region:'', rotate:'', rotation:'', seq:'', src:'', title:'', url:'', 'zoom-on-scroll':''})
        } else {
          setElProps(viewerEl, tagProps[0], {'zoom-on-scroll':''})
          viewerEl.appendChild(propsList(tagProps))
        }
      } else if (slotName === 've-knightlab-timeline') {
        setElProps(viewerEl, tagProps[0], {caption:'', 'hash-bookmark':'', 'initial-zoom':'', source:'', 'timenav-position':''})
      } else if (slotName === 've-map') {
        setElProps(viewerEl, tagProps[0], {basemap:'basemaps', caption:'', center:'', data:'', 'data-id':'', entities:'', 'gesture-handling':'', 'gh-dir':'', marker:'', overlay:'', 'prefer-geojson':'', 'scroll-wheel-zoom':'', title:'', zoom:'', 'zoom-on-click':''})
        viewerEl.appendChild(propsList(tagProps.slice(1)))
      } else if (slotName === 've-plant-specimen') {
        setElProps(viewerEl, tagProps[0], {caption:'', eid:'', jpid:'', max:'', qid:'', 'taxon-name':'', wdid:''})
      } else if (slotName === 've-video') {
        setElProps(viewerEl, tagProps[0], {alt:'', autoplay:'', caption:'', 'data-id':'', end:'', fit:'', id:'', muted:'', 'no-caption':'', poster:'', src:'', start:'', sync:'', vid:''})
      } else if (slotName === 've-visjs') {
        setElProps(viewerEl, tagProps[0], {caption:'', edges:'', hierarchical:'', nodes:'', title:'caption', url:''})
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
      tagProps[0]['data-id'] = j1Viewers.dataset.id
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

  Array.from(article.querySelectorAll('.segment')).forEach(seg => {
    let viewers = seg.children[1]
    let parent = seg.parentElement
    while (parent && parent.tagName !== 'ARTICLE') {
      parent.querySelectorAll(':scope > param').forEach(param => viewers.appendChild(param.cloneNode(true)))
      parent = parent.parentElement
    }
  })

  let main = article.querySelector('main')
  let mainWrapper = document.createElement('main')
  mainWrapper.className = 'page-content markdown-body'
  let content = document.createElement('div')
  content.className = 'content'
  content.innerHTML = main.innerHTML
  let viewers = document.createElement('div')
  viewers.className = 'viewers'
  mainWrapper.appendChild(content)
  mainWrapper.appendChild(viewers)
  main.replaceWith(mainWrapper)

  return article
}

function setStickyOffsets(root) {
  function topIsVisible(el) {
    let bcr = el.getBoundingClientRect()
    return el.tagName === 'VE-HEADER' || el.tagName === 'VE-BREADCRUMBS' || (bcr.top >= 0 && bcr.top <= window.innerHeight)
  }

  let stickyElems = Array.from(root.querySelectorAll('.sticky'))
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

  isJunctureV1 = true

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

    if (setActiveParagraph) {
        currentActiveParagraph = sortedVisible[0]?.para
    } else {
      let found = sortedVisible.find(e => e.para.classList.contains('active'))
      if (found) currentActiveParagraph = found.para
    }
      
    if (currentActiveParagraph !== priorActiveParagraph) {

      let priorViewers, currentViewers
      if (isJunctureV1) {
        priorViewers = priorActiveParagraph?.nextElementSibling
        currentViewers = currentActiveParagraph?.nextElementSibling
        if (priorViewers) priorViewers.classList.remove('active')
      }

      priorActiveParagraph = currentActiveParagraph
      if (setActiveParagraph) { 
        rootEl.querySelectorAll('p.active, ol.active, ul.active').forEach(p => p.classList.remove('active'))
        currentActiveParagraph?.classList.add('active')
        if (currentViewers) currentViewers.classList.add('active')
      }

      setStickyOffsets(rootEl)
    }

  }, { root: null, threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], rootMargin: `${topMargin ? -topMargin : 0}px 0px 0px 0px`})

  // target the elements to be observed
  rootEl.querySelectorAll('p, .segment > ol, .segment > ul').forEach((paragraph) => observer.observe(paragraph))
}

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

function setMeta() {
  let meta
  let header
  Array.from(document.getElementsByTagName('*')).forEach(el => {  
    if (!/^\w+-\w+/.test(el.tagName)) return
    if (el.tagName.split('-')[1] === 'META') meta = el
    else if (el.tagName.split('-')[1] === 'HEADER') header = el
  })
  if (!meta) meta = document.querySelector('param[ve-config]')

  let firstHeading = document.querySelector('h1, h2, h3')?.innerHTML.trim()
  let firstParagraph = Array.from(document.querySelectorAll('p'))
    .find(p => {
      let ptext = p.childNodes.item(0).nodeValue?.trim()
      return p.childNodes[0].tagName !== 'CODE' && ptext?.length && !/^\.\w+-\w+/.test(ptext)
    })?.innerHTML.trim()

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

  // if (meta && meta.getAttribute('ve-config') === null) meta.remove()
  if (jldEl) jldEl.innerText = JSON.stringify(seo)

  return {meta: {title, description, robots, seo}}
}

function isJunctureV1(contentEl) {
  return contentEl.querySelector('param[ve-config]') ? true : false
}

// set the configuration
function setConfig() {
  window.config = {
    ...yaml.parse(window.options || ''), 
    ...(window.jekyll || {}), 
    ...(window.config || {}),
    ...{
      baseurl: window.jekyll?.site.baseurl || location.hostname.indexOf('github.io') > 0 ? `/${location.pathname.split('/')[1]}/` : '/',
      source: {
        owner: window.jekyll?.site.github.owner_name,
        repository: window.jekyll?.site.github.repository_name,
        branch: window.jekyll?.site.github.source.branch,
        dir: window.jekyll?.page.dir,
        path: window.jekyll?.page.path,
        name: window.jekyll?.page.name
      }
    },
    ...setMeta()
  }
  let contentEl = document.createElement('main')
  contentEl.innerHTML = window.config.content || document.body.innerHTML
  window.config.isJunctureV1 = isJunctureV1(contentEl)
  // console.log(window.config)
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
  if (viewers) {
    viewers.style.top = `${offset}px`
    viewers.style.height = `calc(100dvh - ${offset+2}px)`
  }
}

function elFromHtml(html) {
  return new DOMParser().parseFromString(html, 'text/html').querySelector('body')
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

function markdownToHtml(markdown) {
  return marked.use(window.markedFootnote()).parse(markdown)
}

function structureContent(html) {
  let contentEl = document.createElement('main')
  contentEl.innerHTML = html
  convertTags(contentEl)

  let article = restructure(contentEl)
  if (isJunctureV1(contentEl)) article = restructureForJ1(article)
  return article
}

function articleFromHtml(html) {
  let contentEl = document.createElement('main')
  contentEl.innerHTML = html
  convertTags(contentEl)
  let article = restructure(contentEl)
  if (isJunctureV1(contentEl)) article = restructureForJ1(article)
  return article
}

// mount the content
function mount(mountPoint, html) {
  html = html || window.config.content || document.body.innerHTML
  mountPoint = mountPoint || document.querySelector('body > article, body > main, body > section') 
  if (!mountPoint) {
    mountPoint = document.createElement('article')
    document.body.innerHTML = mountPoint.outerHTML
  }

  let article = articleFromHtml(html)

  mountPoint.replaceWith(article)
  if (window.config.isJunctureV1 && !isMobile) {
    document.addEventListener('scroll', () => setViewersPosition())
    setTimeout(() => setViewersPosition(), 100)
  }

  observeVisible(article, article.querySelector('ve-video[sync]') ? false : true)
  readMoreSetup()
  return article
}

export { addLink, addScript, articleFromHtml, elFromHtml, getGhFile, getMarkdown, markdownToHtml, mode, mount, observeVisible, setConfig, structureContent }
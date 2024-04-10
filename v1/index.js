window.config = window.config || {}
window.config.scriptBasePath = Array.from(document.querySelectorAll('script'))
  .filter(script => script.src)
  .filter(script => /\/(mdpress|juncture)\/index\.js$/.test(script.src) || /\/main\.ts$/.test(script.src))
  .map(scriptEl => {
    let srcUrl = new URL(scriptEl.src)
    let path = srcUrl.pathname.split('/').filter(pe => pe).slice(0, -1)
    return path.length > 0 
      ? `${srcUrl.origin}/${path.join('/')}` 
      : location.hostname == 'localhost'
        ? 'http://localhost:8080'
        : srcUrl.origin
  })
  ?.[0] || 'https://www.mdpress.io'

const junctureDependencies = [
  // {tag: 'link', rel: 'stylesheet', href: `${config.baseurl}juncture/index.css`},
  {tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/http-vue-loader@1.4.2/src/httpVueLoader.min.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js'},
  // {tag: 'script', src: `${window.config.scriptBasePath}/v2/dist/js/index.js`, type: 'module'}
]

const isJunctureV1 = Array.from(document.querySelectorAll('param'))
  .find(param =>
    Array.from(param.attributes).find(attr => attr.name.indexOf('ve-') === 0)
  ) !== undefined

function juncture1El() {
  let tmp = new DOMParser().parseFromString(document.querySelector('main').innerHTML, 'text/html').children[0].children[1]
  let img = tmp.querySelector('a img')
  if (img?.src.indexOf('ve-button') > -1) img.parentElement?.parentElement?.remove()

  Array.from(tmp.querySelectorAll('[data-id]'))
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

      while (seg.nextSibling) {
        let sib = seg.nextSibling
        if (sib.nodeName !== 'PARAM') break
        wrapper.appendChild(sib)
      }
      seg.replaceWith(wrapper)
    })

  Array.from(tmp.querySelectorAll('div'))
  .forEach(div => {
    if (div.firstChild?.tagName === 'PARAM' && div.textContent?.trim() == '') div.replaceWith(div.firstChild)
  })

  return tmp
}

function _createJunctureV1App() {

  let html = juncture1El().innerHTML
  // console.log('createJunctureV1App', new DOMParser().parseFromString(html, 'text/html').firstChild.children[1])

  Array.from(document.body.children).forEach(child => {
    if (child.tagName !== 'VE-HEADER') document.body.removeChild(child)
  })

  window.Vue.directive('highlightjs', {
    deep: true,
    bind: function(el, binding) {
      let targets = el.querySelectorAll('code')
      targets.forEach((target) => {
        if (binding.value) {
          target.textContent = binding.value
        }
        window.hljs.highlightBlock(target)
      })
    },
    componentUpdated: function(el, binding) {
      let targets = el.querySelectorAll('code')
      targets.forEach((target) => {
        if (binding.value) {
          target.textContent = binding.value
          window.hljs.highlightBlock(target)
        }
      })
    }
  })

  let main = document.createElement('div')
  main.id = 'vue'
  main.innerHTML = `<juncture-v1 :input-html="html"></juncture-v1>`
  document.body.appendChild(main)

  new window.Vue({
    el: '#vue',
    components: {
      'juncture-v1': window.httpVueLoader(`${window.config.scriptBasePath}/v1/Juncture.vue`)
    },
    data: () => ({ html })
  })
}

function loadDependency(dependency, callback) {
  let e = document.createElement(dependency.tag)
  Object.entries(dependency).forEach(([k, v]) => { if (k !== 'tag') e.setAttribute(k, v) })
  e.addEventListener('load', callback)
  if (dependency.tag === 'script') document.body.appendChild(e)
  else document.head.appendChild(e)
}

function loadDependencies(dependencies, callback, i) {
  i = i || 0
  if (dependencies.length === 0) {
    if (callback) callback()
    else return
  } else {
    loadDependency(dependencies[i], () => {
      if (i < dependencies.length-1) loadDependencies(dependencies, callback, i+1) 
      else if (callback) callback()
    })
  }
}

function createJunctureV1App() {
  loadDependencies(junctureDependencies, () => _createJunctureV1App())
}

export { isJunctureV1, createJunctureV1App, juncture1El }
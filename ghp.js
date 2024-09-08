import { addLink, addScript, articleFromHtml, cssBase, getGhFile, getMarkdown, markdownToHtml, mode, mount, scriptBase, setConfig, structureContent } from './ghp-lib.js'

console.log(`mode=${mode} scriptBase=${scriptBase} cssBase=${cssBase}`)
  
if (!window.config) setConfig()

let scripts = Array.from(document.getElementsByTagName('script')).filter(script => script.src).map(script => script.src)
let stylesheets = Array.from(document.getElementsByTagName('link')).filter(link => link.type == 'text/css'&& link.href).map(link => link.href)

let hasGhpJs = scripts.find(src => src.indexOf('ghp.js') > 0) !== undefined
let hasWcJs = scripts.find(src => src === 'http://localhost:5173/main.ts' || src === `${scriptBase}/index.js`) !== undefined
let hasWcCss = stylesheets.find(href => href === `${cssBase}/index.css`) !== undefined
let isMounted = document.querySelector('body > article') !== null

if (!hasWcCss) {
  addLink({rel: 'stylesheet', type: 'text/css', href: `${cssBase}/index.css`})
  hasWcCss = true
}

if (!hasWcJs) {
  addScript({type: 'module', src: `${scriptBase}/${mode === 'locall' ? 'index.js' : 'main.ts'}`})
  hasWcJs = true
}

function docReady(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(fn, 1)
  else document.addEventListener('DOMContentLoaded', fn)
}

docReady(function() {
  if (hasGhpJs && hasWcJs && hasWcCss && !isMounted) mount()
})

export { articleFromHtml, mount, getGhFile, getMarkdown, markdownToHtml, structureContent }
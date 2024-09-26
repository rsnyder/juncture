import { nextTick } from 'vue'
import { md5 } from 'js-md5';
import * as yaml from 'js-yaml'
import { sha256 as __sha256 } from 'js-sha256'

const window = (globalThis as any).window as any
let options:any = yaml.load(window.options)

export const iiifServer = options?.defaults?.iiifServer || 'iiif.mdpress.io'

export function sha256(str: string) {
  return __sha256(str)
}
export function isURL(str:string) { return /^https*:\/\//.test(str) }
export function isQid(s:string) { return /^Q\d+$/.test(s) }
export function isCoords(s:string) { return /^[+-]?\d+(.\d*|\d*),{1}[+-]?\d+(.\d*|\d*)$/.test(s) }
export function isNumeric(arg:any) { return !isNaN(arg) }
export function camelToKebab(input:string) { return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}
export function kebabToCamel(input:string) { return input.replace(/-([a-z])/g, function (g) {return g[1].toUpperCase()})}

export function Md5(str:string) {
  return md5(str)
}

function _value(langObj: any, language='en') {
  return typeof langObj === 'object'
    ? langObj[language] || langObj.none || langObj[Object.keys(langObj).sort()[0]]
    : langObj
}

export function getMetadata(manifest:any, language:string = 'en'): any[] {
  let metadata:any[] = []
  if (manifest.metadata) {
    manifest.metadata.forEach((md:any) => {
      metadata.push({label: _value(md.label, language)[0], value: _value(md.value, language)})
    })
  }
  return metadata
}

export function metadataAsObj(manifest:any, language:string = 'en'): any {
  return Object.fromEntries(getMetadata(manifest, language).map(md => [md.label, md.value]))
}

export function isMobile() {
  // console.log(`isMobile: ontouchstart=${'ontouchstart' in document.documentElement} mobi=${/mobi/i.test(navigator.userAgent)}`)
  let _isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent) )
  return _isMobile
}

export const isGHP = /\.github\.io$/.test(location.hostname)


function computeStickyOffsets(root:HTMLElement) {
  function topIsVisible(el:HTMLElement) {
    let bcr = el.getBoundingClientRect()
    return bcr.top >= 0 && bcr.top <= window.innerHeight
  }
  let stickyElems = [
    ...(Array.from(root.querySelectorAll('ve-header[sticky], ve-header[sticky], ve-breadcrumbs[sticky]') as NodeListOf<HTMLElement>) as HTMLElement[]),
    ...(Array.from(root.querySelectorAll('.sticky') as NodeListOf<HTMLElement>) as HTMLElement[])
  ]
  .filter(stickyEl => {
    // console.log(stickyEl, topIsVisible(stickyEl))
    return topIsVisible(stickyEl)
  })
  .sort((a,b) => {
      let aTop = a.getBoundingClientRect().top
      let bTop = b.getBoundingClientRect().top
      return aTop < bTop ? -1 : 1
    })
  
  // console.log('computeStickyOffsets', stickyElems.length)

  // nextTick(() => stickyElems.forEach(stickyEl => console.log(stickyEl.getBoundingClientRect()) ))
  // nextTick(() => stickyElems.forEach(stickyEl => console.log(stickyEl) ))

  if (stickyElems.length === 1) {
    // if (!stickyElems[0].style.top) stickyElems[0].style.top = '0px'
  } else if (stickyElems.length > 1) {
    nextTick(() => {
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
            // console.log(priorSticky, priorSticky.style.top)
            let priorTop = parseInt(priorSticky.style.top.replace(/px/,'')) || 0
            stickyElems[i].style.top = `${Math.floor(priorTop + bcrPrior.y + bcrPrior.height)}px`
            break
          }
        }
      }
    })
  }
}

function loadDependency(dependency, callback) {
  let e = document.createElement(dependency.tag)
  Object.entries(dependency).forEach(([k, v]) => { if (k !== 'tag') e.setAttribute(k, v) })
  e.addEventListener('load', callback)
  if (dependency.tag === 'script') document.body.appendChild(e)
  else document.head.appendChild(e)
}

export function loadDependencies(dependencies:any[], callback:any = null, i:number = 0) {
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

let activeParagraph: HTMLElement

let visibleParagraphs: IntersectionObserverEntry[] = []
export function observeVisible(callback:any = null) {

  let topMargin = 0;
  (Array.from(document.querySelectorAll('.sticky') as NodeListOf<HTMLElement>) as HTMLElement[])
  .filter(sticklEl => sticklEl.getBoundingClientRect().x < 600)
  .forEach(stickyEl => topMargin += stickyEl.getBoundingClientRect().height)

  const observer = new IntersectionObserver((entries, observer) => {
    let notVisible = entries.filter(entry => !entry.isIntersecting)
    for (const entry of entries) { if (entry.isIntersecting && !visibleParagraphs.find(vp => vp.target === entry.target)) visibleParagraphs.push(entry) }

    visibleParagraphs = visibleParagraphs
      .filter(entry => notVisible.find(nv => nv.target === entry.target) ? false : true)
      .filter(entry => entry.target.getBoundingClientRect().x < 600)
      .filter(entry => entry.target.classList.contains('sticky') ? false : true)

    visibleParagraphs = visibleParagraphs
      .sort((a,b) => {
        let aTop = a.target.getBoundingClientRect().top
        let bTop = b.target.getBoundingClientRect().top
        return aTop < bTop ? -1 : 1
      })
      // .sort((a,b) => { return a.intersectionRatio > b.intersectionRatio ? -1 : 1 })
    // console.log(`visibleParagraphs: ${visibleParagraphs.length}`)
    // visibleParagraphs.forEach(entry => console.log(entry.target))

    if (activeParagraph !== visibleParagraphs[0]?.target) {
      activeParagraph = visibleParagraphs[0]?.target as HTMLElement
      // console.log('activeParagraph', activeParagraph)
      document.querySelectorAll('p.active').forEach(p => p.classList.remove('active'))
      activeParagraph?.classList.add('active')
      computeStickyOffsets(document.querySelector('main') as HTMLElement)
    }
  }, { root: null, threshold: [1.0, .5], rootMargin: `${topMargin ? -topMargin : 0}px 0px 0px 0px`})

  // target the elements to be observed
  document.querySelectorAll('p').forEach((paragraph) => observer.observe(paragraph))
}

////////// Wikidata Entity functions //////////

window.entityData = {}
window.pendingEntityData = new Set()
window.customEntityAliases = {}
export async function getEntityData(qids: string[], language:string = 'en') {
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
      sparqlResp.results.bindings.forEach( async rec => {
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
          // if (rec.whosOnFirst) _entityData.whosOnFirst = whosOnFirstUrl(rec.whosOnFirst.value)
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

export function mwImage(mwImg:string, width:number = 0) {
  // Converts Wikimedia commons image URL to a thumbnail link
  mwImg = (Array.isArray(mwImg) ? mwImg[0] : mwImg).replace(/Special:FilePath\//, 'File:').split('File:').pop()
  mwImg = decodeURIComponent(mwImg).replace(/ /g,'_')
  const _md5 = md5(mwImg)
  const extension = mwImg.split('.').pop()
  let url = `https://upload.wikimedia.org/wikipedia/commons${width ? '/thumb' : ''}`
  url += `/${_md5.slice(0,1)}/${_md5.slice(0,2)}/${mwImg}`
  if (width > 0) {
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
function whosOnFirstUrl(wof:string) {
  let wofParts:string[] = []
  for (let i = 0; i < wof.length; i += 3) {
    wofParts.push(wof.slice(i,i+3))
  }
  return `https://data.whosonfirst.org/${wofParts.join('/')}/${wof}.geojson`
}

// For cropping regular images
export async function imageDataUrl(url: string, region: any, dest: any): Promise<string> {
  return new Promise((resolve) => {
    let {x, y, w, h} = region
    let {width, height} = dest
    let image = new Image()
    image.crossOrigin = 'anonymous'
    x = x ? x/100 : 0
    y = y ? y/100 : 0
    w = w ? w/100 : 0
    h = h ? h/100 : 0
    image.onload = () => {
      let sw = image.width
      let sh = image.height
      let swScaled = w > 0 ? sw * w : sw - (sw * x)
      let shScaled =  h > 0 ? sh * h : sh - (sh * y)
      let ratio = swScaled/shScaled
      if (ratio > 1) height = width/ratio
      else width = height * ratio
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      x = x*sw
      y = y*sh
      ctx?.drawImage(image, x, y, swScaled, shScaled, 0, 0, width, height)
      let dataUrl = canvas.toDataURL()
      resolve(dataUrl)
    }
    image.src = url
  })
}

export async function getEntity(qid: string, language: string = 'en') {
  let entities = await getEntityData([qid], language)
  return entities[qid]
}

////////// IIIF functions //////////

function _findItems(toMatch: object, current: any, found: object[] = []) {
  found = found || []
  if (current.items) {
    for (let i = 0; i < current.items.length; i++ ) {
      let item = current.items[i]
      let isMatch = !Object.entries(toMatch).find(([attr, val]) => item[attr] && item[attr] !== val)
      if (isMatch) found.push(item)
      else _findItems(toMatch, item, found)
    }
  }
  return found
}

export function findItem(toMatch: object, current: object, seq: number = 1): any {
  const found = _findItems(toMatch, current)
  return found.length >= seq ? found[seq-1] : null
}

export function getItemInfo(manifest:any, seq=1) {
  let _itemInfo = findItem({type:'Annotation', motivation:'painting'}, manifest, seq).body
  // if (_itemInfo.service) _itemInfo.service = _itemInfo.service.map((svc:any) => ({...svc, ...{id: (svc.id || svc['@id']).replace(/\/info\.json$/,'')}}))
  return _itemInfo
}

export function parseImageOptions(str: string) {
  let elems = str?.split('/') || []
  // let seq = 1
  let region = 'full'
  let size = 'full'
  let rotation = '0'
  let quality = 'default'
  let format = 'jpg'
  let offset = 0
  /*
  if (isNum(elems[0])) {
    seq = +elems[0]
    offset = 1
  }
  */
  let options = {
    // seq,
    region: elems.length > offset && elems[offset] ? elems[offset] : region,
    size: elems.length > offset+1 && elems[offset+1] ? elems[offset+1] : size,
    rotation: elems.length > offset+2 && elems[offset+2] ? elems[offset+2] : rotation,
    quality: elems.length > offset+3 && elems[offset+3] ? elems[offset+3] : quality,
    format: elems.length > offset+4 && elems[offset+4] ? elems[offset+4] : format
  }
  return options
}

function isV3Manifest(manifest: any) {
  let contexts = Array.isArray(manifest['@context']) ? manifest['@context'] : [manifest['@context']]
  return contexts.find(ctx => ctx.indexOf('shared-canvas.org') > 0 || parseFloat(ctx.split('/').slice(-2,-1).pop()) < 3) ? false : true
}

const _manifestCache:any = {}
export async function loadManifests(manifestUrls: string[], refresh: boolean=false) {
  let _manifestUrls = manifestUrls
  .map(manifestId =>
    manifestId.indexOf('http') === 0
      ? manifestId
      : `https://${iiifServer}/${manifestId}/manifest.json`
  )
  let toGet = _manifestUrls.filter(url => !_manifestCache[url])
  // console.log(`loadManifests: manifests=${_manifestUrls.length} cached=${_manifestUrls.length - toGet.length}`)

  if (toGet.length > 0) {
    let requests: any = toGet
      .map(manifestUrl => {
        if (refresh && ['localhost', iiifServer].includes(new URL(manifestUrl).hostname)) {
          manifestUrl += '?refresh'
          // console.log(manifestUrl)
        }
        return fetch(manifestUrl).catch((e) => { console.error(e) })
      })
    let responses = await Promise.all(requests)
    let manifests = await Promise.all(responses.map((resp:any) => resp?.json()))
    requests = manifests
      .filter(manifest => manifest && manifest['@context'])
      .filter(manifest => !isV3Manifest(manifest))
      .map(manifest => fetch(`https://${iiifServer}/prezi2to3/`, {
        method: 'POST', 
        body: JSON.stringify(manifest)
      }))

    if (requests.length > 0) {
      responses = await Promise.all(requests)
      let convertedManifests = await Promise.all(responses.map((resp:any) => resp.json()))
      for (let i = 0; i < manifests.length; i++) {
        let mid =  manifests[i].id ||manifests[i]['@id']
        let found = convertedManifests.find(manifest => (manifest.id || manifest['@id']) === mid)
        if (found) manifests[i] = found
      }
    }
    manifests.forEach((manifest, idx) => _manifestCache[toGet[idx]] = manifest)
    return _manifestUrls.map(url => _manifestCache[url])
  } else {
    return _manifestUrls.map(url => _manifestCache[url])
  }
}

export async function getManifest(manifestId: string, refresh: boolean=false) {
  let manifestUrl = manifestId.indexOf('http') === 0
    ? manifestId
    : `https://${iiifServer}/${manifestId}/manifest.json`
  let manifests = await loadManifests([manifestUrl], refresh)
  return manifests[0]
}
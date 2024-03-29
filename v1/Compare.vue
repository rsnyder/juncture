<template>

  <div id="main" :style="containerStyle">
    
    <div id="osd" :style="`display:${mode === 'sync' ? 'block' : 'none'}`"></div>

    <ve-media :style="`display:${mode === 'curtain' ? 'block' : 'none'}`"> <!-- mode === curtain -->
      <ul>
        <li v-for="(item, idx) in compareItems" :key="idx">
          {{ item.manifest }} {{ item.region ? `region=${item.region}` : '' }}
        </li>
      </ul>
    </ve-media>

  </div>

</template>

<script>

const iiifService = 'https://iiif.juncture-digital.org'
const prefixUrl = 'https://openseadragon.github.io/openseadragon/images/'

module.exports = {
  name: 've-compare',
  props: {
    items: { type: Array, default: () => ([]) },
    viewerIsActive: Boolean
  },
  data: () => ({
    viewerLabel: 'Image Compare',
    viewerIcon: 'fas fa-images',
    dependencies: [
      'https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/openseadragon.min.js',
      'https://rsnyder.github.io/juncture/v1/openseadragon-curtain-sync.js'
    ],
    viewer: null,
    manifests: null
  }),
  computed: {
    containerStyle() { return { height: this.viewerIsActive ? '100%' : '0' } },
    compareItems() { return this.items.filter(item => item[this.$options.name]) },
    mode() { 
      let itemsWithMode = this.compareItems.filter(item => item.sync || item.curtain).map(item => item.sync ? 'sync' : 'curtain') 
      return itemsWithMode.length > 0 ? itemsWithMode[0] : 'curtain'
    },
    tileSources() {
      return this.manifests?.map((manifest, idx) => {
        let itemInfo = this.findItem({type:'Annotation', motivation:'painting'}, manifest).body
        let tileSource = itemInfo.service
          ? `${(itemInfo.service[0].id || itemInfo.service[0]['@id'])}/info.json`
          : { url: itemInfo.id, type: 'image', buildPyramid: true }
        const opacity = idx === 0 ? 1 : this.mode === 'layers' ? 0 : 1
        return { tileSource, opacity }
      }) || []
    },
    images() {
      return this.tileSources.map((tileSource, idx) => ({ key: `item-${idx}`, tileSource, shown: true }))
    }
  },
  mounted() { this.loadDependencies(this.dependencies, 0, this.init) },
  methods: {
    init() {},
    initViewer() {
      if (this.viewerIsActive) {
      let main = document.getElementById('main')
      let container = document.getElementById('osd')
      if (container) {
        main.removeChild(container)
      }
      container = document.createElement('div')
      container.id = 'osd'
      container.style.height = '100%'
      main.appendChild(container)
      this.$nextTick(() => {
        this.viewer = new CurtainSyncViewer({
          mode: this.mode, // 'sync' or 'curtain'
          container,
          images: this.images,
          osdOptions: { // OpenSeaDragon options
            autoHideControls: false,
            showHomeControl: true,
            showZoomControl: true,
            homeFillsViewer: false,
            prefixUrl,
            zoomPerClick: 2,
            visibilityRatio: 1,
            wrapHorizontal: false,
            constrainDuringPan: true,
            minZoomImageRatio: 1.35,  
            // maxZoomPixelRatio: Infinity,
            maxZoomPixelRatio: 3,
            viewportMargins: {left:0, top:0, bottom:0, right:0}
          }
        })
      })
      }
    },
    async loadManifests() {
      let requests = this.compareItems.map(item => {
        if (item.manifest) return fetch(item.manifest)
        else if (item.url) {
          let data = {};
          ['url', 'label', 'description', 'attribution', 'license'].forEach(field => {
            if (item[field]) data[field] = item[field]
          })
          return fetch(`${iiifService}/manifest/`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
          })
        }
        else return Promise.resolve()
      })
      let responses = await Promise.all(requests)
      let manifests = await Promise.all(responses.map(resp => resp.json()))
      requests = manifests
        .filter(manifest => !Array.isArray(manifest['@context']) && parseFloat(manifest['@context'].split('/').slice(-2,-1).pop()) < 3)
        .map(manifest => fetch('https://iiif.juncture-digital.org/prezi2to3/', {
          method: 'POST', 
          body: JSON.stringify(manifest)
        }))
      if (requests.length > 0) {
        responses = await Promise.all(requests)
        let convertedManifests = await Promise.all(responses.map(resp => resp.json()))
        for (let i = 0; i < manifests.length; i++) {
          let mid =  manifests[i].id ||manifests[i]['@id']
          let found = convertedManifests.find(manifest => (manifest.id || manifest['@id']) === mid)
          if (found) manifests[i] = found
        }
      }
      return manifests
    },

    // find an item in a IIIF manifest
    findItem(toMatch, current, seq = 1) {
      const found = this._findItems(toMatch, current)
      return found.length >= seq ? found[seq-1] : null
    },

    // recursive helper for finding items in a IIIF manifest
    _findItems(toMatch, current, found = []) {
      found = found || []
      if (current.items) {
        for (let i = 0; i < current.items.length; i++ ) {
          let item = current.items[i]
          let isMatch = !Object.entries(toMatch).find(([attr, val]) => item[attr] && item[attr] !== val)
          if (isMatch) found.push(item)
          else this._findItems(toMatch, item, found)
        }
      }
      return found
    },
  },     
  watch: {
    mode: {
      handler(mode) {
        this.manifests = null
        if (mode === 'sync') {
          this.loadManifests().then(manifests => this.manifests = manifests.map((manifest, idx) => {return {...manifest, ...this.compareItems[idx]}}))
        } else {
          if (this.viewer) document.getElementById('main').removeChild(document.getElementById('osd'))
        }
      },
      immediate: true
    },
    images() {
      if (!this.images.length === 0) return
      if (this.mode === 'sync') this.initViewer()
    },
    active() { 
      if (this.mode === 'sync') this.initViewer() 
    }
  }
}

</script>

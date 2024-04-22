<template>

  <div ref="root" class="root">
    <div ref="datavis" class="diagram">
      Diagram
    </div>
    <div v-if="caption" class="caption">{{ caption }}</div>
  </div>

</template>

<script setup  lang="ts">

  import { computed, nextTick, ref, toRaw, watch } from 'vue'
  import * as d3plus from 'd3plus'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadowRoot = computed(() => root?.value?.parentNode)
  const datavis = ref<HTMLElement | null>(null)

  const props = defineProps({
    base: { type: String },
    caption: { type: String },
    center: { type: String },
    height: { type: Number },
    url: { type: String },
    width: { type: Number }
  })
  watch(props, () => { evalProps() })

  const window = (self as any).window
  const config = ref<any>(window.config || {})
  const source = computed(() => {
    if (config.value.source) return config.value.source
    else if (props.base) {
      let [owner, repository, branch, ...dir] = props.base.split('/')
      return { owner, repository, branch, dir: dir ? `/${dir.join('/')}/` : '/'}
    }
    return null
  })    
  const ghBaseurl = computed(() => `https://raw.githubusercontent.com/${source.value?.owner}/${source.value?.repository}/${source.value?.branch}${source.value?.dir}`)
  // watch(ghBaseurl, () => console.log(`ghBaseurl=${ghBaseurl.value}`))

  const caption = computed(() => props.caption || 'Caption placehlder' )
  // watch(caption, () => console.log(`caption=${caption.value}`))

  const width = ref()
  watch(width, (width) => {
    host.value.style.width = `${width}px`
    height.value = props.height || host.value.clientHeight
  })
  const height = ref()
  watch(height, height => {
    host.value.style.height = `${height}px`
    init()
  })
  function evalProps() {
    if (props.width) width.value = props.width
    if (props.height) height.value = props.height
  }

  watch(host, (host) => { 
    if (!host) return
    if (props.width) {
      width.value = props.width
    } else {
      new ResizeObserver(e => { width.value = host.parentElement.clientWidth }).observe(host.parentElement)
      width.value = host.parentElement.clientWidth
    }
  })

  function init() {
    var links
    if (!props.url) return
    fetch(props.url).then(resp => resp.text())
      .then(delimitedDataString => {
        links = delimitedStringToObjArray(delimitedDataString)
            .map((item:any) => { return { source: item.source.label, target: item.target.label } })
    })
    .then(() => {
      //remove old viscontent DOM object
      var oldObj = datavis.value?.querySelector('#viscontent')
      if (oldObj) oldObj.remove()

      //add new viscontent DOM object
      var newDiv = document.createElement('div')
      newDiv.setAttribute('id', 'viscontent')
      datavis.value?.appendChild(newDiv)

      console.log(props.center, links)
      console.log(datavis.value)
      new d3plus.Rings() // eslint-disable-line no-undef
        .select(newDiv)
        .links(links)
        .label(d => d.id)
        .center(props.center)
        .render()
    })
  }

  function delimitedStringToObjArray(delimitedData, delimiter=`\t`) {
    const objArray: any[] = []
    const lines = delimitedData.split('\n').filter(line => line.trim() !== '')
    if (lines.length > 1) {
      const keys = lines[0].split(delimiter).map(key => key.trim())
      lines.slice(1).forEach(line => {
        let obj = {}
        line.split(delimiter)
            .map(value => value.trim())
            .forEach((value, i) => {
              let rawKey = keys[i].split('.')
              let key = rawKey[0]
              let prop = rawKey.length === 2 ? rawKey[1] : 'id'
              if (!obj[key]) obj[key] = {}
              if (value || prop === 'id') obj[key][prop] = value
            })
        objArray.push(obj)
      })
      let assignedId = 0
      let labels = {}
      objArray.forEach(obj => {
        Object.values(obj).forEach((child:any) => {
          if (child.id === '' && child.label) {
            if (!labels[child.label]) labels[child.label] = ++assignedId
            child.id = labels[child.label]
          }
        })
      })
    }
    return objArray
  }

</script>

<style>

* { box-sizing: border-box;}

  :host {
    display: flex;
    width: 100%;
  }

  .root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    border: 1px solid red;
    background-color: white;
  }
  .diagram {
    /*
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid blue;
    flex: 1;
    */
    width: 100%;
    height: 100%;
  }
  .caption {
    background-color: white;
    color: black;
    padding: 6px;
    border: 1px solid green;
    width: 100%;
  }

#viscontent {
  width: 500px;
  height: 500px;
}
</style>
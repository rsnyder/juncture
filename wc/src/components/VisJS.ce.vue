<template>

  <div ref="root" class="content">
    <div ref="diagramEl" class="diagram"></div>
    <div v-if="caption" ref="captionEl" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, h, nextTick, ref, toRaw, watch } from 'vue'
  import { Network } from 'vis-network'
  import { DataSet } from 'vis-data/peer'
  import { Timeline as visTimeline } from 'vis-timeline/peer'

  const props = defineProps({
    base: { type: String },
    caption: { type: String },
    height: { type: Number },
    timeline: { type: String },
    edges: { type: String },
    nodes: { type: String },
    url: { type: String },
    hierarchical: { type: Boolean, default: false }
  })

  watch(props, () => {
    setHeight()
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const diagramEl = ref<HTMLElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)

  const window = (self as any).window
  const config = ref<any>(window.config || {})
  const source = computed(() => {
    if (config.value.source?.owner) return config.value.source
    else if (props.base) {
      let [owner, repository, branch, ...dir] = props.base.split('/')
      return { owner, repository, branch, dir: dir ? `/${dir.join('/')}/` : '/'}
    } 
    return null
  })

  const caption = computed(() => props.caption )

  function tableToObjs(tableId:string) {
    let table = document.getElementById(tableId) || host.value.parentElement.querySelector(`#${tableId}`)
    let keys = Array.from(table?.querySelectorAll('th') || []).map((th:any) => th.textContent?.trim())
    return Array.from(table?.querySelectorAll('tbody > tr') || [])
      .map((row:any) =>
        Object.fromEntries(
          Array.from(row.children)
            .map((cell:any, idx) => [keys[idx], cell.textContent?.trim()])
            .filter(([key, value]) => key && value)
        )
      )
      .filter(obj => Object.keys(obj).length > 0)
  }

  function tsvToObjs(tsvData:string) {
    let lines = tsvData.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    let keys = lines[0].split('\t')
    return lines.slice(1).map(line => Object.fromEntries(line.split('\t').map((field, idx) => [keys[idx], field])))
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

  const nodes = ref<any>()
  const edges = ref<any>()
  const timeline = ref<any>()

  const networkData = computed(() => ({nodes: nodes.value, edges: edges.value}))
  watch(networkData, (data) => nextTick(() => new Network(diagramEl.value as HTMLElement, data, {layout: {hierarchical: props.hierarchical}})))  

  const timelineData = computed(() => timeline.value )
  watch(timelineData, (data) => { new visTimeline(diagramEl.value as HTMLElement, data, {}) })  

  function setHeight() {
    let height = (props.height || root.value?.clientHeight || 0) -6
    if (diagramEl.value) diagramEl.value.style.height = `${height - (captionEl.value?.clientHeight || 40)}px`
    if (root.value) root.value.style.height = `${height}px`
  }

  function getDataFromUrl(url:string) {
    if (url.indexOf('http') !== 0) url = `${source.value.dir}${url}`
    fetch(url)
      .then(response => response.text())
      .then(text => {
        let objs = delimitedStringToObjArray(text)
        let _nodes = {}
        objs.forEach(obj => {
          if (!_nodes[obj.source.id]) _nodes[obj.source.id] = {id: obj.source.id, label: obj.source.label}
          if (!_nodes[obj.target.id]) _nodes[obj.target.id] = {id: obj.target.id, label: obj.target.label}
        })
        nodes.value = new DataSet(Object.values(_nodes))
        edges.value = new DataSet(objs.map(obj => ({ from: obj.source.id, to: obj.target.id })))
      })
  }

  watch(diagramEl, (diagramEl) => {
    if (!diagramEl) return
    setHeight()
    if (props.timeline) timeline.value = new DataSet(tableToObjs(props.timeline))
    if (props.edges) edges.value = new DataSet(tableToObjs(props.edges))
    if (props.nodes) nodes.value = new DataSet(tableToObjs(props.nodes))
    if (props.url) getDataFromUrl(props.url)
  })


</script>

<style>

  @import 'vis-timeline/dist/vis-timeline-graph2d.min.css';

  * { box-sizing: border-box; }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important;
    background-color: white;
    width: 100%;
  }

  .diagram {
    display: block;
    flex: 1;
  }

  .caption {
    text-align: start;
    padding: 6px 12px;
    font-size: 1em;
    line-height: 1.1;
    border: 1px solid #ddd;
    background-color: white;
  }

</style>
<template>

  <div ref="root" class="content">
    <div ref="diagramEl" class="diagram" ></div>
    <div v-if="caption" ref="captionEl" class="caption">{{ caption }}</div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  import vis from 'visjs-network'

  const props = defineProps({
    caption: { type: String },
    edges: { type: String },
    height: { type: Number },
    nodes: { type: String },
    url: { type: String },
    width: { type: Number }
  })
  watch(props, () => {
    if (props.width) host.value.style.width = `${props.width}px`
    if (props.height) host.value.style.height = `${props.height}px`
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const diagramEl = ref<HTMLElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)

  const caption = computed(() => props.caption )

  function tableToObjs(tableId:string) {
    let table = document.getElementById(tableId)
    let keys = Array.from(table?.querySelectorAll('th') || []).map(th => th.textContent?.trim())
    console.log(keys)
    return Array.from(table?.querySelectorAll('tbody > tr') || [])
      .map(row =>
        Object.fromEntries(
          Array.from(row.children)
            .map((cell, idx) => [keys[idx], cell.textContent?.trim()])
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
  const data = computed(() => ({nodes: nodes.value, edges: edges.value}))
  watch(data, (data) => new vis.Network(diagramEl.value, data, {}))  

  function setWidth() {
    if (!props.width) new ResizeObserver(() => host.value.style.width = `${host.value.parentNode.clientWidth}px`).observe(host.value.parentNode)
    let _width = props.width || host.value.parentNode.clientWidth
    if (_width) host.value.style.width = `${_width}px`
  }

  function setHeight() {
    let height = 
      props.height
        ? props.height
        : props.width
          ? props.width
          : host.value.parentNode.clientWidth
    host.value.style.height = `${height}px`
    if (diagramEl.value) diagramEl.value.style.height = `${height - (captionEl.value?.clientHeight || 0)}px`
  }

  function getDataFromUrl(url:string) {
    fetch(url)
      .then(response => response.text())
      .then(text => {
        let objs = delimitedStringToObjArray(text)
        let _nodes = {}
        objs.forEach(obj => {
          if (!_nodes[obj.source.id]) _nodes[obj.source.id] = {id: obj.source.id, label: obj.source.label}
          if (!_nodes[obj.target.id]) _nodes[obj.target.id] = {id: obj.target.id, label: obj.target.label}
        })
        nodes.value = new vis.DataSet(Object.values(_nodes))
        edges.value = new vis.DataSet(objs.map(obj => ({ from: obj.source.id, to: obj.target.id })))
      })
  }

  watch(diagramEl, (diagram) => {
    if (!diagram) return
    setWidth()
    setHeight()
    console.log(toRaw(props))
    if (props.edges) edges.value = new vis.DataSet(tableToObjs(props.edges))
    if (props.nodes) nodes.value = new vis.DataSet(tableToObjs(props.nodes))
    if (props.url) getDataFromUrl(props.url)
  })

</script>

<style>

  * { box-sizing: border-box; }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    box-shadow: 0 2px 4px rgb(0,0,0,0.5) !important;
    background-color: white;
  }

  .diagram {
    display: block;
  }

  .caption {
    text-align: start;
    padding: 6px 12px;
    font-size: 1.2em;
    border: 1px solid #ddd;
  }

</style>
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { marked } from 'marked'
  import * as yaml from 'js-yaml'

  import { getEntity as getEntityFromWikidata } from '../utils'

  const props = defineProps({
    file: { type: String },
    language: { type: String, default: 'en' },
    qid: { type: String }
  })
  watch(props, () => { 
    if (props.qid) qid.value = props.qid 
    if (props.file) file.value = props.file 
  })

  const qid = ref(props.qid)
  watch(qid, () => { getEntity() })

  const file = ref(props.file)
  watch(file, () => { getEntity() })

  const entity = ref<any>()
  watch (entity, (entity) => { 
    if (!entity.summaryText) getSummaryText()
  })

  // const baseUrl = computed(() => (window as any).config?.baseUrl)
  const source = computed(() => (window as any).config?.source)

  const summaryText = ref()

  onMounted(() => {
    getEntity() 
  })

  async function getEntity() {
  
  if (file.value) {
    let _baseUrl = source.value?.owner
        ? `https://raw.githubusercontent.com/${source.value.owner}/${source.value.repository}/${source.value.branch}/`
        : '/'
      let mdEntity, yamlEntity
      let extension = file.value.split('.').pop()
      if (extension === 'md') {
        mdEntity = await fetch(`${_baseUrl}${file.value}`)
      } else if (extension === 'yaml') {
        yamlEntity = await fetch(`${_baseUrl}${file.value}`)
      } else {
        [mdEntity, yamlEntity] = await Promise.all([fetch(`${_baseUrl}${file.value}.md`), fetch(`${_baseUrl}${file.value}.yaml`)])
      }
      let _entity:any = yamlEntity?.ok ? yamlToEntity(await yamlEntity.text()) : {}
      if (mdEntity?.ok) _entity = { ..._entity, ...mdToEntity(await mdEntity.text()) }
      if (_entity.id) _entity = {...(await getEntityFromWikidata(_entity.id)), ..._entity }
      entity.value = _entity
    } else if (qid.value) {
      entity.value = await getEntityFromWikidata(qid.value)
    }
  }

  function getSummaryText() {
    if (entity.value.wikipedia) {
      let page: number = entity.value.wikipedia.replace(/\/w\//, '/wiki').split('/wiki/').pop()
      fetch(`https://${props.language}.wikipedia.org/api/rest_v1/page/summary/${page}`)
      .then(resp => resp.json())
      .then(data => {
        summaryText.value = data['extract_html'] || data['extract']
        if (qid.value) (window as any).entityData[qid.value].summaryText = data['extract_html'] || data['extract']
      })
    }
  }

  function mdToEntity(s: string) {
    let el = new DOMParser().parseFromString(marked.parse(s), 'text/html')?.firstChild as HTMLElement
    let label = el?.querySelector('h1,h2,h3,h4,h5,h6')?.textContent
    let thumbnail = el?.querySelector('img')?.src
    let id
    let description: string[] = []
    el.querySelectorAll('p').forEach(p => {
      if (/^Q\d+$/.test(p.textContent?.trim() || '')) id = p.textContent?.trim()
      else description.push(p.textContent || '')
    })
    let _entity: any = {}
    if (label) _entity.label = label
    if (id) _entity.id = id
    if (description.length) _entity.description = description.join('\n')
    if (thumbnail) _entity.thumbnail = thumbnail
    return _entity
  }

  function yamlToEntity(s: string) {
    return yaml.load(s)
  }

</script>

<template>

<sl-card class="card" hoist>
  <img v-if="entity?.thumbnail"
    slot="image"
    :src="entity?.thumbnail"
    :alt="entity?.label"
  />
  <div class="content">
    <h2 v-if="entity?.label" v-html="entity.label"></h2>
    <p v-if="entity?.description" class="description" v-html="entity.description"></p>
    <p v-if="summaryText" class="description" v-html="summaryText"></p>
  </div>

  <div slot="footer">
    <a v-if="!file && qid && entity?.wikipedia"  :href="entity.wikipedia" target="_blank">Wikipedia</a>
  </div>

</sl-card>

</template>

<style>

  .card {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 300px;
    max-height: 800px;
    background-color: white;
    margin: 1em;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  img {
    max-height: 375px;
    object-fit: cover;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5em;
    padding: 0.5em;
    overflow-y: scroll;
  }

  h2 {
    margin: 0;
  }
  .description {
    margin: 0;
    padding: 0;
    font-style: italic;
    font-size: 0.9em;
  }

  .card [slot='footer'] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
  }

</style>

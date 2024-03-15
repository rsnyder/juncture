<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { Md5 } from 'ts-md5'

  const props = defineProps({
    language: { type: String, default: 'en' },
    qid: { type: String }
  })
  watch(props, () => { qid.value = props.qid })

  const qid = ref(props.qid)
  watch(qid, () => { getEntity(qid.value) })

  const entities = ref<any>({})
  const entity = computed(() => qid.value && entities.value[qid.value])
  // watch(entity, () => { console.log(toRaw(entity.value)) })

  const label = computed(() => entity.value?.labels?.[props.language]?.value)
  const description = computed(() => entity.value?.descriptions?.[props.language]?.value)
  const wikipediaLink = computed(() => entity.value && entity.value.sitelinks[`${props.language}wiki`]?.url)

  onMounted(() => { getEntity(qid.value) })

  async function getEntity(qid:any) {
    if (!qid || entities.value[qid]) return
    let url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
    const response = await fetch(url)
    const result = await response.json()
    Object.values(result.entities).forEach((entity:any) => {
      entity.summaryText = {}
      if (entity.claims.P18) {
        entity.image = entity.claims.P18[0].mainsnak.datavalue.value
        entity.thumbnail = mwImage(entity.image)
      }
    })
    entities.value = {...entities.value, ...result.entities}
  }

  function mwImage(mwImg:any, width:number=400) {
    // Converts Wikimedia commons image URL to a thumbnail link
    if (Array.isArray(mwImg)) mwImg = mwImg[0]
    mwImg = mwImg.split('/').pop()
    mwImg = decodeURIComponent(mwImg).replace(/ /g,'_')
    const _md5 = Md5.hashStr(mwImg)
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

</script>

<template>

<sl-card class="card" hoist>
  <img
    slot="image"
    :src="entity?.thumbnail"
    :alt="label"
  />
  <div class="content">
    <h2 v-html="label"></h2>
    <p v-if="description" class="description" v-html="description"></p>
  </div>

  <div slot="footer">
    <a :href="wikipediaLink" target="_blank">Wikipedia</a>
  </div>

</sl-card>

</template>

<style>

  .card {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    height: 400px;
    background-color: white;
    margin: 1em;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  img {
    height: 60%;
    object-fit: cover;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5em;
    padding: 0.5em;
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

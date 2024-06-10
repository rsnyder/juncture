<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { getManifest } from '../utils';

  const root = ref<HTMLElement | null>(null)
  const details = ref<HTMLElement | null>(null)
  watch(details, () => { 
    details.value?.addEventListener('sl-hide', (evt) => { 
      evt.stopPropagation()
      evt.preventDefault()
    })
  })

  const manifest = ref<any>()
  // watch(manifest, (manifest) => { console.log(toRaw(manifest)) })
  
  const metadata = computed(() => manifest.value?.metadata
    ? Object.fromEntries(
      manifest.value.metadata.map((item:any) => [
        (item.label.en || item.label.none || Object.keys(item.label)[0])[0], 
        (item.value.en || item.value.none || Object.keys(item.value)[0])[0]
      ]))
    : {}
  )

  const label = computed(() => manifest.value?.label ? (manifest.value.label[props.language] || manifest.value.label.none || manifest.value.label.en || Object.values(manifest.value.label)[0])[0] : null)

  const summary = computed(() => manifest.value?.summary ? (manifest.value.summary[props.language] || manifest.value.summary.none || manifest.value.summary.en || Object.values(manifest.value.summary)[0])[0] : null)

  const requiredStatement = computed(() => manifest.value?.requiredStatement)

  const attribution = computed(() => {
    if (!requiredStatement.value) return null
    if (requiredStatement.value.label  && requiredStatement.value.value) {
      let labelLang = requiredStatement.value ? lang(requiredStatement.value.label, props.language) : ''
      let label = labelLang ? requiredStatement.value.label[labelLang][0].toLowerCase() : ''
      return label === 'attribution' ? requiredStatement.value.value[lang(requiredStatement.value.value, labelLang)][0] : null
    } else {
      let label = Object.keys(requiredStatement.value).find(key => key.toLowerCase() === 'attribution')
      return label
        ? Array.isArray(requiredStatement.value[label])
          ? requiredStatement.value[label].join(', ')
          : requiredStatement.value[label]
        : null
    }
  })

  const photoDetails = computed(() => [
      metadata.value.camera,
      metadata.value.exposure, 
      metadata.value.mode?.split(',').map(item => titleCase(item.trim()).replace(/[_-]/,' ')).join(', '),
    ]
    .filter((item:any) => item)
    .join(', ')
  )

  const navPlace = computed(() => manifest.value?.navPlace)

  const coords = computed(() =>
    navPlace.value?.features[0]?.geometry.coordinates.join(',')
  )

  const props = defineProps({
    annoid: { type: String },
    caption: { type: String },
    language: { type: String, default: 'en' },
    manifest: { type: Object},
    src: { type: String }
  })
  watch(props, () => {
    if (props.manifest) manifest.value = props.manifest
    else if (props.src) getManifest(props.src).then((data) => manifest.value = data)
  })

  function lang(langObj:any, preferredLang:string = props.language) {
    return langObj[props.language]
      ? preferredLang
      : langObj.none
        ? 'none'
        : langObj.en
          ? 'en'
          : Object.keys(langObj)[0]
  }

  function titleCase(word:string) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }

  onMounted(() => {
    if (props.manifest) manifest.value = props.manifest
    else if (props.src) getManifest(props.src).then((data) => manifest.value = data)
  })

</script>

<template>
  <div class="caption" ref="root">
    <div class="label">{{ caption || label }}</div>
    
    <sl-dropdown ref="details" distance="12" skidding="-30" style="align-self: flex-start;">
      <div slot="trigger" style="display:flex; flex-direction: column;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      </div>
      <div class="details">
        <div class="label" v-html="caption || label"></div>
        <div class="summary" v-html="summary"></div>
        <div v-if="attribution" class="attribution" v-html="attribution"></div>
        <div v-if="photoDetails" class="photo-details">{{ photoDetails }}</div>
        <sl-dropdown v-if="coords" ref="details" distance="12" skidding="-30" placement="top">
          <div slot="trigger" style="cursor:pointer;">
            <span v-html="coords"></span>
          </div>
          <div class="location" style="width:200px;">
            <ve-map v-if="coords" :center="coords" zoom="6" marker></ve-map>
          </div>
        </sl-dropdown>
        <div v-if="annoid" class="annoid" v-text="annoid"></div>
      </div>
    </sl-dropdown>
    
  </div>
</template>

<style>
  .caption {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0.5em;
  }
  .label {
    font-size: 0.9em;
    font-weight: 450;
    line-height: 1.1;
  }
  .summary {
    font-size: 1em;
    font-weight: normal;
  }
  .photo-details,
  .attribution {
    font-size: 0.8em;
    font-weight: 400;
  }

  .details,
  .location {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    background-color: white;
    padding: 0.5em;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    border: 1px solid #ccc;
    border-radius: 3px;
    max-width: 300px;
  }
  sl-dropdown svg {
    width: 1em;
    height: 1em;
    cursor: pointer;
    fill: darkgray;
  }
  sl-dropdown svg:hover {
    fill: #333;
  }
  .annoid {
    font-size: 0.8em;
    font-weight: 400;
    color: #666;
  }
</style>
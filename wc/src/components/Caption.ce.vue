<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { getManifest } from '../utils';

  const root = ref<HTMLElement | null>(null)

  const manifest = ref<any>()
  watch(manifest, (manifest) => { console.log(toRaw(manifest)) })
  
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
    let labelLang = requiredStatement.value ? lang(requiredStatement.value.label, props.language) : ''
    let label = labelLang ? requiredStatement.value.label[labelLang][0].toLowerCase() : ''
    return label === 'attribution' ? requiredStatement.value.value[lang(requiredStatement.value.value, labelLang)][0] : null
  })

  const photoDetails = computed(() => [
      metadata.value.camera,
      metadata.value.exposure, 
      metadata.value.mode?.split(',').map(item => titleCase(item.trim()).replace(/[_-]/,' ')).join(', '),
    ]
    .filter((item:any) => item)
    .join(', ')
  )

  const props = defineProps({
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
    <div class="label">{{ label }}</div>
    <div v-if="attribution" class="attribution" v-html="attribution"></div>
    <!--<div class="summary">{{ summary }}</div>-->
    <div v-if="photoDetails" class="photo-details">{{ photoDetails }}</div>
  </div>
</template>

<style>
  .caption {
    display: flex;
    align-items: first baseline;
    flex-wrap: wrap;
    gap: 0.3em;
  }
  .label {
    font-size: 1.4em;
    font-weight: bold;
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
</style>
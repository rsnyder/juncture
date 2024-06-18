<script setup lang="ts">

  import { onMounted } from 'vue'

  onMounted(() => {
    let annoScript = (Array.from(document.querySelectorAll('script')) as HTMLScriptElement[])
    .find(script => script.src.includes('hypothes.is'))
    if (!annoScript) {
      annoScript = document.createElement('script')
      annoScript.src = 'https://hypothes.is/embed.js'
      annoScript.async = true
      document.body.appendChild(annoScript)
    }
  })

</script>

<template>
</template>

<style>
</style>
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import EventBus from './EventBus'
  import { getEntityData } from '../utils'

  const props = defineProps({
    class: { type: String }
  })

  const time = ref(0)
  const current = ref(null)
  watch (current, (current) => { 
    let el = current ? document.getElementById(current) : null
    document.querySelectorAll('p.active').forEach(p => p.classList.remove('active'))
    if (el) el.classList.add('active')
  })

  const qids = computed(() => {
    let el = current.value ? document.getElementById(current.value) : null
    return el?.dataset.qids ? el?.dataset.qids?.split(/\s+/) : []
  })
  watch(qids, async (qids) => { 
    if (qids.length > 0) {
      entities.value = await getEntityData(qids)
    } else {
      entities.value = {}
    } 
  })

  const entities = ref<any>({})
  watch(entities, (entities) => { console.log(toRaw(entities)) })

  onMounted(() => {
    EventBus.on('video-at-time', (evt) => { 
      time.value = evt.time 
    })
    let syncData = Array.from(document.querySelectorAll(`p[data-head]`))
      .map((el:any) => {
        return { start: hmsToSeconds(el.dataset.head.split(/\s+/)[0]), id: el.id }
      })
    EventBus.on('video-at-time', (evt) => {
      let time = evt.time
      current.value = syncData.find((t:any) => t.start <= time && (syncData[syncData.indexOf(t)+1]?.start || Infinity) > time)?.id
    })
  })

  function hmsToSeconds(str:string) {
    var p = str.split(':').slice(0,3).map(pe => parseInt(pe, 10))
    let secs = 0, m = 1
    while (p.length > 0) {
      let val = p.pop() || 0 
      secs += m * val
      m *= 60
    }
    return secs
  }

  function secondsToHms(input:number) {
    let hours = Math.floor(input / 3600)
    let minutes = Math.floor((input - (hours * 3600)) / 60)
    let seconds = input - (hours * 3600) - (minutes * 60)
    return hours.toString().padStart(2, '0') + ':' + 
      minutes.toString().padStart(2, '0') + ':' + 
      seconds.toString().padStart(2, '0')
  }

</script>

<template>
  <div v-html="secondsToHms(time)"></div>
  <div>
    <p v-for="entity in Object.values(entities)" :key="entity.id" v-html="entity.label"></p>
  </div>
</template>

<style>
</style>
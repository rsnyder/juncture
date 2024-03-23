<template>

  <div ref="root">

    <audio v-if="manifest" ref="html5Player" id="html5-player" controls>
      <source :src="src" :type="mime"/>
    </audio>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'

  import { getItemInfo, getManifest } from '../utils'

  import EventBus from './EventBus'

  const props = defineProps({
    alt: { type: String },
    autoplay: { type: Boolean, default: false },
    caption: { type: String },
    class: { type: String },
    end: { type: Number },
    muted: { type: Boolean, default: true },
    noCaption: { type: Boolean },
    poster: { type: String },
    src: { type: String },
    start: { type: Number },
    sync: { type: Boolean, default: false}
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const html5Player = ref<HTMLAudioElement | null>(null)
  watch (html5Player, async (html5Player) => {
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
    mediaPlayer = html5Player
    monitor()
  })

  const manifest = ref<any>(null)
  const itemInfo = computed(() => manifest.value ? getItemInfo(manifest.value) : null)
  const src = computed(() => itemInfo.value?.id)
  const mime = computed(() => { return itemInfo.value?.format })
  const isInline = computed(() => { return host.value?.style.display === 'inline-block' ? true : false })
  watch (isInline, (isInline) => {
    host.value.style.width = isInline ? '250px' : '100%'
  })

  watch (html5Player, (html5Player) => {
    if (html5Player && isInline.value) {
      html5Player.style.height = '24px'
      html5Player.style.verticalAlign = 'middle'
    }
  })

  let mediaPlayer
  const isMuted = ref(false)
  const isPlaying = ref(false)

  watch (host, async () => {
    // console.log(`audio: type=html5 src=${props.src}`)
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
    addInteractionHandlers()
    EventBus.on('seekto', (evt) => seekTo(evt.start, evt.end))
    if (props.sync) syncAudioWithText()
  })

  function syncAudioWithText() {
    let syncData = Array.from(document.querySelectorAll(`p[data-head]`))
      .map((el:any) => {
        let [timestamp, ...rest] = el.dataset.head.split(/\s+/)
        let timestampLink = document.createElement('a')
        timestampLink.classList.add('play')
        timestampLink.href = 'javascript:;'
        timestampLink.textContent = timestamp
        timestampLink.addEventListener('click', () => {
          seekTo(el.dataset.head)
        })

        el.insertBefore(document.createElement('br'), el.firstChild)
        if (rest.length > 0) {
          let headline = document.createElement('span')
          headline.classList.add('headline')
          headline.textContent = rest.join(' ')
          el.insertBefore(headline, el.firstChild)
        }
        el.insertBefore(timestampLink, el.firstChild)
        return { start: hmsToSeconds(el.dataset.head.split(/\s+/)[0]), id: el.id }
      })
    EventBus.on('video-at-time', (evt) => {
      let time = evt.time
      let text = syncData.find((t:any) => t.start <= time && (syncData[syncData.indexOf(t)+1]?.start || Infinity) > time)
      if (text && mediaPlayer && isPlaying.value) {
        let el = document.getElementById(text.id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  function addInteractionHandlers() {
    let el = host.value.parentElement
    while (el?.parentElement && el.tagName !== 'MAIN') {
      (Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[]).forEach(anchorElem => {
        let link = new URL(anchorElem.href)
        let path = link.pathname.split('/').filter((p:string) => p)
        let platAtIdx = path.indexOf('play')
        if (platAtIdx >= 0 && path.length > platAtIdx+1) {
          let imageEl = findComponentEl(anchorElem)
          if (imageEl) {
            let start = path[platAtIdx+1]
            let end = path.length > platAtIdx + 1 ? path[platAtIdx+2] : null
            // console.log(`Found play link: ${start} ${end}`)
            anchorElem.classList.add('play')
            anchorElem.href = 'javascript:;'
            anchorElem.setAttribute('data-play', end ? `${start} ${end}` : start)
            anchorElem.addEventListener('click', (evt:Event) => {
              let [start, end] = (evt.target as HTMLElement).getAttribute('data-play')?.split(/\s+/) || []
              if (start) seekTo(start, end)
            })
          }
        }
      })
      el = el.parentElement;
    }
  }

  function findComponentEl(el:any) {

    function checkSibs(el:any) {
      let sib = el.previousSibling
      while (sib) {
        if (sib.nodeName === 'MDP-AUDIO') return sib === host.value ? sib : null
        sib = sib.previousSibling
      }
    }

    checkSibs(el)
    while (el.parentElement && el.tagName !== 'BODY') {
      el = el.parentElement
      let videoEl = el.querySelector(':scope mdp-audio')
      if (videoEl) return videoEl === host.value ? videoEl : null
    }
  }

  async function monitor() {
    getCurrentTime().then(time => EventBus.emit('video-at-time', { time: Math.round(time) }))

    setInterval(async () => {
      isMuted.value = await getIsMuted()
      isPlaying.value = await getIsPlaying()

      if (isPlaying.value) getCurrentTime().then(time => EventBus.emit('video-at-time', { time: Math.round(time) }))

    }, 1000)
  }

  async function getIsPlaying() {
    return ! (mediaPlayer.ended || mediaPlayer.paused)
  }

  async function getIsMuted() {
    return await props.muted
  }

  function setMuted(mute:boolean) {
    mediaPlayer.muted = mute
  }

  async function getCurrentTime() {
    return mediaPlayer.currentTime
  }

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

  let timeoutId: any = null
  let forceMuteOnPlay = false

  function seekTo(start:string, end:string='') {
    // console.log(`seekTo: start=${start} end=${end}`)
    let startSecs = hmsToSeconds(start)
    let endSecs = end ? hmsToSeconds(end) + 1 : -1
    // console.log(`seekTo: start=${startSecs} end=${endSecs} isMuted=${isMuted.value} forceMuteOnPlay=${forceMuteOnPlay}`)

    // clear delayed pause
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    let wasMuted = isMuted.value
    // if (forceMuteOnPlay) setMuted(true)

    setTimeout(() => {
      mediaPlayer.play()
      mediaPlayer.currentTime = startSecs
      if (endSecs >= startSecs) {
        timeoutId = setTimeout(() => {
          timeoutId = null
          mediaPlayer.pause()
          if (!wasMuted && forceMuteOnPlay) setMuted(false)
        }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
      }
    }, 200)

  }

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display: block;
    width: 100%;
  }

  audio {
    width: 100%;
  }

</style>


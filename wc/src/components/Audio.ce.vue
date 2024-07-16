<template>

  <div ref="root">

    <audio v-if="manifest" ref="html5Player" id="html5-player" controls  :autoplay="props.autoplay" >
      <source :src="src" :type="mime"/>
    </audio>
    <div v-if="caption" class="caption">{{ caption }}</div>

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
    end: { type: String },
    muted: { type: Boolean, default: true },
    noCaption: { type: Boolean },
    poster: { type: String },
    src: { type: String },
    start: { type: String },
    sync: { type: Boolean, default: false}
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const html5Player = ref<HTMLAudioElement | null>(null)
  watch (html5Player, async (html5Player) => {
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
    mediaPlayer = html5Player
    mediaPlayer.addEventListener('play', () => {
      if (!firstPlay.value) {
        firstPlay.value = true
        if (props.start) seekTo(props.start, props.end)
      }
    })
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
  const firstPlay = ref(false)

  watch (host, async () => {
    // console.log(`audio: type=html5 src=${props.src}`)
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
    addInteractionHandlers()
    EventBus.on('seekto', (evt) => seekTo(evt.start, evt.end))
    if (props.sync) syncAudioWithText()
    else if (props.autoplay && props.start) seekTo(props.start, props.end)
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
    EventBus.on('audio-at-time', (evt) => {
      let time = evt.time
      let text = syncData.find((t:any) => t.start <= time && (syncData[syncData.indexOf(t)+1]?.start || Infinity) > time)
      if (text && mediaPlayer && isPlaying.value) {
        let el = document.getElementById(text.id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  function addInteractionHandlers() {
    // console.log('addInteractionHandlers')
    let scope = host.value?.parentElement
      while (scope) {
        // console.log(scope);
        (Array.from(scope.querySelectorAll('a')) as HTMLAnchorElement[]).forEach( async (anchorElem) => {
          let link = new URL(anchorElem.href)
          let path = link.pathname.split('/').filter((p:string) => p)
          let playAtIdx = path.indexOf('play')
          if (playAtIdx >= 0) {
            let playAt = path[playAtIdx+1]
            let trigger = path.slice(playAtIdx+2).filter(val => val === 'click' || val === 'mouseover')[0] || 'click'
            let targetId = path.slice(playAtIdx+2).filter(val => val !== 'click' && val !== 'mouseover')[0]
            let target

            let paraDataId
            let parent = anchorElem.parentElement
            while (parent && !paraDataId) {
              paraDataId = parent.dataset.id
              parent = parent.parentElement
            }
            if (paraDataId) {
              let mapDataId = host.value?.dataset.id
              if (mapDataId && mapDataId !== paraDataId) return
            }

            if (targetId) {
              target = document.getElementById(targetId)
              if (!target) return
            }

            target = findClosestAudioPlayer(anchorElem)
            if (target !== host.value) return

            // console.log(`playAt: ${playAt} ${trigger} ${targetId || paraDataId}`)

            anchorElem.classList.add('play')
            anchorElem.href = 'javascript:;'
            anchorElem.setAttribute('data-play', playAt)
            anchorElem.addEventListener(trigger, (evt:Event) => {
              let [start, end] = (evt.target as HTMLElement).getAttribute('data-play')?.split(/\s+/) || []
              if (start) seekTo(start, end)
            })
          }
        })
        scope = scope.parentElement;
      }
    }

  function findClosestAudioPlayer(anchorElem: HTMLElement) {
    let found
    let scope = anchorElem.parentElement
    while (scope && !found) {
      found = scope.querySelector('ve-audio')
      scope = scope.parentElement
    }
    return found
  }

  async function monitor() {
    getCurrentTime().then(time => EventBus.emit('audio-at-time', { time: Math.round(time) }))

    setInterval(async () => {
      isMuted.value = await getIsMuted()
      isPlaying.value = await getIsPlaying()

      if (isPlaying.value) getCurrentTime().then(time => EventBus.emit('audio-at-time', { time: Math.round(time) }))

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

  .caption {
    text-align: start;
    padding: 6px 12px;
    font-size: 1em;
    line-height: 1.1;
    border: 1px solid #ddd;
  }

</style>


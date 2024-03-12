<template>

  <div ref="root">
    <div v-if="isYouTube" id="youtube-player" style="width:100%;"></div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import YouTubePlayer from 'youtube-player'
  // import VimeoPlayer from '@vimeo/player'

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
  const shadowRoot = computed(() => root?.value?.parentNode)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const isYouTube = computed(() => props.src?.includes('youtube.com'))
  const isVimeo = computed(() => props.src?.includes('vimeo.com'))
  const isHTML5 = computed(() => !isYouTube.value && !isVimeo.value)

  let mediaPlayer
  const isMuted = ref(false)
  const isPlaying = ref(false)

  watch (host, async () => {
    EventBus.on('seekto', (evt) => seekTo(evt.start, evt.end))
    if (isYouTube.value) await initYoutubePlayer()
    if (props.sync) syncVideoWithText()
  })

  function syncVideoWithText() {
    let syncData = Array.from(document.querySelectorAll(`p[data-head]`))
      .map((el:any) => {
        let head = document.createElement('span')
        head.innerHTML = el.dataset.head
        head.addEventListener('click', () => {
          seekTo(el.dataset.head)
        })
        el.insertBefore(document.createElement('br'), el.firstChild)
        el.insertBefore(head, el.firstChild)
        return { start: hmsToSeconds(el.dataset.head.split(/\s+/)[0]), id: el.id }
      })
    EventBus.on('video-at-time', (evt) => {
      let time = evt.time
      let text = syncData.find((t:any) => t.start <= time && (syncData[syncData.indexOf(t)+1]?.start || Infinity) > time)
      if (text) {
        let el = document.getElementById(text.id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  async function initYoutubePlayer() {
    let playerEl = shadowRoot.value?.querySelector('#youtube-player') as HTMLElement
    if (props.src && playerEl) {
      let parsed = new URL(props.src)
      let videoId = parsed.searchParams.get('v') || ''
      let metadata = await youtubeMetadata(videoId)
  
      if (host.value) new ResizeObserver(() => { 
        playerEl = shadowRoot.value?.querySelector('#youtube-player') as HTMLElement
        let width = playerEl?.clientWidth
        let height =  Math.round(width / metadata.aspect)
        // console.log(`Resize player: ${width} x ${height}`)
        playerEl.style.height = `${height}px`
       } ).observe(host.value)

      mediaPlayer = YouTubePlayer(
        playerEl as HTMLElement, {
          videoId,
          width: playerEl?.clientWidth,
          playerVars: {
            color: 'white',
            rel: 0,
            modestbranding: 1,
            playsinline: 1
          }
      })
      mediaPlayer.on('ready', (evt:any) => monitor())
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
    if (isYouTube) return await mediaPlayer.getPlayerState() === 1
    else if (isVimeo) return !(await mediaPlayer.getEnded() || await mediaPlayer.getPaused())
    else if (isHTML5) return ! (mediaPlayer.ended || mediaPlayer.paused)
    return false
  }

  async function getIsMuted() {
    if (isYouTube) return await mediaPlayer.isMuted()
    else if (isVimeo) return await mediaPlayer.getMuted()
    else return await props.muted
  }

  function setMuted(mute:boolean) {
    if (isYouTube) {
      if (mute) mediaPlayer.mute()
      else mediaPlayer.unMute()
    } 
    else if (isVimeo) mediaPlayer.setMuted(mute)
    else if (isHTML5) mediaPlayer.muted = mute
  }

  async function getCurrentTime() {
    if (isYouTube) return mediaPlayer.getCurrentTime()
    else if (isVimeo) return await mediaPlayer.getCurrentTime()
    else if (isHTML5) return mediaPlayer.currentTime
  }

  async function youtubeMetadata(videoId:any) {
    let videoUrl = encodeURI(`https://www.youtube.com/watch?v=${videoId}`)
    let url = `https://youtube.com/oembed?url=${videoUrl}&format=json`
    let resp = await fetch(url)
    let data:any = await resp.json()
    data.aspect = data.width/data.height
    return data
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
    // console.log(`seekTo: start=${startSecs} startElem=${startTimes.value[startSecs] !== undefined} end=${endSecs} isMuted=${isMuted.value} forceMuteOnPlay=${forceMuteOnPlay}`)

    // clear delayed pause
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    let wasMuted = isMuted.value
    // if (forceMuteOnPlay) setMuted(true)

    if (isYouTube) {
      mediaPlayer.playVideo()
      mediaPlayer.seekTo(startSecs).then((_:any) => {
        if (endSecs >= startSecs) {
          timeoutId = setTimeout(() => {
            mediaPlayer.pauseVideo().then((_:any) => {
              timeoutId = null
              if (!wasMuted && forceMuteOnPlay) setMuted(false)
            })
          }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
        }
      })
    }
  
    else if (isVimeo) {
      mediaPlayer.setCurrentTime(startSecs)
      mediaPlayer.play().then((_:any) => {
        if (endSecs >= startSecs) {
          timeoutId = setTimeout(() => {
            mediaPlayer.pause().then((_:any) => {
              timeoutId = null
              if (!wasMuted && forceMuteOnPlay) setMuted(false)
            })
          }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
        }
      })
    }

    else if (isHTML5) {
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

  }

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display: block;
    background-color: inherit;
  }

</style>


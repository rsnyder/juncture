<template>

  <div ref="root">

    <div v-if="isYouTube" id="youtube-player" style="width:100%;"></div>

    <video v-if="manifest" ref="html5Player" id="html5-player" controls playsinline :muted="props.muted" :autoplay="props.autoplay" :poster="props.poster">
      <source :src="src" :type="mime"/>
    </video>
  
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  import YouTubePlayer from 'youtube-player'
  // import VimeoPlayer from '@vimeo/player'

  import { getItemInfo, getManifest } from '../utils'

  import EventBus from './EventBus'

  const props = defineProps({
    alt: { type: String },
    autoplay: { type: Boolean, default: false },
    caption: { type: String },
    class: { type: String },
    end: { type: Number },
    id: { type: String },
    muted: { type: Boolean, default: true },
    noCaption: { type: Boolean },
    poster: { type: String },
    src: { type: String },
    start: { type: Number },
    sync: { type: Boolean, default: false},
    vid: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const html5Player = ref<HTMLVideoElement | null>(null)
  watch(html5Player, (html5Player) => {
    mediaPlayer = html5Player
    monitor()
  })
  const isYouTube = computed(() => props.src?.includes('youtube.com') || props.id || props.vid)
  const isVimeo = computed(() => props.src?.includes('vimeo.com'))
  const isHTML5 = computed(() => !isYouTube.value && !isVimeo.value)
  watch(isHTML5, async () => {
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
   })

  const manifest = ref<any>(null)
  const itemInfo = computed(() => manifest.value ? getItemInfo(manifest.value) : null)
  const src = computed(() => itemInfo.value?.id)
  const mime = computed(() => {
    let fileExtension = src.value?.split('#')[0].split('.').pop()
    return fileExtension === 'mp4'
      ? 'video/mp4'
      : fileExtension === 'webm'
        ? 'video/webm'
        : 'application/ogg'
  })

  let mediaPlayer
  const isMuted = ref(false)
  const isPlaying = ref(false)

  watch (host, async () => {
    let videoType = isYouTube.value ? 'youtube' : isVimeo.value ? 'vimeo' : 'html5'
    if (videoType === 'html5' && !manifest.value && props.src) manifest.value = await getManifest(props.src)
    addInteractionHandlers()
    EventBus.on('seekto', (evt) => seekTo(evt.start, evt.end))
    if (isYouTube.value) await initYoutubePlayer()
    if (props.sync) syncVideoWithText()
  })

  function syncVideoWithText() {
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
    
    let activePara = null
    EventBus.on('video-at-time', (evt) => {
      let time = evt.time
      let text = syncData.find((t:any) => t.start <= time && (syncData[syncData.indexOf(t)+1]?.start || Infinity) > time)
      // if (text && mediaPlayer && isPlaying.value) {
      if (text && text?.id !== activePara) {
        activePara = text.id
        let textEl = document.getElementById(text.id)
        document.querySelectorAll('p.active').forEach(p => p.classList.remove('active'))
        if (textEl) textEl.classList.add('active')
        if (textEl) textEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
        if (sib.nodeName === 'VE-VIDEO') return sib === host.value ? sib : null
        sib = sib.previousSibling
      }
    }

    checkSibs(el)
    while (el.parentElement && el.tagName !== 'BODY') {
      el = el.parentElement
      let videoEl = el.querySelector(':scope ve-video')
      if (videoEl) return videoEl === host.value ? videoEl : null
    }
  }

  async function initYoutubePlayer() {
    let playerEl = shadowRoot.value?.querySelector('#youtube-player') as HTMLElement
    let videoId = props.id || props.vid || props.src && new URL(props.src).searchParams.get('v')
    if (videoId && playerEl) {
      let metadata = await youtubeMetadata(videoId)
  
      if (host.value) new ResizeObserver(() => { 
        playerEl = shadowRoot.value?.querySelector('#youtube-player') as HTMLElement
        let width = playerEl?.clientWidth
        let height =  Math.round(width / metadata.aspect)
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
    if (isYouTube.value) return await mediaPlayer.getPlayerState() === 1
    else if (isVimeo.value) return !(await mediaPlayer.getEnded() || await mediaPlayer.getPaused())
    else if (isHTML5) return ! (mediaPlayer.ended || mediaPlayer.paused)
    return false
  }

  async function getIsMuted() {
    if (isYouTube.value) return await mediaPlayer.isMuted()
    else if (isVimeo.value) return await mediaPlayer.getMuted()
    else return await props.muted
  }

  function setMuted(mute:boolean) {
    if (isYouTube.value) {
      if (mute) mediaPlayer.mute()
      else mediaPlayer.unMute()
    } 
    else if (isVimeo.value) mediaPlayer.setMuted(mute)
    else if (isHTML5.value) mediaPlayer.muted = mute
  }

  async function getCurrentTime() {
    if (isYouTube.value) return mediaPlayer.getCurrentTime()
    else if (isVimeo.value) return await mediaPlayer.getCurrentTime()
    else if (isHTML5.value) return mediaPlayer.currentTime
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
    // console.log(`seekTo: start=${startSecs} end=${endSecs} isMuted=${isMuted.value} forceMuteOnPlay=${forceMuteOnPlay}`)

    // clear delayed pause
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    let wasMuted = isMuted.value
    // if (forceMuteOnPlay) setMuted(true)

    if (isYouTube.value) {
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
  
    else if (isVimeo.value) {
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

    else if (isHTML5.value) {
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

  video {
    width: 100%;
    height: auto;
  }

</style>


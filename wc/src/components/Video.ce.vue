<template>

 <!-- <div ref="main" class="main" :style="`visibility:${playerHeight ? 'visible' : 'hidden'}`"> -->
<div ref="main" class="main">
    <div v-if="isYouTube"
      id="youtube-player"
      ref-="youtubePlayer"
      :style="{
        width: '100%',
        height: playerHeight + 'px',
        position: 'relative'
      }">
      <!--
      <div
        class="poster"
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: showPoster ? 2 : 0,
          backgroundImage,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }"
        @click="showPoster = false"
      ></div>
      -->
      <div
        class="player" 
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 1,
        }"
        ></div>
    </div>
    <video v-if="manifest" ref="html5Player" controls playsinline 
      id="html5-player" 
      :muted="props.muted" 
      :autoplay="props.autoplay" 
      :poster="props.poster"
    >
      <source :src="src" :type="mime"/>
    </video>
    <div v-if="caption" class="caption" ref="captionEl" v-html="caption"></div>
  
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  import YouTubePlayer from 'youtube-player'
  // import VimeoPlayer from '@vimeo/player'

  import { getItemInfo, getManifest } from '../utils'

  import EventBus from './EventBus'

  import { marked } from 'marked'

  const props = defineProps({
    alt: { type: String },
    autoplay: { type: Boolean, default: false },
    caption: { type: String, default: null },
    class: { type: String },
    end: { type: String },
    fit: { type: String },
    height: { type: Number },
    id: { type: String },
    muted: { type: Boolean, default: true },
    noCaption: { type: Boolean },
    poster: { type: String },
    src: { type: String },
    start: { type: String },
    sync: { type: Boolean, default: false},
    vid: { type: String },
    width: { type: Number }
  })

  const main = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => main?.value?.parentNode)
  const host = computed(() => (main.value?.getRootNode() as any)?.host)

  const caption = ref(props.caption && htmlFromMarkdown(props.caption))
  // watch(caption, () => { console.log(`caption="${caption.value}"`) })

  const html5Player = ref<HTMLVideoElement | null>(null)
  const captionEl = ref<HTMLElement | null>(null)
  watch(html5Player, (html5Player) => {
    mediaPlayer = html5Player
    mediaPlayer.addEventListener('play', () => {
      if (!firstPlay.value) {
        firstPlay.value = true
        if (props.start) seekTo(props.start, props.end)
      }
    })
    monitor()
  })
  const isYouTube = computed(() => {
    // console.log(props.src, /^[A-Za-z0-9-]+$/.test(props.src || ''))
    return props.src?.includes('youtube.com') || /^[A-Za-z0-9-]+$/.test(props.src || '') || props.id || props.vid
  })
  const showPoster = ref(false)

  const isVimeo = computed(() => props.src?.includes('vimeo.com'))
  const isHTML5 = computed(() => !isYouTube.value && !isVimeo.value)
  watch(isHTML5, async () => {
    if (!manifest.value && props.src) manifest.value = await getManifest(props.src)
   })

  const manifest = ref<any>(null)
  const itemInfo = computed(() => manifest.value ? getItemInfo(manifest.value) : null)
  const src = computed(() => itemInfo.value?.id)
  const youtubeId = computed(() => {
    return isYouTube.value 
      ? props.src?.includes('youtube.com')
        ? new URL(props.src).searchParams.get('v')
        : /^[A-Za-z0-9-]+$/.test(props.src || '')
          ? props.src
          : props.vid || props.id
      : null
  })
  // watch (youtubeId, (youtubeId) => { console.log(`youtubeId=${youtubeId}`)})
  const playerHeight = ref(0)
  const backgroundImage = computed(() => `url("https://img.youtube.com/vi/${youtubeId.value}/maxresdefault.jpg")` )

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
  const firstPlay = ref(false)

  const definedWidth = ref(props.width || (host.value?.style.width && main.value?.clientWidth))
  const definedHeight = ref(props.height || (host.value?.style.height && main.value?.clientHeight))

  const width = ref(definedWidth.value || host.value?.clientWidth)
  const height = ref(definedHeight.value || width.value)
  watch(height, (height) => { if (main.value) main.value.style.height = `${height}px` })

  function setDimensions() {
    definedWidth.value = props.width || (host.value.style.width && main.value?.clientWidth)
    definedHeight.value = props.height || (host.value.style.height && main.value?.clientHeight)
    width.value = definedWidth.value || main.value?.clientWidth
    height.value  = (definedHeight.value || playerHeight.value || width.value)
    // console.log(`setDimensions: width=${width.value} height=${height.value} definedWidth=${definedWidth.value} definedHeight=${definedHeight.value}`)
  }

  watch (host, async () => {
    // youtubeMetadata(youtubeId.value)
    new ResizeObserver(() => setDimensions()).observe(host.value.parentElement)
    let videoType = isYouTube.value ? 'youtube' : isVimeo.value ? 'vimeo' : 'html5'
    if (videoType === 'html5' && !manifest.value && props.src) manifest.value = await getManifest(props.src)
    addInteractionHandlers()
    EventBus.on('seekto', (evt) => seekTo(evt.start, evt.end))
    if (youtubeId.value) await initYoutubePlayer()
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
    // console.log('addInteractionHandlers')
    let scope = host.value?.parentElement
    while (scope) {
      // console.log(scope);
      (Array.from(scope.querySelectorAll('a')) as HTMLAnchorElement[]).forEach( async (anchorElem) => {
        let link = new URL(anchorElem.href)
        let path = link.pathname.split('/').filter((p:string) => p).map(p => p.toLowerCase()).map(p => p === 'playat' ? 'play' : p)
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

          target = findClosestPlayer(anchorElem, 've-video')
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

  function findClosestPlayer(anchorElem: HTMLElement, playerTag) {
    let found
    let scope = anchorElem.parentElement
    while (scope && !found) {
      found = scope.querySelector(playerTag)
      scope = scope.parentElement
    }
    return found
  }

  /* YouTube

   States:
    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued)
  */
  async function initYoutubePlayer() {
    let playerWrapperEl = shadowRoot.value?.querySelector('#youtube-player') as HTMLElement
    if (youtubeId.value && playerWrapperEl) {
      let metadata = await youtubeMetadata(youtubeId.value)
      if (props.caption === null) caption.value = metadata.title
  
      if (host.value) new ResizeObserver(() => { 
        let viewerWidth = playerWrapperEl?.clientWidth
        let videoHeight = Math.round(viewerWidth / metadata.aspect)
        let captionHeight = captionEl.value?.clientHeight || 0
        playerHeight.value = definedHeight.value || (videoHeight + captionHeight)
        if (main.value) main.value.style.height = `${playerHeight.value}px`

        // console.log(`videoHeight=${videoHeight} captionHeight=${captionHeight} viewerWidth=${viewerWidth} playerHeight=${playerHeight.value}`)
        
      }).observe(host.value)

      playerWrapperEl.style.height = playerHeight.value + 'px'
      let playerEl = playerWrapperEl.querySelector('.player')

      mediaPlayer = YouTubePlayer(
        playerEl as HTMLElement, {
          videoId: youtubeId.value,
          width: playerEl?.clientWidth,
          playerVars: {
            color: 'white',
            rel: 0,
            modestbranding: 1,
            playsinline: 1
          }
      })
      mediaPlayer.on('ready', (evt:any) => {
        monitor()
        mediaPlayer.on('stateChange', (evt:any) => {
          if (evt.data === 1) {
            if (!firstPlay.value) {
              firstPlay.value = true
              if (props.start) seekTo(props.start, props.end)
            }
          }
        })
        if (props.autoplay) {
          mediaPlayer.playVideo()
          if (props.start) seekTo(props.start, props.end)
        }
      })
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
    // console.log('youtubeMetadata', data)
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

  function htmlFromMarkdown(md) { return md ? marked.parse(md).slice(3,-5) : '' }

</script>

<style>

  * { box-sizing: border-box; }

  .main {
    display: flex;
    flex-direction: column;
    background-color: inherit;
  }

  video {
    width: 100%;
    height: auto;
  }

  #youtube-player {
    flex-grow: 1;
  }

  .caption {
    padding: 0.3em;
    width: 100%;
    font-size: 1em;
    font-weight: 500;
    text-align: left;
    line-height: 1.3;
    margin-bottom: 0.3em;
  }

</style>


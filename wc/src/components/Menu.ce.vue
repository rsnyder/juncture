<template>

  <sl-dropdown ref="root">
    <sl-button slot="trigger">
      <svg xmlns="http://www.w3.org/2000/svg" slot="prefix" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </sl-button>
    <sl-menu>
      
      <sl-menu-item v-for="item in menuItems" @click="menuItemSelected(item, $event)">
        <span v-html="item.label"></span>
        <svg v-if="item.icon" slot="prefix" v-html="item.icon"></svg>
        <span v-else slot="prefix" style="width:1em; margin-right:1em;"></span>
      </sl-menu-item>
      
      <sl-menu-item v-if="pdfDownloadEnabled" @click="generatePDF">
        <span>Download as PDF</span>
        <img slot="prefix" width="16" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Noun_Project_PDF_icon_117327_cc.svg" alt="PDF Download Icon">
      </sl-menu-item>

      <!-- Auth -->
      <sl-menu-item v-if="props.auth && isLoggedIn" @click="logout">
        <span class="font-medium">({{user?.name || user?.email}})</span>
        <span class="font-medium"> Logout</span>
        <svg slot="prefix" v-html="icons.user"></svg>
      </sl-menu-item>

      <sl-menu-item v-if="props.auth && !isLoggedIn" @click="login">
        <span class="font-medium">Login with {{ titleCase(props.auth) }}</span>
        <svg slot="prefix" v-html="icons.login"></svg>
      </sl-menu-item>
      <!-- End Auth -->

    </sl-menu>
  </sl-dropdown>

  <!-- Generating PDF Dialog -->
  <div ref="overlayRef">
    <div ref="modalRef" id="hs-basic-modal" class="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div class="p-4 overflow-y-auto flex items-center gap-4 text-black">
            <sl-spinner style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner>
            <p v-html="modalText"></p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  // @ts-ignore
  import { HSOverlay } from '../lib/preline/components/hs-overlay'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  watch(host, () => { 
    getMenuItems() 
  })
  
  const overlayRef = ref<HTMLElement | null>(null)
  const overlayEl = computed(() => overlayRef?.value as HTMLElement)
  const overlay = computed(() =>  new HSOverlay(overlayEl.value) )

  const modalRef = ref<HTMLElement | null>(null)
  const modalEl = computed(() => modalRef?.value as HTMLElement)

  const modalText = ref('Generating PDF...')

  watch(modalEl, (modal) => { 
    overlay.value.init()
    modal.addEventListener('open.hs.overlay', (e:any) => isOpen.value = true)
    modal.addEventListener('close.hs.overlay', (e:any) => isOpen.value = false)
  })

  const isOpen = ref(false)
  watch(isOpen, (isOpen) => {
    if (isOpen) overlay.value.open(modalEl.value)
    else overlay.value.close(modalEl.value)
  })

  const props = defineProps({
    auth: { type: String },
    contact: { type: String },
    pdfDownloadEnabled: { type: Boolean, default: false}
  })

  onMounted(async () => {
    if (props.auth === 'github') setupGithubAuth()
  })

  const menuItems = ref<any[]>([])
  // watch(menuItems, () => console.log('menuItems', toRaw(menuItems.value)))

  function getMenuItems() {
    function parseSlot() {
      let items = Array.from(host.value.querySelectorAll('li'))
        .map((li: any) => {
          const a = li.querySelector('a') as HTMLAnchorElement
          let label = a?.innerText.trim()
          let icon = (li.querySelector('svg') as SVGElement)?.outerHTML
          if (!icon) {
            let action = a?.href.split('/').filter((x:string) => x).pop()?.toLowerCase() || ''
            action = location.host === action 
              ? 'home' 
              : action.indexOf('search') === 0
                ? 'search'
                : action
            if (icons[action]) icon = icons[action]
          }
          return { label, icon, href: a?.href }
        })
        if (props.contact) items.push({ label: 'Contact Us', icon: icons.contact, href: '/contact' })
      menuItems.value = items
    }
    parseSlot()
    new MutationObserver(
      (mutationsList:any) => {
        for (let mutation of mutationsList) { if (mutation.type === 'childList') parseSlot() }      
      }
    ).observe(host.value, { childList: true, subtree: true })
  }

  function menuItemSelected(item: any, evt:Event) {
    // console.log('menuItemSelected', toRaw(item))
    let action = item.href.split('/').filter((x:string) => x).pop().toLowerCase()
    action = location.host === action 
      ? 'home' 
      : action.indexOf('search') === 0
        ? 'search'
        : action
    if (action === 'contact') mailto()
    else if (action === 'home')
      location.href = item.href
    else if (action === 'search')
      window.open(item.href, '_blank')
    else {
      let href = new URL(item.href)
      if (href.origin === location.origin) {
        let baseurl = ((window as any)?.config || {})?.baseurl || ''
        let path = `${baseurl}${href.pathname}`
        location.pathname = path
      } else {
        location.href = item.href
      }
    }
  }

  function mailto() {
    const email = props.contact
    const subject = `${(window as any).config.title} Contact`
    const bodyText = ''
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${bodyText}`
    window.open(mailtoLink, '_blank')
  }

  async function generatePDF() {
    // console.log(`Generating PDF for ${location.href}`)
    modalText.value = 'Generating PDF...'
    isOpen.value = !isOpen.value
    let source = (window as any).config?.source
    let loc = new URL(location.href)
    let url = loc.hostname == 'localhost' ? `https://v3.juncture-digital.org?source=${source.owner}/${source.repository}/${source.branch}/${source.path}` : loc.href
    console.log('generatePDF for url:', url)
    let landscape = document.querySelector('article.j1') ? true : false
    let resp = await fetch(`https://ezsitepdf-drnxe7pzjq-uc.a.run.app/pdf?url=${encodeURIComponent(url)}${landscape ? '&landscape=true' : ''}`)
    if (resp.ok) {
      let fname = source.path.split('/').filter(pe => pe).filter(pe => pe !== 'README.md' && pe !== 'index.md')?.pop().replace('.md', '') || 'document'
      modalText.value = 'Downloading PDF...'
      let pdf = await resp.blob()
      const aElement = document.createElement('a')
      aElement.setAttribute('download', `${fname}.pdf`)
      const href = URL.createObjectURL(pdf)
      aElement.href = href
      aElement.setAttribute('target', '_blank')
      aElement.click()
      aElement.addEventListener
      URL.revokeObjectURL(href)
    }
    setTimeout(() => isOpen.value = false, 2000)
  }

  const icons = {
    about: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
    contact: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>',
    editor: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>',
    home: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>',
    login: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>',
    tools: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>',
    wb: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>',
    workbench: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>',
  }

  const window = (self as any).window
  const config = ref<any>(window.config || {})
  const user = ref<any>(null)
  const userCanUpdateRepo = ref(false)
  // watch (userCanUpdateRepo, () => console.log('userCanUpdateRepo', userCanUpdateRepo.value))

  watch(user, () => {
    if (user.value) {
      localStorage.setItem('auth-user', JSON.stringify(user.value))
      localStorage.setItem('gh-auth-token', user.value.token) // For J1 compatibility
      localStorage.setItem('gh-username', user.value.username) // For J1 compatibility
    } else {
      if (localStorage.getItem('auth-user')) localStorage.removeItem('auth-user')
      if (localStorage.getItem('gh-auth-token')) localStorage.removeItem('gh-auth-token')
      if (localStorage.getItem('gh-username')) localStorage.removeItem('gh-username')
    }
  })

  const isLoggedIn = computed(() => {
    return user.value?.token || user.value?.token || false
  })
  watch(isLoggedIn, () => {
    if (!isLoggedIn.value) userCanUpdateRepo.value = false
  })

  function titleCase(word:string) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }

  function login(evt:Event) {
    evt.preventDefault()
    ghLogin()
  }

  function logout(evt:Event) {
    evt.preventDefault()
    user.value = null
    ghLogout()
  }

  /***************** Github auth *****************/
  
  const clientIds:any = {
    'iiif.mdpress.io': '9baccef56771878fd304',
    'www.mdpress.io': '12548925f073dccf16d4',
    'v3.juncture-digital.org': 'Ov23li6BZxay7BGbQwHe'
  }

  async function setupGithubAuth() {
    let _user: any = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
    if (_user?.provider === 'github') user.value = _user
    else user.value = null
    let searchParams = new URL(window.location.href).searchParams
    let code = searchParams.get('code')
    let source = searchParams.get('source')
    if (code) {
      let href = `${location.pathname}${location.hash}` + (source ? `?source=${source}` : '')
      window.history.replaceState({}, '', href)
      let url = `https://iiif.mdpress.io/gh-token?code=${code}&hostname=${window.location.hostname}`
      let resp = await fetch(url)
      if (resp.ok) {
        let token = await resp.text()
        let _user = await getGhUserInfo(token)
        user.value = _user
      }
    }
    if (user.value && config.value?.github) {
      userCanUpdateRepo.value = await isCollaborator(config.value?.github.owner_name, config.value?.github.repository_name, user.value.username, user.value.token)
    }
  }

  async function ghLogin() {
    let hostname = (new URL(window.location.href)).hostname
    let isDev = hostname === 'localhost' || hostname.indexOf('192.168.') === 0
    if (isDev) {
      // let resp = await fetch('http://localhost:8088/gh-token?hostname=localhost&code=testing')
      let resp = await fetch('https:iiif.mdpress.io/gh-token?hostname=localhost&code=testing')
      if (resp.ok) {
        let token = await resp.text()
        let _user = await getGhUserInfo(token)
        user.value = _user
        userCanUpdateRepo.value = await isCollaborator(config.value?.github?.owner_name, config.value?.github?.repository_name, user.value.username, token)
        location.reload()
      }
    } else {
      let source = new URL(location.href).searchParams.get('source')
      let redirectTo = `${window.location.href}`
      let href = clientIds[location.hostname] !== undefined
        ? `https://github.com/login/oauth/authorize?client_id=${clientIds[location.hostname]}&scope=repo&state=juncture&redirect_uri=${redirectTo}` + (source ? `&source=${source}` : '')
        : null
      if (href) window.location.href = href
    }
  }

  function ghLogout() {
    Object.keys(localStorage)
    .filter(key => key === 'auth-user' || key === 'gh-auth-token' || key === 'gh-username')
    .forEach(key => localStorage.removeItem(key))
    user.value = null
    location.reload()
  }

  async function getGhUserInfo(token:string) {
    let resp = await fetch('https://api.github.com/user' ,{
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`
      }
    })
    if (resp.ok) {
      let info = await resp.json()
      return { provider: 'github', username: info.login, name: info.name, email: info.email, token }
    }
  }

  async function isCollaborator(owner: string, repo: string, username: string, token: string) {
    // console.log(`GithubClient.isCollaborator: owner=${owner} repo=${repo} username=${username}`)
    let url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`
    let resp = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`
      }
    })
    return resp.ok && resp.status === 204
  }
</script>

<style>
  @import '@shoelace-style/shoelace/dist/themes/light.css';
  @import '../tailwind.css';
  sl-menu-item svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    margin-right: 1em;
  }
</style>

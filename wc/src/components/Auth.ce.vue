<template>

  <div ref="root" class="main">

    <sl-tooltip v-if="isLoggedIn" :content="`Logged in as ${username}`" placement="bottom">
      <sl-button variant="default" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
        Logout
      </sl-button>
    </sl-tooltip>

    <sl-tooltip v-else content="Click to Login with Github" placement="top">
      <sl-button variant="default" @click="login">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
        Login with Github
      </sl-button>
    </sl-tooltip>

  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  const clientIds:any = {
    'www.juncture-digital.org': 'f7247e1e4769ba7c61e4',
    'dev.juncture-digital.org': 'bb290b5a738cb6fe31c7',
    'search.juncture-digital.org': 'ce9f2d2fb0a3498569fd',
    'v3.juncture-digital.org': 'Ov23li6BZxay7BGbQwHe'
  }

  const user = ref<any>(null)
  const username = computed(() => user.value?.name || user.value?.username || user.value?.email )
  const isLoggedIn = computed(() => user.value?.token ? true : false )

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

  onMounted(async () => { setupGithubAuth() })

  function login(evt:Event) {
    evt.preventDefault()
    ghLogin()
  }

  function logout(evt:Event) {
    evt.preventDefault()
    user.value = null
    ghLogout()
  }

  async function setupGithubAuth() {
    let _user: any = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
    if (_user?.provider === 'github') user.value = _user
    else user.value = null
    let searchParams = new URL(location.href).searchParams
    let code = searchParams.get('code')
    let source = searchParams.get('source')
    console.log(`setupGithubAuth: hostname=${window.location.hostname} code=${code} source=${source}`)
    if (code) {
      let href = `${location.pathname}${location.hash}` + (source ? `?source=${source}` : '')
      window.history.replaceState({}, '', href)
      let url = `https://iiif.mdpress.io/gh-token?code=${code}&hostname=${window.location.hostname}`
      let resp = await fetch(url)
      let token = resp.ok ? await resp.text() : null
      console.log(`token=${token}`)
      if (token) {
        let _user = await getGhUserInfo(token)
        user.value = _user
      }
    }
  }

  async function ghLogin() {
    let hostname = (new URL(window.location.href)).hostname
    let clientId = clientIds[hostname]
    let isDev = hostname === 'localhost' || hostname.indexOf('192.168.') === 0
    console.log(`ghLogin: hostname=${hostname}, isDev=${isDev} clientIds=${clientId}`)
    if (isDev) {
      let resp = await fetch(`https:iiif.mdpress.io/gh-token?hostname=${hostname}&code=testing`)
      if (resp.ok) {
        let token = await resp.text()
        let _user = await getGhUserInfo(token)
        user.value = _user
        location.reload()
      }
    } else {
      let href = clientId
        ? `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=juncture&redirect_uri=${location.href}`
        : null
      // if (href) window.location.href = href
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
    console.log(resp)
    if (resp.ok) {
      let info = await resp.json()
      console.log(info)
      return { provider: 'github', username: info.login, name: info.name, email: info.email, token }
    }
  }

</script>

<style>
  
  :host {
    display: inline-block;
  }
  
  div {
    color: blue;
  }
  div:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  svg {
    width: 2em;
    height: 2em;
    vertical-align: middle;
    margin-right: 1em;
  }

</style>
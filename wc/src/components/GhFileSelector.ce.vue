
<template>

  <div ref="root">

    <sl-breadcrumb>

      <sl-breadcrumb-item>
        <sl-dropdown>
          <sl-input ref="acctInput" slot="trigger" size="medium" placeholder="Github username" autocomplete="off" @keyup="inputHandler" :value="acct"></sl-input>
          <sl-menu ref="acctMenu"> 
            <sl-menu-item v-for="_acct, idx in accts" :key="`acct-${idx}`" @click="accountSelected(_acct)" v-html="_acct.login" :class="{'selected': _acct.login === acct}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item>
        <sl-dropdown v-if="repos.length">
          <sl-button slot="trigger" size="medium" v-html="repo"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_repo, idx in repos" :key="`repo-${idx}`" @click="repoSelected(_repo)" v-html="_repo.name" :class="{'selected': _repo.name === repo}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item>
        <sl-dropdown v-if="branches.length">
          <sl-button slot="trigger" size="medium" v-html="branch"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_branch, idx in branches" :key="`branch-${idx}`" @click="branchSelected(_branch)" v-html="_branch.name" :class="{'selected': _branch.name === branch}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item v-for="pathElem, pidx in path" :key="`pe-${pidx}`">
        <sl-dropdown v-if="pathElem.dirList.length">
          <sl-button slot="trigger" size="medium" v-html="pathElem.selected.name"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_item, idx in pathElem.dirList" 
              :key="`dl=${pidx}-${idx}`" 
              @click="(_item.type === 'dir' || /\.md$/.test(_item.name)) && pathSelected(pidx, _item)" 
              :class="{'selected': _item.name === pathElem.selected.name}"
              :disabled="_item.type === 'file' && !/\.md$/.test(_item.name) ? '' : null">
              <!-- folder icon -->
              <svg v-if="_item.type === 'dir'" slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>
              <!-- markdown icon -->
              <svg v-else-if="/\.md$/.test(_item.name)" slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>
              <!-- file icon -->
              <svg v-else slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/></svg>
              {{ _item.name }}
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

    </sl-breadcrumb>
  
  </div>

</template>

<script setup lang="ts">

  import { defineExpose, onMounted, ref, toRaw, watch } from 'vue'
  import { GithubClient } from '../gh-utils'

  defineExpose({ GithubClient })
  
  const emit = defineEmits(['fileSelected', 'repoIsWritable'])

  const props = defineProps({
    ghSource: { type: String }
  })
  watch(props, () => init() )
  onMounted(() => init() )

  function init() {
    getAuthToken()
    parseGhSource() 
  }

  const acctInput = ref<HTMLElement | null>(null)
  const acctMenu = ref<HTMLElement | null>(null)

  const authToken = ref<string | null>('')
  const githubClient = ref<any>()
  const isLoggedIn = ref(false)
  const username = ref<any[]>([])
  const userCanUpdateRepo = ref(false)

  const requested = ref<any>()
  
  watch(authToken, () => {
    // console.log(`authToken=${authToken.value}`)
    isLoggedIn.value = window.localStorage.getItem('gh-auth-token') !== null
    githubClient.value = new GithubClient(authToken.value || '')
  })

  watch(githubClient, async (githubClient) => {
    // console.log('githubClient', isLoggedIn.value, toRaw(requested.value))
    /*
    if (isLoggedIn.value) {
      getAccounts()
      username.value = await githubClient.user().then((userData:any) => userData.login)
      if (acct.value && repo.value && username.value) {
        githubClient.isCollaborator(acct.value, repo.value, username.value).then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
    } else if (requested.value?.acct) {
      acct.value = requested.value.acct
    }
    */
  })

  // Account
  const accts = ref<any[]>([])
  const acct = ref('')
  watch(accts, (accts) => {
    if (!accts.length) return
    // console.log('accts', toRaw(accts))
    let selected = accts.find(acct => acct.login === requested.value?.acct)
    acct.value = selected?.login || requested.value?.acct || accts[0].login
  })
  async function getAccounts() {
    // console.log('getAccounts')
    Promise.all([githubClient.value.user(), githubClient.value.organizations()])
    .then(responses => accts.value = responses.flat())
  }
  function accountSelected(_acct:any) {
    requested.value = null
    acct.value = _acct.login
  }
  function inputHandler(evt:KeyboardEvent) {
    let typedInput = (acctInput.value as HTMLInputElement).value.trim()
    // console.log(`typedInput=${typedInput.length}`)
    if (acctMenu.value) acctMenu.value.style.display = typedInput.length ? 'none' : 'block'
    if (evt.key === 'Enter') acct.value = typedInput
  }

  // Repository
  const repos = ref<any[]>([])
  const repo = ref('')
  watch(acct, (acct) => {
    // console.log(`acct=${acct}`)
    getRepositories()
  })
  watch(repos, (repos) => {
    if (!repos.length) return
    // console.log('repos', toRaw(repos))
    let selected = repos.find(repo => repo.name === requested.value?.repo) || repos[0]
    repo.value = selected.name
  })
  function getRepositories() {
    githubClient.value.repos(acct.value).then((_repos:any[]) => repos.value = _repos)
  }
  function repoSelected(_repo:any) {
    requested.value = null
    repo.value = _repo.name
  }
  watch(userCanUpdateRepo, (userCanUpdateRepo) => {
    // console.log(`userCanUpdateRepo=${userCanUpdateRepo}`)
    emit('repoIsWritable', userCanUpdateRepo)

  })

  // Branch
  const branches = ref<any[]>([])
  const branch = ref('')
  watch(repo, (repo) => {
    if (!repo) return
    // console.log(`repo=${repo}`)
    if (isLoggedIn.value) {
      githubClient.value.user()
        .then((userData:any) => userData.login)
        .then((username:string) => repo ? githubClient.value.isCollaborator(acct.value, repo, username) : false)
        .then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
    }
    getBranches()
  })
  async function getBranches() {
    githubClient.value.branches(acct.value, repo.value).then((_branches:any[]) => branches.value = _branches)
  }

  let defaultBranch: string
  watch(branches, async (branches) => {
    if (!branches.length) return
    // console.log('branches', toRaw(branches))
    if (!defaultBranch && acct.value && repo.value) defaultBranch = await githubClient.value.defaultBranch(acct.value, repo.value)
    branch.value = defaultBranch || branches[0]?.name
    getDirList('').then((dirList) => {
      // console.log('dirList', toRaw(dirList))
      let selected = selectFromDirlist(dirList)
      // console.log(toRaw(selected))
      path.value = [{dirList, selected}]
    })
  })
  function branchSelected(_branch:any) {
    requested.value = null
    branch.value = _branch.name
  }

  // Path
  const path = ref<any[]>([])
  watch(path, () => {
    if (!path.value.length) return
    // console.log('path', toRaw(path.value))
    let lastIdx = path.value.length-1
    let lastPathElement = path.value[lastIdx]
    // console.log(toRaw(lastPathElement))
    if (lastPathElement?.selected?.type === 'dir') {
      getDirList(path.value.map((p:any) => p.selected.name).join('/')).then((dirList) => {
        // console.log('dirList', toRaw(dirList))
        let selected = selectFromDirlist(dirList, lastIdx+1)
        path.value = [...path.value, {dirList, selected}]
      })
    } else {
      // console.log(acct.value, repo.value, branch.value, toRaw(path.value))
      let ghSource = `${acct.value}/${repo.value}/${branch.value}/${path.value.map((p:any) => p.selected.name).join('/')}`
      console.log(`ghSource=${ghSource}`)
      emit('fileSelected', ghSource)
    }
  })
  function pathSelected(idx, selected:any) {
    requested.value = null
    // console.log('pathItem selected', toRaw(selected))
    let _path = [...path.value]
    _path[idx] = {dirList: _path[idx].dirList, selected}
    path.value = _path.slice(0, idx+1)
  }

  function selectFromDirlist(dirList:any, idx=0) {
    // console.log('selectFromDirlist', toRaw(dirList), idx, requested.value?.path[idx])
    return dirList?.find(item => item.name === requested.value?.path[idx] || item.name === `${requested.value?.path[idx]}.md`) ||
           dirList?.filter(item => item.type === 'file').find(item => item.name === 'index.md' || item.name === 'README.md') ||
           dirList?.filter(item => item.type === 'file' && /\.md$/.test(item.name))[0] ||
           dirList?.filter(item => item.type === 'dir')[0] ||
           dirList?.filter(item => item.type === 'file')[0]
  }

  async function getDirList(_path:string) {
    let _dirList = await githubClient.value.dirlist(acct.value, repo.value, _path, branch.value)
    let dirs = _dirList.filter(item => item.type === 'dir')
    let files = _dirList.filter(item => item.type === 'file')
    return [...dirs, ...files]
  }

  function reset() {
    accts.value = []
    repos.value = []
    branches.value = []
    path.value = []
    acct.value = ''
    repo.value = ''
    branch.value = ''
  }

  async function parseGhSource() {
    if (!props.ghSource) return
    reset()
    // console.log(`ghSource=${props.ghSource}`);
    let [_acct, _repo, _branch, ..._path] = (props.ghSource || '').split('/').filter(pe => pe)
    requested.value = {acct: _acct, repo: _repo, branch: _branch, path: _path}
    if (isLoggedIn.value) {
      getAccounts()
      username.value = await githubClient.value.user().then((userData:any) => userData.login)
      if (acct.value && repo.value && username.value) {
        githubClient.value.isCollaborator(acct.value, repo.value, username.value).then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
    } else if (requested.value?.acct) {
      acct.value = requested.value.acct
    }

  }
  watch(requested, (requested) => {
    // if (requested) console.log('requested', toRaw(requested))
    // if (requested?.acct && githubClient.value && !acct.value) acct.value = requested.acct
  })

  async function getUnscopedToken() {
    let url = `https://iiif.mdpress.io/gh-token`
    let resp = await fetch(url)
    if (resp.ok) {
      let unscopedToken = await resp.text()
      window.localStorage.setItem('gh-unscoped-token', unscopedToken)
    }
  }

  async function getAuthToken() {
    if (!window.localStorage.getItem('gh-unscoped-token')) await getUnscopedToken()
    authToken.value = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
  }

</script>

<style>
  @import '@shoelace-style/shoelace/dist/themes/light.css';

* { box-sizing: border-box; }

:host {
  display: block;
  width: 100%;
  border: 1px solid #444;
  padding: 6px;
  position: relative;
  z-index: 1;
  background-color: white;
}

sl-menu {
  text-align: left;
}

sl-menu-item.selected::part(label){
  font-weight: bold;
}

</style>
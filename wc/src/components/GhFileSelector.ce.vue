
<template>

  <div ref="root">

    <sl-breadcrumb>

      <sl-breadcrumb-item>
        <sl-dropdown>
          <sl-input ref="acctInput" slot="trigger" size="medium" placeholder="Github username" autocomplete="off" @keyup="inputHandler" :value="acct"></sl-input>
          <sl-menu ref="acctMenu"> 
            <sl-menu-item v-for="_acct, idx in accts" :key="`acct-${idx}`" :checked="_acct.login === acct" @click="accountSelected(_acct)" type="checkbox" v-html="_acct.login"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item>
        <sl-dropdown v-if="repos.length">
          <sl-button slot="trigger" size="medium" v-html="repo"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_repo, idx in repos" :key="`repo-${idx}`" :checked="_repo.name === repo" @click="repoSelected(_repo)" type="checkbox" v-html="_repo.name"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item>
        <sl-dropdown v-if="branches.length">
          <sl-button slot="trigger" size="medium" v-html="branch"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_branch, idx in branches" :key="`branch-${idx}`" :checked="_branch.name === branch" @click="branchSelected(_branch)" type="checkbox" v-html="_branch.name"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item v-for="pathElem, pidx in path" :key="`pe-${pidx}`">
        <sl-dropdown v-if="pathElem.dirList.length">
          <sl-button slot="trigger" size="medium" v-html="pathElem.selected.name"></sl-button>
          <sl-menu>
            <sl-menu-item v-for="_item, idx in pathElem.dirList" :key="`dl=${pidx}-${idx}`" :checked="_item.name === pathElem" @click="pathSelected(pidx, _item)" type="checkbox" v-html="_item.name"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

    </sl-breadcrumb>
  
  </div>

</template>

<script setup lang="ts">

  import { onMounted, ref, toRaw, watch } from 'vue'
  import { GithubClient } from '../gh-utils'

  const emit = defineEmits(['fileSelected', 'repoIsWritable'])

  const props = defineProps({
    ghSource: { type: String }
  })
  watch(props, () => init())
  onMounted(() => init())

  function init() {
    parseGhSource() 
    getAuthToken()
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
    if (isLoggedIn.value) {
      getAccounts()
      username.value = await githubClient.user().then((userData:any) => userData.login)
      if (acct.value && repo.value && username.value) {
        githubClient.isCollaborator(acct.value, repo.value, username.value).then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
    } else if (requested.value?.acct) {
      acct.value = requested.value.acct
    }
  })

  // Account
  const accts = ref<any[]>([])
  const acct = ref('')
  watch(accts, (accts) => {
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
  watch(branches, async () => {
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
    // console.log('path', toRaw(path.value))
    let lastIdx = path.value.length-1
    let lastPathElement = path.value[lastIdx]
    // console.log(toRaw(lastPathElement))
    if (lastPathElement.selected.type === 'dir') {
      getDirList(path.value.map((p:any) => p.selected.name).join('/')).then((dirList) => {
        // console.log('dirList', toRaw(dirList))
        let selected = selectFromDirlist(dirList, lastIdx+1)
        path.value = [...path.value, {dirList, selected}]
      })
    } else {
      let ghSource = `${acct.value}/${repo.value}/${branch.value}/${path.value.map((p:any) => p.selected.name).join('/')}`
      // console.log(`ghSource=${ghSource}`)
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
    return githubClient.value.dirlist(acct.value, repo.value, _path, branch.value)
  }

  function parseGhSource() {
    if (!props.ghSource) return
    // console.log(`ghSource=${props.ghSource}`);
    let [_acct, _repo, _branch, ..._path] = (props.ghSource || '').split('/').filter(pe => pe)
    // console.log(`ghSource=${props.ghSource} acct=${_acct}, repo=${_repo}, branch=${_branch}, path=${_path}`)
    requested.value = {acct: _acct, repo: _repo, branch: _branch, path: _path}
  }
  watch(requested, (requested) => {
    // if (requested) console.log('requested', toRaw(requested))
    if (requested?.acct && githubClient.value && !acct.value) acct.value = requested.acct
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

</style>

<template>

  <div ref="root" class="main">

    <svg slot="prefix" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
    
    <sl-breadcrumb>

      <sl-breadcrumb-item>
        <sl-dropdown ref="acctDropdown">
          <sl-input ref="acctInput" slot="trigger" size="medium" placeholder="Github username" autocomplete="off" @keyup="inputHandler" :value="acct">
            <svg v-if="accts.length > 0" slot="suffix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
          </sl-input>
          <sl-menu ref="acctMenu"> 
            <sl-menu-item v-for="_acct, idx in accts" :key="`acct-${idx}`" @click="accountSelected(_acct)" v-html="_acct.login" :class="{'selected': _acct.login === acct}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item v-if="repo">
        <sl-dropdown v-if="repos.length">
          <sl-button slot="trigger" size="medium">
            {{ repo }}
            <svg v-if="repos.length > 1" slot="suffix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
          </sl-button>
          <sl-menu>
            <sl-menu-item v-for="_repo, idx in repos" :key="`repo-${idx}`" @click="repoSelected(_repo)" v-html="_repo.name" :class="{'selected': _repo.name === repo}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item v-if="branch">
        <sl-dropdown v-if="branches.length">
          <sl-button v-if="branch" slot="trigger" size="medium">
            {{ branch }}
            <svg v-if="branches.length > 1" slot="suffix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
          </sl-button>
          <sl-menu>
            <sl-menu-item v-for="_branch, idx in branches" :key="`branch-${idx}`" @click="branchSelected(_branch)" v-html="_branch.name" :class="{'selected': _branch.name === branch}"></sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-breadcrumb-item v-for="pathElem, pidx in path" :key="`pe-${pidx}`">
        <sl-dropdown v-if="pathElem.dirList.length">
          <sl-button slot="trigger" size="medium">
            {{ pathElem.selected.name }}
            <svg  v-if="pathElem.dirList.length > 1" slot="suffix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
          </sl-button>
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
            <sl-menu-item v-if="userCanUpdateRepo" @click="showAddFileDialog(pidx)">
              <!-- plus icon -->
              <svg  slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
              <span>Add Item</span>
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-breadcrumb-item>

      <sl-dropdown v-if="userCanUpdateRepo && path.length">
        <svg width="24" height="24" slot="trigger" fill="#999" style="cursor:pointer; padding:0 0 0 8px; margin-top:-12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/></svg>
        <sl-menu>
          <sl-menu-item @click="deleteDialog?.show()">
            <!-- trash can icon -->
            <svg slot="prefix" width="18" height="18" fill="red" style="margin-right:0.5em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
            Delete file
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>

    </sl-breadcrumb>
  
    <sl-dialog ref="deleteDialog" label="Confirm Delete" class="deleteDialog">
      Delete {{ path[path.length-1]?.selected?.name }}?
      <div slot="footer">
        <sl-button variant="primary" class="cancel" style="margin-right:1em;">Cancel</sl-button>
        <sl-button variant="primary" class="confirm">Confirm</sl-button>
      </div>
    </sl-dialog>

    <sl-dialog label="Add File" ref="addDialog">
      <form id="add-file-form" class="input-validation-pattern">
        <sl-input 
          style="flex:1;" 
          autocomplete="off" 
          required 
          id="add-file-input" 
          placeholder="Enter file path" 
          pattern="^([A-z0-9\-_]+/)*[A-z0-9\-_.]+$"></sl-input>
        <br />
        <div v-if="errorMessage" v-html="errorMessage" style="color:red; margin-bottom: 1em;"></div>
        <sl-button @click="closeAddFileDialog()">Cancel</sl-button>
        <sl-button type="reset" variant="default">Reset</sl-button>
        <sl-button type="submit" variant="primary">Add</sl-button>
      </form>
    </sl-dialog>

  </div>

</template>

<script setup lang="ts">

  import { defineExpose, onMounted, ref, toRaw, watch } from 'vue'
  import type SLDIalog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  import type SLDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
  import type SLMenu from '@shoelace-style/shoelace/dist/components/menu/menu.js'
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

  const errorMessage = ref<string | null>(null)
  const trigger = ref<string | null>(null)

  const deleteDialog = ref<SLDIalog | null>(null)
  watch(deleteDialog, (deleteDialog) => {
    deleteDialog?.addEventListener('sl-overlay-dismiss', () => deleteDialog.hide())
    deleteDialog?.addEventListener('sl-close', () => deleteDialog.hide())
    deleteDialog?.querySelector('.cancel')?.addEventListener('click', () => deleteDialog.hide())
    deleteDialog?.querySelector('.confirm')?.addEventListener('click', () => {
      deleteDialog?.hide()
      deleteItem()
    })
  })

  const addDialog = ref<SLDIalog | null>(null)
  watch(addDialog, (addDialog) => {
    addDialog?.addEventListener('sl-overlay-dismiss', () => addDialog.hide())
    addDialog?.addEventListener('sl-close', () => addDialog.hide())
    addDialog?.querySelector('.cancel')?.addEventListener('click', () => addDialog.hide())
    addDialog?.querySelector('.confirm')?.addEventListener('click', () => {
      addDialog?.hide()
    })
  })

  const acctInput = ref<HTMLElement | null>(null)
  const acctDropdown = ref<SLDropdown | null>(null)
  const acctMenu = ref<SLMenu | null>(null)

  const authToken = ref<string | null>('')
  const githubClient = ref<any>()
  const isLoggedIn = ref(false)
  const username = ref<any[]>([])
  const userCanUpdateRepo = ref(false)

  const requested = ref<any>()
  
  watch(authToken, () => {
    console.log(`authToken=${authToken.value} acct=${acct.value} repo=${repo.value} username=${username.value} isLoggedIn=${isLoggedIn.value}`)
    isLoggedIn.value = window.localStorage.getItem('gh-auth-token') !== null
    githubClient.value = new GithubClient(authToken.value || '')
    if (acct.value) getRepositories()
  })

  watch(githubClient, async (githubClient) => {
    console.log('githubClient', isLoggedIn.value, toRaw(requested.value))
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
    console.log('accts', toRaw(accts))
    if (!accts.length) return
    let selected = accts.find(acct => acct.login === requested.value?.acct)
    acct.value = selected?.login || requested.value?.acct || accts[0].login
  })
  async function getAccounts() {
    console.log('getAccounts')
    Promise.all([githubClient.value.user(), githubClient.value.organizations()])
    .then(responses => accts.value = responses.flat())
  }
  function accountSelected(_acct:any) {
    requested.value = null
    acct.value = _acct.login
  }
  function inputHandler(evt:KeyboardEvent) {
    let typedInput = (acctInput.value as HTMLInputElement).value.trim()
    if (acctMenu.value) acctMenu.value.style.display = typedInput.length ? 'none' : 'block'
    if (evt.key === 'Enter') {
      acct.value = typedInput
      acctDropdown.value?.hide()
      // if (acctMenu.value) acctMenu.value.style.display = 'none'
    }
  }

  // Repository
  const repos = ref<any[]>([])
  const repo = ref('')
  watch(acct, (acct) => {
    // console.log(`acct=${acct}`)
    if (acct) {
      repo.value = ''
      getRepositories()
    } else {
      repos.value = []
    }
  })
  watch(repos, (repos) => {
    // console.log('repos', toRaw(repos))
    if (repos.length) {
      // console.log('repos', toRaw(repos))
      let selected = repos.find(repo => repo.name === requested.value?.repo) || repos.find(repo => repo.name === 'essays') || repos[0]
      repo.value = selected.name
    } else {
      repo.value = ''
    }
  })
  function getRepositories() {
    // console.log('getRepositories', acct.value)
    if (acct.value) githubClient.value?.repos(acct.value).then((_repos:any[]) => repos.value = _repos)
    else repos.value = []
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
    if (repo) {
      branch.value = ''
      if (isLoggedIn.value) {
        githubClient.value.user()
          .then((userData:any) => userData.login)
          .then((username:string) => repo ? githubClient.value.isCollaborator(acct.value, repo, username) : false)
          .then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
      getBranches()
    } else {
      branches.value = []
    }
  })
  async function getBranches() {
    // console.log('getBranches', acct.value, repo.value)
    if (acct.value && repo.value) githubClient.value.branches(acct.value, repo.value).then((_branches:any[]) => branches.value = _branches)
    else branches.value = []
  }

  let defaultBranch: string
  watch(branches, async (branches) => {
    // console.log('branches', toRaw(branches))
    if (branches.length) {
      if (!defaultBranch && acct.value && repo.value) defaultBranch = await githubClient.value.defaultBranch(acct.value, repo.value)
      branch.value = requested.value?.branch || defaultBranch || branches[0]?.name
    } else {
      branch.value = ''
    }
  })
  function branchSelected(_branch:any) {
    requested.value = null
    branch.value = _branch.name
  }
  watch(branch, (branch) => {
    if (acct.value && repo.value && branch) {
      // console.log(`branch=${branch}`)
      getDirList('').then((dirList) => {
        // console.log('dirList', toRaw(dirList))
        let selected = selectFromDirlist(dirList)
        // console.log(toRaw(selected))
        path.value = [{dirList, selected}]
      })
    } else {
      path.value = []
    }
  })  

  // Path
  const path = ref<any[]>([])
  watch(path, () => {
    // console.log(`path=${path.value.map((p:any) => p.selected.name).join('/')}`)
    if (path.value.length) {
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
        let ghSource = `${acct.value}/${repo.value}/${branch.value}/${path.value.map((p:any) => p.selected?.name).join('/')}`
        emit('fileSelected', {trigger: trigger.value, path: ghSource})
      }
    } else {
      let ghSource = ''
      emit('fileSelected', {trigger: trigger.value, path: ghSource})
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

  async function parseGhSource(ghSource:(string|undefined|null)=props.ghSource, _trigger='select') {
    console.log(`parseGhSource: ghSource=${ghSource} isLoggedIn=${isLoggedIn.value}`)
    if (!ghSource) return
    trigger.value = _trigger
    reset()
    // console.log(`ghSource=${ghSource}`);
    let [_acct, _repo, _branch, ..._path] = (ghSource || '').split('/').filter(pe => pe)
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
    if (!requested) return
    // console.log(`requested: acct=${requested.acct}, repo=${requested.repo}, branch=${requested.branch}, path=${requested.path}`)
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
    console.log('getAuthToken')
    if (!window.localStorage.getItem('gh-unscoped-token')) await getUnscopedToken()
    authToken.value = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
  }

  function toTitleCase(str:string) {
    return str.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  let addItemPathIdx = 0
  function showAddFileDialog(idx=0) {
    addItemPathIdx = idx
    let form = addDialog.value?.querySelector('#add-file-form') as HTMLFormElement
    if (!form.onclick) {
      form.onclick = function () { }
      form.addEventListener('submit', async (evt) => {
        // console.log('showAddFileDialog.submit', addItemPathIdx)
        errorMessage.value = null
        evt.preventDefault()
        let inputEl = addDialog.value?.querySelector('#add-file-input') as HTMLInputElement
        let newFilePathElems:string[] = [
          ...path.value.slice(0,addItemPathIdx).filter((p:any) => p.selected.type === 'dir').map((p:any) => p.selected.name), 
          ...inputEl.value.split('/').filter(pe => pe)
        ]
        let essayName = newFilePathElems[newFilePathElems.length-1]
        if (newFilePathElems[newFilePathElems.length-1].indexOf('.') > 0) newFilePathElems[newFilePathElems.length-1] = newFilePathElems[newFilePathElems.length-1].replace(/readme\.md/,'README.md')
        else newFilePathElems.push('README.md')
        let _path = newFilePathElems.join('/')
        essayName = toTitleCase(essayName.replace(/\.md$/,''))
        let markdown = `[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)\n\n# ${essayName}\n\n`
        // console.log(`addFile: acct=${acct.value}, repo=${repo.value}, branch=${branch.value}, path=${_path}`)
        let resp = await githubClient.value.putFile(acct.value, repo.value, _path, markdown, branch.value)
        if (resp.status >= 200 && resp.status < 300) {
          let _ghSource = `${acct.value}/${repo.value}/${branch.value}/${_path}`
          // console.log(`addFile successful: ${_ghSource}`)
          parseGhSource(_ghSource, 'add')
          closeAddFileDialog()
        } else {
          // console.log(`addFile failed: ${resp.status} ${resp.statusText}`)
          errorMessage.value = `Error: ${resp.statusText} ${_path}`
        }
        // path.value = newFilePathElems
      })
      form.addEventListener('reset', () => { errorMessage.value = null })

    }
    addDialog.value?.addEventListener('sl-after-show', () => {
      (addDialog.value?.querySelector('#add-file-input') as HTMLInputElement).focus()
    })
    addDialog.value?.show()
  }

  function closeAddFileDialog() {
    let inputEl = addDialog.value?.querySelector('#add-file-input') as HTMLInputElement
    inputEl.value = ''
    errorMessage.value = null
    addDialog.value?.hide()
  }

  async function deleteItem() {
    let toDelete = path.value.map((p:any) => p.selected.name).join('/')
    // console.log('deleteItem', toDelete)
    let resp = await githubClient.value.deleteFile(acct.value, repo.value, toDelete, branch.value)
    // console.log('deleteItem', resp)
    parseGhSource(`${acct.value}/${repo.value}/${branch.value}`, 'delete')
  }

</script>

<style>
  @import '@shoelace-style/shoelace/dist/themes/light.css';

* { box-sizing: border-box; }

:host {
  display: block;
  width: 100%;
  border: 1px solid #ced4da;
  /* padding: 6px; */
  position: relative;
  z-index: 1;
  background-color: white;
  box-sizing: border-box;
}

.main {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 6px;
}

sl-menu {
  text-align: left;
}

sl-menu-item.selected::part(label){
  font-weight: bold;
}

</style>

<template>

  <div ref="root">

    <section class="content-path" style="position:relative;">
      
      <div class="workspace">

        <sl-tooltip :content="`${acct}: ${repo} (${branch})`" :disabled="isMobile" placement="bottom">
          <sl-button pill size="medium" @click="toggleDrawer">
            <!-- github icon -->
            <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
          </sl-button>
        </sl-tooltip>

        <div class="ws-path">   
          <div class="breadcrumbs">
            <sl-breadcrumb>
              <sl-breadcrumb-item>
              <sl-button  pill size="medium" @click="prunePath(0)">/
                <!-- folder icon -->
                <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>
              </sl-button>
              </sl-breadcrumb-item>
              <sl-breadcrumb-item v-for="pathElem, idx in path" :key="`bci-${idx}`">
                <template v-if="idx === path.length-1" >
                  <span v-if="compact" class="path-elem" v-html="pathElem" @click="prunePath(idx+1)"></span>
                  <sl-button v-else pill size="medium" @click="prunePath(idx+1)">
                    {{pathElem}}
                    <!-- markdown icon -->
                    <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>
                  </sl-button>
                  <sl-dropdown slot="suffix">
                    <!-- caret down icon -->
                    <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                    <sl-menu>
                      <sl-menu-item @click="() => fileToDelete = pathElem">Delete file
                      <!-- trashcan icon -->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></sl-menu-item>
                    </sl-menu>
                  </sl-dropdown>
                </template>
                <template v-else>
                  <span v-if="compact" class="path-elem" v-html="pathElem" @click="prunePath(idx+1)"></span>
                  <sl-button v-else pill size="medium" @click="prunePath(idx+1)">
                    {{pathElem}}
                    <!-- folder icon -->
                    <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>
                  </sl-button>
                </template>
              </sl-breadcrumb-item>
            </sl-breadcrumb>
            <sl-tooltip v-if="isLoggedIn && mode === 'media'" :content="`Add ${props.mode === 'media' ? 'resource' : 'file'}`" placement="bottom">
              <sl-button 
                variant="default" 
                :size="mode === 'media' ? 'medium' : 'small'"
                class="add-item" 
                :name="`Add ${mode === 'media' ? 'resource' : 'file'}`"
                circle 
                @click="onAddFileClicked"
              >
                <!-- plus icon -->
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
              </sl-button>
            </sl-tooltip>
          </div>
          <sl-drawer noHeader label="Workspace" placement="bottom" contained class="workspace-selector" style="--size:100%">
            <div style="display:flex; height:100%; align-items:center;">
            <div v-if="!compact" class="github-select">Select GitHub Repository</div>
            <!-- chevron right icon -->
            <svg v-if="!compact" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
            <sl-breadcrumb style="margin-left:12px;">
              
              <!-- Account selector -->
              <sl-breadcrumb-item>
                <sl-tooltip content="Github Account" hoist :disabled="isMobile" placement="left">
                  <sl-dropdown v-if="accts.length > 1">
                    <span v-if="compact"  slot="trigger" class="path-elem">{{ acct }}</span>
                    <sl-button v-else slot="trigger" pill size="medium" class="folder">
                      {{acct}}
                      <!-- github icon-->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
                    </sl-button>
                    <sl-menu>
                      <sl-menu-item v-for="_acct, idx in accts" :key="`acct-${idx}`" :checked="_acct.login === acct" @click="accountSelected(_acct)" type="checkbox" v-html="_acct.login"></sl-menu-item>
                    </sl-menu>
                  </sl-dropdown>
                  <template v-else>
                    <span v-if="compact" class="path-elem">{{ branch }}</span>
                    <sl-button v-else pill size="medium" class="folder">
                      {{acct}}
                      <!-- github icon-->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
                    </sl-button>
                  </template>
                </sl-tooltip>
              </sl-breadcrumb-item>

              <!-- Repository selector -->
              <sl-breadcrumb-item>
                <sl-tooltip content="Github Repository" hoist :disabled="isMobile" placement="left">
                  <sl-dropdown v-if="repos.length > 1">
                    <span v-if="compact"  slot="trigger" class="path-elem">{{ repo }}</span>
                    <sl-button v-else slot="trigger" pill size="medium">
                      {{repo}}
                      <!-- archive icon-->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z"/></svg>
                    </sl-button>
                    <sl-menu>
                      <sl-menu-item v-for="_repo, idx in repos" :key="`repo-${idx}`" :checked="_repo.name === repo" @click="repoSelected(_repo)" type="checkbox" v-html="_repo.name"></sl-menu-item>
                      <sl-divider></sl-divider>
                      <sl-menu-item class="add-repo" @click="showAddRepoDialog">
                        <!-- plus icon -->
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        New repository
                      </sl-menu-item>
                    </sl-menu>
                  </sl-dropdown>
                  <template v-else>
                    <span v-if="compact" class="path-elem">{{ repo }}</span>
                    <sl-button v-else pill size="medium">
                      {{repo}}
                      <!-- archive icon-->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z"/></svg>
                    </sl-button>
                  </template>
                </sl-tooltip>
              </sl-breadcrumb-item>

              <!-- Branch selector -->
              <sl-breadcrumb-item>
                <sl-tooltip content="Github Branch" hoist :disabled="isMobile" placement="left">
                  <sl-dropdown v-if="branches.length > 1">
                    <span v-if="compact" slot="trigger" class="path-elem">{{ branch }}</span>
                    <sl-button v-else slot="trigger" pill size="medium">
                      {{branch}}
                      <!-- share icon -->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/></svg>
                    </sl-button>
                    <sl-menu>
                      <sl-menu-item v-for="_branch, idx in branches" :key="`branch-${idx}`" :checked="_branch.name === branch" @click="branchSelected(_branch)"  type="checkbox" v-html="_branch.name"></sl-menu-item>
                    </sl-menu>
                  </sl-dropdown>
                  <template v-else>
                    <span v-if="compact" class="path-elem"> {{ branch }}</span>
                    <sl-button v-else pill size="medium">
                      {{branch}}
                      <!-- share icon -->
                      <svg slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/></svg>
                    </sl-button>
                  </template>
                </sl-tooltip>
              </sl-breadcrumb-item>
            </sl-breadcrumb>
            </div>
          </sl-drawer>
        </div>
      </div>
      <sl-divider v-if="dirList.filter(item => props.mode === 'essays' || item.type === 'dir').length > 0"></sl-divider>
      
      <!-- Directory contents -->
      <div v-if="dirList.length > 0" class="dirs">
        
        <sl-button v-for="item, idx in dirList.filter(item => props.mode === 'essays' || item.type === 'dir')" :key="`child-${idx}`" @click="appendPath(item)" pill size="small" :class="item.type">
          <!-- folder icon -->
          <svg v-if="item.type === 'dir'" slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>
          <!-- file icon -->
          <svg v-else slot="prefix" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/></svg>
          {{item.name}}
        </sl-button>

        <sl-tooltip v-if="path && (path.length === 0 || (path[path.length-1].split('.').pop() !== 'md')) && props.mode === 'essays'" :content="`Add ${mode === 'media' ? 'resource' : 'file'}`" placement="bottom">
          <sl-button 
            variant="default" 
            size="small"
            class="add-item" 
            name="`Add file"
            circle 
            @click="onAddFileClicked"
          >
            <!-- plus icon -->
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
          </sl-button>
        </sl-tooltip>
    </div>
    </section>

    <sl-dialog id="add-repo-dialog" label="Add Repository">
      <form id="add-repo-form" class="input-validation-pattern">
        <sl-input autocomplete="off" required id="add-repo-input" placeholder="Enter name" pattern="^[A-z0-9\-_]+$"></sl-input>
        <br />
        <sl-button @click="hideAddRepoDialog">Cancel</sl-button>
        <sl-button type="submit" variant="primary">Add</sl-button>
      </form>
    </sl-dialog>

    <sl-dialog id="add-file-dialog" label="Add File">
      <form id="add-file-form" class="input-validation-pattern">
        <sl-input autocomplete="off" required id="add-file-input" placeholder="Enter file path" pattern="^\/?([A-z0-9-_+]+\/)*([A-z0-9\-]+(\.(css|md|json|geojson|yaml|yml))?)$"></sl-input>
        <br />
        <sl-button @click="hideAddFileDialog">Cancel</sl-button>
        <sl-button type="reset" variant="default">Reset</sl-button>
        <sl-button type="submit" variant="primary">Add</sl-button>
      </form>
    </sl-dialog>

    <sl-dialog id="delete-file-dialog" label="Confirm file delete">
      <div>Delete file <span v-html="fileToDelete"></span>?</div>
      <sl-button slot="footer" @click="hideDeleteFileDialog">Cancel</sl-button>
      <sl-button slot="footer" variant="primary" @click="deleteFile">Confirm</sl-button>
    </sl-dialog>

  </div>

</template>

<script setup lang="ts">

  import { computed, onMounted, onUpdated, ref, toRaw, watch } from 'vue'

  import { isMobile as _isMobile } from '../utils'
  import { GithubClient } from '../gh-utils'

  import '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js'
  import '@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.js'
  import '@shoelace-style/shoelace/dist/components/button/button.js'
  import '@shoelace-style/shoelace/dist/components/details/details.js'
  import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
  import '@shoelace-style/shoelace/dist/components/divider/divider.js'
  import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
  import '@shoelace-style/shoelace/dist/components/icon/icon.js'
  import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
  import '@shoelace-style/shoelace/dist/components/input/input.js'
  import '@shoelace-style/shoelace/dist/components/menu/menu.js'
  import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
  import '@shoelace-style/shoelace/dist/components/tag/tag.js'
  import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
  import type SLDIalog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'

  const props = defineProps({
    contentPath: { type: String },
    sticky: { type: Boolean, default: false },
    mode: { type: String, default: 'media' },
    compact: { type: Boolean },
  })

  const emit = defineEmits(['accessChanged', 'addMediaResource', 'contentPathChanged'])

  defineExpose({ getDirList, getFile, putFile, repositoryIsWriteable })

  const igmore = new Set(['config.yaml', 'CNAME', 'index.html', '404.html', '.nojekyll'])

  // const contentPath = ref<string>()
  
  let ready: boolean = false

  const contentPath = ref<string>('')
  watch(contentPath, () => {
    // console.log(`contentPath=${toRaw(contentPath.value)}`)
    emit('contentPathChanged', contentPath.value)
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode)

  let drawer: any

  let username: string = ''
  let useReadme: boolean = true

  const fileToDelete = ref<string | null>()
  watch(fileToDelete, () => {
    if (fileToDelete.value) showDeleteFileDialog()
  })

  const isMobile = ref(_isMobile())

  const authToken = ref<string | null>('')
  const githubClient = ref<any>()
  const isLoggedIn = ref(false)
  const userCanUpdateRepo = ref(false)
  watch(authToken, () => {
    isLoggedIn.value = window.localStorage.getItem('gh-auth-token') !== null
    githubClient.value = new GithubClient(authToken.value || '')
  })

  watch(isLoggedIn, () => {
    if (!isLoggedIn) {
      username = ''
      userCanUpdateRepo.value = false
    }
  })

  watch(userCanUpdateRepo, () => {
    emit('accessChanged', {acct: acct.value, repo: repo.value, canUpdate: userCanUpdateRepo.value})
  })

  watch(githubClient, async () => {
    // console.log('githubClient', props.contentPath)
    // if (props.contentPath) parseContentPath(props.contentPath)
    parseContentPath()
    if (isLoggedIn.value) {
      accts.value = await getAccounts()
      username = await githubClient.value.user().then((userData:any) => userData.login)
      await githubClient.value.repos(username).then((repos:any[]) => {
        if (!repos.find(repo => repo.name === 'essays')) githubClient.value.createRepository({name:'essays', description:'Juncture visual essays'})
        if (!repos.find(repo => repo.name === 'media')) githubClient.value.createRepository({name:'media', description:'Juncture media'})
      })
      if (acct.value && repo.value && username) {
        githubClient.value.isCollaborator(acct.value, repo.value, username).then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
    }
  })

  const accts = ref<any[]>([])
  const acct = ref('')
  watch(accts, () => {
    acct.value = acct.value || (accts.value.length > 0 ? accts.value[0].login : null)
  })
  watch(acct, (_acct, _prior) => {
    // console.log(`watch.acct=${_acct} prior=${_prior}`)
    if (_prior) repo.value = ''
    getRepositories().then(_repos => repos.value = _repos)
  })

  const repos = ref<any[]>([])
  const repo = ref('')
  watch(repos, () => {
    // console.log('watch.repos')
    if (!repo.value && repos.value.length > 0) {
      if (repos.value.length === 1) repo.value = repos.value[0].name
      else {
        let defaultForMode = props.mode === 'media' ? 'media' : 'essays'
        repo.value = repos.value.find(repo => repo.name === defaultForMode) ? defaultForMode : repos.value[0].name
      }
    }
  })

  const branches = ref<any[]>([])
  const branch = ref('')
  watch(repo, (_repo, _prior) => {
    // console.log(`watch.repo=${_repo} prior=${_prior}`)
    if (_prior) path.value = []
    updateDirList().then(_ => setContentPath())
    branch.value = ''
    if (repo.value) {
      if (isLoggedIn.value && acct.value) {
        githubClient.value.user().then((userData:any) => userData.login)
        .then((username:string) => repo.value ? githubClient.value.isCollaborator(acct.value, repo.value, username) : false)
        .then((isCollaborator:boolean) => userCanUpdateRepo.value = isCollaborator)
      }
      getBranches().then(_branches => branches.value = _branches)
    }
  })


  let defaultBranch: string
  watch(branches, async () => {
    if (!defaultBranch && acct.value && repo.value) defaultBranch = await githubClient.value.defaultBranch(acct.value, repo.value)
    if (defaultBranch) branch.value = defaultBranch
  })

  watch(branch, () => {
    // console.log(`watch.branch=${toRaw(branch.value)}`)
    if (branch.value && path.value) {
      if (pathIsDirectory) updateDirList().then(_ => setContentPath())
    }
  })

  const path = ref<string[]>([])
  watch(path, () => {
    // console.log(`watch.path=${toRaw(path.value)}`)
    if (branch.value) updateDirList().then(_ => setContentPath())
  })

  let pathIsDirectory: boolean = true
  const dirList = ref<any[]>([])
  watch(dirList, () => {
    pathIsDirectory = path.value.length === 0 || dirList.value.length > 0 
  })

  onMounted(() => {
    // console.log('onMounted', props)
    getAuthToken()
    window.addEventListener('storage', () =>  getAuthToken() )
    drawer = shadowRoot?.value?.querySelector('.workspace-selector')
  }) 

  // Ensure 'essays' repository exists
  let createSubmitted: boolean = false
  async function waitForRepoInit() {
    if (username && username === acct.value) {
      let repos = await githubClient.value.repos(acct.value)
      ready = repos.find((repo:any) => repo.name === 'essays') !== undefined
      // console.log(`waitForRepoInit: repo=${repo} repos=${repos.map((repo:any) => repo.name)} found=${ready} createSubmitted=${createSubmitted}`)
      if (!ready && !createSubmitted) {
        githubClient.value.createRepository({name:'essays', description:'Juncture visual essays'})
        githubClient.value.createRepository({name:'media', description:'Juncture media'})
        createSubmitted = true
        // notReadyText = 'Waiting for repository creation...'
      }
    } else {
      ready = true
      getRepositories()
    }
    if (!ready) setTimeout(() => waitForRepoInit(), 5000)
  }

  function parseContentPath(_contentPath:string='') {
    _contentPath = _contentPath || props.contentPath || ''
    // console.log('parseContentPath', _contentPath)
    if (_contentPath) {
      let [_path, _args] = _contentPath.split(':').pop()?.split('?') || []
      let qargs = _args ? Object.fromEntries(_args.split('&').map(arg => arg.split('='))) : {}
      let pathElems = _path.split('/').filter(pe => pe)
      if (pathElems.length > 0) acct.value = pathElems[0]
      if (pathElems.length > 1) repo.value = pathElems[1]
      if (pathElems.length > 2) path.value = pathElems.slice(2)
      if (qargs.ref) branch.value = qargs.ref || 'main'
      // console.log(`parseContentPath: acct=${acct.value} repo=${repo.value} ref=${branch.value} path=${path.value}`)
    }
  }

  function setContentPath() {
    // console.log('setContentPath', acct.value, repo.value, path.value)
    if (acct.value && repo.value) {
      let _contentPath = `gh:${acct.value}/${repo.value}`
      if (path.value.length > 0) _contentPath += `/${path.value.join('/')}`
      if (branch.value && branch.value !== defaultBranch) _contentPath += `?ref=${branch.value}`
      contentPath.value = _contentPath
    }
  }

  async function getUnscopedToken() {
    let url = `https://api.juncture-digital.org/gh-token`
    let resp = await fetch(url)
    if (resp.ok) {
      let unscopedToken = await resp.text()
      window.localStorage.setItem('gh-unscoped-token', unscopedToken)
    }
  }

  async function getAuthToken() {
    if (!window.localStorage.getItem('gh-unscoped-token')) await getUnscopedToken()
    authToken.value = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
    isLoggedIn.value = window.localStorage.getItem('gh-auth-token') !== null
  }

  async function getAccounts(): Promise<string[]> {
    return await Promise.all([githubClient.value.user(), githubClient.value.organizations()])
    .then(responses => responses.flat())
  }

  async function getRepositories(): Promise<string[]> {
    return githubClient.value.repos(acct.value)
  }

  async function getBranches(): Promise<string[]> {
    return githubClient.value.branches(acct.value, repo.value)
  }

  async function updateDirList() {
    dirList.value = []
    let _dirList:any[] = await githubClient.value.dirlist(acct.value, repo.value, path.value.join('/'), branch.value)
    //if (dirList.length === 0 && path.length > 0) dirList = await githubClient.dirlist(acct, repo, path.slice(0,-1).join('/'), ref)
    let dirs = _dirList.filter(item => item.type === 'dir')
    let files = _dirList.filter(item => item.type === 'file' && !igmore.has(item.name))
    if (useReadme && files.find(file => file.name === 'README.md') && dirs.length === 0) {
      if (path.value.length === 0 || path.value[path.value.length-1] !== 'README.md') path.value = [...path.value, `README.md`]
    }
    dirList.value = [...dirs, ...files]
  }

  function getDirList() {
    return dirList.value
  }

  function repositoryIsWriteable() {
    return userCanUpdateRepo.value
  }

  async function getFile(contentPath:string) {
    let [_path, _args] = contentPath.split(':').pop()?.split('?') || []
    let qargs = _args ? Object.fromEntries(_args.split('&').map(arg => arg.split('='))) : {}
    let pathElems = _path.split('/').filter(pe => pe)
    let [_acct, _repo] = pathElems.slice(0,2)
    _path = pathElems.slice(2).filter(pe => pe).join('/')
    return githubClient.value.getFile(_acct, _repo, _path, qargs.ref || branch.value)
  }

  async function putFile(contentPath:string, content:string) {
    let [_path, _args] = contentPath.split(':').pop()?.split('?') || []
    let qargs = _args ? Object.fromEntries(_args.split('&').map((arg:string) => arg.split('='))) : {}
    let pathElems = _path.split('/').filter((pe:string) => pe)
    let [_acct, _repo] = pathElems.slice(0,2)
    _path = pathElems.slice(2).filter((pe:string) => pe).join('/')
    let ref = qargs.ref || branch.value
    return githubClient.value.putFile(_acct, _repo, _path, content, ref)
  }

  function accountSelected(_acct:any) {
    acct.value = _acct.login
  }

  function repoSelected(_repo:any) {
    repo.value = _repo.name
  }

  function branchSelected(_branch:any) {
    branch.value = _branch.name
  }

  function appendPath(item: any) {
    drawer.hide()
    useReadme = true
    let newPath = [...path.value]
    if (!pathIsDirectory) newPath = newPath.slice(0,-1)
    if (newPath.length === 0 || newPath[newPath.length-1] !== item.name) newPath = [...newPath, item.name]
    // console.log('appendPath', path, pairectory, newPath)
    path.value = newPath
  }

  function prunePath(idx: number) {
    drawer.hide()
    // useReadme = idx === path.length - 2
    useReadme = false
    path.value = idx === 0 ? [] : path.value.slice(0,idx)
  }

  function onAddFileClicked(evt:Event) {
    if (props.mode === 'essays') showAddFileDialog()
    else emitAddEvent(evt)
  }

  function toTitleCase(str:string) {
    return str.toLowerCase().split('-').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ')
  
  }
  function showAddFileDialog() {
    let form = (shadowRoot.value?.querySelector('#add-file-form') as HTMLFormElement)
    if (!form.onclick) {
      form.onclick = function () { }
      form.addEventListener('submit', async (evt) => {
        evt.preventDefault()
        let inputEl = (shadowRoot.value?.querySelector('#add-file-input') as HTMLInputElement)
        let newFilePathElems:string[] = [...path.value, ...inputEl.value.split('/').filter(pe => pe)]
        let essayName = newFilePathElems[newFilePathElems.length-1]
        if (newFilePathElems[newFilePathElems.length-1].indexOf('.') > 0) newFilePathElems[newFilePathElems.length-1] = newFilePathElems[newFilePathElems.length-1].replace(/readme\.md/,'README.md')
        else newFilePathElems.push('README.md')
        let _path = newFilePathElems.join('/')
        essayName = toTitleCase(essayName)
        await githubClient.value.putFile(acct.value, repo.value, _path, `# ${essayName}\n\n`, branch.value)
        path.value = newFilePathElems
        hideAddFileDialog()
      })
    }
    let dialog = shadowRoot.value?.querySelector('#add-file-dialog') as HTMLDialogElement
    dialog.addEventListener('sl-after-show', () => {
      (shadowRoot.value?.querySelector('#add-file-input') as HTMLInputElement).focus()
    })
    dialog.show()
  }

  function hideAddFileDialog() {
    (shadowRoot.value?.querySelector('#add-file-input') as HTMLInputElement).value = '';
    (shadowRoot.value?.querySelector('#add-file-dialog') as any).hide();
  }

  function showDeleteFileDialog() {
    let dialog = shadowRoot.value?.querySelector('#delete-file-dialog') as SLDIalog
    dialog.show()
  }

  function hideDeleteFileDialog() {
    let dialog = shadowRoot.value?.querySelector('#delete-file-dialog') as SLDIalog
    dialog.hide()
  }

  async function showAddRepoDialog() {
    let form = (shadowRoot.value?.querySelector('#add-repo-form') as HTMLFormElement)
    if (!form.onclick) {
      form.onclick = function () { }
      form.addEventListener('submit', async (evt) => {
        evt.preventDefault()
        let inputEl = shadowRoot.value?.querySelector('#add-repo-input') as HTMLInputElement
        let name = inputEl.value
        let resp = await githubClient.value.createRepository({name, org: username === acct.value ? null : acct.value })
        if (resp.status === 201) {
          getRepositories().then(_repos => {
            repo.value = name
            repos.value = _repos
          })
        }
        hideAddRepoDialog()
      })
    }
    let dialog = shadowRoot.value?.querySelector('#add-repo-dialog') as SLDIalog
    dialog.addEventListener('sl-after-show', () => {
      (shadowRoot.value?.querySelector('#add-repo-input') as HTMLInputElement).focus()
    })
    dialog.show()
  }

  function hideAddRepoDialog() {
    let dialog = shadowRoot.value?.querySelector('#add-repo-dialog') as SLDIalog
    dialog.hide();
    (shadowRoot.value?.querySelector('#add-repo-input') as HTMLInputElement).value = ''
  }

  async function deleteFile() {
    let toDelete = path.value.join('/')
    await githubClient.value.deleteFile(acct.value, repo.value, toDelete, branch.value)
    await updateDirList()
    prunePath(path.value.length-(dirList.value.length === 0 ? 2 : 1))
    fileToDelete.value = null
    hideDeleteFileDialog()
  }

  function dirItems() {
    return dirList.value.filter(item => item.type === 'dir' || (item.name.split('.').pop() === 'md' && props.mode === 'essays'))
  }

  function emitAddEvent(evt:Event) {
    emit('addMediaResource', evt)
  }

  function toggleDrawer() {
    if (drawer.open) drawer.hide()
    else drawer.show()
  }

</script>

<style>
* { box-sizing: border-box; }

:host {
  display: block;
  width: 100%;
  border: 1px solid #444;
  padding: 6px;
  z-index: 9;
  background-color: white;
}
span.path-elem {
  font-family: "Archivo Narrow", Roboto, sans-serif;
  font-size: 1.2rem;
}
.workspace {
  display: flex;
  align-items: center;
}
.workspace-selector {
  display: flex;
  gap: 12px;
}
.workspace-selector div {
  display: inline-flex;
  position: relative;
  padding-left: 6px;
  font-size: 1rem;
}
.selectors {
  display: flex;
  gap: 6px;
}
.ws-path {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 3px;
}
.workspace-selector > sl-icon {
  vertical-align: middle;
  padding-right: 6px;
}
sl-drawer::part(base), sl-drawer::part(panel), sl-drawer::part(body) {
  padding: 0;
  overflow: visible;
}

.github-select {
  font-weight: bold;
  font-size: 1.2em;
  color: #5A162E;
}

sl-divider {
  margin: 6px;
}
.values {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.values > div {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.label {
  font-weight: bold;
}

.value {
  display: inline-block;
}

div.path {
}

sl-breadcrumb-item::part(label) {
  font-size: 1rem;
  color: var(--sl-color-primary-600);
}

.dir-items li {
  cursor: pointer;
}

.dir-items {
  height: 40vh;
  overflow-y: scroll;
}

.dir-items li:hover {
  color: var(--sl-color-primary-600);
}

sl-icon-button::part(base) {
  padding: 0;
}

.content-path {
  display: flex;
  flex-direction: column;
  /* gap: 12px; */
}

sl-icon-button {
  align-self: start;
  margin-top:6px;;
}

sl-menu::part(base) {
  max-height: 300px;
  overflow-y: scroll;
}

.dirs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dirs sl-button::part(base) {
  border-radius: 12px;
  font-weight: 500;
  font-family: "Archivo Narrow", Roboto, sans-serif;
  font-size: 1rem;
}

sl-button.dir::part(base) {
  background-color: #eee;
  /*
  background-color: rgba(91,21,46,.6);
  color: white;
  */
}

sl-button.file::part(base) {
}

sl-button.add-item::part(base) {
  background-color: #eee;
  color: black;
}

.delete {
  margin-left: 18px;
}

sl-icon-button.delete::part(base) {
  color: red;
}

.add-repo {
  background-color: #ddd;
}

sl-menu {
  text-align: left;
}

sl-breadcrumb {
  display: inline-block;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 12px;;
}

</style>
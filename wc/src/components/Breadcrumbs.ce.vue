<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  watch(shadowRoot, (shadowRoot) => {
    shadowRoot.children[1].classList.remove('sticky')
  })

  const crumbs = ref()
  // watch(crumbs, (crumbs) => { console.log(toRaw(crumbs)) })

  onMounted(() => {
    let path = location.pathname
    let baseurl = (window as any).config?.baseurl || ''
    crumbs.value = [ 
      // ...[{ name: 'home', path: baseurl }],
      ...path.split('/')
        .filter(pe => pe)
        .slice(baseurl?.split('/').filter(pe => pe).length)
        .map((path, index, paths) => ({ name: path, path: baseurl + '/' + paths.slice(0, index + 1).join('/')}))
    ]
  })

</script>

<template>
  <div class="main" ref="root">
    <template v-if="crumbs?.length" v-for="(crumb, idx) in crumbs" :key="crumb.path">
      <a v-if="idx < crumbs.length - 1" :href="crumb.path">{{ crumb.name }}</a>
      <span v-else>{{ crumb.name }}</span>
      <span v-if="idx < crumbs.length - 1"> > </span>
    </template>
  </div>
</template>

<style>
  @import '../tailwind.css';
  .main {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    flex-wrap: wrap;
    line-height: 1.5;
    padding: 0.5rem 0;
  }
  a {
    color: #0645ad;
  }
  a:hover {
    text-decoration: underline;
  }
  span {
    color: gray;
    font-weight: 500;
  }

</style>
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  import * as Vue from 'vue';
  import { loadModule } from 'vue3-sfc-loader';
  import { markRaw } from 'vue';

  const junctureDependencies = [
    // {tag: 'link', rel: 'stylesheet', href: `${config.baseurl}juncture/index.css`},
    {tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'},
    {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js'},
    {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/http-vue-loader@1.4.2/src/httpVueLoader.min.js'},
    {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'},
    {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'},
    {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js'},
    {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js'},
    // {tag: 'script', src: `${window.config.scriptBasePath}/v2/dist/js/index.js`, type: 'module'}
  ]

  const root = ref<HTMLElement | null>(null)
  const app = ref<HTMLElement | null>(null)

  const html = ref<string>('<param ve-config title="For problem def and testing" layout="vertical"> <div>hello world</div>')

  const props = defineProps({
  })

  const parsedComponent = ref<any>(null);

  onMounted(async () => {
    loadDependencies(junctureDependencies, async () => {
      console.log('Dependencies loaded')
      const sfcString = `<template> Hello World !</template>`;
      parsedComponent.value = markRaw(await parseToComponent(sfcString));
      console.log(parsedComponent.value)
    }, 0)

  })

  async function parseToComponent(sfcString) {
    const id = 'xxx';
    const options:any = {
        moduleCache: { vue: Vue },
        async getFile(url) {
            // return Promise.resolve(sfcString);
            const res = await fetch('http://localhost:8080/v1/Juncture.vue');
            if (res.ok ) {
              let sfcText = await res.text();
              return sfcText
            }
        },
        addStyle(styleString) {
            let style = document.getElementById(id);
            if (!style) {
                style = document.createElement('style');
                style.setAttribute('id', id);
                const ref = document.head.getElementsByTagName('style')[0] || null;
                document.head.insertBefore(style, ref);
            }
            style.textContent = styleString;
        }
    };
    const component:any = loadModule(`${id}.vue`, options);
    console.log(await component)
    return Vue.defineAsyncComponent(() => component);
}

function loadDependency(dependency, callback) {
  let e = document.createElement(dependency.tag)
  Object.entries(dependency).forEach(([k, v]) => { if (k !== 'tag') e.setAttribute(k, v) })
  e.addEventListener('load', callback)
  if (dependency.tag === 'script') document.body.appendChild(e)
  else document.head.appendChild(e)
}

function loadDependencies(dependencies, callback, i) {
  i = i || 0
  if (dependencies.length === 0) {
    if (callback) callback()
    else return
  } else {
    loadDependency(dependencies[i], () => {
      if (i < dependencies.length-1) loadDependencies(dependencies, callback, i+1) 
      else if (callback) callback()
    })
  }
}

</script>

<template>

  <div ref="root">
    <parsed-component v-if="parsedComponent" :input-html="html"></parsed-component>
  </div>

</template>

<style>
</style>

<template>
  <div :style="containerStyle">

  Test
  </div>  
</template>

<script>

module.exports = {
  name: 'NewComponent',
  props: { 
    items: { type: Array, default: () => ([]) },
    viewerIsActive: Boolean
  },
  data: () => ({
    viewerLabel: 'New Component',
    viewerIcon: 'fas fa-file-code',
    dependencies: []
  }),
  computed: {
    containerStyle() { return { 
      position: 'relative',
      height: this.viewerIsActive ? '100%' : '0', 
      overflowY: 'auto !important' 
    }},
  },
  mounted() { this.loadDependencies(this.dependencies, 0, this.init) },
  methods: {
    init() {
    }
  }
}
</script>

<style>
</style>

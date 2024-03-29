<template>

  <div>
  
    <div id="essay-component" ref="essay" v-html="processedHtml"></div>

    <!-- Entity infobox popup -->
    <div style="display:none;">
      <div ref="popup" class="popup" v-if="hoverEntity">
        <div v-if="hoverEntity.thumbnails" class="image"><img :src="hoverEntity.thumbnails[0]"></div>
        <div class="label" v-html="hoverEntity.label"></div>
        <div v-if="hoverEntity.description" class="description" v-html="hoverEntity.description"></div>
        <div v-if="hoverEntity.summary" class="summary" v-html="hoverEntity.summary"></div>
        <div v-if="hoverEntity.mwPage" v-html="hoverEntity.mwPage"></div>
      </div>
    </div>

  </div>

</template>

<script>
module.exports = {  
  name: 've1-visual-essay',
  props: {
    html: { type: String, default: '' },
    path: String,
    anchor: String,
    entities: { type: Object, default: () => ({}) },
    params: { type: Array, default: () => ([]) },
    availableViewers: { type: Array, default: () => ([]) }
  },
  data: () => ({
    processedHtml: '',
    hoverEntity: null,
    active: null
  }),
  computed: {
    items() { return this.active ? this.paramsInScope(document.querySelector(`[data-id="${this.active}"] p`)) : []
    },
  },
  mounted() {
    document.getElementById('app').classList.add('visual-essay')
  },
  methods: {

    async essayLoaded() {
      this.active = null
      let essayElem = document.getElementById('essay')
      essayElem.querySelectorAll('.seg-link').forEach(el => el.addEventListener('click', () => navigator.clipboard.writeText(el.dataset.anchor)))
      Array.from(essayElem.querySelectorAll('.collapsible')).forEach(el =>el.addEventListener('click', this.toggleExpandCollapse))
      this.tagEntities(essayElem)
      // this.$emit('set-entities', this.entities)
      this.$nextTick(() => {
        this.addPopups(this.entities)
        let segments = [...essayElem.querySelectorAll('.segment')]
        if (this.anchor && location.pathname.split('/').filter(p => p).indexOf('preview') === -1) {
          let anchorElem = document.getElementById(this.anchor)
          if (anchorElem) {
            this.$emit('scroll-to-anchor')
            this.$nextTick(() => essayElem.scrollTop = this.scrollTop - 100)
          }
        } else {
          essayElem.scrollTop = 0
          this.active = segments.length > 0 ? segments[0].dataset.id : null
          if (this.active) {
            this.$emit('set-active', this.active)
            segments[0].classList.add('active')
          }

        }
      })
      let self = this

      function observeVisible(callback = null) {

        let topMargin = 100

        console.log(`observeVisible: topMargin=${topMargin} active=${self.active}`)

        const visible = {}
        const observer = new IntersectionObserver((entries, observer) => {
          for (const entry of entries) {
            let para = entry.target
            let intersectionRatio = Math.round(100*entry.intersectionRatio)/100
            if (intersectionRatio > 0) visible[para.id] = {para, intersectionRatio}
            else delete visible[para.id]
          }

          let sortedVisible = Object.values(visible)
            .sort((a,b) => b.intersectionRatio - a.intersectionRatio || a.para.getBoundingClientRect().top - b.para.getBoundingClientRect().top)
          // sortedVisible.forEach(v => console.log(v.para, v.intersectionRatio, v.top, v.para.getBoundingClientRect()))
          // console.log('---')

          if (self.active !== sortedVisible[0]?.para.id) {
            self.active = sortedVisible[0]?.para.id
            console.log(`active: ${self.active}`)
            document.querySelectorAll('.active').forEach(p => p.classList.remove('active'))
            sortedVisible[0]?.para?.classList.add('active')
            self.$emit('set-active', self.active)
          }

        }, { root: null, threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], rootMargin: `${topMargin ? -topMargin : 0}px 0px 0px 0px`})

        // target the elements to be observed
        document.querySelectorAll('.segment').forEach((paragraph) => observer.observe(paragraph))
      }

      observeVisible()

    },
    doCustomFormatting(elem) {
      Array.from(elem.querySelectorAll('section.cards')).forEach(cardsSection => {
        Array.from(cardsSection.querySelectorAll('section')).forEach(card => {
          ['img', '.card > .segment > p > a', '.card > .segment > p > strong', 'ul'].forEach(selector => {
            let el = card.querySelector(selector)
            if (el) {
              if (selector !== 'strong' || el.parentElement.tagName !== 'A') card.appendChild(el)
            }
          })
          let segments = []
          Array.from(card.querySelectorAll('.segment')).forEach(seg => {
            if (seg.textContent.trim() === '') {
              card.removeChild(seg)
            } else {
              segments.push(seg)
            }
          })
          if (segments.length > 0) {
            let abstractWrapper = document.createElement('div')
            abstractWrapper.classList.add('abstract')
            card.appendChild(abstractWrapper)
            let abstractDiv = document.createElement('div')
            abstractDiv.classList.add('abstract-text')
            abstractWrapper.appendChild(abstractDiv)
            segments.forEach(seg => abstractDiv.appendChild(seg))
            abstractWrapper.innerHTML += '<button class="collapsible">read more</button>'
          }
        })
      })
      return elem.innerHTML
    },
    // Adds tippy popups to tagged entity text
    addPopups(entities) {
      tippy('.entity', {
        allowHTML: true,
        interactive: true,
        appendTo: document.body,
        delay: [null, null],
        placement: 'right',
        theme: 'light-border',
        onShow: async (instance) => {
          this.hoverEntity = this.entities[instance.reference.dataset.eid]
          if (!this.hoverEntity.summary) {
            let label, summary
            if (this.hoverEntity.article) {
              let resp = await fetch(`https://api.juncture-digital.org/html/?url=${this.hoverEntity.article}`)
              if (resp.ok) {
                let articleHTML = await resp.text()
                let tmp = new DOMParser().parseFromString(articleHTML, 'text/html').children[0].children[1]
                label = tmp.querySelector('h1, h2, h3, h4, h5, h6').innerHTML
                summary = Array.from(tmp.querySelectorAll('p')).map(p => p.outerHTML).join('')
              }
            } else if (this.hoverEntity.mwPage) {
              let page = this.hoverEntity.mwPage.replace(/\/w\//, '/wiki/').split('/wiki/').pop()
              let resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${page}`)
              resp = await resp.json()
              summary = resp.extract_html
            }
            if (label || summary) {
              entities[instance.reference.dataset.eid].summary = summary
              entities[instance.reference.dataset.eid].label = entities[instance.reference.dataset.eid].label || label
              this.$emit('set-entities', entities)
              this.hoverEntity = {...entities[instance.reference.dataset.eid]}
            }
          }
          this.$nextTick(() => instance.setContent(this.$refs.popup.outerHTML))
        },
        onHide: () => {}
      })
    },
    toggleExpandCollapse(e) {
      let button = e.target
      let textDiv = button.previousElementSibling
      if (button.innerText == 'read more') {
        button.innerText = 'read less'
        textDiv.style['-webkit-line-clamp'] = 'unset'
      }
      else if (button.innerText == 'read less') {
        button.innerText = 'read more'
        textDiv.style['-webkit-line-clamp'] = 5
      }
    },
    // Finds all param tags in elements between top-level app element and element in para arg
    paramsInScope(root) {
      let paramTags = []
      let scope = []
      let el = root
      while (el) {
        scope.push(el)
        el = el.id !== 'essay-component' ? el.parentElement : null
      }
      scope.forEach(elemInScope => {
        let domPathElems = getDomPath(elemInScope)
        let elemPath = domPathElems.slice(domPathElems.indexOf('div#essay-component')+1).join('>')
        paramTags = [...paramTags, ...this.params.filter(param => param.path === elemPath)]
        })
        return paramTags
    },
    // Finds words/phrases in content paragraphs that match labels or aliases for entities in scope
    // Matched text is wrapped with a span tag for reacting to hover and click actions
    tagEntities(root) {
      Array.from(root.querySelectorAll('.segment p')).forEach(para => {
        let paraHTML = para.innerHTML
        this.paramsInScope(para, this.params)
          .filter(param => param['ve-entity'] !== undefined || param.eid !== undefined)
          .map(param => param.eid)
          .forEach(id => {
            let entity = this.entities[id]
            if (entity) {
              let toMatch = [...[entity.label], ...Array.from(entity.aliases).filter(alias => alias.length > 2)]
              for (let i = 0; i < toMatch.length; i++) {
                if (toMatch[i]) {
                  let re = new RegExp(`(^|[\\s(>])(${toMatch[i].replace(/'/, "'?")})([\\s)<;:,.]|$)`, 'i')
                  let match = re.exec(paraHTML)
                  if (match) {
                    // paraHTML = paraHTML.replace(match[2], `<span class="entity inferred" data-eid="${id}">${match[2]}</span>`)
                    paraHTML = paraHTML.replace(match[2], `<ve-entity-infobox qid="${id}">${match[2]}</ve-entity-infobox>`)
                    entity.foundIn.add(para.parentElement.dataset.id)
                    break
                  }
                }
              }
            }
          })
        para.innerHTML = paraHTML
      })
      Array.from(root.querySelectorAll('p span')).forEach(span => {
        if (span.attributes.eid) {
          let entityInfobox = document.createElement('ve-entity-infobox')
          entityInfobox.innerHTML = span.innerHTML
          entityInfobox.setAttribute('qid', span.attributes.eid.value)
          span.replaceWith(entityInfobox)
        }
      })
    }
  },
  watch: {
    html: {
      handler: function (html) {
        if (html) {
          let tmp = new DOMParser().parseFromString(html, 'text/html').children[0].children[1]
          this.processedHtml = this.doCustomFormatting(tmp)
          this.$nextTick(() => this.essayLoaded())
        }
      },
      immediate: true
    },
    items: {
      handler: function (items) {
        this.$emit('set-items', items)
      },
      immediate: true
    }
  }
}

function getDomPath(el) {
  var stack = []
  while ( el.parentNode != null ) {
    let sibCount = 0
    let sibIndex = 0
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      let sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + `#${el.id}`)
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + (sibIndex > 0 ? `[${sibIndex}]` : ''))
    } else {
      stack.unshift(el.nodeName.toLowerCase())
    }
    el = el.parentNode
  }
  return stack
}
</script>

<style>

  .popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.2);
    padding: 12px;
  }
</style>

<style scoped>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr) );
    grid-auto-rows: 1fr;
    grid-gap: 1.8rem;
  }
  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr 0px;
    grid-template-areas:
        "image"
        "title"
        "metadata"
        "abstract"
        "heading";
    border-radius: 4px;
    padding: .5rem;
  }
  .card > a, .card > strong {
    grid-area: title;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-top: 1.3rem;
    margin-bottom: 0.2rem;
    text-decoration: none;
}
  .card a:hover {
    text-decoration: underline;
  }
  .card img {
      grid-area: image;
      justify-self: stretch;
      object-fit: cover;
      width: 100%;
      height: 250px;
  }
  .card ul {
      grid-area: metadata;
      list-style-type: none;
      padding: 12px 0;
      margin: 0;
      font-size: 0.9rem;
      font-weight: 400;
  }
</style>

import { defineCustomElement } from 'vue'
import ('preline')

import '@shoelace-style/shoelace/dist/components/animated-image/animated-image.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js'
import '@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js'
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js'
import '@shoelace-style/shoelace/dist/components/details/details.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/image-comparer/image-comparer.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'

import AnimatedImage from './components/AnimatedImage.ce.vue'
import Annotate from './components/Annotate.ce.vue'
import Article from './components/Article.ce.vue'
import Audio from './components/Audio.ce.vue'
import Breadcrumbs from './components/Breadcrumbs.ce.vue'
// import Button from './components/Button.ce.vue'
import Carousel from './components/Carousel.ce.vue'
import Compare from './components/Compare.ce.vue'
import ContentSelector from './components/ContentSelector.ce.vue'
// import Dropdown from './components/Dropdown.ce.vue'
import Entities from './components/Entities.ce.vue'
import EntityCard from './components/EntityCard.ce.vue'
import EntityInfobox from './components/EntityInfobox.ce.vue'
import Footer from './components/Footer.ce.vue'
import Gallery from './components/Gallery.ce.vue'
import GhFileSelector from './components/GhFileSelector.ce.vue'
import Header from './components/Header.ce.vue'
import IFrame from './components/IFrame.ce.vue'
import Image from './components/Image.ce.vue'
import Caption from './components/Caption.ce.vue'
import InfoCard from './components/InfoCard.ce.vue'
import Juncture1Viewers from './components/Juncture1Viewers.ce.vue'
import Juncture1ViewersSlots from './components/Juncture1ViewersSlots.ce.vue'
import KnightlabTimeline from './components/KnightlabTimeline.ce.vue'
import Manifest from './components/Manifest.ce.vue'
import ManifestPopup from './components/ManifestPopup.ce.vue'
import Map from './components/Map.ce.vue'
import Menu from './components/Menu.ce.vue'
import Mermaid from './components/Mermaid.ce.vue'
import Meta from './components/Meta.ce.vue'
import Modal from './components/Modal.ce.vue'
import PlantSpecimen from './components/PlantSpecimen.ce.vue'
import SiteSearch from './components/SiteSearch.ce.vue'
import SourceViewer from './components/SourceViewer.ce.vue'
import Snippet from './components/Snippet.ce.vue'
// import SlotTest from './components/SlotTest.ce.vue'
// import SpcWrapper from './components/SpcWrapper.ce.vue'
import Video from './components/Video.ce.vue'
import VisJS from './components/VisJS.ce.vue'


function defineCustomElements() {
	customElements.define('ve-animated-image', defineCustomElement(AnimatedImage))
	customElements.define('ve-annotate', defineCustomElement(Annotate))
	customElements.define('ve-article', defineCustomElement(Article))
	customElements.define('ve-audio', defineCustomElement(Audio))
	customElements.define('ve-breadcrumbs', defineCustomElement(Breadcrumbs))
	customElements.define('ve-carousel', defineCustomElement(Carousel))
	customElements.define('ve-compare', defineCustomElement(Compare))
	customElements.define('ve-content-selector', defineCustomElement(ContentSelector))
	// customElements.define('ve-button', defineCustomElement(Button))
	// customElements.define('ve-dropdown', defineCustomElement(Dropdown))
	customElements.define('ve-entities', defineCustomElement(Entities))
	customElements.define('ve-entity-card', defineCustomElement(EntityCard))
	customElements.define('ve-entity-infobox', defineCustomElement(EntityInfobox))
	customElements.define('ve-footer', defineCustomElement(Footer))
	customElements.define('ve-gallery', defineCustomElement(Gallery))
	customElements.define('ve-gh-file-selector', defineCustomElement(GhFileSelector))
	customElements.define('ve-header', defineCustomElement(Header))
	customElements.define('ve-iframe', defineCustomElement(IFrame))
	customElements.define('ve-image', defineCustomElement(Image))
	customElements.define('ve-caption', defineCustomElement(Caption))
	customElements.define('ve-info-card', defineCustomElement(InfoCard))
	customElements.define('ve-j1-viewers', defineCustomElement(Juncture1Viewers))
	customElements.define('ve-j1-viewers-slots', defineCustomElement(Juncture1ViewersSlots))
	customElements.define('ve-knightlab-timeline', defineCustomElement(KnightlabTimeline))
	customElements.define('ve-manifest', defineCustomElement(Manifest))
	customElements.define('ve-manifest-popup', defineCustomElement(ManifestPopup))
	customElements.define('ve-map', defineCustomElement(Map))
	customElements.define('ve-menu', defineCustomElement(Menu))
	customElements.define('ve-mermaid', defineCustomElement(Mermaid))
	customElements.define('ve-meta', defineCustomElement(Meta))
	customElements.define('ve-modal', defineCustomElement(Modal))
	customElements.define('ve-plant-specimen', defineCustomElement(PlantSpecimen))
	customElements.define('ve-site-search', defineCustomElement(SiteSearch))
	// customElements.define('ve-slot-test', defineCustomElement(SlotTest))
	// customElements.define('ve-sfc-wrapper', defineCustomElement(SpcWrapper))
	customElements.define('ve-snippet', defineCustomElement(Snippet))
	customElements.define('ve-source-viewer', defineCustomElement(SourceViewer))
	customElements.define('ve-video', defineCustomElement(Video))
	customElements.define('ve-visjs', defineCustomElement(VisJS))
}

// @ts-ignore
console.log(`juncture: version=${process.env.version}`)

defineCustomElements()

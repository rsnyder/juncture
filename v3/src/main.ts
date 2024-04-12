import { defineCustomElement } from 'vue'
import ('preline')

import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/image-comparer/image-comparer.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'

import Audio from './components/Audio.ce.vue'
import Breadcrumbs from './components/Breadcrumbs.ce.vue'
// import Button from './components/Button.ce.vue'
import Compare from './components/Compare.ce.vue'
// import Dropdown from './components/Dropdown.ce.vue'
import Entities from './components/Entities.ce.vue'
import EntityCard from './components/EntityCard.ce.vue'
import EntityInfobox from './components/EntityInfobox.ce.vue'
import Footer from './components/Footer.ce.vue'
import Gallery from './components/Gallery.ce.vue'
import Header from './components/Header.ce.vue'
import IFrame from './components/IFrame.ce.vue'
import Image from './components/Image.ce.vue'
import Caption from './components/Caption.ce.vue'
import InfoCard from './components/InfoCard.ce.vue'
import Juncture1Viewers from './components/Juncture1Viewers.ce.vue'
import KnightlabTimeline from './components/KnightlabTimeline.ce.vue'
import Manifest from './components/Manifest.ce.vue'
import ManifestPopup from './components/ManifestPopup.ce.vue'
import Map from './components/Map.ce.vue'
import Menu from './components/Menu.ce.vue'
import Meta from './components/Meta.ce.vue'
import Modal from './components/Modal.ce.vue'
import PlantSpecimen from './components/PlantSpecimen.ce.vue'
import SiteSearch from './components/SiteSearch.ce.vue'
import SpcWrapper from './components/SpcWrapper.ce.vue'
import Video from './components/Video.ce.vue'


function defineCustomElements() {
	customElements.define('mdp-audio', defineCustomElement(Audio))
	customElements.define('mdp-breadcrumbs', defineCustomElement(Breadcrumbs))
	customElements.define('mdp-compare', defineCustomElement(Compare))
	// customElements.define('mdp-button', defineCustomElement(Button))
	// customElements.define('mdp-dropdown', defineCustomElement(Dropdown))
	customElements.define('mdp-entities', defineCustomElement(Entities))
	customElements.define('mdp-entity-card', defineCustomElement(EntityCard))
	customElements.define('mdp-entity-infobox', defineCustomElement(EntityInfobox))
	customElements.define('mdp-footer', defineCustomElement(Footer))
	customElements.define('mdp-gallery', defineCustomElement(Gallery))
	customElements.define('mdp-header', defineCustomElement(Header))
	customElements.define('mdp-iframe', defineCustomElement(IFrame))
	customElements.define('mdp-image', defineCustomElement(Image))
	customElements.define('mdp-caption', defineCustomElement(Caption))
	customElements.define('mdp-info-card', defineCustomElement(InfoCard))
	customElements.define('mdp-j1-viewers', defineCustomElement(Juncture1Viewers))
	customElements.define('mdp-knightlab-timeline', defineCustomElement(KnightlabTimeline))
	customElements.define('mdp-manifest', defineCustomElement(Manifest))
	customElements.define('mdp-manifest-popup', defineCustomElement(ManifestPopup))
	customElements.define('mdp-map', defineCustomElement(Map))
	customElements.define('mdp-menu', defineCustomElement(Menu))
	customElements.define('mdp-meta', defineCustomElement(Meta))
	customElements.define('mdp-modal', defineCustomElement(Modal))
	customElements.define('mdp-plant-specimen', defineCustomElement(PlantSpecimen))
	customElements.define('mdp-site-search', defineCustomElement(SiteSearch))
	customElements.define('mdp-sfc-wrapper', defineCustomElement(SpcWrapper))
	customElements.define('mdp-video', defineCustomElement(Video))
}

// @ts-ignore
console.log(`mdpress: version=${process.env.version}`)

defineCustomElements()

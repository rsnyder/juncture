import { defineCustomElement } from 'vue'
import ('preline')

import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'

// import '@shoelace-style/shoelace/dist/themes/light.css'
// import './css/github-markdown.css' /* From https://github.com/sindresorhus/github-markdown-css */
// import './css/cards.css'
// import './css/default.css'

import Breadcrumbs from './components/Breadcrumbs.ce.vue'
// import Button from './components/Button.ce.vue'
// import Dropdown from './components/Dropdown.ce.vue'
import EntityInfobox from './components/EntityInfobox.ce.vue'
import Footer from './components/Footer.ce.vue'
import Gallery from './components/Gallery.ce.vue'
import Header from './components/Header.ce.vue'
import Image from './components/Image.ce.vue'
import Manifest from './components/Manifest.ce.vue'
import ManifestPopup from './components/ManifestPopup.ce.vue'
import Map from './components/Map.ce.vue'
import Menu from './components/Menu.ce.vue'
import Meta from './components/Meta.ce.vue'
import Modal from './components/Modal.ce.vue'
import SiteSearch from './components/SiteSearch.ce.vue'
// import Trigger from './components/Trigger.ce.vue'


function defineCustomElements() {
	customElements.define('mdp-breadcrumbs', defineCustomElement(Breadcrumbs))
	// customElements.define('mdp-button', defineCustomElement(Button))
	// customElements.define('mdp-dropdown', defineCustomElement(Dropdown))
	customElements.define('mdp-entity-infobox', defineCustomElement(EntityInfobox))
	customElements.define('mdp-footer', defineCustomElement(Footer))
	customElements.define('mdp-gallery', defineCustomElement(Gallery))
	customElements.define('mdp-header', defineCustomElement(Header))
	customElements.define('mdp-image', defineCustomElement(Image))
	customElements.define('mdp-manifest', defineCustomElement(Manifest))
	customElements.define('mdp-manifest-popup', defineCustomElement(ManifestPopup))
	customElements.define('mdp-map', defineCustomElement(Map))
	customElements.define('mdp-menu', defineCustomElement(Menu))
	customElements.define('mdp-meta', defineCustomElement(Meta))
	customElements.define('mdp-modal', defineCustomElement(Modal))
	customElements.define('mdp-site-search', defineCustomElement(SiteSearch))
	// customElements.define('mdp-trigger', defineCustomElement(Trigger))
}

// @ts-ignore
console.log(`mdpress: version=${process.env.version}`)

defineCustomElements()

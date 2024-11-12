# Image Carousel

<style> 
    .markdown-section h2 ~ p > strong > a { color: crimson; font-size: 110%; text-decoration: none; }
    .markdown-section table { 
        margin-left:3rem; 
        width: calc(100% - 6rem); 
        border:1px solid #555;
    }
    .markdown-section td, .markdown-section th {
        border:1px solid #555;
        padding: 8px;
        line-height: 1.2;
    }
    .markdown-section th {
        background-color:#E2F0F7;
        font-weight:bold !important;
        text-align:center !important;
    }
    h3 {
        margin-top: 2em !important;
    }

</style>

The `ve-carousel` displays an arbitrary number of images along a horizontal or vertical axis.  The `ve-carousel` is a Juncture wrapper for the [Shoelace](https://shoelace.style/) [sl-carousel](https://shoelace.style/components/carousel) component.

## Attributes

**[aspect-ratio](#basic)** (_string_) :  Use the `aspect-ratio` attribute to customize the size of the carousel’s viewport from the default value of **16/9**.  Other values include **3/2** and **1/1**.

**[autoplay](#basic)** (_boolean_) :  The carousel will automatically advance when the `autoplay` attribute is used. To change how long a slide is shown before advancing, set autoplay-interval to the desired number of milliseconds. For best results, use the loop attribute when autoplay is enabled. Note that autoplay will pause while the user interacts with the carousel.

**[caption](#basic)** (_string_) :  A caption for the carousel viewer.  Image-specific captions are set in the image list.

**[fit](#basic)** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.

- **contain** (_default_) - The image keeps its aspect ratio, but is resized to fit within the available space.
- **cover** - The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit.

**[gallery](#basic)** (_boolean_) :  The `gallery` attribute syncs the active slide with a set of thumbnails, creating a gallery-style carousel.

**[height](#basic)** (_number_) :  

**[loop](#basic)** (_boolean_) :  By default, the carousel will not advanced beyond the first and last slides. You can change this behavior and force the carousel to “wrap” with the `loop` attribute.

**[navigation](#basic)** (_boolean_) :  Use the `navigation` attribute to show previous and next buttons.

**[orientation](#basic)** (_string_) :  Setting the `orientation` attribute to **vertical** will render the carousel in a vertical layout. If the content of your slides vary in height, you will need to set amn explicit height or max-height on the carousel using CSS.

**[pagination](#basic)** (_boolean_) :  Use the `pagination` attribute to show the total number of slides and the current slide as a set of interactive dots.

**[scroll-hint](#basic)** (_boolean_) :  Use the `scroll-hint` attribute to add inline padding in horizontal carousels and block padding in vertical carousels. This will make the closest slides slightly visible, hinting that there are more items in the carousel.

**[slides-per-page](#basic)** (_number_) :  The `slides-per-page` attribute makes it possible to display multiple slides at a time. You can also use the `slides-per-move` attribute to advance more than once slide at a time, if desired.

**[slides-per-move](#basic)** (_number_) :  Generally used in conjunction with the `slides-per-page` attribute to advance more than one slide at a time.

**[width](#basic)** (_number_) :  

## Images list

An image definition for each carousel image follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided.  Other optional attributes may be specified as needed.

### Image Attributes

**[caption](#basic)** (_string_) :  Image-specific caption.  Overrides the default caption generated from the `label` property in the IIIF manifest for the image.

**[fit](#basic)** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.  This image-specific attribute overrides the `fit` attribute defined in the carousel headline.

- **contain** (_default_) - The image keeps its aspect ratio, but is resized to fit within the available space.
- **cover** - The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit.

**[src](#basic)** (_string_) :  URL for image IIIF manifest.


## Examples

<ve-snippet collapsible label="Basic Carousel with navigation controls">
```
carousel navigation
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with caption and navigation controls">
```
carousel "Carousel with navigation controls" navigation
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with caption, navigation and pagination controls">
```
carousel navigation pagination caption="Carousel with navigation and pagination controls"
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with autoplay and loop">
```
carousel autoplay loop
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with gallery">
```
carousel gallery navigation caption="Carousel with gallery"
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with gallery and 'cover' image fit">
```
carousel gallery navigation fit=cover caption="Carousel with 'cover' fit'"
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg
- wc:Amalfi_Coast_Italy_6.JPG
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>

<ve-snippet collapsible label="Carousel with image-specific attributes">
```
carousel "Carousel with image-specific attributes" navigation
- wc:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg "Custom caption for image 1"
- wc:Amalfi_Coast_Italy_6.JPG "Custom caption for image 2 and fit=cover" fit=cover
- wc:Costiera-amalfitana-_panorama_from_the_sea_129.jpg "*Caption* with **Markdown** formatting"
- wc:Amalfi_Coast_(247891371).jpeg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_73_(50557616528).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_72_(50558479917).jpg
- wc:Amalfi_Coast_(Italy,_October_2020)_-_14_(50558382446).jpg
```
</ve-snippet>
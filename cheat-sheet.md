[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

<style>
	h3 { font-size: 2em !important; color: #5A162E; }
	.section3 ul strong { color: red; }
</style>

# Juncture Cheat Sheat

## Juncture tagging

Juncture extends the Markdown language with tags for adding viewer components to the generated web page.

## Juncture components

- [Animated Image Viewer](#animated-image-viewer)
- [Audio Player](#audio-player)
- [Image Carousel](#image-carousel)
- [IFrame Viewer](#iframe-viewer)
- [Image Compare Viewer](#image-compare-viewer)
- [Image Gallery](#image-gallery)
- [Image Viewer](#image-viewer)
- [Map Viewer](#map-viewer)
- [Mermaid Diagram Viewer](#mermaid-diagram-viewer)
- [Plant Specimen Viewer](#plant-specimen-viewer)
- [Video Player](#video-player)
- [VisJS Diagram Viewer](#visjs-diagram-viewer)

### Animated Image Viewer 

The `animated-image` tag creates a viewer that is able to play animated GIFs.

####
`.mcol`

#####

**Tag Attributes**

- **src** (_string_): The URL to the animated GIF image.  Wikimedia Commons short form URLs are supported.
- **caption** (_string_): Defines the text to use for a caption that is displayed below the image.
- **autoplay** (_boolean_): Automatically play animation when viewer is displayed.

#####

**Examples**

<ve-snippet collapsible label="Click to view basic example">
`animated-image https://upload.wikimedia.org/wikipedia/commons/e/e3/Animhorse.gif`
</ve-snippet>

For more examples visit the [animated-image documentation page](https://docs.juncture-digital.org/components/animated-image-viewer).

### Audio Player

The `audio` tag creates a viewer that is able to play audio content.

####
`.mcol`

#####

**Tag Attributes**

- **src** (_string_): The URL to the animated GIF image.  Wikimedia Commons short form URLs are supported.
- **caption** (_string_): Defines the text to use for a caption that is displayed below the image.
- **start** (_number_): Time position to start playing audio clip.
- **end** (_number_): Time position to stop playing audio clip.
- **autoplay** (_boolean_): Automatically play animation when viewer is displayed.
- **muted** (_boolean_): Mute audio when initially played.
- **sync** (_boolean_): Synchronize playback with timestamps in text headline.

#####

**Examples**

<ve-snippet collapsible label="Click to view example">
`audio wc:Interview_with_Warren_Hanson_regarding_Hundred_Flowers.ogg "Interview with Warren Hanson regarding Hundred Flowers"`
 </ve-snippet>
 
For more examples visit the [audio documentation page](https://docs.juncture-digital.org/components/audio-player).

### Image Carousel

The `carousel` tag displays an arbitrary number of images along a horizontal or vertical axis.  The carousel is a Juncture wrapper for the [Shoelace](https://shoelace.style/) [sl-carousel](https://shoelace.style/components/carousel) component.

####
`.mcol`

#####

**Tag Attributes**

- **caption** (_string_) :  A caption for the carousel viewer.  Image-specific captions are set in the image list.
- **aspect-ratio**: (_string_) :  Use the `aspect-ratio` attribute to customize the size of the carousel’s viewport from the default value of **16/9**.  Other values include **3/2** and **1/1**.
- **autoplay** (_boolean_) :  The carousel will automatically advance when the `autoplay` attribute is used. To change how long a slide is shown before advancing, set autoplay-interval to the desired number of milliseconds. For best results, use the loop attribute when autoplay is enabled. Note that autoplay will pause while the user interacts with the carousel.
- **fit** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.

	| Value | Description |
	| -------- | ---------------------------------------- |
	| *contain*  (_default_)  | The image keeps its aspect ratio, but is resized to fit within the available space |
	| *cover*  | The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit  |

- **gallery** (_boolean_) :  The `gallery` attribute syncs the active slide with a set of thumbnails, creating a gallery-style carousel.
	| Value | Description |
	| -------- | ---------------------------------------- |
	| *contain*  (_default_)  | The image keeps its aspect ratio, but is resized to fit within the available space |
	| *cover*  | The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit  |
- **loop** (_boolean_) :  By default, the carousel will not advanced beyond the first and last slides. You can change this behavior and force the carousel to "wrap" with the `loop` attribute.
- **navigation** (_boolean_) :  Use the `navigation` attribute to show previous and next buttons.
- **orientation** (_string_) :  Setting the `orientation` attribute to **vertical** will render the carousel in a vertical layout. If the content of your slides vary in height, you will need to set amn explicit height or max-height on the carousel using CSS.
- **pagination** (_boolean_) :  Use the `pagination` attribute to show the total number of slides and the current slide as a set of interactive dots.
- **scroll-hint** (_boolean_) :  Use the `scroll-hint` attribute to add inline padding in horizontal carousels and block padding in vertical carousels. This will make the closest slides slightly visible, hinting that there are more items in the carousel.
- **slides-per-page** (_number_) :  The `slides-per-page` attribute makes it possible to display multiple slides at a time. You can also use the `slides-per-move` attribute to advance more than once slide at a time, if desired.
- **slides-per-move** (_number_) :  Generally used in conjunction with the `slides-per-page` attribute to advance more than one slide at a time.

**Images List**

A list of one or more images to be displayed in the carousel.  At a minimum, the `src` attribute must be defined for each image.  Other optional attributes may be defined as needed.

- **src** (_string_): The URL to the image IIIF manifest.  Wikimedia Commons and Github short form URLs are supported.
- **caption** (_string_) :  A caption for the image.
- **fit** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.
	- *contain* (_default_) - The image keeps its aspect ratio, but is resized to fit within the available space.
	- *cover* - The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit.

#####

**Examples**

<ve-snippet collapsible label="Basic Carousel">
```
carousel navigation caption="Wikimedia Commons Picture of the Year"
- wc:Glühwendel_brennt_durch.jpg 2013
- wc:A_butterfly_feeding_on_the_tears_of_a_turtle_in_Ecuador.jpg 2014
- wc:Pluto-01_Stern_03_Pluto_Color_TXT.jpg 2015
- wc:Jubilee_and_Munin,_Ravens,_Tower_of_London_2016-04-30.jpg 2016
- wc:Perereca-macaco_-_Phyllomedusa_rohdei.jpg 2017
- wc:Evolution_of_a_Tornado.jpg 2018
- wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg 2019
- wc:Alcedo_atthis_-_Riserve_naturali_e_aree_contigue_della_fascia_fluviale_del_Po.jpg 2020
- wc:Holy_SURP_Hovhannes_Church.jpg 2021
- wc:Phalacrocorax_carbo,_Egretta_garzetta_and_Mareca_strepera_in_Taudha_Lake.jpg 2022
```
</ve-snippet>

For more examples visit the [carousel documentation page](https://docs.juncture-digital.org/components/image-carousel).

### IFrame Viewer

The `iframe` tag allows arbitrary web pages to be embedded in an essay. The Juncture iframe viewer is a light wrapper around the standard HTML iframe that is used to embed another document within the current HTML document.

####
`.mcol`

#####

**Tag Attributes**

- **src** (_string_):  The URL of the page to embed. Use a value of about:blank to embed an empty page that conforms to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#inherited_origins). Also note that programmatically removing an iframe's src attribute (e.g. via [Element.removeAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)) causes about:blank to be loaded in the frame in Firefox (from version 65), Chromium-based browsers, and Safari/iOS.

***Expert attributes***

The following attributes are passed through to the native `iframe` element.  These attributes should not normally be needed.

- **allow** (_string_):  Specifies a [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) for the iframe. The policy defines what features are available to the iframe (for example, access to the microphone, camera, battery, web-share, etc.) based on the origin of the request.
- **allowfullscreen** (_boolean_):  Set to true if the **[allow](#expert)** (_string_):  Specifies a [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) for the iframe. The policy defines what features are available to the iframe (for example, access to the microphone, camera, battery, web-share, etc.) based on the origin of the request.
 can activate fullscreen mode by calling the requestFullscreen() method.
- **credentialless** (_string_):  Set to true to make the iframe credentialless, meaning that its content will be loaded in a new, ephemeral context. It doesn't have access to the network, cookies, and storage data associated with its origin. It uses a new context local to the top-level document lifetime. In return, the [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) (COEP) embedding rules can be lifted, so documents with COEP set can embed third-party documents that do not. See [IFrame credentialless](https://developer.mozilla.org/en-US/docs/Web/Security/IFrame_credentialless) for more details.
- **csp** (_string_):  A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) enforced for the embedded resource. See [HTMLIFrameElement.csp](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp) for details.
- **fetchpriority** (_string_):  Provides a hint of the relative priority to use when fetching the iframe document. Allowed values:

	| Value | Description |
	| -------- | ---------------------------------------- |
	| high | Signals a high-priority fetch relative to other iframe documents. |
	| low  | Signals a low-priority fetch relative to other iframe documents. |
	| auto | Default: Signals automatic determination of fetch priority relative to other iframe documents. |

- **loading** (_string_):  Indicates how the browser should load the iframe:

	| Value | Description |
	| -------- | ---------------------------------------- |
	| eager | Load the iframe immediately, regardless if it is outside the visible viewport (this is the default value) |
	| lazy  | Defer loading of the iframe until it reaches a calculated distance from the viewport, as defined by the browser. |

- **name** (_string_):  A targetable name for the embedded browsing context. This can be used in the target attribute of the `a`, `form`, or `base` elements; the formtarget attribute of the `input` or `button` elements; or the windowName parameter in the [window.open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) method.
- **referrerpolicy** (_string_):  Indicates which referrer to send when fetching the frame's resource:

	| Value | Description |
	| -------- | ---------------------------------------- |
	| no-referrer                     | The [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header will not be sent. |
	| no-referrer-when-downgrade      | The [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header will not be sent to [origins](https://developer.mozilla.org/en-US/docs/Glossary/Origin) without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS) ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)). |
	| origin                          | The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL), [host](https://developer.mozilla.org/en-US/docs/Glossary/Host), and [port](https://developer.mozilla.org/en-US/docs/Glossary/Port). |
	| origin-when-cross-origin        | The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.
	 |
	| same-origin                     | A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy), but cross-origin requests will contain no referrer information. |
	| strict-origin                   | Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don't send it to a less secure destination (HTTPS→HTTP). |
	| strict-origin-when-cross-origin | (default): Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP). |
	| unsafe-url                      | The referrer will include the origin and the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/username)). This value is unsafe, because it leaks origins and paths from TLS-protected resources to insecure origins. |

- **sandbox** (_string_):  Applies extra restrictions to the content in the frame. The value of the attribute can either be empty to apply all restrictions, or space-separated tokens to lift particular restrictions:

	| Value | Description |
	| -------- | ---------------------------------------- |
	| allow-downloads-without-user-activation | Allows for downloads to occur without a gesture from the user. |
	| allow-downloads | Allows for downloads to occur with a gesture from the user. |
	| allow-forms | Allows the resource to submit forms. If this keyword is not used, form submission is blocked. |
	| allow-modals | Lets the resource [open modal windows](https://html.spec.whatwg.org/multipage/browsers.html#sandboxed-modals-flag) |
	| allow-orientation-lock | Lets the resource [lock the screen orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation). |
	| allow-pointer-lock | Lets the resource use the [Pointer Lock API.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) |
	| allow-popups | Allows popups (such as window.open(), target="_blank", or showModalDialog()). If this keyword is not used, the popup will silently fail to open. |
	| allow-popups-to-escape-sandbox | Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to. |
	| allow-presentation | Lets the resource start a [presentation session](https://developer.mozilla.org/en-US/docs/Web/API/PresentationRequest). |
	| allow-same-origin | If this token is not used, the resource is treated as being from a special origin that always fails the [same-origin policy](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy) (potentially preventing access to [data storage/cookies](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_data_storage_access) and some JavaScript APIs). |
	| allow-scripts | Lets the resource run scripts (but not create popup windows). |
	| allow-storage-access-by-user-activation | Lets the resource request access to the parent's storage capabilities with the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API). |
	| allow-top-navigation | Lets the resource navigate the top-level browsing context (the one named _top). |
	| allow-top-navigation-by-user-activation | Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture. |

- **srcdoc** (_string_):  Inline HTML to embed, overriding the src attribute. If a browser does not support the srcdoc attribute, it will fall back to the URL in the src attribute.

#####

**Examples**
 
<ve-snippet collapsible label="Click to view example">
`iframe https://archive.org/embed/slaveryinunit00ballcha/page/172/mode/1up`
</ve-snippet>

For more examples visit the [iframe documentation page](https://docs.juncture-digital.org/components/iframe-viewer).

### Image Compare Viewer

The `image-compare` tag creates a viewer that is able to display 2 high-resolution in a stacked compare viewer.

####
`.mcol`

#####

**Tag Attributes**

- **caption** (_string_) :  A caption for the compare viewer.

**Images List**

An image definition for the 2 images to be compared follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided in the `src` attribute.  The region attribute may optionally be specified on one or bot images as needed for alignment.

- **src** (_string_) :  URL for image IIIF manifest.
- **region** (_string_):  The region attribute defines the rectangular portion of the full image to be returned. The region can be specified by pixel coordinates, percentage, or by the value "full", which specifies that the entire image should be returned.

#####

**Examples**
 
<ve-snippet collapsible label="Click to view example">
```
compare caption="Comparison of Van Gogh Sketch and Painting"
wc:Vincent_van_Gogh_-_Vincent's_Bedroom_in_Arles_-_Letter_Sketch_October_1888.jpg
wc:Vincent_van_Gogh’s_famous_painting,_digitally_enhanced_by_rawpixel-com_49.jpg
```
</ve-snippet>

For more examples visit the [image-compare documentation page](https://docs.juncture-digital.org/components/image-compare-viewer).

### Image Gallery

The `gallery` tag displays an arbitrary number of image thumbnails in a grid. By default only the thumbnail is displayed. An image caption cah be shown using the show-caption boolean attribute. When the thumbnail is clicked, the full image is shown in a popup window.

####
`.mcol`

#####

**Tag Attributes**

- **show-captions** (_boolean_) : Displays the image caption below each thumbnail in the grid.

**Images List**

An image definition for each carousel image follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided in the `src` attribute.  An optional `caption` may be provided to replace the caption obtained from the IIIF manifest.  Note that this caption will only show if the `show-caption` attribute is set in the tag headline.

- **src** (_string_) :  URL for image IIIF manifest.
- **caption** (_string_) :  Image-specific caption.  Overrides the default caption generated from the `label` property in the IIIF manifest for the image.

#####

**Examples**

<ve-snippet collapsible label="Click to view example">
```
gallery
- wc:Glühwendel_brennt_durch.jpg 2013
- wc:A_butterfly_feeding_on_the_tears_of_a_turtle_in_Ecuador.jpg 2014
- wc:Pluto-01_Stern_03_Pluto_Color_TXT.jpg 2015
- wc:Jubilee_and_Munin,_Ravens,_Tower_of_London_2016-04-30.jpg 2016
- wc:Perereca-macaco_-_Phyllomedusa_rohdei.jpg 2017
- wc:Evolution_of_a_Tornado.jpg 2018
- wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg 2019
- wc:Alcedo_atthis_-_Riserve_naturali_e_aree_contigue_della_fascia_fluviale_del_Po.jpg 2020
- wc:Holy_SURP_Hovhannes_Church.jpg 2021
- wc:Phalacrocorax_carbo,_Egretta_garzetta_and_Mareca_strepera_in_Taudha_Lake.jpg 2022
```
</ve-snippet>

For more examples visit the [gallery documentation page](https://docs.juncture-digital.org/components/image-gallery).

### Image Viewer

The `image` tag will render a high-resolution image with full interactivity (deep-zoom and panning) enabled.

Many of the image-specific attributes used in the ve-image viewer are based on the [IIIF Image API](https://iiif.io/api/image/2.1/).  The attribute values are often directly passed to the IIIF server hosting the images.  For detailed explanations of the attributes and possible values, the [IIIF image request parameters](https://iiif.io/api/image/2.1/#image-request-parameters) documentation should be consulted.

####
`.mcol`

#####

**Tag attributes**

- **src** (_url_) :  The URL to the IIIF manifest for the item to display in the viewer.  This attribute is omitted when using the viewer in multi-image mode.  This attribute may also be omitted in single-image mode when QIDs are in scope.  When a src attribute is not specified the most relevant (closest) QID to the tag is used to generate an IIIF manifest URL.  More information on QID use can be found in the [Wikidata](#wikidata) section.
**caption** (_string_):  When a single image is defined using the `src` attribute a caption is automatically generated using the label property found in the associated IIIF manifest.  This caption is displayed in the caption bar at the bottom of the viewer by default (this can be inhibited by adding a `no-caption` attribute).  Specifying a caption in single-image mode will override this with the value provided in this attribute.  In all other viewer modes (multi-image, audio, and video) no caption is displayed in the caption bar.  Defining a caption with this attribute will cause the caption bar to be displayed with the provided text.
- **static** (_boolean_):  A static image is returned instead of an interactive image with deep-zoom and panning.  `static` mode provides a number of image formatting options not available in the default interactive viewer (with deep zoom and panning).  More information on options available in static mode are found [below](#static-image-attributes).
- **seq** (_number_):  A number defining the image to use in a multi-image manifest.  If not specified the default value is _1_.
- **fit** (_string_):  The _fit_ attribute controls the display of an image in the viewer viewport.  In the default mode (_contain_) the entire image is shown with letter boxing applied to the top and bottom or left and right when the image aspect ratio differs from the viewer.  When the value _cover_ is used the entire viewport is filled and the displayed portion of the image is cropped as needed to fit.

	| Value | Description |
	| -------- | ---------------------------------------- |
	| *contain*  (_default_)  | The image keeps its aspect ratio, but is resized to fit within the available space |
	| *cover*  | The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit  |

- **no-caption** (_boolean_):  This attribute inhibits the display of the caption at the bottom of the viewer.
- **no-info-icon** (_boolean_):  This attribute inhibits the display of the icon used to trigger the display of the information popup.  By default, the icon is displayed in the top-right region of the viewer when hovering over the viewing area.
- **region** (_string_):  The region attribute defines the rectangular portion of the full image to be returned. The region can be specified by pixel coordinates, percentage, or by the value "full", which specifies that the entire image should be returned.

	| Form | Description |
	| -------- | ---------------------------------------- |
	| full        | The complete image is returned, without any cropping. |
	| square      | The region is defined as an area where the width and height are both equal to the length of the shorter dimension of the complete image. The region may be positioned anywhere in the longer dimension of the image content at the server’s discretion, and centered is often a reasonable default. |
	| x,y,w,h     | The region of the full image to be returned is specified in terms of absolute pixel values. The value of x represents the number of pixels from the 0 position on the horizontal axis. The value of y represents the number of pixels from the 0 position on the vertical axis. Thus the x,y position 0,0 is the upper left-most pixel of the image. w represents the width of the region and h represents the height of the region in pixels. |
	| pct:x,y,w,h | The region to be returned is specified as a sequence of percentages of the full image’s dimensions, as reported in the image information document. Thus, x represents the number of pixels from the 0 position on the horizontal axis, calculated as a percentage of the reported width. w represents the width of the region, also calculated as a percentage of the reported width. The same applies to y and h respectively. These may be floating point numbers. |

- **rotation** (_number_):  The rotation attribute specifies mirroring and rotation. A leading exclamation mark ("!") indicates that the image should be mirrored by reflection on the vertical axis before any rotation is applied. The numerical value represents the number of degrees of clockwise rotation, and may be any floating point number from 0 to 360.
- **zoom-on-scroll** (_boolean_):  Specifies whether the viewer will zoom the image when a scroll gesture is performed in the image viewer.  This is inhibited by default.

**Static image attributes**

The following attributes are only applicable for single images when `static` mode is enabled.

- **region** (_string_):  The region attribute defines the rectangular portion of the full image to be returned. The region can be specified by pixel coordinates, percentage, or by the value "full", which specifies that the entire image should be returned.

	| Form | Description |
	| -------- | ---------------------------------------- |
	| full        | The complete image is returned, without any cropping. |
	| square      | The region is defined as an area where the width and height are both equal to the length of the shorter dimension of the complete image. The region may be positioned anywhere in the longer dimension of the image content at the server’s discretion, and centered is often a reasonable default. |
	| x,y,w,h     | The region of the full image to be returned is specified in terms of absolute pixel values. The value of x represents the number of pixels from the 0 position on the horizontal axis. The value of y represents the number of pixels from the 0 position on the vertical axis. Thus the x,y position 0,0 is the upper left-most pixel of the image. w represents the width of the region and h represents the height of the region in pixels. |
	| pct:x,y,w,h | The region to be returned is specified as a sequence of percentages of the full image’s dimensions, as reported in the image information document. Thus, x represents the number of pixels from the 0 position on the horizontal axis, calculated as a percentage of the reported width. w represents the width of the region, also calculated as a percentage of the reported width. The same applies to y and h respectively. These may be floating point numbers. |

- **size** (_string_):  The size parameter determines the dimensions to which the extracted region is to be scaled.

	| Form | Description |
	| -------- | ---------------------------------------- |
	| full  | The image or region is not scaled, and is returned at its full size. |
	| max   | The image or region is returned at the maximum size available, as indicated by maxWidth, maxHeight, maxArea in the profile description. This is the same as full if none of these properties are provided. |
	| w,    | The image or region should be scaled so that its width is exactly equal to w, and the height will be a calculated value that maintains the aspect ratio of the extracted region. |
	| ,h    | The image or region should be scaled so that its height is exactly equal to h, and the width will be a calculated value that maintains the aspect ratio of the extracted region. |
	| pct:n |   The width and height of the returned image is scaled to n% of the width and height of the extracted region. The aspect ratio of the returned image is the same as that of the extracted region. |
	| w,h   |The width and height of the returned image are exactly w and h. The aspect ratio of the returned image may be different than the extracted region, resulting in a distorted image. |
	| !w,h  | The image content is scaled for the best fit such that the resulting width and height are less than or equal to the requested width and height. The exact scaling may be determined by the service provider, based on characteristics including image quality and system performance. The dimensions of the returned image content are calculated to maintain the aspect ratio of the extracted region. |

- **quality** (_string_):  The quality attribute determines whether the image is delivered in color, grayscale or black and white.  Recognized values for this attribute are `color`, `gray`, `bitonal`, `default`.  The default value used by the Juncture IIIF image server is `color`.

	| Value | Description |
	| -------- | ---------------------------------------- |
	| color   | The image is returned in full color. |
	| gray    | The image is returned in grayscale, where each pixel is black, white or any shade of gray in between. |
	| bitonal | The image returned is bitonal, where each pixel is either black or white. |
	| default | The image is returned using the server’s default quality (e.g. color, gray or bitonal) for the image. |

- **options** (_string_):  The _options_ attribute combines the `region`, `size`, `rotation`, `quality`, and `format` attributes into a single value.  

**Images List**

When multiple images are to be displayed an image definition for each image follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided in the `src` attribute.  Other optional attributes may be specified as needed.

- **src** (_string_) :  URL for image IIIF manifest.
- **caption** (_string_) :  Image-specific caption.  Overrides the default caption generated from the `label` property in the IIIF manifest for the image.
- **fit** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.  This image-specific attribute overrides the `fit` attribute defined in the carousel headline.

	| Value | Description |
	| -------- | ---------------------------------------- |
	| *contain*  (_default_)  | The image keeps its aspect ratio, but is resized to fit within the available space |
	| *cover*  | The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit  |

- **seq** (_number_):  A number defining the image to use in a multi-image manifest.  If not specified the default value is _1_.

#####

**Examples**

<ve-snippet collapsible label="Single image using Harvard hosted IIIF image">
 `image https://iiif.harvardartmuseums.org/manifests/object/299843`
</ve-snippet>

<ve-snippet collapsible label="Single image using Wikimedia Commons hosted IIIF image">
 `image https://iiif.mdpress.io/https://upload.wikimedia.org/wikipedia/commons/3/37/Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg/manifest.json`
</ve-snippet>

<ve-snippet collapsible label="Single image using Wikimedia Commons shorthand URL notation">
 `image wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg`
</ve-snippet>

<ve-snippet collapsible label="Single image with caption override">
 `image wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg caption="Wikimedia Commons picture of the year for 2019"`
</ve-snippet>

<ve-snippet collapsible label="Multiple images">
```
image
	- wc:Glühwendel_brennt_durch.jpg
	- wc:A_butterfly_feeding_on_the_tears_of_a_turtle_in_Ecuador.jpg
	- wc:Pluto-01_Stern_03_Pluto_Color_TXT.jpg
	- wc:Jubilee_and_Munin,_Ravens,_Tower_of_London_2016-04-30.jpg
	- wc:Perereca-macaco_-_Phyllomedusa_rohdei.jpg
	- wc:Evolution_of_a_Tornado.jpg
	- wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg
	- wc:Alcedo_atthis_-_Riserve_naturali_e_aree_contigue_della_fascia_fluviale_del_Po.jpg
	- wc:Holy_SURP_Hovhannes_Church.jpg
	- wc:Phalacrocorax_carbo,_Egretta_garzetta_and_Mareca_strepera_in_Taudha_Lake.jpg
```
</ve-snippet>

<ve-snippet collapsible label="Image with initial zoom set using region attribute">
	`image wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg static region=2075,516,1329,886`
</ve-snippet>

<ve-snippet collapsible label="Static image with region">
	`image wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg region=2075,516,1329,886`
</ve-snippet>

<ve-snippet collapsible label="Static image rotated 90 degrees">
	`image wc:Mud_Cow_Racing_-_Pacu_Jawi_-_West_Sumatra,_Indonesia.jpg rotation=90`
</ve-snippet>

For more examples visit the [image documentation page](https://docs.juncture-digital.org/components/image-viewer).
  
### Map Viewer

The `map` tag creates a map viewer that displays a base map with optional map layers. The map viewer supports zooming and panning. 

####
`.mcol`

#####

**Tag attributes**

- **location** (_string_):  Comma-separated values for latitude, longitude and an optional zoom level.  A Wikidata QID may be used in place of the latitude and longitude coordinates.
- **basemaps** (_string_):  The names of optional base maps to be used.  Multiple base map names are comma separated.  A list of supported base maps can be seen [here](/components/basemaps)
- **caption** (_string_):  A caption to use in the viewer caption bar.
- **center** (_string_):  Defines the initial center of the rendered map.  This can be defined using latitude and longitude coordinates or with a Wikidata QID.
- **marker** (_boolean_):  If true a Marker will be added to the map center point.
- **popup-on-hover** (_boolean_):  Show location popup when hovering over the location (marker pin or GeoJSON shape).  The default behavior is to show the popup when clicking on the location.
- **prefer-geojson** (_boolean_):  Display a GeoJSON shape rather than a pin marker when available.
- **scroll-wheel-zoom** (_boolean_):  Enable map zoom behavior when scrolling over a map.  This is disabled be default.
- **zoom** (_number_):  Defines the initial zoom level of the rendered map.
- **zoom-on-click** (_boolean_):  Increase zoom level on a location after clicking on a location marker pin or shape. 

**Layers List**

The base map can be augmented with one or more optional map layers. Juncture supports 3 types of layers:

- **Location layer** - A location layer contains all of the individual locations defined for a map.  Locations are defined in a list following the _ve-map_ tag.  Locations may defined with explicit geographic coordinates, a Wikidata entity ID that corresponds to a location, or an IIIF image that contains geographic coordinates in the manifest metadata.  An IIIF manifest created by Juncture will include geographic coordinates if they are found in the [Exif](https://en.wikipedia.org/wiki/Exif) metadata embedded in the source image.  Locations are displayed as map pins.  If the location is specified using a Wikidata ID and the Wikidata entity associated with the location links to a GeoJSON resource the corresponding shape may be displayed instead of the pin by including the `prefer-geojson` attribute in the list item.  By default, all locations are aggregated into a single layer.  The `layer` attribute may be used to organize locations into separate layers.
- **GeoJSON layer** - [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) is an open standard format designed for representing simple geographical features, along with their non-spatial attributes. It is based on the JSON format.  A GeoJSON layer is added by including a URL to a GeoJSON file in the list following the _ve-map_ tag.
- **Georeferenced image** - A georeferenced image may also be used as a map layer.  [Georeferencing](https://en.wikipedia.org/wiki/Georeferencing) is a type of coordinate transformation that binds a digital image that represents a geographic space (often a scanned map or aerial photograph) to a spatial reference system, thus locating the digital data in the real world.  One common use of a georeferenced image layer is to create an historic map overlay. Juncture supports the use of georeferenced IIIF images created by [allmaps](https://allmaps.org/).  Adding an allmaps georeferenced image to a Juncture map is accomplished by including the text `allmaps=<ALLMAPS ID>` in a list item following the _ve-map_ tag.

**Layer attributes**

- **allmaps** (_string_):  Allmaps ID of a georeferenced image.
- **coords** (_string_):  Location coordinates.
- **description** (_string_):  Location description used in a popup.
- **disabled** (_boolean_):  Location is not displayed initially.  This attribute must be used in conjunction with the `layer` attribute.
- **geojson** (_string_):  URL to a GeoJSON file.
- **iiif** (_string_):  IIIF manifest URL containing geographic coordinates.
- **image** (_string_):  Location image used in a popup thumbnail.
- **label** (_string_):  Location label used in a popup.
- **layer** (_string_):  Layer name to associate with the location.  Multiple locations can use the same layer name.  When a layer name is specified the layer may be hidden when the map is initially rendered by including the `disabled` attribute on one of the layer locations.
- **marker-type** (_string_):  Type of marker to render.  Recognized values are 'circle'.
- **prefer-geojson]** (_boolean_):  When using a Wikidata ID to define a location a GeoJSON shape may be used rather than a pin marker when available.
- **qid** (_string_):  Wikidata entity ID of a location.
- **zoom** (_number_):  Location zoom level when `zoom-on-click` behavior is enabled.

**Geojson styling attributes**

- **color** (_string_): Line color
- **weight** (_number_): Line weight
- **opacity** (_number_): Line opacity level (0-1)
- **fillColor** (_string_):  Fill color
- **fillOpacity** (_number_): Opacity level (0-1) of the fill color.

#####

**Examples**

<ve-snippet collapsible label="Default map">
`map`
</ve-snippet>

<ve-snippet collapsible label="Map with location">
`map 38.914167,-77.063333,16`
</ve-snippet>

<ve-snippet collapsible label="Map with location, caption and marker">
`map 38.914167,-77.063333,16 "Dumbarton Oaks" marker`
</ve-snippet>

<ve-snippet collapsible label="Map with QID">
`map Q1264942,16`
</ve-snippet>

<ve-snippet collapsible label="Map with custom basemap">
`map 38.914167,-77.063333,16 "Dumbarton Oaks" marker basemaps=Esri_WorldImagery`
</ve-snippet>

<ve-snippet collapsible label="Map with marker using IIIF image">
```
map Q223969,5 basemap=Esri_WorldPhysical
	- wc:Double-O-Arch_Arches_National_Park_2.jpg
```
</ve-snippet>

<ve-snippet collapsible label="Map with image overlay">
```
map 51.39257,0.50752,14
- allmaps=911e307b5cecc423
```
</ve-snippet>

Click on the marker or click here to see the image.

For more examples visit the [map documentation page](https://docs.juncture-digital.org/components/map-viewer).

### Mermaid Diagram Viewer

The `mermaid` tag uses the [mermaid.js](https://mermaid.js.org/intro/) JavaScript library to create diagram visualizations. With this tag, you can create charts and diagrams with Markdown-inspired text definitions used by Mermaid. This page will show you the different diagram types supported by Mermaid that you can include in your visual essay.

####
`.mcol`

#####

**Tag attributes**

- **caption]** (_string_):  A caption to use in the viewer caption bar.

#####

**Examples**

<ve-snippet collapsible label="Mermaid mindmap">
```
mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
```
</ve-snippet>

For more examples visit the [mermaid documentation page](https://docs.juncture-digital.org/components/mermaid-diagram-viewer).

### Plant Specimen Viewer

The `plant-specimen` tag is used to display one or more plant specimens obtained from JSTOR Global Plants. The component is a wrapper for the .ve-media viewer which is used to display the high-resolution specimen images.

####
`.mcol`

#####

**Tag attributes**

- **qid** (_string_) :  The Wikidata QID for the associated plan taxon entity.  More information on QID use can be found in the [Wikidata](#wikidata) section.
**[taxon-name](#examples)** (_string_):  The text to use in the _alt_ tag used by screen readers.  If not provided an _alt_ tag is automatically generated from the manifest label property.
- **max** (_number_):  The maximum number of specimen images to show (default=1).  Many specimen images may be found for a taxon entity.  By default only one is shown.  The plant specimen component attempts to show the best available when multiple are found.  The default maximum of 1 can be overridden with this attribute.
- **caption** (_string_):  When a single image is defined using the `src` attribute a caption is automatically generated using the label property found in the associated IIIF manifest.  This caption is displayed in the caption bar at the bottom of the viewer by default (this can be inhibited by adding a `no-caption` attribute).  Specifying a caption in single-image mode will override this with the value provided in this attribute.  In all other viewer modes (multi-image, audio, and video) no caption is displayed in the caption bar.  Defining a caption with this attribute will cause the caption bar to be displayed with the provided text.

#####

**Examples**

<ve-snippet collapsible label="Click to view example">
`plant-specimen Q11575`
</ve-snippet>

For more examples visit the [plant-specimen documentation page](https://docs.juncture-digital.org/components/plant-specimen-viewer).

### Video Player

The `video` tag creates a viewer that is able to play video content, including streaming video from YouTube and Vimeo.

####
`.mcol`

#####

**Tag attributes**

- **src** (_url_) :  The YouTube ID or URL or a URL to the IIIF manifest for a video file to play.
- **start** (_number_):  Time position to begin playing resource.
- **end** (_number_): Time position to stop playing resource.
- **caption** (_string_): Defines the text to use for a caption that is displayed below the video player.
- **autoplay** (_boolean_):  Automatically play video resource when the media viewer is loaded.
- **vid** (_number_): The YouTube ID of the image to stream.
- **muted** (_boolean_):  Mute resource when initially played.
- **poster** (_string_): Image displayed in viewer before video plays.
- **sync** (_boolean_): Synchronize playback with timestamps in text headline.

#####

**Examples**

<ve-snippet collapsible label="Click to view example">
`video Zy3K2Lcw7hQ`
</ve-snippet>

For more examples visit the [video documentation page](https://docs.juncture-digital.org/components/video-player).

### VisJS Diagram Viewer

The `visjs` tag uses the [vis.js](https://visjs.org/) JavaScript library to create diagram visualizations. With this tag, you can create network, timeline, and other types of diagrams.

####
`.mcol`

#####

**Tag attributes**

#####

**Examples**

<ve-snippet collapsible label="Click to view example">
|id |     label     |
|---|---------------|
| 1 | Node 1        |
| 2 | Node 2        |
| 3 | Node 3        |
| 4 | Node 4        |
| 5 | Node 5        |
`#nodes`

|from|to |
|----|---|
| 1 | 3  |
| 1 | 2  |
| 2 | 4  |
| 2 | 5  |
| 3 | 3  |
`#edges`
</ve-snippet>

For more examples visit the [visjs documentation page](https://docs.juncture-digital.org/components/visjs-diagram-viewer).

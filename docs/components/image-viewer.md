# Image Viewer

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
</style>

The `ve-image` tag is the most commonly used essay tag.  The tag creates a viewer that is able to display high-resolution images.

## Static image mode

By default, the `ve-image` viewer will render an image with full interactivity (deep-zoom and panning) enabled.  An alternative to this is to use the `static` attribute to render the image with the interaction features disabled.  Static mode offers some performance advantages and additional image formatting options.  Clicking on an image in static mode will display a popup window with the same image displayed with deep-zoom and panning enabled.

The example below demonstrates the use of the ve-image viewer with the same image in static and dynamic (default) modes.  In both cases, the caption bar and information popover are rendered in the same way.  The core difference is in how the image is displayed in the viewer pane.  In the dynamic version hovering over the image will reveal the image controls in the top-left portion of the viewer pane.  These controls allow the image to be zoomed, panned, and rotated.  The mouse and/or keyboard can be used to pan the image.  In the viewer with the static image these controls are not available.  However, in static mode, clicking on the image will cause the image to be redisplayed in a modal window.  The image viewer in the modal window displays the image in dynamic mode with zooming, panning, and rotation enabled.

<ve-snippet collapsible label="Basic image">
`image wc:Sunflower_sky_backdrop.jpg "Default image viewer" .left`

</ve-snippet>

## Multiple images

To use more than one image with a `ve-image` the Markdown block code syntax is used.

<ve-snippet collapsible label="Multiple images">
```
image 
wc:Vincent_van_Gogh_-_Vincent's_Bedroom_in_Arles_-_Letter_Sketch_October_1888.jpg
wc:Sunflower_sky_backdrop.jpg
wc:Vincent_van_Gogh_-_Zonnebloemen_-_Google_Art_Project.jpg
wc:Vincent_van_Gogh_-_Sunflowers_(1888,_National_Gallery_London).jpg
wc:Vincent_Van_Gogh_-_Three_Sunflowers_F453.jpg
wc:Akseli_Gallen-Kallela_-_Sunflower_at_the_Nairobi_Savannah_(1909%E2%80%921910).jpg
wc:Moestuin_met_zonnebloem_-_s0004V1962v_-_Van_Gogh_Museum.jpg
wc:The_Artist's_Garden_at_Eragny.jpg
wc:Bessac_16_Le_Menot_2013.jpg
wc:Mother_and_Child_-_Cassatt_1905.jpg
wc:Sunflowersagnaneamt.jpg
```
</ve-snippet>

## Attributes

Many of the image-specific attributes used in the ve-image viewer are based on the [IIIF Image API](https://iiif.io/api/image/2.1/).  The attribute values are often directly passed to the IIIF server hosting the images.  For detailed explanations of the attributes and possible values, the [IIIF image request parameters](https://iiif.io/api/image/2.1/#image-request-parameters) documentation should be consulted.

**[src](#basic)** (_url_) :  The URL to the IIIF manifest for the item to display in the viewer.  This attribute is omitted when using the viewer in multi-image mode.  This attribute may also be omitted in single-image mode when QIDs are in scope.  When a src attribute is not specified the most relevant (closest) QID to the tag is used to generate an IIIF manifest URL.  More information on QID use can be found in the [Wikidata](#wikidata) section.

**[alt](#basic)** (_string_):  The text to use in the _alt_ tag used by screen readers.  If not provided an _alt_ tag is automatically generated from the manifest label property.

**[caption](#basic)** (_string_):  When a single image is defined using the `src` attribute a caption is automatically generated using the label property found in the associated IIIF manifest.  This caption is displayed in the caption bar at the bottom of the viewer by default (this can be inhibited by adding a `no-caption` attribute).  Specifying a caption in single-image mode will override this with the value provided in this attribute.  In all other viewer modes (multi-image, audio, and video) no caption is displayed in the caption bar.  Defining a caption with this attribute will cause the caption bar to be displayed with the provided text.

**[static](static-images)** (_boolean_):  A static image is returned instead of an interactive image with deep-zoom and panning.

**[seq](#basic)** (_number_):  A number defining the image to use in a multi-image manifest.  If not specified the default value is _1_.

**[fit](#basic)** (_string_):  The _fit_ attribute controls the display of an image in the viewer viewport.  In the default mode (_contain_) the entire image is shown with letter boxing applied to the top and bottom or left and right when the image aspect ratio differs from the viewer.  When the value _cover_ is used the entire viewport is filled and the displayed portion of the image is cropped as needed to fit.

**[no-caption](#basic)** (_boolean_):  This attribute inhibits the display of the caption at the bottom of the viewer.

**[no-info-icon](#basic)** (_boolean_):  This attribute inhibits the display of the icon used to trigger the display of the information popup.  By default, the icon is displayed in the top-right region of the viewer when hovering over the viewing area.

**[rotation](#basic)** (_number_):  The rotation attribute specifies mirroring and rotation. A leading exclamation mark (“!”) indicates that the image should be mirrored by reflection on the vertical axis before any rotation is applied. The numerical value represents the number of degrees of clockwise rotation, and may be any floating point number from 0 to 360.

**Dynamic image attributes**

**[zoom-on-scroll](#basic)** (_boolean_):  Specifies whether the viewer will zoom the image when a scroll gesture is performed in the image viewer.  This is inhibited by default.

**Static image attributes**

The following attributes are only applicable for single images in `static` mode.

**[region](#static-images)** (_string_):  The region attribute defines the rectangular portion of the full image to be returned. The region can be specified by pixel coordinates, percentage, or by the value “full”, which specifies that the entire image should be returned.

| Form | Description |
| -------- | ---------------------------------------- |
| full        | The complete image is returned, without any cropping. |
| square      | The region is defined as an area where the width and height are both equal to the length of the shorter dimension of the complete image. The region may be positioned anywhere in the longer dimension of the image content at the server’s discretion, and centered is often a reasonable default. |
| x,y,w,h     | The region of the full image to be returned is specified in terms of absolute pixel values. The value of x represents the number of pixels from the 0 position on the horizontal axis. The value of y represents the number of pixels from the 0 position on the vertical axis. Thus the x,y position 0,0 is the upper left-most pixel of the image. w represents the width of the region and h represents the height of the region in pixels. |
| pct:x,y,w,h | The region to be returned is specified as a sequence of percentages of the full image’s dimensions, as reported in the image information document. Thus, x represents the number of pixels from the 0 position on the horizontal axis, calculated as a percentage of the reported width. w represents the width of the region, also calculated as a percentage of the reported width. The same applies to y and h respectively. These may be floating point numbers. |

**[size](#static-images)** (_string_):  The size parameter determines the dimensions to which the extracted region is to be scaled.

| Form | Description |
| -------- | ---------------------------------------- |
| full  | The image or region is not scaled, and is returned at its full size. |
| max   | The image or region is returned at the maximum size available, as indicated by maxWidth, maxHeight, maxArea in the profile description. This is the same as full if none of these properties are provided. |
| w,    | The image or region should be scaled so that its width is exactly equal to w, and the height will be a calculated value that maintains the aspect ratio of the extracted region. |
| ,h    | The image or region should be scaled so that its height is exactly equal to h, and the width will be a calculated value that maintains the aspect ratio of the extracted region. |
| pct:n |   The width and height of the returned image is scaled to n% of the width and height of the extracted region. The aspect ratio of the returned image is the same as that of the extracted region. |
| w,h   |The width and height of the returned image are exactly w and h. The aspect ratio of the returned image may be different than the extracted region, resulting in a distorted image. |
| !w,h  | The image content is scaled for the best fit such that the resulting width and height are less than or equal to the requested width and height. The exact scaling may be determined by the service provider, based on characteristics including image quality and system performance. The dimensions of the returned image content are calculated to maintain the aspect ratio of the extracted region. |

**[quality](#static-images)** (_string_):  The quality attribute determines whether the image is delivered in color, grayscale or black and white.  Recognized values for this attribute are `color`, `gray`, `bitonal`, `default`.  The default value used by the Juncture IIIF image server is `color`.

| Value | Description |
| -------- | ---------------------------------------- |
| color   | The image is returned in full color. |
| gray    | The image is returned in grayscale, where each pixel is black, white or any shade of gray in between. |
| bitonal | The image returned is bitonal, where each pixel is either black or white. |
| default | The image is returned using the server’s default quality (e.g. color, gray or bitonal) for the image. |

**[options](#static-images)** (_string_):  The _options_ attribute combines the `region`, `size`, `rotation`, `quality`, and `format` attributes into a single value.  

## Images list

When multiple images are to be displayed an image definition for each image follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided in the `src` attribute.  Other optional attributes may be specified as needed.

### Image List Attributes

**[caption](#basic)** (_string_) :  Image-specific caption.  Overrides the default caption generated from the `label` property in the IIIF manifest for the image.

**[fit](#basic)** (_string_) :  The `fit` attribute is used to define how an image should be resized to fit its container.  This image-specific attribute overrides the `fit` attribute defined in the carousel headline.

- **contain** (_default_) - The image keeps its aspect ratio, but is resized to fit within the available space.
- **cover** - The image keeps its aspect ratio and fills the the available space. The image will be clipped to fit.

**[seq](#basic)** (_number_):  A number defining the image to use in a multi-image manifest.  If not specified the default value is _1_.

**[src](#basic)** (_string_) :  URL for image IIIF manifest.


## Examples

### Basic

<ve-snippet collapsible label="Image with defaults">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg`
</ve-snippet>

<ve-snippet collapsible label="Full-width image with rotation">
`image wc:Sunflower.jpg .right rotate=90 caption="Sunflower, rotated"`
</ve-snippet>

The example below includes 2 .ve-image viewers displaying the same image from Wikimedia Commons.  The first viewer uses the full manifest URL.  The second uses the short-form support by the Juncture IIIF server. 

<ve-snippet collapsible label="Images short-form IIIF URL">
`image wc:Sunflower.jpg .right`
</ve-snippet>

The example below includes 2 renderings of the same image, a normal (uncropped) rendering, and a cropped version using the `region` attribute.  The cropped version also shows the use of a custom caption.



### Static images

<ve-snippet collapsible label="Static image">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg static`
</ve-snippet>

<ve-snippet collapsible label="Static image in grayscale">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg static quality=gray`
</ve-snippet>

<ve-snippet collapsible label="Static image cropped using region attribute">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg static region=3801,5853,7002,5553`
</ve-snippet>

<ve-snippet collapsible label="Static image mirrored">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg static rotation=!0`
</ve-snippet>

In the example below the options attribute is used to format a static image.  In this example, the image is cropped, rotated, and displayed in grayscale.

<ve-snippet collapsible label="Static image using options attribute">
`image wc:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg static options=3801,5853,7002,5553/max/90/gray`
</ve-snippet>

### Viewer positioning

Viewer positioning examples can be found [here](/styling/viewer-positioning)


# Image Compare

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

The `ve-image-compare` creates a viewer that is able to display 2 high-resolution in a stacked compare viewer.

## Attributes

**[caption](#basic)** (_string_) :  A caption for the compare viewer.

## Images list

An image definition for the 2 images to be compared follows the tag headline.  At a minimum, a URL to the image IIIF manifest must be provided in the `src` attribute.  The region attribute may optionally be specified on one or bot images as needed for alignment.

### Image Attributes

**[src](#basic)** (_string_) :  URL for image IIIF manifest.

**[region](#static-images)** (_string_):  The region attribute defines the rectangular portion of the full image to be returned. The region can be specified by pixel coordinates, percentage, or by the value “full”, which specifies that the entire image should be returned.

| Form | Description |
| -------- | ---------------------------------------- |
| full        | The complete image is returned, without any cropping. |
| square      | The region is defined as an area where the width and height are both equal to the length of the shorter dimension of the complete image. The region may be positioned anywhere in the longer dimension of the image content at the server’s discretion, and centered is often a reasonable default. |
| x,y,w,h     | The region of the full image to be returned is specified in terms of absolute pixel values. The value of x represents the number of pixels from the 0 position on the horizontal axis. The value of y represents the number of pixels from the 0 position on the vertical axis. Thus the x,y position 0,0 is the upper left-most pixel of the image. w represents the width of the region and h represents the height of the region in pixels. |
| pct:x,y,w,h | The region to be returned is specified as a sequence of percentages of the full image’s dimensions, as reported in the image information document. Thus, x represents the number of pixels from the 0 position on the horizontal axis, calculated as a percentage of the reported width. w represents the width of the region, also calculated as a percentage of the reported width. The same applies to y and h respectively. These may be floating point numbers. |

## Examples

<ve-snippet collapsible label="Bedroom in Arles">
```
compare caption="Comparison of Van Gogh Sketch and Painting"
wc:Vincent_van_Gogh_-_Vincent's_Bedroom_in_Arles_-_Letter_Sketch_October_1888.jpg
wc:Vincent_van_Gogh’s_famous_painting,_digitally_enhanced_by_rawpixel-com_49.jpg
```
</ve-snippet>

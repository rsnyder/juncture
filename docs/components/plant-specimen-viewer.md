# Plant Specimen Viewer

<style> 
    .markdown-section h3 ~ p > strong > a { color: crimson; font-size: 110%; text-decoration: none; }
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

The `ve-plant-specimen` tag is used to display one or more plant specimens obtained from [JSTOR Global Plants](https://plants.jstor.org/).  The component is a wrapper for the `.ve-media` viewer which is used to display the high-resolution specimen images.

## Attributes

### Resource attributes

**[qid](#examples)** (_string_) :  The Wikidata QID for the associated plan taxon entity.  More information on QID use can be found in the [Wikidata](#wikidata) section.

**[taxon-name](#examples)** (_string_):  The text to use in the _alt_ tag used by screen readers.  If not provided an _alt_ tag is automatically generated from the manifest label property.

**[max](#examples)** (_number_):  The maximum number of specimen images to show (default=1).  Many specimen images may be found for a taxon entity.  By default only one is shown.  The plant specimen component attempts to show the best available when multiple are found.  The default maximum of 1 can be overridden with this attribute.

**[caption](#examples)** (_string_):  When a single image is defined using the `src` attribute a caption is automatically generated using the label property found in the associated IIIF manifest.  This caption is displayed in the caption bar at the bottom of the viewer by default (this can be inhibited by adding a `no-caption` attribute).  Specifying a caption in single-image mode will override this with the value provided in this attribute.  In all other viewer modes (multi-image, audio, and video) no caption is displayed in the caption bar.  Defining a caption with this attribute will cause the caption bar to be displayed with the provided text.

## Examples

<ve-snippet collapsible label="Plant specimen for QID Q11575">
    `plant-specimen Q11575`
</ve-snippet>

<ve-snippet collapsible label="Plant specimen with right positioning">
    `plant-specimen Q11575 .right`
</ve-snippet>

<ve-snippet collapsible label="Showing multiple specimen images">
    `plant-specimen Q11575 max=3`
</ve-snippet>

<ve-snippet collapsible label="Plant specimen for Taxon Name 'Zea mays'">
    `plant-specimen taxon-name="Zea mays"`
</ve-snippet>
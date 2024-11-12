# Animated Image

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

The `ve-animated-image` tag creates a viewer that is able to play animated GIFs.

## Attributes

### Resource attributes

**[autoplay](examples)** (_boolean_):  Automatically play animation when image is displayed.

**[caption](#examples)** (_string_): Defines the text to use for a caption that is displayed below the image.

**[src](#examples)** (_url_) :  The URL to the animated GIF image.  Wikimedia Commons short form URLs are supported.

## Examples

<ve-snippet collapsible label="Wikimedia Commons hosted image">
`animated-image https://upload.wikimedia.org/wikipedia/commons/e/e3/Animhorse.gif`
</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted image (short form URL)">
`animated-image wc:Animhorse.gif autoplay`
</ve-snippet>

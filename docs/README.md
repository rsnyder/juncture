[![](https://v3.juncture-digital.org/badge.png)](https://v3.juncture-digital.org)

```
header Juncture subtitle=Documentation auth=github background=wc:Box_of_type.jpg height=100 no-manifest-popover
- [Workbench](/wb)
```

# Juncture Overview

Juncture is a tool for creating and displaying interactive web pages.  Juncture web pages are created using an extended version of the [Markdown](Q1193600) language.  Markdown is a lightweight markup language that is widely used to add formatting elements to plain text.  Juncture extends Markdown with the addition of a few custom tags enabling interactive viewers to be easily added to a generated web page.  Juncture uses [GitHub](Q364) for storing the Markdown files.

**GitHub** is a free Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to how one might use Dropbox or Google Drive. The Markdown files that Juncture uses to render interactive web pages are stored in GitHub.  A free GitHub account can be created at  [https://github.com/signup](https://github.com/signup).

**Quick links:**

- [Creating and Modifying Juncture Essays](#editing)
- [Markdown Tags](#markdown)
- [Juncture Tags](#juncture)
  - [Tagging syntax](#juncture-syntax)
  - [Viewer Tags](#juncture-viewers)
    - [Audio Player](#audio-player) - Plays .mp3 audio files
    - Diagram Viewers - Viewers for creating network and other types of diagrams
      - [Mermaid](#mermaid-viewer)
      - [VisJS](#visjs-viewer)
    - [IFrame Viewer](#iframe-viewer) - Displays arbitrary web pages in an embedded HTML IFrame component
    - [Image Viewer](#image-viewer) - Displays one or more images
    - [Image Compare Viewer](#image-compare) - Compares 2 images in a stacked viewer
    - [Image Gallery](#image-gallery) - Displays multiple image thumbnails
    - [Map Viewer](#map-viewer) - Displays interactive maps with optional overlays
    - [Plant Specimen Viewer](#plant-viewer) - Displays high-resolution plant specimen images
    - [Video Player](#video-player) - Plays .mp4 video files and streams YouTube videos
  - [Interaction triggers](#juncture-interactions)
    - [Entity Infobox](#entity-infobox) - Creates an infobox popup using Wikidata entity identifiers
    - [zoomto](#zoomto) - Uses a text link to trigger a `zoomto` action on an image viewer
    - [flyto](#flyto) - Uses a text link to trigger a `flyto` action on a map viewer
    - [play](#play) - Uses a text link to trigger to start an audio or video playback at a specified time

## Creating and Modifying Juncture Essays `#editing`

Juncture essays are defined using plain Markdown files stored in GitHub.  The essay Markdown files may be created and modified using the built-in GitHub web editor or the editor provided in the [Juncture Workbench](https://v3.juncture-digital.org/wb).

## Markdown Tags `#markdown`

Markdown is a lightweight markup language for creating formatted text using a plain-text editor. Below are some basic elements to get you started.

### Headings

Use `#` for headings. The number of `#` symbols indicates the level of the heading.

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Emphasis

To emphasize text, use `*` or `_` for italic and `**` or `__` for bold.

```markdown
*italic* or _italic_
**bold** or __bold__
```

### Lists

#### Unordered Lists

Use -, +, or * for unordered lists.

```markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
```

#### Ordered Lists

Use numbers followed by a period for ordered lists.

```markdown
1. First item
2. Second item
   1. Subitem 2.1
   2. Subitem 2.2
```

### Links

Create links using `[link text](URL)`.

```markdown
[OpenAI](https://www.openai.com)
```

### Images

Include images using `![alt text](image URL)`.

```markdown
![Markdown logo](https://markdown-here.com/img/icon256.png)
```

### Code

#### Inline Code

Use backticks for inline code.

```markdown
`inline code`
```

#### Code Blocks

Use triple backticks for code blocks.

### Blockquotes

Use `>` for blockquotes.

```markdown
> This is a blockquote.
```

### Horizontal Rules

Create horizontal rules using `---`, `***`, or `___`.

```markdown
___
```

### Tables

Create tables using pipes `|` and hyphens `-`.


```markdown
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Data 1   |
| Row 2    | Data 2   |
```

## Juncture Tags `#juncture`

Juncture viewers are defined by adding Juncture-specific tags to standard Markdown text.

The original syntax used for adding a Juncture tag to Markdown was based on the HTML `param` tag.  The param tag included parameters that defined the type of Juncture viewer to use (e.g., `ve-image` for the image viewer) and one or more viewer-specific parameters.

The latest version of Juncture supports a simplified tagging syntax using the Markdown `inline code` tag.

Note that the original and simplified notations can not be used in the same Juncture essay.

### Juncture Tagging Syntax `#juncture-syntax`

#### Original

The original syntax used for adding a Juncture tag to Markdown was based on the HTML `param` tag.  The param tag included parameters that defined the type of Juncture viewer to use (e.g., `ve-image` for the image viewer) and one or more viewer-specific parameters.  Viewer parameters are defined using name-value notation (`param-name="param-value"`).  In name-value notation the parameter name and value are separated by an equals sign and the parameter value is enclosed in quotes.  For example, below is a Juncture tag for an image viewer.  In this example the viewer is provided with the URL to the image and a title to be displayed as a viewer caption. 

```markdown
<param ve-image url="https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg" title="A Sunflower">
```

Note that when using the original tagging syntax Juncture will format the essay using a 2-column layout where the text is shown in the left column and the viewer is displayed in the right column.  This side-by-side format is forced when using the original syntax.  More flexible formatting is supported when using the newer simplified tagging syntax described in the next section.

#### Simplified

The latest version of Juncture supports a simplified tagging syntax using the Markdown `inline code` tag.  A standard Markdown inline code tag is evaluated as a Juncture tag if it occurs at the start of a line.  The simplified tagging syntax does not use the `<param ...>` wrapper and does not require attribute values to be quoted unless they includes a space character.  For example,

```markdown
`ve-image url=https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg title="A Sunflower"`
```

In the simplified syntax, the `ve-` prefix can omitted from the tag name and parameter names can often be omitted for commonly used parameters.  Below is an example using the positional parameter notation for the image viewer.

```markdown
`image https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg title="A Sunflower"`
```

### Juncture Tags  `#juncture-viewers`

#### Audio Player `#audio-player`

##### Parameters

- [param1]: 
- [param2]: 

#### Image Compare Viewer `#image-compare`

##### Parameters

- [param1]: 
- [param2]: 

#### Image Viewer `#image-viewer`

The Juncture image viewer displays one or more images in an interactive IIIF viewer.  The viewer supports zooming and panning of high resolution images.  The viewer also provides captioning and attribution.

```markdown
<param ve-image url="https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg" title="A Sunflower">
```

or

```markdown
`image https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg title="A Sunflower"`
```

##### Parameters

- `src` (or `url`): The image URL
- `caption` (or `title`): The text to use for the image caption
- `fit`: Defines whether the image should fill the viewer or be scaled to show the entire image in the original image aspect ratio.  The value of `cover` is used to fill the viewer with the image. The value `contain` is used to show the entire image.

#### Image Gallery `#image-gallery`

##### Parameters

- [param1]: 
- [param2]: 

##### Examples

original:

```markdown
<param ve-image url="https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg" title="A Sunflower">
```

simplified:

```markdown
`image https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg title="A Sunflower"`
```

#### Map Viewer `#map-viewer`

##### Parameters

- [param1]: 
- [param2]: 

#### Mermaid Diagram Viewer `#mermaid`

##### Parameters

- [param1]: 
- [param2]: 

#### Video Player `#video-player`

##### Parameters

- [param1]: 
- [param2]: 

#### VisJS Diagram Viewer `#visjs`

##### Parameters

- [param1]: 
- [param2]: 

### Juncture Interaction  `#juncture-interactions`

#### Entity Infobox `#entity-infobox`

#### zoomto `#zoomto`

#### flyto `#flyto`

#### play `#play`






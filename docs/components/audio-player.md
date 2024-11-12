# Audio Player

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

The `ve-audio` tag creates a viewer that is able to play audio content.

## Attributes

### Resource attributes

**[autoplay](examples)** (_boolean_):  Automatically play audio resource when the media viewer is loaded.

**[caption](#examples)** (_string_): Defines the text to use for a caption that is optionally displayed below the audio player.

**[end](#examples)** (_number_): Time position to stop playing resource.

**[muted](#examples)** (_boolean_):  Mute resource when initially played.

**[src](#examples)** (_url_) :  The URL to the IIIF manifest for a audio file to play.

**[start](#examples)** (_number_):  Time position to begin playing resource.

**[sync](#examples)** (_boolean_): Synchronize playback with timestamps in text headline.


## Examples

<ve-snippet collapsible label="Audio file hosted on Wikimedia Commons">
`audio wc:Interview_with_Warren_Hanson_regarding_Hundred_Flowers.ogg caption="Interview with Warren Hanson regarding Hundred Flowers"`
</ve-snippet>

<ve-snippet collapsible label="Audio file hosted on Wikimedia Commons, with autoplay">
`audio wc:Interview_with_Warren_Hanson_regarding_Hundred_Flowers.ogg caption="Interview with Warren Hanson regarding Hundred Flowers" autoplay`
</ve-snippet>

<ve-snippet collapsible label="Audio file hosted on Wikimedia Commons, with start and end">
`audio wc:Interview_with_Warren_Hanson_regarding_Hundred_Flowers.ogg caption="Interview with Warren Hanson regarding Hundred Flowers"  start=1:00 end=1:20`
</ve-snippet>

<ve-snippet collapsible label="Audio file hosted on Wikimedia Commons, with text trigger">
    `audio wc:Interview_with_Warren_Hanson_regarding_Hundred_Flowers.ogg caption="Interview with Warren Hanson regarding Hundred Flowers" .right`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. [Excepteur](play/1:00) sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</ve-snippet>

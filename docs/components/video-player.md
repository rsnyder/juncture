# Video Player

<style> 
    .markdown-section h3 ~ p > strong > a { color: crimson; font-size: 110%; text-decoration: none; }
    .markdown-section table { 
        margin-left:3rem; 
        width: calc(100% - 6rem); 
        border:1px solid #555;
    }
    .markdown-section td, .markdown-section th {
        border:1px solid #555;  fvi
        padding: 8px;
        line-height: 1.2;
    }
    .markdown-section th {
        background-color:#E2F0F7;
        font-weight:bold !important;
        text-align:center !important;
    }
</style>

The `ve-video` tag creates a viewer that is able to play video content, including streaming video from YouTube.

## Attributes

### Resource attributes

**[alt](#examples)** (_string_):  The text to use in the _alt_ tag used by screen readers.  If not provided an _alt_ tag is automatically generated from the IIIF manifest label property or inferred from the filename.

**[autoplay](examples)** (_boolean_):  Automatically play video resource when the media viewer is loaded.

**[caption](#examples)** (_string_): Defines the text to use for a caption that is displayed below the video player.

**[end](#examples)** (_number_): Time position to stop playing resource.

**[vid](#examples)** (_number_): The YouTube ID of the image to stream.

**[muted](#examples)** (_boolean_):  Mute resource when initially played.

**[poster](#examples)** (_string_): Image displayed in viewer before video plays.

**[src](#examples)** (_url_) :  The YouTube URL or a URL to the IIIF manifest for a video file to play.

**[start](#examples)** (_number_):  Time position to begin playing resource.

**[sync](#examples)** (_boolean_): Synchronize playback with timestamps in text headline.

## Examples

<ve-snippet collapsible label="YouTube streaming video">
`video Zy3K2Lcw7hQ`
</ve-snippet>

<ve-snippet collapsible label="YouTube video and start time">
`video Zy3K2Lcw7hQ start=60`
</ve-snippet>

<ve-snippet collapsible label="YouTube video with autoplay">
`video Zy3K2Lcw7hQ autoplay`
</ve-snippet>

<ve-snippet collapsible label="YouTube video with autoplay and start/end times">
`video Zy3K2Lcw7hQ autoplay start=60 end=70`
</ve-snippet>

<ve-snippet collapsible label="YouTube video, with text trigger">
    `video Zy3K2Lcw7hQ .right`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. [Excepteur](play/1:00) sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted video">
`video wc:Van_Gogh_Alive.webm`
</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted video and start time">
`video wc:Van_Gogh_Alive.webm start=30`
</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted video with autoplay">
`video wc:Van_Gogh_Alive.webm autoplay`
</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted video with autoplay and start/end times">
`video wc:Van_Gogh_Alive.webm autoplay start=30 end=40`
</ve-snippet>

<ve-snippet collapsible label="Wikimedia Commons hosted video, with text trigger">
    `video wc:Van_Gogh_Alive.webm .right`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. [Excepteur](play/30) sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>
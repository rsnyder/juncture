# Adding a KnightLab Timeline

The [Knight Lab Timeline](https://timeline.knightlab.com/) is an open-source tool for creating interactive, visually appealing timelines. It allows users to combine text, images, videos, and other media to present chronological narratives. The tool is user-friendly, requiring only a Google Sheets template to input data, and supports customizations for design and functionality. It's widely used in journalism, education, and storytelling to make historical or event-based content more engaging.

Previous versions of Juncture included a `knightlab-timeline` viewer component.  That component has been deprecated.  The [iframe viewer](/docs/components/iframe-viewer) is now used for embedding a Knight Lab Timeline in a Juncture essay.

## Make a Timeline

Follow the 4 step [Make a Timeline](https://timeline.knightlab.com/#make) guide on the KnightLab site.

1. Create a Google Spreadsheet using the supplied template.  Detailed instructions for this are provided [here](https://timeline.knightlab.com/docs/using-spreadsheets.html)
2. Publish the spreadsheet to the web
3. Create the Timeline using the data from the published Google Spreadsheet.  This is accomplished by copy/pasting the Google Spreadsheet URL into the form found in the [Make a Timeline](https://timeline.knightlab.com/#make) guide.
4. In step 4 of the guide a timeline URL and embed code are generated.  Copy the URL for the timeline.  This URL will be used as the `src` value for the Juncture `iframe` tag.  Using the "Women in Computing" example timeline, the URL would be
```
https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1xuY4upIooEeszZ_lCmeNx24eSFWe0rHe9ZdqH2xqVNk&font=Default&lang=en&initial_zoom=2&height=100%
```

## Add it to a Juncture essay using the ve-iframe tag

For example,

<ve-snippet collapsible label="KnightLab Timeline example">
    `iframe https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1xuY4upIooEeszZ_lCmeNx24eSFWe0rHe9ZdqH2xqVNk&font=Default&lang=en&initial_zoom=2&height=100%`
</ve-snippet>

?> When using the `src` value only, Juncture will calculate a height for the iframe viewer.  A specific height may be defined using the `:height` style attribute.

<ve-snippet collapsible label="KnightLab Timeline example">
    `iframe https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1xuY4upIooEeszZ_lCmeNx24eSFWe0rHe9ZdqH2xqVNk&font=Default&lang=en&initial_zoom=2&height=100% :height=500px`
</ve-snippet>
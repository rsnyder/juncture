
# Getting Started

## How to use the Juncture documentation

The Juncture documentation index is located in the left sidebar.  The sidebar is closed by default but can easily be opened/closed by clicking on the menu icon located in the top-left corner of the page.

Information boxes are used to draw attention to bits that are particularly useful or important.

?> This is an informational message 

!> This is a message highlighting something important

The documentation also includes a lot of examples demonstrating the use of Markdown and Juncture tags.  Each example includes Markdown snippets showing how a tag would be used in an essay.  An HTML snippet is also provided for each example.  The HTML snippet is valid to use in a Markdown file but is included as a convenience for applications in which a Juncture component is used in an HTML page not rendered by a Juncture-enabled server. In addition to the Markdown and HTML snippets, the examples also include a rendered version of the snippet.

Below is an example that provides Markdown and HTML code snippets and a demo of the rendered code.  The snippets are designed to be easily copy-pasted or drag-and-dropped into the Juncture editor.

<ve-snippet>
    .ve-image wc:AmalfiCoast11.jpg width=50%
</ve-snippet>

This is an example that is collapsed by default and must be opened by clicking.  This approach is often used for longer examples.

<ve-snippet collapsible label="A collapsed example snippet - click on me to open">
    # The Amalfi Coast

    .ve-media wc:AmalfiCoast11.jpg right
    
    The Amalfi Coast is a stretch of coastline in southern Italy overlooking the Tyrrhenian Sea and the Gulf of Salerno. It is located south of the Sorrentine Peninsula and north of the Cilentan Coast.

    Celebrated worldwide for its Mediterranean landscape and natural diversity, the Coast is named after the town of Amalfi, which makes up its main historical and political center. It is a very popular jet set destination, and has been an attraction to upper-class Europeans since the 18th century, when it was a frequent stopover on their Grand Tours. Attracting international tourists of all classes annually, the Amalfi Coast was listed as a UNESCO World Heritage Site in 1997.
</ve-snippet>

## Juncture essay rendering

The primary function performed by Juncture is to turn a plain text file stored in Github into an interactive web page that contains narrative text, deep-zoom images, maps, video, audio, and more.

As an example, consider a Juncture user with the Github username of **SomeUser**.  SomeUser has completed the Juncture [quick-start](/docs/quick-start) and now has a Markdown file named `example.md` at the root of their essays repository.
- The Github URL for SomeUser's essay file is https://github.com/SomeUser/essays/blob/main/example.md
- The URL for rendered Juncture essay would be https://SomeUser.github.io/essays/example

In addition to the `SomUser.github.io` domain that is created when a GitHiub repository is configured for Juncture, all Juncture essays are also viewable with a URL of the form `https://juncture-digital.org/<USERNAME>/<REPOSITORY>/<PATH>`, where:
- `<USERNAME>` and `<REPOSITORY>` is the Github username and repository hosting the Markdown file used for the essay.
- `<PATH>` is the path to a Github hosted Markdown file that contains the essay text.  If the filename is `README.md` or `index.md` it may be omitted from the path.  Similarly, the `.md` file extension may also be omitted.

In addition to the `juncture-digital.org` URL that is available for any Juncture essay, an essay may also be associated with a custom domain.  For example, SomeUser has obtained the domain `MySite.net` for a personal site and connected it to his Github essays repository.  With this custom domain, the domain https://MySite.net can also be used for their essays, for instance, https://MySite.net/example.  When using a custom domain the URL path will not include the Github username or repository name.

?> Note that SomeUser could have also created their essay in a text file named `README.md` (or `index.md`) in a folder named `example`.  Either of these approaches would result in a Juncture essay accessed by the URL https://juncture-digital.org/SomeUser/essays/example (or https://MySite.net/example in the case of the custom domain).  The advantage of using the folder-based approach is that this provides a convenient place for storing other files that may eventually be associated with an essay (for instance, image annotations or map overlays).  The folder approach is generally recommended for all but the simplest essays.

?> Juncture essay text files must include a `.md` file extension.  While the file is a plain text the .md extension signals that it contains  [Markdown](https://www.markdownguide.org/) text formatting tags.  When using the folder-based approach for creating a Juncture essay text file, the file must be named `README.md` or `index.md`, following the Github convention for naming a primary file in a folder.

## More about Github...

Github is a **free** Internet hosting service commonly used for software development projects.  It provides sophisticated features for version control and workflow management for distributed teams.  Juncture primarily uses Github as a file hosting service, similar to how one might use Dropbox or Google Drive.  When using the Juncture Editor and Media Tool for essay authoring and management the Github interactions (file creation, saving, deletion, etc) are handled by the tools.  

A visual essay text file stored in Github will be associated with a Github account (Github username), repository, and file path.  Github-hosted content is organized into one or more repositories.  Users unfamiliar with Github can think of a repository as a workspace, or simply as a collection of folders containing one or more files.  This is similar to how content is stored on most computers.  Github supports the creation and use of multiple repositories for organizing content.

Essays are defined in plain text Markdown files that are stored in a Github repository.  These files include narrative text and tags for text formatting and viewer rendering.  How these text files are created is not important to the display of the generated web page by Juncture.  All that matters is that the formatting and viewer tags are correctly formed.

- A Github repository will be associated with a URL of the form `https://github.com/<USERNAME>/<REPOSITORY>`, where `<USERNAME>` is the Github username associated with your Github account and `REPOSITORY` is the name of a repository in the account.  By convention the repository name is often `essays`, but any repository name can be used.  

To begin using Juncture you will need a GitHub account and some basic familiarity with Markdown.

**GitHub** is a free Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to how one might use Dropbox or Google Drive. The Markdown files that Juncture uses to render interactive web pages are stored in GitHub.  Go to https://github.com/signup to sign up for a free GithHub account.

**Markdown** is a simple language and a basic understanding of usage can be obtained in just a few minutes.  The [Markdown Guide - Getting Started tutorial](https://www.markdownguide.org/getting-started) is a good resource for getting started with Markdown.

# GitHub Setup

Create and configure a Juncture-enabled Github repository

1. Create a Juncture-enabled Github repository using this link - [https://github.com/juncture-digital/template/generate](https://github.com/juncture-digital/template/generate)

  - Enter a Repository name (e.g,, "essays") and optional Description.
  - Press **Create Repository**

2. In the newly created repository, enable Github Pages by selecting **Pages** from the **Code and automation** section in the repository **Settings** page.  In the **Pages** form select **main** from the **Branch** pull-down menu and press **Save**.

# Creating an essay

This section describes the steps typically performed in the creation of a Juncture essay.  The steps described represent a logical progression from plain, unformatted text, to a completed visual essay with text formatting, interactive viewers, text-to-viewer interactions, headers and footers, and more.  This is a conceptual workflow.  All of these activities are optional and can be performed in any sequence.  In practice, the creation of an essay is often an iterative process where aspects of some steps are performed multiple times. 

## Essay creation options

Options for creating an essay text file include:

- **Using the Github web editor.**  This is the simplest approach and was the primary means for creating and editing Juncture essays in the first version.  The drawbacks to this approach are that the editor is exited each time a save is made and previewing changes requires a separate request to the Juncture-enabled web server.  While workable it can be a cumbersome and inefficient workflow.  Improving this workflow was a key objective in the Juncture rewrite for version 2.  
- **Using the Juncture Editor.**  A web-based editor was introduced in Juncture version 2,  It provides an in-browser editor with preview features.  It also provides syntax highlighting of Markdown and Juncture tags.  The Juncture editor also supports the automatic creation of Juncture tags using copy-paste and drag-n-drop.  For instance, Juncture `image`, `audio`, and `video` tags are automatically created when dragging an image, video, or audio clip into the editor window from some commonly used websites.

!> **Avoid using both editors simultaneously as divergent edits may result in Github merge conflicts when saving.**

## 1. Add Text

Essay text is often entered as plain, unformatted text using a text editor.  During this phase of essay development, the text is often just organized into paragraphs.  There is nothing special about paragraph formatting in Juncture.  A paragraph is simply a grouping of one or more sentences separated by one or more blank lines.  The Juncture editor will automatically wrap paragraph text so putting each sentence on a new line is not necessary, or even recommended.  In this digital format, it is also a good idea to keep paragraphs relatively small.

?> <ve-popup>
    <sl-button slot="trigger">Show example as plain text</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/1-text-only.md"></ve-snippet>
</ve-popup>

## 2. Format Text with Markdown

Adding Markdown formatting can be done during the initial text entry or added later.  Most often it will be a combination of both.  The Juncture Editor includes a Markdown formatting toolbar in the top-left portion of the editor window.  This can be convenient for most formatting.  The Markdown tags are also quite simple and easy to remember.  Entering the tags manually is often equally fast and convenient.  Below are some links to resources describing the Markdown syntax.

- [Markdown Guide](https://www.markdownguide.org/)
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [Short (12min) Markdown tutorial on YouTube](https://www.youtube.com/watch?v=6A5EpqqDOdk)

The most commonly used Markdown tags are

- **paragraph** - A paragraph is defined by using a blank line to separate one or more lines of text.  Multiple sentences can appear in a single line of Juncture text.  The Juncture Editor will wrap long lines of text.
- **heading** - To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three, use three number signs.  Note that the number signs for a heading must start at the beginning of a line.
- **bold** - To bold text, add two asterisks or underscores before and after a word or phrase. To bold the middle of a word for emphasis, add two asterisks without spaces around the letters.
- **italic** -To italicize text, add one asterisk or underscore before and after a word or phrase. To italicize the middle of a word for emphasis, add one asterisk without spaces around the letters.
- **link** - To create a link, enclose the link text in brackets (e.g., [Juncture]) and then follow it immediately with the URL in parentheses (e.g., (https://juncture-digital.org)).
- **blockquote** - To create a blockquote, add a > in front of a paragraph.
- **list** - Lists can be ordered or unordered.  To create an ordered list, add line items with numbers followed by periods. The numbers don’t have to be in numerical order, but the list should start with the number one.  To create an unordered list, add dashes (-), asterisks (*), or plus signs (+) in front of line items. Indent one or more items to create a nested list.

> [Example essay with Markdown tagging](/docs/getting-started/2-markdown)

<ve-snippet collapsible label="Basic Markdown formatting">
    # Markdown example

    ## Markdown paragraphs

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit laoreet id donec ultrices tincidunt arcu non. Lectus urna duis convallis convallis tellus id interdum. Mi bibendum neque egestas congue quisque egestas diam in. 
    
    Proin nibh nisl condimentum id. Donec massa sapien faucibus et molestie ac feugiat. Sit amet est placerat in egestas erat imperdiet sed euismod. Nunc aliquet bibendum enim facilisis. Metus aliquam eleifend mi in nulla posuere. Odio eu feugiat pretium nibh ipsum consequat nisl vel.

    ## Markdown lists

    **An unordered list:**
    - First list item
    - Second list item
    - Third list item

    **An ordered list:**
    1. First list item
    1. Second list item
    1. Third list item

    ## A blockquote

    > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit laoreet id donec ultrices tincidunt arcu non. Lectus urna duis convallis convallis tellus id interdum. Mi bibendum neque egestas congue quisque egestas diam in. 

    ## Word and phrase formatting

    - This is **a bolded text**
    - This is _italicized text_
    - This is ***a bolded and italicized text***
    - This is a [link](https://some-url.net)

</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with Markdown formatting</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/2-markdown.md"></ve-snippet>
</ve-popup>

## 3. Add Footnotes

In cases where content is reused from another source, it is a best practice to cite the source with a footnote.  The core Markdown language does not include a footnote tag but most of the Markdown implementations provide an extension for this, including the Markdown parser used by Juncture.

Adding a footnote reference to essay text is accomplished by appending a simple tag to the citing text.  A footnote tag must start with a caret symbol `^` and may contain any inline text (including spaces) between a set of square brackets `[]`. Only the first caret has any special meaning.

Footnote content must start with the label followed by a colon and at least one space. The label used to define the content must exactly match the label used in the text (including capitalization and white space).

<ve-snippet collapsible label="Basic footnotes example">
    **Monument Valley**, meaning "valley of the rocks", is a region of the Colorado Plateau characterized by a cluster of sandstone buttes, with the largest reaching 1,000 ft (300 m) above the valley floor[^1]. The most famous butte formations are located in northeastern Arizona along the Utah–Arizona state line. The valley is considered sacred by the Navajo Nation, the Native American people within whose reservation it lies.[^2]

    [^1]: Scheffel, Richard L.; Wernet, Susan J., eds. (1980). Natural Wonders of the World. Reader's Digest. p. 255. ISBN 978-0895770875.
    [^2]: King, Farina (2018). "Náhookọs (North): New Hioes for Diné Students." The Earth Memory Compass: Diné Landscapes and Education in the Twentieth Century. University Press of Kansas. pp. 142–74. doi:10.2307/j.ctv6mtdsj. S2CID 135010884.
</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with footnotes</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/3-footnotes.md"></ve-snippet>
</ve-popup>

## 4. Add Entity Popovers

It can be useful to add information popups to text that references entities (people, locations, etc) that may be unfamiliar to the reader.  The information popover provides a short description and image (when available) with a short overview of the referenced entity.  The popover will also include a link to the relevant Wikipedia page where the reader can go to learn more.  Using entity popovers can be an effective way for providing context to a reader without disrupting the flow of the narrative.  More information on using entity information popovers can be found [here](/entity-popovers).

The information popover is created from data and text retrieved from Wikipedia and [Wikidata](https://www.wikidata.org).  Wikidata is an open database containing entries for more than 100 million entities.  Each of these entities is associated with a unique identifier, also known as a `QID` since each identifier starts with the capital letter `Q` followed by a number.  As an example, the Wikidata identifier for Vincent van Gogh is [Q5582](https://www.wikidata.org/wiki/Q5582).

More background on Wikidata and how Juncture uses it can be found [here](/wikidata). 

An entity tag is created by enclosing the entity text in double equal signs and appending an attribute block with the associated QID.  For example, `[Vincent van Gogh](Q5582)`.

<ve-snippet collapsible label="Text with Entity Popover">    
    **Monument Valley**, meaning "valley of the rocks", is a region of the Colorado Plateau characterized by a cluster of sandstone buttes, with the largest reaching 1,000 ft (300 m) above the valley floor. The most famous butte formations are located in northeastern Arizona along the Utah–Arizona state line. The valley is considered sacred by the [Navajo Nation](Q1783171), the Native American people within whose reservation it lies.
</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with entity popover</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/4-entity-popovers.md"></ve-snippet>
</ve-popup>

## 5. Add Juncture Viewer Tags

This is where a text narrative starts to become an interactive and engaging visual essay.  High-resolution images, maps, videos, and other visualizations can bring a text narrative to life while also providing details and context that can often be difficult to convey in text alone.  Juncture's media viewer is great at providing visual appeal, especially when using high-resolution images.  Videos and interactive maps are other visualizations often used in a visual essay.

Juncture tags are used to add viewers to an essay.  The media ([ve-media](/components/media)) and map ([ve-map](/components/map)) viewers are two of the most commonly used.  Others are available and more will be added in future versions of Juncture.  

Juncture tags include a `.ve-` prefix and must be located at the beginning of a new line in the essay.  One or more attributes will often be required after the tag.  These attributes can be expressed as single values or as key-value pairs, for instance, `fit=cover` is an attribute used by the Juncture `.ve-media` tag.  The key in this string is `fit` and the value is `cover`.  This is an attribute that tells the media viewer how to display an image that has a different aspect ratio than the viewer.  Many attributes can be expressed as single values as Juncture can usually infer the purpose of the attribute by its position in the tag string or the value itself.  

<ve-snippet collapsible label="Juncture image tag example">
    `image wc:Monument_Valley,_Utah,_USA_(23611451292).jpg "Monument Valley"`
</ve-snippet>

?> Note that in the HTML version of the tag seen in the snippet above, the `src` key has been added by the Markdown-to-HTML conversion that Juncture performs.  The Markdown versions of the Juncture tags are easier to write but the Juncture tags are ultimately converted into HTML for use by the browser.  The HTML version of the Juncture tags is provided in the snippets as a convenience for users that may be using Juncture viewers in web pages not rendered by Juncture -- for instance, in a vanilla HTML document or a WordPress site.  The HTML version of the tag could be used in an essay text file but the Markdown version is always more concise and readable.

<ve-snippet collapsible label="Juncture media tag with positioning attribute">
    .ve-media wc:Sunflower_sky_backdrop.jpg right
    This example adds the `right` positioning attribute to the `.ve-media` tag to position the media viewer on the right side of the page.  The width is set to 50% of the essay size and the height will be automatically calculated to preserve the aspect ratio of the source item.
</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with Juncture viewer tags</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/5-juncture-viewer-tags.md"></ve-snippet>
</ve-popup>

## 6. Add Viewer Interactions

One of Juncture's key features is the ability to connect text passages to viewer actions.  These actions include zooming in on a particular region of an image, positioning a map over a specific location, and playing an audio or video clip at a specific time stamp.  Actions may be triggered by clicking on marked passages or by scrolling marked paragraphs into the active portion of the browser window. 

After adding Juncture viewers to an essay it can often be useful to connect the viewer to associated sections of the text with one or more interactions.  These interactions include `zoom to`, `fly to`, and `play at` actions for images, maps, and audio/video clips.  The interactions are triggered by a user gesture -- clicking or hovering over a marked passage in the text.

In the snippet below a few `zoomto` actions are defined for an image displayed by the `.ve-image` viewer.

<ve-snippet collapsible label="Juncture 'zoomto' interactions on an image">
    `image wc:Monument_Valley,_Utah,_USA_(23611451292).jpg "Monument Valley" right`

    Major rock formations include [West and East Mitten Buttes](zoomto/675,518,2909,1937), [Merrick Butte](zoomto/3759,1040,1455,969), Hunts Mesa, Eagle Mesa, Sentinel Mesa, Brighams Tomb, Castle Rock, Stagecoach, Big Indian, Rain God Mesa, Spearhead Mesa, Mitchell Mesa, Mitchell Butte, Gray Whiskers, Elephant Butte, Camel Butte, Cly Butte, King-on-his-Throne, Rooster Rock, and Setting Hen. Another notable formation is Totem Pole, a highly eroded butte remanent. The valley also includes large stone structures, such as the "Eye of the Sun".
</ve-snippet>

This next snippet shows the use of `flyto` actions with a `.ve-map` viewer.

<ve-snippet collapsible label="Juncture 'flyto' interactions on a map">
    `map Q192017,4 "Monument Valley" marker right`

    [Monument Valley](flyto/Q192017,11) is part of the Colorado Plateau. The elevation of the valley floor ranges from 5,000 to 6,000 feet (1,500 to 1,800 m) above sea level. The floor is largely siltstone of the Cutler Group, or sand derived from it, deposited by the meandering rivers that carved the valley. The valley's vivid red coloration comes from iron oxide exposed in the weathered siltstone. The darker, blue-gray rocks in the valley get their color from manganese oxide.
</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with Juncture viewer interactions</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/6-juncture-viewer-interactions.md"></ve-snippet>
</ve-popup>

More information on the Juncture interactions framework can be found [here](/actions).

## 7. Add Header and Footer

Custom headers and/or footers can be a nice addition to an essay.  A Header can be a good location for a title and subtitle or author name.  Headers can be very useful, or even essential when building a website consisting of multiple interlinked essays.  The header provides navigation capabilities that can be used for linking key areas of a site as well as providing access to documentation and a contact form.  Headers also support the use of a banner image which can add to the visual appeal of an essay.

<ve-snippet collapsible label="Header with background image">
    `header "Monument Valley" wc:Monument_Valley_banner.jpg height=100 alpha=0`
    afasfafasfasf
</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with header and footer</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/7-header-footer.md"></ve-snippet>
</ve-popup>

More information on the Juncture header component can be found [here](/components/header).  Footer info is found [here](/components/footer).

## 8. Enable Annotations

Depending on the purpose of an essay, enabling annotations may be desired.  This can be easily done by adding the `.ve-annotate` tag anywhere in an essay.

`ve-annotate` adds the [Hypothes.is](https://web.hypothes.is/) annotation client to an essay.  The Hypothes.is annotation tool is [widely used in education](https://web.hypothes.is/education/).  It is open source and based on standards developed by the W3C Web Annotation Working Group. 

The `.ve-annotate` does not use any attributes.  Simply add the tag anywhere in your essay text and the annotation client will be added to the rendered essay.  That's it.  Using the annotation client from a rendered essay will require logging into Hypothes.is.  New Hypothes.is users will need to [signup for a free Hypothes.is account](https://web.hypothes.is/start/).


?> Note that the annotation client is not added to an essay when displayed in an example snippet or in preview mode in the Juncture editor.  It is only added to the rendered version of an essay.  

The example below demonstrates how to add the `.ve-annotate` tag to an essay.

<ve-snippet collapsible label="Adding the Hypothes.is annotation client to an essay">
    # My Essay

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    .ve-annotate

</ve-snippet>

?> <ve-popup>
    <sl-button slot="trigger">Show example with annotations enabled</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/8-annotator.md"></ve-snippet>
</ve-popup>
# Getting Started

## How to use the Juncture documentation

The Juncture documentation index is located in the left sidebar. The sidebar is closed by default but can be opened or closed by clicking the menu icon in the top-left corner of the page.

Information boxes are used to highlight useful or important content:

?> This is an informational message.

!> This is a message highlighting something important.

The documentation contains numerous examples that demonstrate the use of Markdown and Juncture tags. Each example includes Markdown snippets that show how a tag would be used in an essay. An HTML snippet is also provided for each example. The HTML snippet can be used in Markdown files, but it is also included for situations where a Juncture component is used in an HTML page not rendered by a Juncture-enabled server. Additionally, the examples include a rendered version of the snippet.

Below is an example with Markdown and HTML code snippets, along with a demo of the rendered code. The snippets are designed for easy copy-pasting or drag-and-drop into the Juncture editor.

<ve-snippet>
    .ve-image wc:AmalfiCoast11.jpg width=50%
</ve-snippet>

Some examples are collapsed by default and can be opened by clicking. This approach is often used for longer examples.

<ve-snippet collapsible label="A collapsed example snippet - click on me to open">
    # The Amalfi Coast

    `image wc:AmalfiCoast11.jpg right`
    
    The Amalfi Coast is a stretch of coastline in southern Italy overlooking the Tyrrhenian Sea and the Gulf of Salerno. It is located south of the Sorrentine Peninsula and north of the Cilentan Coast.

    Celebrated worldwide for its Mediterranean landscape and natural diversity, the Coast is named after the town of Amalfi, which is its main historical and political center. It is a popular jet set destination and has been an attraction for upper-class Europeans since the 18th century, when it was a frequent stopover on their Grand Tours. Attracting international tourists annually, the Amalfi Coast was listed as a UNESCO World Heritage Site in 1997.
</ve-snippet>

## Juncture essay rendering

Juncture turns plain text files stored in GitHub into interactive web pages that contain narrative text, deep-zoom images, maps, video, audio, and more.

For example, consider a Juncture user with the GitHub username **SomeUser** who has completed the Juncture [quick-start](/docs/quick-start). SomeUser has a Markdown file named `example.md` at the root of their essays repository:
- The GitHub URL for SomeUser's essay file is https://github.com/SomeUser/essays/blob/main/example.md
- The rendered Juncture essay can be accessed at https://SomeUser.github.io/essays/example

In addition to the `SomeUser.github.io` domain that is created when a GitHub repository is configured for Juncture, all Juncture essays are also accessible with URLs of the form `https://juncture-digital.org/<USERNAME>/<REPOSITORY>/<PATH>`, where:
- `<USERNAME>` and `<REPOSITORY>` refer to the GitHub username and repository hosting the Markdown file for the essay.
- `<PATH>` is the path to the GitHub-hosted Markdown file containing the essay text. If the filename is `README.md` or `index.md`, it may be omitted from the path. Similarly, the `.md` file extension may also be omitted.

An essay may also be associated with a custom domain. For instance, SomeUser has obtained the domain `MySite.net` for a personal site and connected it to their GitHub essays repository. With this custom domain, the essay can also be accessed via https://MySite.net/example. In this case, the URL path will not include the GitHub username or repository name.

?> Note: SomeUser could also have created their essay in a text file named `README.md` (or `index.md`) inside a folder named `example`. Either approach results in a Juncture essay accessible via https://juncture-digital.org/SomeUser/essays/example (or https://MySite.net/example for the custom domain). The advantage of the folder-based approach is that it provides a convenient place for storing other files associated with an essay (such as image annotations or map overlays). The folder approach is generally recommended for all but the simplest essays.

?> Juncture essay text files must include a `.md` file extension. While the file is plain text, the `.md` extension signals that it contains [Markdown](https://www.markdownguide.org/) text formatting tags. When using the folder-based approach for creating a Juncture essay, the file must be named `README.md` or `index.md`, following GitHub conventions.

## More about GitHub...

GitHub is a **free** Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to Dropbox or Google Drive. When using the Juncture Editor and Media Tool for essay authoring and management, the GitHub interactions (file creation, saving, deletion, etc.) are handled automatically.

A visual essay text file stored in GitHub will be associated with a GitHub account (username), repository, and file path. GitHub-hosted content is organized into one or more repositories. Users unfamiliar with GitHub can think of a repository as a workspace or collection of folders containing files, similar to how content is stored on a computer. GitHub supports the creation of multiple repositories for organizing content.

Essays are defined in plain text Markdown files stored in a GitHub repository. These files include narrative text and tags for text formatting and viewer rendering. The process of creating these text files does not impact how the generated web page is displayed by Juncture, as long as the tags are correctly formed.

- A GitHub repository has a URL of the form `https://github.com/<USERNAME>/<REPOSITORY>`, where `<USERNAME>` is the GitHub username, and `<REPOSITORY>` is the repository name. By convention, the repository name is often `essays`, but any name can be used.

To start using Juncture, you'll need a GitHub account and some basic familiarity with Markdown.

**GitHub**: Go to https://github.com/signup to create a free account.

**Markdown**: Markdown is a simple language, and basic usage can be learned quickly. The [Markdown Guide - Getting Started tutorial](https://www.markdownguide.org/getting-started) is a good place to start.

# GitHub Setup

Create and configure a Juncture-enabled GitHub repository.  

?> This needs to be performed on any GitHub repository that will be used as a content repository for a web site, either using the `<GITHUB USERNAME>.gitnub.io/<GITHUB REPOSITORY NAME>` base URL or a custom domain.  GitHub repository setup is not needed if the essays are served from the `juncture-digital.org` domain and the repository is only used for file storage.

1. Create a Juncture-enabled GitHub repository using this link: [https://github.com/juncture-digital/template/generate](https://github.com/juncture-digital/template/generate)
   - Enter a repository name (e.g., "essays") and optional description.
   - Click **Create Repository**.

2. In the newly created repository, enable GitHub Pages by selecting **Pages** from the **Code and automation** section in the repository **Settings** page. In the **Pages** form, select **main** from the **Branch** pull-down menu and click **Save**.

# Creating an essay

This section describes the typical steps involved in creating a Juncture essay. The steps represent a logical progression from plain text to a completed visual essay, incorporating text formatting, interactive viewers, headers, footers, and more. However, the process is often iterative, with aspects of some steps revisited multiple times.

## Essay creation options

Options for creating an essay text file include:

- **Using the GitHub web editor**: This is the simplest approach and was the primary method for creating and editing Juncture essays in the first version. The drawback is that the editor must be exited each time a save is made, and previewing changes requires a separate request to the Juncture-enabled web server. This workflow can be cumbersome and inefficient. Improving this workflow was a key objective in Juncture version 2.
- **Using the Juncture Editor**: A web-based editor introduced in Juncture version 2. It provides an in-browser editing experience with live previews and syntax highlighting of Markdown and Juncture tags. The Juncture Editor also supports the automatic creation of Juncture tags through copy-paste and drag-and-drop. For instance, Juncture `image`, `audio`, and `video` tags are automatically created when dragging media into the editor window from common websites.

!> **Avoid using both editors simultaneously, as divergent edits may result in GitHub merge conflicts when saving.**

## 1. Add Text

Essay text is often initially entered as plain, unformatted text using a text editor. During this phase, the text is typically organized into paragraphs. In Juncture, a paragraph is simply a grouping of one or more sentences separated by one or more blank lines. The Juncture Editor will automatically wrap text within paragraphs, so placing each sentence on a new line is not necessary.

<ve-popup>
    <sl-button slot="trigger">Show example as plain text</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/1-text-only.md"></ve-snippet>
</ve-popup>

## 2. Format Text with Markdown

Markdown formatting can be added during initial text entry or afterward. The Juncture Editor includes a Markdown formatting toolbar that makes it easy to apply common tags. However, the Markdown tags themselves are simple and often faster to enter manually.

Below are links to Markdown resources:

- [Markdown Guide](https://www.markdownguide.org/)
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [Short (12min) Markdown tutorial on YouTube](https://www.youtube.com/watch?v=6A5EpqqDOdk)

The most commonly used Markdown tags are:

- **Paragraph**: Defined by separating one or more lines of text with a blank line.
- **Heading**: Created by adding number signs (#) in front of a word or phrase, with the number of signs corresponding to the heading level.
- **Bold**: Add two asterisks or underscores before and after a word or phrase.
- **Italic**: Add one asterisk or underscore before and after a word or phrase.
- **Link**: Enclose the link text in brackets and follow with the URL in parentheses.
- **Blockquote**: Add a `>` in front of a paragraph.
- **List**: Ordered or unordered lists can be created using numbers, dashes, asterisks, or plus signs.

<ve-popup>
    <sl-button slot="trigger">Show example with Markdown formatting</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/2-markdown.md"></ve-snippet>
</ve-popup>

## 3. Add Footnotes

When reusing content from another source, it's good practice to cite the source using footnotes. Juncture's Markdown parser supports footnotes, even though they are not part of the core Markdown language.

Add a footnote reference by appending a tag starting with `^` and enclosing inline text in square brackets `[]`. Footnote content is defined with the same label, followed by a colon and a space.

<ve-popup>
    <sl-button slot="trigger">Show example with footnotes</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/3-footnotes.md"></ve-snippet>
</ve-popup>

## 4. Add Entity Popovers

Information popups can provide additional context for entities (such as people or locations) mentioned in an essay. These popups display a short description and image (if available), as well as a link to the relevant Wikipedia page.

Entity tags are created by enclosing the entity text in double equal signs and appending a QID from Wikidata (e.g., `[Vincent van Gogh](Q5582)`).

<ve-popup>
    <sl-button slot="trigger">Show example with entity popover</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/4-entity-popovers.md"></ve-snippet>
</ve-popup>

## 5. Add Juncture Viewer Tags

To make a narrative more engaging, Juncture tags are used to add interactive viewers, such as high-resolution images, maps, or videos.

Juncture tags start with `.ve-` and must be on a new line. Attributes can be included in key-value pairs (e.g., `fit=cover`).

<ve-popup>
    <sl-button slot="trigger">Show example with Juncture viewer tags</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/5-juncture-viewer-tags.md"></ve-snippet>
</ve-popup>

## 6. Add Viewer Interactions

One of Juncture's most powerful features is the ability to link viewer actions (e.g., zooming, playing media) to specific parts of the text. Interactions can be triggered by clicking or scrolling.

<ve-popup>
    <sl-button slot="trigger">Show example with Juncture viewer interactions</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/6-juncture-viewer-interactions.md"></ve-snippet>
</ve-popup>

## 7. Add Header and Footer

Adding custom headers and footers can enhance the presentation of an essay. Headers are useful for navigation, while footers can provide additional information or links.

<ve-popup>
    <sl-button slot="trigger">Show example with header and footer</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/7-header-footer.md"></ve-snippet>
</ve-popup>

## 8. Enable Annotations

To enable annotations for your essay, add the `.ve-annotate` tag. This integrates the Hypothes.is annotation tool, which is widely used in education.

<ve-popup>
    <sl-button slot="trigger">Show example with annotations enabled</sl-button>
    <ve-snippet slot="content" src="https://juncture-digital.github.io/examples/monument-valley/8-annotator.md"></ve-snippet>
</ve-popup>

Hypothes.is is only added to the rendered version of an essay, not in preview mode or snippet examples.

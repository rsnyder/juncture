[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

```
header auth=github background=wc:Box_of_type.jpg height=100 no-manifest-popover
- [Help](https://docs.juncture-digital.org)
- [Workbench](/wb)
```

# Juncture

Juncture is a tool for creating and displaying interactive web pages.  Juncture web pages are created using an extended version of the [Markdown](Q1193600) language.  Markdown is a lightweight markup language that is widely used to add formatting elements to plain text.  Juncture extends Markdown with the addition of a few custom tags enabling interactive viewers to be easily added to a generated web page.  Juncture uses [GitHub](Q364) for storing the Markdown files.

To create a new repository using this template go to [https://github.com/juncture-digital/template/generate](https://github.com/juncture-digital/template/generate)

Example essays can be found at [https://github.com/juncture-digital/examples](https://github.com/juncture-digital/examples)

Documentation is located at [https://docs.juncture-digital.org](https://docs.juncture-digital.org)

## Getting Started

To begin using Juncture you will need a GitHub account and some basic familiarity with Markdown.

**GitHub** is a free Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to how one might use Dropbox or Google Drive. The Markdown files that Juncture uses to render interactive web pages are stored in GitHub.

- [Signup for a free Github account](https://github.com/signup)

**Markdown** is a simple language and a basic understanding of usage can be obtained in just a few minutes.  Below are some resuources for learning Markdown.

- [Markdown Guide - Getting Started tutorial](https://www.markdownguide.org/getting-started)
- [markdowntutorial.com](https://www.markdowntutorial.com)
- [Markdown tutorial](https://www.youtube.com/watch?v=6A5EpqqDOdk)

### Creating your first Juncture essay

#### Create and configure a Juncture-enabled Github repository

1. Create a Juncture-enabled Github repository using this link - [https://github.com/juncture-digital/template/generate](https://github.com/juncture-digital/template/generate)

  - Enter a Repository name (e.g,, "essays") and optional Description.
  - Press **Create Repository**

2. In the newly created repository, enable Github Pages by selecting **Pages** from the **Code and automation** section in the repository **Settings** page.  In the **Pages** form select **main** from the **Branch** pull-down menu and press **Save**.

### Create a new Markdown file to use for the Juncture essay

1. In the newly created repository, create a new markdown file for the Juncture essay by selecting **Create new file** from the **Add file** pull-down menu located on the repository home page.  
2. In the file name input field enter "sunflower/README.md"
3. In the editor field add the text `[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)`
4. Press the **Commit changes...** button located at the top-right of the page.

### Add Markdown text for your essay

At this point you should have a new repository with a `README.md` file located in a folder named `sunflower`.

To add Markdown text for the essay you may continue to use the Github editor or the editor provided in the Juncture Workbench.  The Juncture Workbench editor is recommended as it provides a preview toggle for rapidly making and viewing changes.  

To activate the workbench press the button now displayed at the top of the Markdown file when viewing from the Github site,

```
# Common Sunflower

The **common sunflower** (*Helianthus annuus*) is a species of large annual forb of the daisy family Asteraceae. The [common sunflower](https://en.wikipedia.org/wiki/Common_sunflower) is harvested for its edible oily seeds which are used in the production of cooking oil.

![Common sunflower](https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/217px-Sunflower_sky_backdrop.jpg)
```
	
4. Commit (save) the file

5. Press the button found at the top of the essay to see the Juncture rendered essay.  Note that at this point we are not using any Juncture extensions, just basic Markdown. 
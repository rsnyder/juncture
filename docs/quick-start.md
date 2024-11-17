# Quick Start

To begin using Juncture you will need a GitHub account and some basic familiarity with Markdown.

**GitHub** is a free Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to how one might use Dropbox or Google Drive. The Markdown files that Juncture uses to render interactive web pages are stored in GitHub.  Go to https://github.com/signup to sign up for a free GithHub account.

**Markdown** is a simple language and a basic understanding of usage can be obtained in just a few minutes.  The [Markdown Guide - Getting Started tutorial](https://www.markdownguide.org/getting-started) is a good resource for getting started with Markdown.

## Creating your first Juncture essay

### Create and configure a Juncture-enabled Github repository

1. Create a Juncture-enabled Github repository using this link - [https://github.com/juncture-digital/template/generate](https://github.com/juncture-digital/template/generate)

  - Enter a Repository name (e.g,, "essays") and optional Description.
  - Press **Create Repository**

2. In the newly created repository, enable Github Pages by selecting **Pages** from the **Code and automation** section in the repository **Settings** page.  In the **Pages** form select **main** from the **Branch** pull-down menu and press **Save**.

## Add a Juncture essay with some commonly used Juncture tags

1. In the newly created repository, create a new markdown file for the Juncture essay by selecting **Create new file** from the **Add file** pull-down menu located on the repository home page.  
2. In the file name input field enter "example.md"
3. In the editor field add the text found at this [link](https://raw.githubusercontent.com/juncture-digital/examples/main/monument-valley/README.md)
4. Press the **Commit changes...** button located at the top-right of the page.

?> Note: This example essay is created in a stepwise process in the [Getting Started](/docs/getting-started) guide.

## View your essay

To view your newly created Juncture essay use the link https://`<GitHub Username>`/github.io/`<GitHub Repository>`/example, replacing `<GitHub Username>` with your GitHub username, and `<GitHub Repository>` with the name of the new repository created (e.g,, "essays").

Note that it may take a minute or so for the new essay link to become active.  If the link doesn't work immediately wait and try again.

## Editing Juncture Files

Juncture source files may be created and edited using the GitHub editor or the Juncture web editor.  In both cases Markdown files are saved to a GithHub repository in your account.  The advantage of using the Juncture editor includes a preview feature and Juncture syntax highlighting.  When using the Juncture editor for the first time you will need to authenticate with GitHub and authorize Juncture to access to write to your repository.

## Embedding a preview link in your essay

When first creating a Juncture Markdown file in GitHub it is recommended that the code below be inserted at the beginning of the file.  This code will render a "View with Juncture" link at the top of the file when viewed from the GitHub site.  This provides a convenient way to view the rendered Juncture essay from the GitHub site.

```
[![](https://v3.juncture-digital.org/badge.png)](https://v3.juncture-digital.org)
```

?> Note that this preview link may not work browsers other than Chrome

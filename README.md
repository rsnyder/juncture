[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

# Juncture

Juncture is a tool for creating and displaying interactive web pages.  Juncture web pages are created using an extended version of the [Markdown](https://www.markdownguide.org/) language.  Markdown is a lightweight markup language that is widely used to add formatting elements to plain text.  Juncture extends Markdown with the addition of a few custom tags enabling interactive viewers to be easily added to a generated web page.

## Getting Started

To begin using Juncture you will need a GitHub account and some basic familiarity with Markdown.

**GitHub** is a free Internet hosting service commonly used for software development projects. It provides sophisticated features for version control and workflow management for distributed teams. Juncture primarily uses GitHub as a file hosting service, similar to how one might use Dropbox or Google Drive. The Markdown files that Juncture uses to render interactive web pages are stored in GitHub.

- [Signup for a free Github account](https://github.com/signup)

**Markdown** is a simple language and a basic understanding of usage can be obtained in just a few minutes.  Below are some resuources for learning Markdown.

- [Markdown Guide - Getting Started tutorial](https://www.markdownguide.org/getting-started)
- [markdowntutorial.com](https://www.markdowntutorial.com)
- [Markdown tutorial](https://www.youtube.com/watch?v=6A5EpqqDOdk)

### Creating your first Juncture essay

1. Create a Markdown file in your Github account.  Refer to this [simple guide to GitHub and Markdown](docs/github) for assistance, if needed.
	- Create a Github repository named `essays` if it doesn't already exist.
	- In the `essays` repository create a new file named `sunflower.md`.

2. At the top of this file add the following text.  This text will create a button enabling the rendered Juncture essay to be easily previewed (from the Chrome browser).  It is recommended that this button link be added to the beginning of the Markdown file for each Juncture essay.
	```markdown
	[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)
	```
	
3. Add the Markdown text for your Juncture essay.  Add this text below the button text previously inserted, separated by a blank line, for example.
 
	```markdown
	# Common Sunflower
	
	The **common sunflower** (*Helianthus annuus*) is a species of large annual forb of the daisy family Asteraceae. The [common sunflower](https://en.wikipedia.org/wiki/Common_sunflower) is harvested for its edible oily seeds which are used in the production of cooking oil.
	
	![Common sunflower](	https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/217px-Sunflower_sky_backdrop.jpg)
	```
	
4. Commit (save) the file

5. Press the button found at the top of the essay to see the Juncture rendered essay.  Note that at this point we are not using any Juncture extensions, just basic Markdown. 
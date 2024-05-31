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

### How to Use GitHub to Create and Manage Markdown Files

#### 1. Create a GitHub Account

- Go to [github.com](https://github.com) and sign up for a free account.

#### 2. Create a New Repository

A repository is like a folder for your project.

- Log in to GitHub.
- Click the "+" icon in the top right corner and select "New repository."
- Give your repository a name (like a folder name) and click "Create repository."

#### 3. Create a Markdown File

- Go to your new repository.
- Click the "Add file" button and select "Create new file."
- Name your file. Make sure to include the `.md` extension (e.g., `README.md`).

#### 4. Write in Markdown

In the text editor that appears, write your content. Here are some basics:

- **Headings:**
	```markdown
	# Heading level 1
	## Heading level 2
	### Heading level 3
	```

- **Paragraphs:**
 Paragraphs are formatted as blocks of plain text separated by blank lines.
	```markdown
	This is the first sentence in paragraph 1.  This is another sentence in paragraph 1.
	
	This is the first sentence in paragraph 2.  This is another sentence in paragraph 2.

	```
	
- **Bold and Italics:**
	```markdown
	**Bold text**
	*Italic text*
	```

- **lists:**
	```markdown
	- list item 1
	- list item 2
	  - nested list item 1
	  - nested list item 2
	```


- **Hyperlinks:**
	```markdown
	[Link text](URL)
	```
	
	- **Images:**
	```markdown
	![Alt text](Image URL)
	```
	
- **Inline code:**
	```markdown
	`Some text`
	```
	
- **A simple markdown file**

	Below is a simple markdown file with a heading, paragraph, and an image.  The paragraph includes italicized, bolded text, and a hyperlink.

	```markdown
	# Common Sunflower
	
	The **common sunflower** (*Helianthus annuus*) is a species of large annual forb of the daisy family Asteraceae. The [common sunflower](https://en.wikipedia.org/wiki/Common_sunflower) is harvested for its edible oily seeds which are used in the production of cooking oil.
	
	![Common sunflower](	https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/217px-Sunflower_sky_backdrop.jpg)
	```

#### 5. Save Your File

- Scroll down to the "Commit new file" section.
- Add a short message describing your file (e.g., "Added a new Markdown file").
- Click "Commit new file."

#### 6. Edit a Markdown File

- Open the Markdown file you want to edit in your repository.
- Click the pencil icon (✏️) in the top right of the file view.
- Make your changes in the text editor.
- Scroll down to the "Commit changes" section.
- Add a message describing your changes.
- Click "Commit changes."

### Creating your first Juncture essay

1. Using the guide above, create a Markdown file in your Github account.  Create a Github repository named `essays`, and in this repository create a new file named `sunflower.md`.

2. At the top of this file add the following text.  This text will create a button enabling the rendered Juncture essay to be easily previewed.
	```markdown
	[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)
	```
	
3. Add the Markdown text for your Juncture essay.  To start, we can use the sunflower example from above.  Add this text below the button text previously inserted, separated by a blank line, for example.
 
	```markdown
	[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

	# Common Sunflower
	
	The **common sunflower** (*Helianthus annuus*) is a species of large annual forb of the daisy family Asteraceae. The [common sunflower](https://en.wikipedia.org/wiki/Common_sunflower) is harvested for its edible oily seeds which are used in the production of cooking oil.
	
	![Common sunflower](	https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/217px-Sunflower_sky_backdrop.jpg)
	```
	
4. Commit (save) the file

5. Press the button found at the top of the essay to see the Juncture rendered essay.  At this point we are not using any Juncture extensions.  The 
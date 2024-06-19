[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

# Juncture

## Markdown

Markdown is a lightweight markup language for creating formatted text using a plain-text editor. Below are some basic elements to get you started.

### Headings

Use `#` for headings. The number of `#` symbols indicates the level of the heading.

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Emphasis

To emphasize text, use * or _ for italic and ** or __ for bold.

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

## Juncture Tags

### Original

The original syntax used for adding a Juncture tag to Markdown was using the HTML `param` tag.  The param tag included attributes that define the type of Juncture viewer to use (e.g., `ve-image` for the image viewer) and one or more viewer specific parameters.  Viewer parameters are defined using name-value notation (`param-name="param-value"`).  In name-value notation the parameter name and value are separated by an equals sign and the parameter value is enclosed in quotes.

```markdown
<param juncture-tag param-1="value1" param-2="value2">
```

For example, below is a Juncture tag. 

```markdown
<param ve-image url="https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg" title="Sunflower">
```

### Simplified

The latest versions of Juncture support a simplified tagging syntax using the Markdown `inline code` tag.  A standard Markdown inline code tag is evaluated as a Juncture tag if it occurs at the start of a line.  The simplified tagging syntax does not use the `<param ...>` wrapper and does not require attribute values to be quoted unless the value includes a space character.

```markdown
`ve-image URL`
```



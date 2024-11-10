[![](https://v3.juncture-digital.org/badge.png)](https://v3.juncture-digital.org)

<style>
    th { background-color: #e9ecef; }
    td { width: 25% !important; }
    code { background-color: inherit !important;}

    table.example td {
        vertical-align: top;
    }
    table.example td > code {
        padding: 0;
    }

    table.example td:nth-of-type(2) {
        font-family: monospace;
    }
</style>

# Overview

Nearly all Markdown applications support the basic syntax outlined in the original Markdown design document. There are minor variations and discrepancies between Markdown processors — those are noted inline wherever possible.

# Headings

To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three (`<h3>`), use three number signs (e.g., `### My Header`).

| Markdown | HTML | Rendered |
|----------|------|----------|
| `# Heading Level 1` | `<h1>Heading level 1</h1>` | <h1>Heading level 1</h1> |
| `## Heading Level 2` | `<h2>Heading level 2</h2>` | <h2>Heading level 2</h2> |
| `### Heading Level 3` | `<h3>Heading level 3</h3>` | <h3>Heading level 3</h3> |
| `#### Heading Level 4` | `<h4>Heading level 4</h4>` | <h4>Heading level 4</h4> |
| `##### Heading Level 5` | `<h5>Heading level 5</h5>` | <h5>Heading level 5</h5> |
| `###### Heading Level 6` | `<h6>Heading level 6</h6>` | <h6>Heading level 6</h6> |

## Heading Best Practices

Put a space between the number signs and the heading name.

| ✅ Do this | ❌  Don't do this |
|------------|-------------------|
| # Here's a Heading | #Here's a Heading |

Put blank lines before and after a heading.

| ✅ Do this | ❌  Don't do this |
|------------|-------------------|
| Preceding paragraph...<br/><br/> # Here's a Heading<br/><br/>Following paragraph...<br/> | Preceding paragraph...<br/> # Here's a Heading<br/>Following paragraph...<br/> |

# Juncture Extensions to Markdown

## Images

| | Markdown | HTML | Rendered |
|----------|----------|------|----------|
| Basic | &#96;image wc:Sunflower_sky_backdrop.jpg&#96; | `<ve-image src="wc:Sunflower_sky_backdrop.jpg"></ve-image>` | `image wc:Sunflower_sky_backdrop.jpg` |
| With custom caption | &#96;image wc:Sunflower_sky_backdrop.jpg "A custom caption"&#96; | `<ve-image src="wc:Sunflower_sky_backdrop.jpg" caption="A custom caption"></ve-image>` | `image wc:Sunflower_sky_backdrop.jpg "A custom caption"` |
| Region | &#96;image wc:Sunflower_sky_backdrop.jpg region=pct:25,25,50,50&#96; | `<ve-image src="wc:Sunflower_sky_backdrop.jpg" region="pct:25,25,50,50"></ve-image>` | `image wc:Sunflower_sky_backdrop.jpg region=pct:25,25,50,50` |
`.example`

###
`.tabs`

#### Markdown

&#96;image wc:Sunflower_sky_backdrop.jpg&#96;

#### HTML

`<ve-image src="wc:Sunflower_sky_backdrop.jpg"></ve-image>`

#### Rendered

`image wc:Sunflower_sky_backdrop.jpg`

## Maps

| Markdown | HTML | Rendered |
|----------|------|----------|
| &#96;map 42.273,-83.738,12 "Ann Arbor, MI"&#96; | `<ve-map center="42.273,-83.738" zoom="12" caption="Ann Arbor, MI"></ve-map>` | `map 42.273,-83.738,12 "Ann Arbor, MI"` |
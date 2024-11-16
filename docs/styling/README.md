# General Styling

Custom styles may be applied to a Juncture essay in few ways.

- Reference an external stylesheet
- Style tag in essay
- In-line element style

## Reference an external stylesheet

The `ve-style` tag can be used to link to an external stylesheet.  The .ve-style tag requires a `href` attribute defining the stylesheet URL.  The href attribute may be included using positional or key-value notation.  The URL may be absolute or relative.

<ve-snippet collapsible label="Using external style sheet" prefix="rsnyder/essays" path="styling">

    ve-style ./custom.css

    # Heading

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>

## Style tag in essay

An HTML `style` tag with CSS properties may be added in the essay text.

<ve-snippet collapsible label="Custom styling using HTML style tag">

    <style>
        h1 { color: red; }
    </style>

    # Heading

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>

In this example a `style` tag is used to load and use an external font.

<ve-snippet collapsible label="Style tag with font import">

<style>
    @import url(//fonts.googleapis.com/css?family=Montserrat);
    .test { font-family: Montserrat; }
    h1 { color: red; }
</style>

    # Heading
    `.test`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>

## In-line element styling

In-line styling may also be applied to elements by appending stylye attributes to an element using the Markdown code tag.  A CSS style attribute is defined by prepending the ":" character to the style name and setting the propery value following the "=".  Property values that include spaces must be enclosed in quotes.  For example,
- `:color=red`
- `:border="2px solid red"`

When applying an attibute block to a paragraph the block is included on a new line following the paragraph text.  

To apply CSS properties to an entire section the attributes are defined on the same like as the section heading with a space separting the attributes from the heading text.  

It is not possible to apply inline styling to a section heading using the in-line styling.  To style a section heading element a `style` tag must be used.  The style tag example in the preceding section shows the use of a style tag to style a heading.

<ve-snippet collapsible label="Custom paragraph styling using in-line styling">

    # Heading

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `:border="1px solid red" padding=6px`

</ve-snippet>

<ve-snippet collapsible label="Custom section styling using in-line styling">

    # Heading `:border="1px solid red" padding=6px`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

</ve-snippet>
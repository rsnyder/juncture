# VisJS Diagram Viewer

<style> 
    .markdown-section h3 ~ p > strong > a { color: crimson; font-size: 110%; text-decoration: none; }
    .markdown-section table { 
        margin-left:3rem; 
        width: calc(100% - 6rem); 
        border:1px solid #555;
    }
    .markdown-section td, .markdown-section th {
        border:1px solid #555;
        padding: 8px;
        line-height: 1.2;
    }
    .markdown-section th {
        background-color:#E2F0F7;
        font-weight:bold !important;
        text-align:center !important;
    }

</style>

he `ve-visjs` tag uses the [vis.js](https://visjs.org/) JavaScript library to create diagram visualizations. With this tag, you can create network, timeline, and other types of diagrams.

## Attributes

### Network attributes 

**[edges](#network-diagram)** (_string_):  The table id defining the network edges

**[hierarchical](#network-diagram)** (_boolean_):  Requests hierarchical layout

**[nodes](#network-diagram)** (_string_):  The table id defining the network nodes

### Timeline attributes 

**[timeline](#timeline-diagram)** (_string_):  The table id defining the timeline data

## Examples

### Network Diagram

When creating a VisJS network diagram the nodes and edges are defined in a Markdown table and referenced in the `ve-visjs` tag using the `id` attribute assigned to each table.

<ve-snippet collapsible label="VisJS network diagram">

    |id |     label     |
    |---|---------------|
    | 1 | Node 1        |
    | 2 | Node 2        |
    | 3 | Node 3        |
    | 4 | Node 4        |
    | 5 | Node 5        |
    `#nodes`

    |from|to |
    |----|---|
    | 1 | 3  |
    | 1 | 2  |
    | 2 | 4  |
    | 2 | 5  |
    | 3 | 3  |
    `#edges`

    `ve-visjs edges=edges nodes=nodes caption="VisJS Network" :height=400px`

</ve-snippet>

<ve-snippet collapsible label="VisJS network diagram with hierarchical layout">

    |id |     label     |
    |---|---------------|
    | 1 | Node 1        |
    | 2 | Node 2        |
    | 3 | Node 3        |
    | 4 | Node 4        |
    | 5 | Node 5        |
    `#nodes`

    |from|to |
    |----|---|
    | 1 | 3  |
    | 1 | 2  |
    | 2 | 4  |
    | 2 | 5  |
    | 3 | 3  |
    `#edges`

    `ve-visjs edges=edges nodes=nodes caption="VisJS Network" hierarchical :height=600px`

</ve-snippet>

### Timeline Diagram

When creating a VisJS timeline the timeline data is defined in a Markdown table and referenced in the `ve-visjs` tag using the `id` attribute assigned to the table.

<ve-snippet collapsible label="VisJS timeline diagram">

    |id | content |   start    |    end     | type  |
    |---|---------|------------|------------|-------|
    | 1 | Item 1  | 2014-04-20 |            |       |
    | 2 | Item 2  | 2014-04-14 |            |       |
    | 3 | Item 3  | 2014-04-18 |            |       |
    | 4 | Item 4  | 2014-04-16 | 2014-04-19 |       |
    | 5 | Item 5  | 2014-04-25 |            |       |
    | 6 | Item 6  | 2014-04-25 |            | point |
    `#timeline`

    `ve-visjs timeline=timeline caption="VisJS Timeline"`

</ve-snippet>

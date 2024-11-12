# Mermaid Diagram Viewer

<style> 
    .markdown-section h2 ~ p > strong > a { color: crimson; font-size: 110%; text-decoration: none; }
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

The `ve-mermaid` tag uses the [Mermaid.js](https://mermaid.js.org/) JavaScript library to create diagram visualizations. With this tag, you can create charts and diagrams with Markdown-inspired text definitions used by Mermaid. [This page](https://mermaid.js.org/intro/#diagram-types) will show you the different diagram types supported by Mermaid that you can include in your visual essay.

## Diagram Syntax

To create your visualization using `ve-mermaid`, write a diagram or chart following the syntax of Mermaid JS. Below is a list of guides to writing different diagrams on  [Mermaid.js](https://mermaid.js.org/). Once you have your diagram code, include it beneath the `.mermaid` tag with one right indent. (Note: if the diagram code is not indented to the right of  `mermaid` tag, the diagram will not show.) 

- [MermaidJS Diagram Syntax Structure Overview](https://mermaid.js.org/intro/n00b-syntaxReference.html)
- [Flowchart](https://mermaid.js.org/syntax/)
- [Sequence diagrams](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [Class diagrams](https://mermaid.js.org/syntax/classDiagram.html)
- [State diagrams](https://mermaid.js.org/syntax/stateDiagram.html)
- [Entity Relationship Diagrams](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
- [User Journey Diagram](https://mermaid.js.org/syntax/userJourney.html)
- [Gantt diagrams](https://mermaid.js.org/syntax/gantt.html)
- [Pie chart diagrams](https://mermaid.js.org/syntax/pie.html)
- [Quadrant Chart](https://mermaid.js.org/syntax/quadrantChart.html)
- [Requirement Diagram](https://mermaid.js.org/syntax/requirementDiagram.html)
- [Gitgraph Diagrams](https://mermaid.js.org/syntax/gitgraph.html)
- [C4 Diagrams](https://mermaid.js.org/syntax/c4.html)
- [Mindmap](https://mermaid.js.org/syntax/mindmap.html)
- [Timeline](https://mermaid.js.org/syntax/timeline.html)
- [ZenUML](https://mermaid.js.org/syntax/zenuml.html)
- [Sankey diagram](https://mermaid.js.org/syntax/sankey.html)
- [XY Chart](https://mermaid.js.org/syntax/xyChart.html)
- [Block Diagrams Documentation](https://mermaid.js.org/syntax/block.html)
- [Other Examples](https://mermaid.js.org/syntax/examples.html)

## Attributes

**[caption](#examples)** (_string_):  A caption to use in the viewer caption bar.

## Examples

<ve-snippet collapsible label="Basic Mermaid diagram">
```
mermaid
graph TD
    A((Indigenous Amazonians)) --- B((Ayahuasca))
    F((New Age Practitioners)) --- B
    G((Syncretic Religions)) --- B
    H((Tourists)) --- B
    I((Western Researchers)) --- B
    A --- C((RELIGIOUS OR SPIRITUAL))
    A --- D((MEDICINAL))
    A --- E((ECONOMIC))
    F --- C
    F --- D
    F --- E
    G --- C
    G --- D
    H --- C
    H --- D
    H --- E
    I --- D
```
</ve-snippet>

<ve-snippet collapsible label="Basic Mermaid diagram with caption">
```
mermaid caption="Mermaid Graph Diagram"
graph TD
    A((Indigenous Amazonians)) --- B((Ayahuasca))
    F((New Age Practitioners)) --- B
    G((Syncretic Religions)) --- B
    H((Tourists)) --- B
    I((Western Researchers)) --- B
    A --- C((RELIGIOUS OR SPIRITUAL))
    A --- D((MEDICINAL))
    A --- E((ECONOMIC))
    F --- C
    F --- D
    F --- E
    G --- C
    G --- D
    H --- C
    H --- D
    H --- E
    I --- D
```
</ve-snippet>

<ve-snippet collapsible label="Pie Chart">
```
mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```
</ve-snippet>

<ve-snippet collapsible label="Mind Map">
```
mermaid
mindmap
root
  A
    B
    C
```
</ve-snippet>

<ve-snippet collapsible label="Quadrant Chart">
```
mermaid
quadrantChart
  title Reach and engagement of campaigns
  x-axis Low Reach --> High Reach
  y-axis Low Engagement --> High Engagement
  quadrant-1 We should expand
  quadrant-2 Need to promote
  quadrant-3 Re-evaluate
  quadrant-4 May be improved
  Campaign A: [0.3, 0.6]
  Campaign B: [0.45, 0.23]
  Campaign C: [0.57, 0.69]
  Campaign D: [0.78, 0.34]
  Campaign E: [0.40, 0.34]
  Campaign F: [0.35, 0.78]
 ```
</ve-snippet>

<ve-snippet collapsible label="Timeline">
```
mermaid
timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter 
```
</ve-snippet>
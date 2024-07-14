[![](https://v3.juncture-digital.org/images/wb.svg)](https://v3.juncture-digital.org/wb)

<ve-snippet collapsible label="Basic VisJS diagram">

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

`ve-visjs edges=edges nodes=nodes caption="VisJS Graph"`

</ve-snippet>
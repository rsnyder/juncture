`mdp-breadcrumbs`

# VisJS examples

## Table data
`:width=50%`

|id|label|
|--|-----|
|1|Node 1|
|2|Node 2|
|3|Node 3|
|4|Node 4|
`#g1-nodes`

|from|to|`#g1-edges`
|----|--|
|1|3|
|1|2|
|2|4|
|2|5|
|3|3|

`mdp-visjs edges=g1-edges nodes=g1-nodes caption="VisJS Graph from local Markdown table data"`

## Data from URL
`:width=50%`

`mdp-visjs url=https://raw.githubusercontent.com/plant-humanities/essays/main/ayahuasca/Networks.tsv caption="VisJS Graph from remote TSV file"`


# Mermaid example
`:width=50%`

```mermaid
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
`caption="Mermaid Graph"`

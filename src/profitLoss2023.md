# Profit and Loss Statement 2023

This page presents a visual overview of the financial outcomes, specifically the profits and losses, for the year 2023.

↓ Touch the dots!

```js
const j1 = FileAttachment("data/profit-loss/pl-2023-j1.csv").csv();
const j2 = FileAttachment("data/profit-loss/pl-2023-j2.csv").csv();
const j3 = FileAttachment("data/profit-loss/pl-2023-j3.csv").csv();
```

```js
import PLChart from './components/profit-loss/PLChart.js';
```

```js
import getPLKeys from './components/profit-loss/utils.js';
```


```js
import TsneChart from './components/profit-loss/TsneChart.js';
```

```js
import calculateTsne from './components/profit-loss/calculateTsne.js';
```

```js
import calculateUmap from './components/profit-loss/calculateUmap.js';
```

```js
import {normalize, transpose} from './components/profit-loss/utils.js';
```

```js
const transposed = [
    ...transpose(j1),
    ...transpose(j2),
    ...transpose(j3)
    ].filter(
        (d) => (d["売上高"] != 0) & !["Ｊ１\n 総合計", "Ｊ１\n 平均"].includes(d.team)
    )

```

```js
const normalized = normalize(transposed);
```


```js
const solution = calculateTsne(
    normalized.map((d) => Object.values(d).slice(1, -1)), {
        dim: 2,
        perplexity: 50,
        nIter: 10000,
        metric: "euclidean"
    }
);
```

```js
const tsneChart = new TsneChart(solution, "#tsne .chart", {
    height: 500,
    width: width / 2,
    margin: { top: 10, bottom: 20, left: 10, right: 40 },
    teams: normalized.map((d) => d.team),
    plData: [...j1, ...j2, ...j3]
}).draw()
```

```html
<div id="tsne" class="grid grid-cols-2">
    <div class="chart card"></div>
    <div class="detail"></div>
</div>
```


## J1

```js
const j1Team = view(Inputs.radio(Object.keys(j1[0]).filter(
    (d) => !["大分類", "小分類", ""].includes(d)
  ),
  { label: "J1 Team (2023)", value: "浦和" }
))
```

```js
const chartj1 = new PLChart(j1, "#j1 .chart", {
    height: 500,
    width: width,
    margin: { top: 10, bottom: 20, left: 50, right: 50 },
    team: j1Team,
    yExtent: [-10000, 10000],
    plKeys: getPLKeys(j1),
    detail: true
}).draw()
```

```html
<div id="j1">
    <div class="chart card"></div>
</div>
```

## J2

```js
const j2Team = view(Inputs.radio(Object.keys(j2[0]).filter(
    (d) => !["大分類", "小分類", ""].includes(d)
  ),
  { label: "J2 Team (2023)", value: "秋田" }
))
```

```js
const chartj2 = new PLChart(j2, "#j2 .chart", {
    height: 500,
    width: width,
    margin: { top: 10, bottom: 20, left: 50, right: 50 },
    team: j2Team,
    yExtent: [-10000, 10000],
    plKeys: getPLKeys(j2),
    detail: true
}).draw()
```


```html
<div id="j2">
    <div class="chart card"></div>
</div>
```

## J3

```js
const j3Team = view(Inputs.radio(Object.keys(j3[0]).filter(
    (d) => !["大分類", "小分類", ""].includes(d)
  ),
  { label: "J3 Team (2023)", value: "いわき" }
))
```

```js
const chartj3 = new PLChart(j3, "#j3 .chart", {
    height: 500,
    width: width,
    margin: { top: 10, bottom: 20, left: 50, right: 50 },
    team: j3Team,
    yExtent: [-10000, 10000],
    plKeys: getPLKeys(j3),
    detail: true
}).draw()
```

```html
<div id="j3">
    <div class="chart card"></div>
</div>
```

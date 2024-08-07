# 損益計算書 - 2023

2023年Jリーグ(J1, J2, J2)の財務成績まとめ。


↓ 点をタッチしてみよう

```js
const j1 = FileAttachment("../data/pl-2023-j1.csv").csv();
const j2 = FileAttachment("../data/pl-2023-j2.csv").csv();
const j3 = FileAttachment("../data/pl-2023-j3.csv").csv();

const data = FileAttachment("../data/pl-2023.csv").csv();
```

```js
import PLChart from '../components/PLChart.js';
```

```js
import getPLKeys from '../components/utils.js';
```


```js
import PLEmbeddingChart from '../components/PLEmbedding.js';
import TsneChart from '../components/TsneChart.js';
import calculateTsne from '../components/calculateTsne.js';

```

```js
import calculateUmap from '../components/calculateUmap.js';
```

```js
import {normalize, transpose} from '../components/utils.js';
```

```js
const transposed = [
    ...transpose(j1),
    ...transpose(j2),
    ...transpose(j3)
    ].filter(
        (d) => (d["売上高-合計"] != 0) & !["J1合計", "J1平均"].includes(d.team) & !["J2合計", "J2平均"].includes(d.team) & !["J3合計", "J3平均"].includes(d.team)
    )
```


```js
const normalized = normalize(transposed);
```


```js
const solution = calculateTsne(
    normalized.map((d) => Object.values(d).slice(1, -1)), {
        dim: 2,
        perplexity: 40,
        nIter: 10000,
        metric: "euclidean"
    }
);
```

```js
const embedding = new PLEmbeddingChart(transposed, "#embedding .chart", {
    height: 500,
    width: width / 2,
    margin: { top: 10, bottom: 20, left: 20, right: 40 },
    teams: transposed.map((d) => d.team),
    plData: [...j1, ...j2, ...j3]
}).draw()
```

<!-- ```js
const tsne = new TsneChart(solution, "#embedding .chart", {
    height: 500,
    width: width / 2,
    margin: { top: 10, bottom: 20, left: 20, right: 40 },
    teams: transposed.map((d) => d.team),
    plData: [...j1, ...j2, ...j3]
}).draw()
``` -->

```html
<div id="embedding" class="grid grid-cols-2">
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
  { label: "J2 Team (2023)", value: "大宮" }
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
  { label: "J3 Team (2023)", value: "鳥取" }
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


## データ

https://www.jleague.jp/corporate/assets/pdf/club_info/j_kessan-2023.pdf
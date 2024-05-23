# Urawa Red Diamonds - All Games
---
```js
const data = FileAttachment("../data/urawa-all-games.csv").csv({typed: true});
```

```js
const yearData = data.filter(d=>d.year==year);
const yearJ1Data = yearData.filter(d => d.J1 != null);
```


## J1

```js
const year = view(Inputs.range([1992, 2024],  {label: "Year", step: 1, value: 2023  }));
```

```js
import SeasonDescriber from '../components/SeasonDescriber.js';
```

```js
const describer = new SeasonDescriber(
    {
        allData: data,
        seasonData: yearData,
        j1Data: yearJ1Data,
    }
);
```

```js
const seasonSummary = describer.seasonSummary('#season-results .description .season')
const j1Summary = describer.j1Summary('#season-results .description .j1')
```


```js
import J1SeasonResults from '../components/J1SeasonResults.js';
```

```js
new J1SeasonResults(yearJ1Data, '#season-results .chart', {
    height: 500,
    width: width,
    margin: { top: 10, bottom: 40, left: 40, right: 40 },
}).draw();
```

```html
<div id="season-results">
    <div class="description card">
        <div class="season"></div>
        <div class="j1"></div>
    </div>
    <div class="chart card"></div>
</div>
```

```js
view(Inputs.table(yearJ1Data));
```
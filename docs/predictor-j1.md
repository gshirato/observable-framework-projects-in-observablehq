# J1 Predictor

```js
const results2023 = FileAttachment('./data/predictor-j1/results-j1-2023.csv').csv()
const prediction2024 = FileAttachment('./data/predictor-j1/predictor-j1-2024.csv').csv()
```

```js
import drawTimelineChart from './components/j1-predictor/TimelineChart.js';
```

```js
const predictor = view(Inputs.select(
  results2023.map((d) => d.予想),
  { label: "予想者", value: "Gota" }
))
```


```js
const timeline = drawTimelineChart(results2023, "#timelineChart .timeline", {
    height: 500,
    width: width ,
    margin: { top: 10, bottom: 20, left: 30, right: 30 },
    teams: Object.values(results2023[0]).filter((d) => d !== "結果"),
    predictor: predictor
})
```

```js
import drawPositionScatterChart from './components/j1-predictor/PositionScatterChart.js';
```


```js
const scatter = drawPositionScatterChart(results2023, "#positionScatter .chart", {
    height: 500,
  width: width,
  teams: Object.values(results2023[0]).filter((d) => d !== "結果"),
  margin: { top: 10, bottom: 20, left: 20, right: 30 },
})
```


```html
<div id="timelineChart">
    <div class="timeline card"></div>
</div>
```

## Who was the favorite?

```html
<div id="positionScatter">
    <div class="chart card"></div>
</div>
```

```js
import TableChart from './components/j1-predictor/TableChart.js';
```

## TableChart

```js
const tableChart = new TableChart(results2023, "#tableChart .table", {
  height: 500,
  width: width,
  margin: { top: 10, bottom: 20, left: 20, right: 10 }
}).draw()
```

```html
<div id="tableChart">
    <div class="table card"></div>
</div>
```

## Prediction 2024

```js
import ChangeFromPrevYearChart from './components/j1-predictor/ChangeFromPrevYearChart.js';
```

```js
const predictor2024 = view(Inputs.select(
    prediction2024.map((d) => d["予想"]),
    { label: "予想者", value: 'Gota' }
))
```

```js
const changeFromPrevYearChart = new ChangeFromPrevYearChart(prediction2024, "#changeFromPrevYearChart .chart", {
  height: 500,
  width: width,
  margin: { top: 10, bottom: 20, left: 20, right: 30 },
  predictor: predictor2024
}).draw()
```

```js
const description = new Description({
  prediction: prediction2024,
  predictor: predictor2024,
  compareTo: '2023年'
}).summary("#changeFromPrevYearChart .description")
```

```html
<div id="changeFromPrevYearChart">
    <div class="description card"></div>
    <div class="chart card"></div>
</div>
```

```js
import drawPredictionScatterChart from './components/j1-predictor/PredictionScatterChart.js';
```

```js
const predictionScatterChart = drawPredictionScatterChart(prediction2024, "#predictionScatter .chart", {
  height: 500,
  width: width,
  margin: { top: 10, bottom: 20, left: 20, right: 30 }
})
```

### 人気チーム

```js
import Description from './components/j1-predictor/Describer.js';
```

```html
<div id="predictionScatter">
    <div class="chart card"></div>
</div>
```
# Small multiples of episodes

```js
const data = FileAttachment("../../data/data_investigation/World_Cup.csv").csv({typed: true});
```


```js
import SmallMultiplesChart from "../../components/data_investigation/smallMultiples.js";
import EpisodeSummaryChart from "../../components/data_investigation/summary.js";
```

```js
import {require} from "npm:d3-require";
```

```js
function drawSmallMultiples(data, nCols, soccer) {
    const matchIds = Array.from(d3.union(data.map(d => d.match_id))).sort((a, b) => d3.ascending(a, b));
    const episodes = Array.from(d3.union(data.map(d => d.episode)));

    const charts = d3.select('#smallMultiples .charts')
    for (const matchId of matchIds.slice(0, 3)) {
        charts.append('h3').text(`Match ${matchId}`);
        const matchElem = charts
            .append('div')
            .attr('class', `match-${matchId} grid grid-cols-${nCols}`);

        for (const episode of episodes.slice(0, 9)) {
            const episodes = data.filter(d => (d.episode === episode) && (d.match_id === matchId));
            matchElem
                .append('div')
                .attr('class', `episode-${episode}`);


            new SmallMultiplesChart(episodes,
                `#smallMultiples .charts .match-${matchId} .episode-${episode}`, {
                width: 300,
                height: 120,
                margin: {top: 20, right: 0, bottom: 20, left: 0},
                soccerModule: soccer
            }).draw();
        }
    }
}
```

```js
const q = new EpisodeSummaryChart(data, '#summary', {
    width: width,
    height: 120,
    margin: {top: 20, right: 20, bottom: 20, left: 40}
}).draw();
```

```js
Array.from(d3.rollup(data, x => ({
        count: x.length,
        avg: d3.mean(x, d => d.possession_duration),
        min: d3.min(x, d => d.possession_duration),
        max: d3.max(x, d => d.possession_duration)
    }),
    d => d.match_id,
    d => d.episode
))
```

<div id="summary"></div>


---

<div id="smallMultiples" class="container grid">
    <div class="sidebar">
      <div class="charts"></div>
    </div>
    <div class="content">
        <div class="detail"></div>
        <div class="table-container">
            <table class="table"></table>
        </div>
    </div>
  </div>


```js
const nCols = 3
let _ = require("d3-soccer").then(soccer=>{
    drawSmallMultiples(data, nCols, soccer)
})
```

```js
view(data)
```


<style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: Arial, sans-serif;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 55%;
      overflow-y: auto;
      padding: 10px;
      background-color: #f8f8f8;
      border-right: 1px solid #ddd;
    }

    .content {
      width: 45%;
      position: relative;
    }

    .detail {
        flex: 1;
        position: fixed;
        top: 100;
        right: 0;
        width: 50%;
        height: 100%;
        padding: 20px;
        background-color: none;
    }

    .table-container {
        position: fixed;
        top: 750px;
        height: 200px;
        overflow-y: auto;
        padding: 10px;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .table th {
        background-color: #f4f4f4;
        text-align: left;
    }
</style>

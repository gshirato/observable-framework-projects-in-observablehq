# Small multiples of episodes

```js
const data = FileAttachment("../../data/data_investigation/World_Cup.csv").csv({typed: true});
```


```js
import SmallMultiplesChart from "../../components/data_investigation/smallMultiples.js";
import LengthDistributionChart from "../../components/data_investigation/lengthDistribution.js";
import addEmoji from "../../components/data_investigation/countryEmojis.js";
import drawSmallMultiples from "../../components/data_investigation/utils.js";
import getUniqueArray from '../../components/utils.js';
```

```js
const teams = getUniqueArray(data.map(d=>d.team_name));
const selectedTeams = view(Inputs.checkbox(teams, {value: ['Croatia', 'France', 'Belgium', 'Japan', 'Germany'], format: x=>addEmoji(x)}))
```

```js
const filteredMatchId = getUniqueArray(data.filter(d=>selectedTeams.includes(d.team_name)).map(d=>d.match_id))
console.log(filteredMatchId)
const filtered = data.filter(d=>filteredMatchId.includes(d.match_id))
```



```js
import {require} from "npm:d3-require";
```


```js
let _ = require("d3-soccer").then(soccer=>{
    new LengthDistributionChart(filtered, '#length-distribution', {
        width: width,
        height: 120,
        margin: {top: 20, right: 20, bottom: 20, left: 40},
        smallMultiplesSelector: '#smallMultiples .charts',
        soccerModule: soccer
    }).draw();
})
```

```js


```

<div id="length-distribution"></div>


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
    drawSmallMultiples(filtered, '#smallMultiples .charts', {nCols: nCols, soccerModule: soccer})
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
      width: 60%;
      overflow-y: auto;
      padding: 10px;
      background-color: #f8f8f8;
      border-right: 1px solid #ddd;
    }

    .content {
      width: 40%;
      position: relative;
    }

    .detail {
        flex: 1;
        position: fixed;
        top: 100;
        right: 20;
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

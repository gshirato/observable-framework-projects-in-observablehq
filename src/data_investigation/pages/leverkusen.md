
# Leverkusen 23/24

```js
import getMatches from '../../statsbomb/components/data.js';
```

```js
const matches = getMatches(9, 281).then(d=>d.sort((a, b) => d3.ascending(a.match_date, b.match_date)))
```


```js
function getEvents(match_id) {
    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${match_id}.json`
    ).then(d => {
        //add match_id to each event
        d.forEach(e=>e.match_id = match_id)
        return d
    })
}

function getEventsList(matches) {
    return Promise.all(matches.map(d=>getEvents(d.match_id)))
}
```

```js
const validDataIndices = Array.from(d3.union(data.filter(d=>d.location !== undefined).map(d=>[d.match_id, d.possession])))
```

```js
const data = getEventsList(matches).then(d=>d.flat().filter(d=>(d.minute !== 0) | (d.second !== 0) ))
```

```js
data
```


```js
import {require} from "npm:d3-require";
import LengthDistributionChart from "../components/lengthDistribution.js";
import drawSmallMultiplesStatsbomb from "../components/drawSmallMultiplesStatsbomb.js";
```


```js
let _ = require("d3-soccer").then(soccer=>{
    new LengthDistributionChart(data, '#length-distribution', {
        width: width,
        height: 120,
        margin: {top: 20, right: 20, bottom: 20, left: 40},
        smallMultiplesSelector: '#smallMultiples .charts',
        soccerModule: soccer,
        episodeName: 'possession'
    }).draw();
})
```

<div id="length-distribution"></div>


```js
```

---

<div id="overview"></div>
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
    drawSmallMultiplesStatsbomb(
        data,
        '#smallMultiples .charts',
        {
            nCols: nCols,
            soccerModule: soccer,
            episodeName: 'possession'
        }
    )
})
```


## Data

https://statsbomb.com/articles/soccer/free-statsbomb-data-bayer-leverkusens-invincible-bundesliga-title-win/

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
        position: relative;
        top:400px;
        height: 500px;
        width: 500px;
        overflow-x: auto;
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

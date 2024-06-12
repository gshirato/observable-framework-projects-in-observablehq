---
toc: false
---

# Small multiples of episodes

```js
// const data = FileAttachment("../data/events/World_Cup.csv").csv({typed: true});
const competition = view(Inputs.select(["World_Cup", "European_Championship", "England", "Spain", "Italy", "Germany", "France"], {value: "World_Cup"}))
```

```js
const response = await fetch(`https://raw.githubusercontent.com/gshirato/observable-framework-projects-in-observablehq/main/public/episodes/${competition}.csv`)

if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
const text = await response.text()
const data = await d3.csvParse(text, d3.autoType)
```

```js
competition; // This line is necessary to trigger the view

function drawCharts() {
  d3.select('#smallMultiples .charts').selectAll('*').html('');
  drawOverview();
}
drawCharts()
```

```js
import LengthDistributionChart from "../components/lengthDistribution.js";
import addEmoji from "../components/emoji/addEmoji.js";
import drawSmallMultiples from "../components/drawSmallMultiples.js";
import getUniqueArray from '../../chart/components/utils.js';
```

```js
const teams = getUniqueArray(data.map(d=>d.team_name));
const selectedTeams = view(Inputs.checkbox(teams, {value: ['France'], format: x=>addEmoji(x)}))
```

```js
const eventNames = getUniqueArray(data.map(d=>d.event_name))
const eventObjects = eventNames.map(d => ({ "Event name": d }));
const events = view(Inputs.table(eventObjects, {value: eventObjects, required: false}))
```

```js
const eventKeys = getUniqueArray(data.filter(d=>events.map(d=>d['Event name']).includes(d.event_name)).map(d=>`${d.match_id}-${d.episode}`)).map(d=>d.split('-').map(Number))

const filteredMatchId = getUniqueArray(data.filter(d=>selectedTeams.includes(d.team_name)).map(d=>d.match_id))

const filtered = data.filter(d=>filteredMatchId.includes(d.match_id)).filter(d=>eventKeys.some(k=>k[0] === d.match_id && k[1] === d.episode))
```

```js
import {require} from "npm:d3-require";
```


```js

function drawOverview() {
    require("d3-soccer").then(soccer=>{
        new LengthDistributionChart(filtered, '#length-distribution', {
            width: width,
            height: 120,
            margin: {top: 20, right: 20, bottom: 20, left: 40},
            smallMultiplesSelector: '#smallMultiples .charts',
            episodeName: 'episode',
            soccerModule: soccer
        }).draw();
    })

    const nCols = 3
    require("d3-soccer").then(soccer=>{
        drawSmallMultiples(
            filtered,
            '#smallMultiples .charts',
            {
                nCols: nCols,
                soccerModule: soccer,
                episodeName: 'episode',
            }
        )
    })
}

drawOverview()
```

```js
```


<div id="length-distribution"></div>


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

```

```js
view(data)
```

## References

- A public data set of spatio-temporal match events in soccer competitions (https://www.nature.com/articles/s41597-019-0247-7)
- Metadata record for: A public data set of spatio-temporal match events in soccer competitions (https://springernature.figshare.com/articles/dataset/Metadata_record_for_A_public_data_set_of_spatio-temporal_match_events_in_soccer_competitions/9711164)


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

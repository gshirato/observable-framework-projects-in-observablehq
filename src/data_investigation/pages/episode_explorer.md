---
toc: false
---

# Small multiples of episodes

```js

const competition = view(Inputs.select(
    ["World_Cup", "European_Championship", "England", "Spain", "Italy", "Germany", "France"],
    {
        value: "World_Cup",
        format: x => addEmoji(x)
    })
)
```

<div id="loading"></div>


```js
const response = await fetch(`https://raw.githubusercontent.com/gshirato/observable-framework-projects-in-observablehq/main/public/episodes/${competition}.csv`).then(d => {
    d3.select('#loading').classed('display', true);
    return d
})

if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
const text = await response.text()
const data = await d3.csvParse(text, d3.autoType)
```

```js
const responseSummary = await fetch(`https://raw.githubusercontent.com/gshirato/observable-framework-projects-in-observablehq/main/public/summary/${competition}.csv`)

if (!responseSummary.ok) throw new Error(`HTTP ${responseSummary.status} - ${responseSummary.statusText}`);
const textSummary = await responseSummary.text()
const summary = await d3.csvParse(textSummary, d3.autoType)
```

```js
competition; // This line is necessary to trigger the view
function drawCharts() {
    d3.select('#timeline .charts').selectAll('*').html('');
    drawOverview();
    showMatchNavigation(filtered, '#timeline .charts', {})
    d3.select('#loading').classed('display', false)
}
drawCharts()
```

```js
import addEmoji from "../components/emoji/addEmoji.js";
import addEmojiToLabel from "../components/emoji/addToLabel.js";
import getUniqueArray from '../../chart/components/utils.js';
import EventTimelineChart from "../components/event-timeline/chart.js";

```

```js
/*
* Dirty fix for the case when the team name is not available in the data
*/
function getPlayingTeams(data, matchId) {
    return Array.from(d3.union(data.filter(d=>d.match_id === matchId).map(d => addEmoji(d.team_name)))).join(' vs ')
}

/**
 * Copied from drawSmallMultiples.js and this function should be extracted in the original code
 */
function showMatchNavigation(data, selector, config) {
    const matchIds = Array.from(d3.union(data.map(d => d.match_id))).sort((a, b) => d3.ascending(a, b));
    console.log(matchIds)

    const charts = d3.select(selector);
    charts.selectAll('*').remove();

    const overview = d3.select(`#overview`);
    overview.selectAll('*').remove();

    overview
        .append('div')
        .attr('class', 'grid grid-cols-3')
        .selectAll('div')
        .data(matchIds)
        .enter()
        .append('div')
        .attr('class', d => `card match-overview match-${d}`)
        .style('padding', '3px')
        .style('text-align', 'center')
        .text(d => getPlayingTeams(data, d))
        .on('click', function(event, d) {
            d3.selectAll('.match-overview').style('background-color', 'white');
            d3.select(this).style('background-color', 'lightgrey');
            const matchClass = d3.select(this).attr('class').split(' ')[2];
            const matchSelector = `${selector} .${matchClass}`;
            console.log(matchSelector)
            d3.select(matchSelector).node().scrollIntoView({ behavior: 'smooth' });
        });
}
```

```js
const teams = getUniqueArray(data.map(d=>d.team_name));
const selectedTeams = view(Inputs.checkbox(teams, {value: ['France'], format: x=>addEmoji(x)}))
```


```js
const filteredMatchId = getUniqueArray(data.filter(d=>selectedTeams.includes(d.team_name)).map(d=>d.match_id))

const filtered = data.filter(d=>filteredMatchId.includes(d.match_id))
```

```js
import {require} from "npm:d3-require";
```


```js

function drawOverview() {
    let _ = require("d3-soccer").then(soccer=>{
    summary.map(d=>d.match_id).forEach(match_id=>{
          const container = d3.select('#timeline .charts').append('div')
          container.append('h3')
            .attr('class', `match-${match_id}`)
            .html(addEmojiToLabel(summary.find(d => d.match_id === match_id).label))
          container.append('div').attr('class', `id-${match_id}`)


          new EventTimelineChart(data.filter(d=>d.match_id === match_id), `#timeline .charts .id-${match_id}`, {
          width: width * .45,
          height: 150,
          margin: {top: 15, right: 10, bottom: 20, left: 25},
          summary: summary.find(d => d.match_id === match_id),
          soccerModule: soccer
      }).draw();
    })
  })
}
```


---

<div id="overview"></div>
<div id="timeline" class="container grid">
    <div class="sidebar">
        <div class="charts"></div>
    </div>
    <div class="content">
        <div class="episodes">
            <div class="before grid grid-cols-3">
                <div class="episode-0">
                    <h3>⏪3</h3>
                </div>
                <div class="episode-1">
                    <h3>⏪2</h3>
                </div>
                <div class="episode-2">
                    <h3>⏪1</h3>
                </div>
            </div>
            <div class="selected-episode"></div>
            <div class="after grid grid-cols-3">
                <div class="episode-0">
                    <h3>⏩1</h3>
                </div>
                <div class="episode-1">
                    <h3>⏩2</h3>
                </div>
                <div class="episode-2">
                    <h3>⏩3</h3>
                </div>
            </div>
        </div>
    </div>
</div>
<hr>
<div class="table-container">
    <table class="table"></table>
</div>


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
      height: 60vh;
    }

    .sidebar {
      width: 46%;
      height: 600px;
      overflow-y: auto;
      padding: 10px;
      background-color: #f8f8f8;
      border-right: 1px solid #ddd;
    }

    .content {
      width: 40%;
      position: relative;
    }

    .episodes {
        flex: 1;
        position: fixed;
        top: 20;
        right: 20;
        width: 50%;
        height: 100%;
        padding: 20px;
        background-color: none;
    }

    .table-container {
        top:0px;
        height: 500px;
        width: 100%;
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

<style>
#loading {
    width: 2rem;
    height: 0rem;
    border: 5px solid #f3f3f3;
    border-top: 6px solid #9c41f2;
    border-radius: 100%;
    margin: auto;
    visibility: hidden;
    animation: spin 2s linear infinite;
}

#loading.display {
    visibility: visible;
    height: 2rem;
}



@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
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

const response = await fetch(`https://media.githubusercontent.com/media/gshirato/observable-framework-projects-in-observablehq/main/public/episodes/${competition}.csv`).then(d => {
    d3.select('#loading').classed('display', true);
    return d
})
if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
const text = await response.text()
const data = await d3.csvParse(text, d3.autoType)
```

```js
const responseSummary = await fetch(`https://media.githubusercontent.com/media/gshirato/observable-framework-projects-in-observablehq/main/public/summary-by-game/${competition}.csv`)

if (!responseSummary.ok) throw new Error(`HTTP ${responseSummary.status} - ${responseSummary.statusText}`);
const textSummary = await responseSummary.text()
const summary = await d3.csvParse(textSummary, d3.autoType)
```

```js
competition; // This line is necessary to trigger the view
function drawCharts(soccer) {
    d3.select('#timeline .charts').selectAll('*').html('');
    showMatchNavigation(filtered, '#timeline .charts', {soccerModule: soccer})
    d3.select('#loading').classed('display', false)
}
let _ = require("d3-soccer").then(soccer=>drawCharts(soccer))
```

```js
import addEmoji from "../components/emoji/addEmoji.js";
import addEmojiToLabel from "../components/emoji/addToLabel.js";
import getUniqueArray from '../../chart/components/utils.js';
import {EventTimelineChart} from "../components/event-timeline/chart.js";

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
    const soccer = config.soccerModule;
    const matchIds = Array.from(d3.union(data.map(d => d.match_id))).sort((a, b) => d3.ascending(a, b));

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
        .on('click', function(event, match_id) {
            d3.selectAll('.match-overview').style('background-color', 'white');
            d3.select(this).style('background-color', 'lightgrey');
            const matchClass = d3.select(this).attr('class').split(' ')[2];
            const matchSelector = `${selector} .${matchClass}`;

            showTimeline(match_id, soccer);
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
function showTimeline(match_id, soccer) {
    const container = d3.select('#main-timeline .chart')
    container.selectAll('*').remove();

    container.append('h3')
        .attr('class', `match-${match_id}`)
        .html(addEmojiToLabel(summary.find(d => d.match_id === match_id).label))
    container.append('div').attr('class', `id-${match_id}`)


    new EventTimelineChart(data.filter(d=>d.match_id === match_id), `#main-timeline .chart .id-${match_id}`, {
        width: width,
        height: 100,
        margin: {top: 15, right: 10, bottom: 20, left: 25},
        summary: summary.find(d => d.match_id === match_id),
        detailRootSelector: '#timeline',
        soccerModule: soccer
    }).draw();
}

```

---

<div id="overview"></div>
<div id="main-timeline">
    <div class="chart"></div>
</div>
<div id="timeline" class="container grid">
    <div class="content">
        <div class="episodes">
            <div class="before grid grid-cols-3">
                <div class="grid">
                    <h3>⏪3</h3>
                    <div class="episode-0"></div>
                </div>
                <div class="grid">
                    <h3>⏪2</h3>
                    <div class="episode-1"></div>
                </div>
                <div class="grid">
                    <h3>⏪1</h3>
                    <div class="episode-2"></div>
                </div>
            </div>
            <div class="selected grid grid-cols-2">
                <div class="selected-episode"></div>
                <div class="table-container">
                    <table class="table"></table>
                </div>
            </div>
            <div class="after grid grid-cols-3">
                <div class="grid">
                    <h3>⏩1</h3>
                    <div class="episode-0"></div>
                </div>
                <div class="grid">
                    <h3>⏩2</h3>
                    <div class="episode-1"></div>
                </div>
                <div class="grid">
                    <h3>⏩3</h3>
                    <div class="episode-2"></div>
                </div>
            </div>
        </div>
    </div>
</div>


<hr>


## References

- A public data set of spatio-temporal match events in soccer competitions (https://www.nature.com/articles/s41597-019-0247-7)
- Metadata record for: A public data set of spatio-temporal match events in soccer competitions (https://springernature.figshare.com/articles/dataset/Metadata_record_for_A_public_data_set_of_spatio-temporal_match_events_in_soccer_competitions/9711164)

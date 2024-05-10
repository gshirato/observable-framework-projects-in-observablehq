# A motivating example: Netherlands vs USA in the 2022 FIFA World Cup

Now, let's consider a motivating example of visual analytics in football. We will investigate the match between **the Netherlands** and **the USA** in **${gameInfo.competition.competition_name}** **${gameInfo.season.season_name}**, which took place on **${gameInfo.match_date}** at **${gameInfo.stadium.name} (${gameInfo.stadium.country.name})**.

The Netherlands won the match with a score of **${gameInfo.home_score} - ${gameInfo.away_score}**.



```js
const gamesInfo = d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/43/106.json`
);
```

```js
const gameInfo = gamesInfo[27];
```

<video src="https://youtu.be/4WGpIOwkLA4?si=AlZnr1RneHEM5kVU" autoplay loop controls></video>

We would like to answer the following questions:

- Identify the key events in the match.
- Analyze the performance of the teams.

```js
display(gameInfo);
```

## Event data

We will use the event data to analyze the key events in the match. The event data provides detailed information about the events that occurred during the match, such as shots and passes. There are **${events.length} events** in the dataset for the match between the Netherlands and the USA.

<div class="note" label>
<b>Possible event types</b>: ${Array.from(d3.union(events.map(d=>d.type.name))).join(", ")}
</div>

```js
import EventTypeCounts from '../../../components/visual-analytics/football/EventTypeCounts.js';
```

```js
const colors = {home_team: "#fdc086", away_team: "#7fc97f"};
```

```js
```

```js
const events = d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${gameInfo.match_id}.json`
);
```

```js
class EventClass {
    constructor(events, teamId) {
        this.events = events;
        this.teamId = teamId;
    }

    getEventsOfTeam() {
        return this.events.filter(d=>d.possession_team.id === this.teamId);
    }
    getEventCounts() {
        const rollup = d3.rollup(this.getEventsOfTeam(), v => v.length, d => d.type.name);
        return Array.from(rollup).sort((a,b)=>d3.descending(a[1], b[1]));
    }
}

```

```js
const homeEventCounts = new EventClass(events, gameInfo.home_team.home_team_id).getEventCounts();
const awayEventCounts = new EventClass(events, gameInfo.away_team.away_team_id).getEventCounts();
```

```js

```

```js
new EventTypeCounts(homeEventCounts, "#homeEvents .chart", {
    width: width / 2,
    height: 300,
    margin: { top: 20, right: 40, bottom: 20, left: 30 },
    defaultColor: "#beaed4",
    highlightColor: colors.home_team,
    otherHighlightColor: colors.away_team,
    otherHighlight: "#awayEvents .chart"

  }).draw();

new EventTypeCounts(awayEventCounts, "#awayEvents .chart", {
    width: width / 2,
    height: 300,
    margin: { top: 20, right: 40, bottom: 20, left: 30 },
    defaultColor: "#beaed4",
    highlightColor: colors.away_team,
    otherHighlightColor: colors.home_team,
    otherHighlight: "#homeEvents .chart"
}).draw();

```
<div class="grid grid-cols-2">
    <div id="homeEvents">
        <h3>${gameInfo.home_team.home_team_name} (#events = ${d3.sum(homeEventCounts, d=>d[1])})</h3>
        <div class="chart"></div>
    </div>
    <div id="awayEvents">
        <h3>${gameInfo.away_team.away_team_name} (#events = ${d3.sum(awayEventCounts, d=>d[1])})</h3>
        <div class="chart"></div>
    </div>
</div>

```js
display(events)
```

## Possession
Each event has a possession number that indicates the order of possession in the match. A possession data looks like this (hover on circles to see the details):



```js
import {require} from "npm:d3-require";
import SimplePossessionChart from "../../../components/visual-analytics/football/SimplePossession.js";
```


```js
require("d3-soccer").then(soccer=>{
  new SimplePossessionChart(events.filter(d=>d.possession==2), "#possession .chart", {
    width: width,
    height: 400,
    margin: { top: 20, right: 40, bottom: 20, left: 20 },
    soccerModule: soccer
  }).draw();
});
```

<div id="possession">
    <div class="chart"></div>
</div>


```js
Inputs.table(events.filter(d=>d.possession==2))
```

```js
import PassesInPossession from "../../../components/visual-analytics/football/PassesInPossession.js";
```

```js
require("d3-soccer").then(soccer=>{
  new PassesInPossession(events.filter(d=>d.possession==2).filter(d=>d.type.name=='Pass'), "#passesEpisode .chart", {
    width: width,
    height: 400,
    margin: { top: 20, right: 40, bottom: 20, left: 20 },
    soccerModule: soccer
  }).draw();
});
```

### Time Series

```js
import PossessionTimeSeriesChart from "../../../components/visual-analytics/football/PossessionTimeSeries.js";
```


```js
new PossessionTimeSeriesChart(Array.from(d3.group(events, d=>d.possession)), "#possessionTS .chart", {
    width: width,
    height: 400,
    margin: { top: 20, right: 40, bottom: 20, left: 30 },
    homeTeamId: gameInfo.home_team.home_team_id,
    awayTeamId: gameInfo.away_team.away_team_id,
    homeColor: colors.home_team,
    awayColor: colors.away_team
  }).draw();
```

<div id="possessionTS">
    <div class="chart"></div>
</div>


### Temporal Distribution

```js
import PossessionTemporalDistributionChart from "../../../components/visual-analytics/football/PossessionTemporalDistribution.js";
```


```js
for (let i = 1; i <= 2; i++) {
    const half = i == 1 ? ".first" : ".second";
    new PossessionTemporalDistributionChart(Array.from(d3.group(events, d=>d.possession)), `#possessionTemporalDistribution ${half} .chart`, {
        width: width,
        height: 200,
        margin: { top: 20, right: 40, bottom: 20, left: 30 },
        homeTeamId: gameInfo.home_team.home_team_id,
        awayTeamId: gameInfo.away_team.away_team_id,
        homeColor: colors.home_team,
        awayColor: colors.away_team,
        period: i
      }).draw();

}
```

<div id="possessionTemporalDistribution">
    <div class="first">
        <div class="chart"></div>
    </div>
    <div class="second">
        <div class="chart"></div>
    </div>
</div>



## Passes

When we focus on the passes and draw lines for each pass, we can see the following:


<div id="passesEpisode">
    <div class="chart"></div>
</div>


We can also analyze the distribution of passes in the match. The following chart shows the distribution of passes by the Netherlands and the USA in the match.

```js
import PassDensityChart from "../../../components/visual-analytics/football/PassDensity.js";
```

```js
require("d3-soccer").then(soccer=>{
    for (const type of ['from', 'to']) {
        for (const side of ['home', 'away'])
        new PassDensityChart(events
                .filter(d=>d.type.name=='Pass')
                .filter(d=>d.team.id === gameInfo[`${side}_team`][`${side}_team_id`]),
            `#${type}PassDensity .${side} .chart`,
            {
                width: width / 2,
                height: 300,
                margin: { top: 40, right: 40, bottom: 40, left: 40 },
                teamId: gameInfo[`${side}_team`][`${side}_team_id`],
                teamName: gameInfo[`${side}_team`][`${side}_team_name`],
                teamColor: colors[`${side}_team`],
                soccerModule: soccer,
                type: type,
        }).draw();
    }
});
```

<h3>Passers' positions</h3>
<div id="fromPassDensity" class="grid grid-cols-2">
    <div class="home">
        <div class="chart"></div>
    </div>
    <div class="away">
        <div class="chart"></div>
    </div>
</div>

<h3>Pass destinations</h3>
<div id="toPassDensity" class="grid grid-cols-2">
    <div class="home">
        <div class="chart"></div>
    </div>
    <div class="away">
        <div class="chart"></div>
    </div>
</div>


```js
import PassDistributionChart from "../../../components/visual-analytics/football/PassDistribution.js";
```

```js
require("d3-soccer").then(soccer=>{
    for (const cmap of ['team', 'outcome']) {
        for (const type of ['origin', 'destination']) {
            for (const side of ['home', 'away']) {
                new PassDistributionChart(
                    events
                        .filter(d=>d.type.name=='Pass')
                        .filter(d=>d.team.id === gameInfo[`${side}_team`][`${side}_team_id`]), `#${cmap}PassDistribution .${type} .${side} .chart`, {
                    width: width / 2,
                    height: 250,
                    margin: { top: 20, right: 40, bottom: 40, left: 20 },
                    teamId: gameInfo[`${side}_team`][`${side}_team_id`],
                    teamName: gameInfo[`${side}_team`][`${side}_team_name`],
                    teamColor: colors[`${side}_team`],
                    soccerModule: soccer,
                    type: type,
                    colorMapType: cmap
                }).draw();
            }
        }
    }
});
```

<div id="teamPassDistribution">
    <h3>Highlight to show passes going out from selected zone</h3>
    <div class="origin grid grid-cols-2">
        <div class="home">
            <div class="chart"></div>
        </div>
        <div class="away">
            <div class="chart"></div>
        </div>
    </div>
    <h3>Highlight to show passes coming in selected zone</h3>
    <div class="destination grid grid-cols-2">
        <div class="home">
            <div class="chart"></div>
        </div>
        <div class="away">
            <div class="chart"></div>
        </div>
    </div>
</div>

<div id="outcomePassDistribution">
    <h3>Highlight to show passes going out from selected zone</h3>
    <div class="origin grid grid-cols-2">
        <div class="home">
            <div class="chart"></div>
        </div>
        <div class="away">
            <div class="chart"></div>
        </div>
    </div>
    <h3>Highlight to show passes coming in selected zone</h3>
    <div class="destination grid grid-cols-2">
        <div class="home">
            <div class="chart"></div>
        </div>
        <div class="away">
            <div class="chart"></div>
        </div>
    </div>
</div>



```js
import PassNetworkChart from "../../../components/visual-analytics/football/PassNetwork.js";
```

```js
require("d3-soccer").then(soccer=>{
    for (const side of ['home', 'away']) {
        new PassNetworkChart(
            events
                .filter(d=>d.type.name=='Pass')
                .filter(d=>d.team.id === gameInfo[`${side}_team`][`${side}_team_id`]), `#network .${side} .chart`, {
            width: width / 2,
            height: 250,
            margin: { top: 20, right: 40, bottom: 40, left: 20 },
            teamId: gameInfo[`${side}_team`][`${side}_team_id`],
            teamName: gameInfo[`${side}_team`][`${side}_team_name`],
            teamColor: colors[`${side}_team`],
            soccerModule: soccer,
        }).draw();
    }
});
```




<div id="network">
    <h3>Network</h3>
    <div class="origin grid grid-cols-2">
        <div class="home">
            <div class="chart"></div>
        </div>
        <div class="away">
            <div class="chart"></div>
        </div>
    </div>
</div>

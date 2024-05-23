# Events leading to shots

```js
const gamesInfo = d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/43/106.json`
);
```


```js
import {require} from "npm:d3-require";
const gameInfo = gamesInfo[27];
const colors = {home_team: "#fdc086", away_team: "#7fc97f"};
```

```js
const events = d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${gameInfo.match_id}.json`
);
```


```js
import EpisodesLeadingToShot from '../../../../components/seminars/football/leading-to-shot/episodes.js';
```

```js
view(events.filter(d=>(d.possession==4)))
```


```js
require("d3-soccer").then(soccer=>{
    new EpisodesLeadingToShot(Array.from(d3.group(events, d=>d.possession)), "#leadingToShot .chart", {
        width: width,
        height: 300,
        margin: { top: 20, right: 40, bottom: 20, left: 30 },
        soccerModule: soccer,
        observedId: gameInfo.home_team.home_team_id,
        opponentId: gameInfo.away_team.away_team_id,
        observedColor: colors.home_team,
        opponentColor: colors.away_team,
    }).draw();
})
```


<div id="leadingToShot">
    <div class="chart"></div>
</div>
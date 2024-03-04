# Event Stream (Statsbomb)

<div class="alert">
 Fix IT: show the pitch
</div>

```js
const competitions = d3.json(
  "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json"
)
```

```js
import sortCompetitions from "./components/statsbomb-open-data/statsbomb.js";
```

```js
const sortedCompetitions = sortCompetitions(competitions);
```


```js
function competitionRepresentation(d) {
    console.log(d);
    function available_360(d) {
      return d.match_available_360 === null ? "" : " *360 data available";
    }
    return `${d.competition_name} (${d.competition_gender}, ${
      d.season_name
    })${available_360(d)}`;
}
function matchRepresentation(d) {
  return `${d.home_team.home_team_name} ${d.home_score} - ${d.away_score} ${d.away_team.away_team_name} (Week ${d.match_week}, ${d.match_date})`;
}
```

```js
const competition = view(Inputs.select(sortedCompetitions, {
  format: (d) => competitionRepresentation(d),
  label: "Competition",
  value: sortedCompetitions.find(
    (d) => d.competition_id === 43 && d.season_id === 106
  )
}))
```

```js
const game = view(Inputs.select(sortedGamesOfSeason, {
  format: (d) => matchRepresentation(d),
  label: "Game",
  value: sortedGamesOfSeason.find((d) => d.match_id === 3857255)
}))
```

```js
function sortGamesOfSeason(games) {
  return d3.sort(
    games,
    (a, b) =>
      d3.ascending(a.match_week, b.match_week) ||
      d3.ascending(a.match_date, b.match_date)
  );
}
```

```js
function getSeasonOfCompetition(d) {
  return d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/${d.competition_id}/${d.season_id}.json`
  );
}
```

```js
const seasonGames = getSeasonOfCompetition(competition)
```

```js
const sortedGamesOfSeason = sortGamesOfSeason(seasonGames);
```

## Event stream

```js
function getEvents(game) {
  return d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${game.match_id}.json`
  );
}
```

```js
const events = getEvents(game)
```

```js
function getThreeSixty(game, competitions) {
    const competition = competitions.find(
      (d) =>
        d.competition_id === game.competition.competition_id &&
        d.season_id === game.season.season_id
    );

    if (competition.match_available_360 === null) return "No 360 data available";

    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/three-sixty/${game.match_id}.json`
    );
  }
```

```js
const threeSixty = getThreeSixty(game, competitions)
```

```js
import PassStreamChart from "./components/statsbomb-open-data/PassStreamChart.js";
```

```js
import {require} from "npm:d3-require";
```


```js
import getPossessionData from './components/statsbomb-open-data/utils.js'
```


```js
const passes = events.filter(d=>d.type.name === 'Pass');
const possessions = getPossessionData(passes);
```

```js
const teams = Array.from(d3.union(events.map(d=>d.team.name)));
```

```js
function formatMMSS(d) {
    return `${String(d.minute).padStart(2, '0')}:${String(d.second).padStart(2, '0')}`
}
```

```js
require("d3-soccer").then(soccer=>{
  new PassStreamChart(possession[1], "#passStream .chart", {
    width: width,
    height: 300,
    margin: { top: 20, right: 40, bottom: 20, left: 20 },
    period: 2,
    teams: teams,
    homeColor: "black",
    awayColor: "blue",
    threeSixty: threeSixty,
    timeRange: [
    { minute: possession[1][0].minute, second: possession[1][0].second},
    { minute: possession[1].slice(-1)[0].minute , second: possession[1].slice(-1)[0].second + parseInt(possession[1].slice(-1)[0].duration) + 1},
    ],
    soccerModule: soccer
  }).draw();
});
view(possession[1])
```

```js
const teamToPass = view(Inputs.radio(teams, {label: 'Team', value: teams[0]}))
```

```js
const possession = view(Inputs.select(possessions.filter(d=>d[1][0].possession_team.name == teamToPass), {label: "Possession", format: d=>{
  const startEvent = d[1][0];
  const endEvent = d[1].slice(-1)[0];
  const period = startEvent.period === 1 ? '1st': '2nd';
  const text = `(${period}) ${formatMMSS(startEvent)}~${formatMMSS(endEvent)} (#Events=${d[1].length}, ${startEvent.possession_team.name})`

  return text;
}}))
```

<div id="passStream" class="card">
  <div class="chart"></div>
  <div class="threeSixty"></div>
</div>

# Statsbomb Open Data Visualization


```js
const competitions = d3.json(
  "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json"
)
```

```js
import sortCompetitions from "./components/statsbomb.js";
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
display(Inputs.table(sortedCompetitions))
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

```js
display(Inputs.table(sortedGamesOfSeason));
```

## Query actions

```js
const game = view(Inputs.select(sortedGamesOfSeason, {
  format: (d) => matchRepresentation(d),
  label: "Game",
  value: sortedGamesOfSeason.find((d) => d.match_id === 3857255)
}))
```

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
const players = d3.union(
  events
    .filter((d) => d !== null)
    .filter((d) => d["player"] != null)
    .map((d) => d["player"]["name"])
)
```

```js
const actions = d3.union(
  events
    .filter((d) => d !== null)
    .filter((d) => d["type"] != null)
    .map((d) => d["type"]["name"])
)
```

```js
const queriedActions = events
  .filter((d) => d !== null)
  .filter((d) => d["player"] != null)
  .filter((d) => d["player"]["name"] == queryPlayer)
  .filter((d) => d["type"]["name"] == queryAction)
```
```js
const queryPlayer = view(Inputs.select(players, { label: "Select a player" }))
```

```js
const queryAction = view(Inputs.select(actions, {
  label: "Select an action",
  value: "Pass"
}))
```

```js
display(Inputs.table(queriedActions));
```

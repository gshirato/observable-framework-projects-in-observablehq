# A motivating example: Investigating a football game

In this tutorial, we will explore a motivating example of visual analytics in football. We will use the [StatsBomb Open Data](https://github.com/statsbomb/open-data) to investigate a football game. The StatsBomb Open Data provides detailed event data for football games.


## Data

The available data is organized into the following categories:

- Competitions
- Matches
- Events
- Lineups
- ThreeSixty

---

### Competitions

The competitions data provides information about the competitions, such as name, gender, and season.

```js
const competitions = d3.json(
  "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json"
)
```

```js
import sortCompetitions from "../../../components/statsbomb-open-data/statsbomb.js";
```

```js
const sortedCompetitions = sortCompetitions(competitions);
display(Inputs.table(sortedCompetitions))
```

### Matches

The matches data provides information about the matches, such as the home team, away team, scores, and match date.


```js
function competitionRepresentation(d) {
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

Some attributes such as competition include Object values. We can display the data in a table format.

```js
display(Inputs.table(sortedGamesOfSeason));
```

---

### Events

The events data provides detailed information about the events that occur during a match, such as possession team, player, and location.

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
display(Inputs.table(events));
```

---

### Lineups

```js
function getLineups(game) {
  return d3.json(
    `https://raw.githubusercontent.com/statsbomb/open-data/master/data/lineups/${game.match_id}.json`
  );
}
const lineups = getLineups(game)
```


```js
display(Inputs.table(lineups))
```

#### `lineups[0]` (${lineups[0].team_name})

```js
Inputs.table(lineups[0].lineup)
```

```js
view(lineups[0].lineup[7])
```

#### `lineups[1]` (${lineups[1].team_name})


```js
Inputs.table(lineups[1].lineup)
```

```js
view(lineups[1].lineup[7])
```


### ThreeSixty

The ThreeSixty data ([StatsBomb 360](https://statsbomb.com/what-we-do/soccer-data/360-2/)) provides information about players' locations of the events.

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

Each event is associated to a ThreeSixty data (if available). A ThreeSixty data includes the following attributes:

- event_uuid: unique identifier of the event
- visible_area: area where players are visible
- freeze_frame: list of players' locations

```js
display(threeSixty[0]);
```

```js
import SimpleThreeSixtyChart from "../../../components/visual-analytics/football/SimpleThreeSixty.js";
```



```js
import {require} from "npm:d3-require";
```


```js
require("d3-soccer").then(soccer=>{
  new SimpleThreeSixtyChart(threeSixty[0], "#threeSixty .chart", {
    width: width,
    height: 300,
    margin: { top: 20, right: 40, bottom: 20, left: 20 },
    soccerModule: soccer
  }).draw();
});
```

Although the ThreeSixty data provides detailed information about the players' locations, it is difficult to interpret the data. We can use a different visualization to better understand the data.



<div id="threeSixty">
  <div class="chart"></div>
</div>

The "actor" (who possesses the ball) is highlighted with a dashed ring. Their teammates are colored in red, while the opponents are colored in blue.

```js
import EventStreamChart from "../../../components/statsbomb-open-data/EventStreamChart.js";
```

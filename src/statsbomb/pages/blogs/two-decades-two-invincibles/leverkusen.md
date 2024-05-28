# Two Decades, Two Invincibles

Bayer Leverkusen has just won the Bundesliga for the first time in their history. They have done it in style, going unbeaten throughout the season. This is the first time a team has ever gone unbeaten in the Bundesliga. The last time a team went unbeaten in a top European league was Arsenal in the 2003-04 season. This is the first time in two decades that a team has gone unbeaten in a top European league. The two teams that have achieved this feat are Bayer Leverkusen and Arsenal.

What was the secret to their success? How did they manage to go unbeaten throughout the season? What was remarkable about their performances? What can we learn from their achievements? Let's take a closer look at the two invincibles.

```js
function getEvents(match_id) {
    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${match_id}.json`
    );
}
```

## Bayer Leverkusen (2023-24)

```js
const competitions = d3.json(
  "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json"
)
```

```js
import getMatches from "../../../components/data.js";
```

```js
const matchesLev = getMatches(9, 281).then(d=>d.sort((a, b) => d3.ascending(a.match_date, b.match_date)))
view(Inputs.table(matchesLev))
```

```js
matchesLev[0]
```

```js
const eventsLev = getEvents(matchesLev[0].match_id)
view(Inputs.table(eventsLev))
```

```js
```


## Arsenal (2003-04)
```js
const matchesArs = getMatches(2, 44).then(d=>d.sort((a, b) => d3.ascending(a.match_date, b.match_date)))

view(Inputs.table(matchesArs))
```


```js
matchesArs[0]
```

```js
const eventsArs = getEvents(matchesArs[0].match_id)
view(Inputs.table(eventsArs))
```

## Data

https://statsbomb.com/articles/soccer/free-statsbomb-data-bayer-leverkusens-invincible-bundesliga-title-win/
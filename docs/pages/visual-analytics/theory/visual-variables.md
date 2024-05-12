# Visual Variables

So, let's start visualizing data by drawing marks. We have the following dataset:

```js
const shots = events.filter(d=>d.type.name === 'Shot');
```

```js
Inputs.table(shots);
```



```js
Inputs.table(Object.entries(events.find(d=>d.type.name === 'Shot')['shot']));
```


Each row in the dataset represents a shot event. A shot event has the following attributes:

- `location`: the location of the shot event.
- `shot`: the shot details.
    - `outcome`: the outcome of the shot.
    - `type`: the type of the shot.
    - `body_part`: the body part used to make the shot.
    - `technique`: the technique used to make the shot.
    - `freeze_frame`: the freeze frame of the shot.
    - `first_time`: whether the shot was made first time.
    - `end_location`: the end location of the shot.
    - `key_pass_id`: the key pass id of the shot.
    - `statsbomb_xg`: the StatsBomb expected goals of the shot.
- `player`: the player who made the shot.
- `team`: the team of the player who made the shot.
- `minute`: the minute of the shot event.
- etc.


Among them, we are interested in the `location` attirbute of the shot event, along with other attributes such as `outcome`, `type`, `body_part`, `technique`, `statsbomb_xg`, etc.

## Marks

### Position

The `location` attribute of the shot event represents the position of the shot event. We can use the `location` attribute to draw the position of the shot event on the field.

We can agree that the `location` attribute can best be represented by the position variable.


```js
import PositionOnPitch from "../../../components/visual-analytics/theory/visualVariable/positionOnPitch.js";
```

```js
require("d3-soccer").then(soccer=>{
    const posOnPitch = new PositionOnPitch(shots[0], '#positionOnPitch .chart', {
        width: width,
        height: 300,
        margin: {top: 20, right: 20, bottom: 20, left: 40},
        soccerModule: soccer
    }).draw()
})
```

<div id="positionOnPitch">
    <div class="chart"></div>
</div>


```js
import Position from "../../../components/visual-analytics/theory/visualVariable/position.js";
```

```js
const pos = new Position(shots, '#position .chart', {
    width: width,
    height: 200,
    margin: {top: 20, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="position">
    <div class="chart"></div>
</div>


### Size

```js
import Size from "../../../components/visual-analytics/theory/visualVariable/size.js";
```

```js
const size = new Size(shots, '#size .chart', {
    width: width,
    height: 100,
    margin: {top: 20, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="size">
    <div class="chart"></div>
</div>


### Shape

```js
import Shape from "../../../components/visual-analytics/theory/visualVariable/shape.js";
```

```js
const shape = new Shape(shots, '#shape .chart', {
    width: width,
    height: 100,
    margin: {top: 20, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="shape">
    <div class="chart"></div>
</div>

### Value


```js
import Value from "../../../components/visual-analytics/theory/visualVariable/value.js";
```

```js
const value = new Value(shots, '#value .chart', {
    width: width,
    height: 100,
    margin: {top: 20, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="value">
    <div class="chart"></div>
</div>

### Color

```js
import Color from "../../../components/visual-analytics/theory/visualVariable/color.js";
```

```js
const color = new Color(shots, '#color .chart', {
    width: width,
    height: 100,
    margin: {top: 20, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="color">
    <div class="chart"></div>
</div>

### Orientation


### Texture

### Motion

## Characteristics of Visual Variables

### Associative

### Selective

### Quantitative

### Order

### Length

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
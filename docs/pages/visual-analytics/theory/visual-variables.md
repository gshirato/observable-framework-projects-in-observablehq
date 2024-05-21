# Visual Variables

So, let's start visualizing data by drawing marks. We have the following dataset:

```js
const shots = events.filter(d=>d.type.name === 'Shot');
```

```js
view(Inputs.table(shots));
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
const posOnPitch = require("d3-soccer").then(soccer=>{
    new PositionOnPitch(shots[0], '#positionOnPitch .chart', {
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
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="position">
    <div class="chart"></div>
</div>

---

### Size

```js
import Size from "../../../components/visual-analytics/theory/visualVariable/size.js";
```

```js
const size = new Size(shots, '#size .chart', {
    width: width,
    height: 70,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="size">
    <div class="chart"></div>
</div>

---

### Shape

```js
import Shape from "../../../components/visual-analytics/theory/visualVariable/shape.js";
```

```js
const shape = new Shape(shots, '#shape .chart', {
    width: width,
    height: 70,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="shape">
    <div class="chart"></div>
</div>


---

### Value


```js
import Value from "../../../components/visual-analytics/theory/visualVariable/value.js";
```

```js
const value = new Value(shots, '#value .chart', {
    width: width,
    height: 70,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="value">
    <div class="chart"></div>
</div>

---

### Color

```js
import Color from "../../../components/visual-analytics/theory/visualVariable/color.js";
```

```js
const color = new Color(shots, '#color .chart', {
    width: width,
    height: 70,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```

<div id="color">
    <div class="chart"></div>
</div>

---

### Motion



```js
import Motion from "../../../components/visual-analytics/theory/visualVariable/motion.js";
```

```js
const motion = require("d3-soccer").then(soccer=>{
    new Motion(shots, '#motion .chart', {
        width: width,
        height: 300,
        margin: {top: 20, right: 20, bottom: 20, left: 40},
        soccerModule: soccer
    }).draw()
})
```

<div id="motion">
    <div class="chart"></div>
</div>


### Others

- Orientation
- Texture

---

## Characteristics of Visual Variables

```js
// make the html below using d3.js
const descriptions = [
    "Visual variables can be used to <b>group or associate</b> marks based on their visual appearance.",
    "Visual variables can be used to <b>select</b> marks based on their visual appearance.",
    "Visual variables can be used to represent <b>order</b>.",
    "Visual variables can be used to represent <b>proportion</b>."
]
d3.select('#characteristics-desc')
    .selectAll('.div')
    .data(['association', 'selection', 'order', 'quantity'])
    .join('div')
    .attr('id', d=>d)
    .attr('class', 'characteristic')
    .html((d, i)=>`
        <h3>${d.charAt(0).toUpperCase() + d.slice(1)}</h3>
        <p>${descriptions[i]}</p>
    `)
    .on('mouseover', function(event, d){
        d3.select(this).style('background-color', 'lightgray')
        console.log(d3.selectAll(`#characteristics .${d}`).node())
        d3.selectAll(`#characteristics .${d}`)
            .style("background-color", 'lightgray')
    })
    .on('mouseout', function(event, d){
        d3.select(this).style('background-color', 'white')
        d3.selectAll(`#characteristics .${d}`)
            .style("background-color", 'white')

    })
```

```html
```

<div id="characteristics-desc" class="grid grid-cols-2">
</div>

---

<div id="characteristics" class="grid grid-cols-2">
    <div class="position selection association order quantity">
        <div class="chart"></div>
    </div>
    <div class="size selection order">
        <div class="chart"></div>
    </div>
    <div class="shape selection association">
        <div class="chart"></div>
    </div>
    <div class="value selection association order">
        <div class="chart"></div>
    </div>
    <div class="color selection association">
        <div class="chart"></div>
    </div>
</div>

```js
let _ = new Position(shots, '#characteristics .position .chart', {
    width: width / 2,
    height: 100,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()

_ = new Size(shots, '#characteristics .size .chart', {
    width: width / 2,
    height: 100,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()

_ = new Shape(shots, '#characteristics .shape .chart', {
    width: width / 2,
    height: 100,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()

_ = new Value(shots, '#characteristics .value .chart', {
    width: width / 2,
    height: 100,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()

_ = new Color(shots, '#characteristics .color .chart', {
    width: width / 2,
    height: 100,
    margin: {top: 0, right: 20, bottom: 20, left: 40},
}).draw()
```



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
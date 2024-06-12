# Incorrect Locations

Some events are correctly located at one of the corners ([0, 0], [0, 68], [105, 0], [105, 68]), typically during corner kicks or rare actions near the corners. However, we discovered that some event types, which should never occur at these corners, such as goal kicks, also have these corner locations. We need to determine whether these corner locations are indeed incorrect or if the events genuinely start or end at the corner.

## Events with incorrect locations

```js
const data = FileAttachment("../data/events/World_Cup.csv").csv({typed: true});
```

```js
function suspiciousLocations(d) {
    if (d.sub_event_name === 'Corner') return false;
    if (d.start_x === null) return true;
    if (d.start_y === null) return true;
    if (d.end_x === null) return true;
    if (d.end_y === null) return true;
    if ((d.start_x === 105) & (d.start_y === 0)) return true;
    if ((d.start_x === 105) & (d.start_y === 68)) return true;
    if ((d.start_x === 0) & (d.start_y === 0)) return true;
    if ((d.start_x === 0) & (d.start_y === 68)) return true;
    if ((d.end_x === 105) & (d.end_y === 0)) return true;
    if ((d.end_x === 105) & (d.end_y === 68)) return true;
    if ((d.end_x === 0) & (d.end_y === 0)) return true;
    if ((d.end_x === 0) & (d.end_y === 68)) return true;
    return false;
}
```

```js
const search = view(Inputs.search(data.filter(d=>suspiciousLocations(d))))
```


```js
Inputs.table(search)
```

```js
const suspiciousLocationData = data.filter(d=>suspiciousLocations(d));
```

```js
import {require} from "npm:d3-require";
```

```js
import SingleEventChart from "../components/singleEvent.js";
```

```js
let _ = require("d3-soccer").then(soccer=>{
    new SingleEventChart(suspiciousLocationData, '#single-event .chart', {
        width: width,
        height: 340,
        margin: {top: 40, right: 40, bottom: 40, left: 40},
        soccerModule: soccer
    }).draw();
})
```

## Grouping by event types and sub event types

```js
d3.group(suspiciousLocationData, d=>d.event_name, d=>d.sub_event_name)
```

<div class="warning">
The following (sub) event types have incorrect locations in either their start_x and start_y or end_x and end_y coordinates. Their locations have been replaced with [NA, NA] or one of the corner coordinates: [0, 0], [0, 68], [105, 0], [105, 68].
</div>

```js
view(`Goal kick = ${data.filter(d=>d.sub_event_name==='Goal kick').length}`)
view(`Save attempt = ${data.filter(d=>d.sub_event_name==='Save attempt').length}`)
view(`Reflexes = ${data.filter(d=>d.sub_event_name==='Reflexes').length}`)
view(`Shot = ${data.filter(d=>d.sub_event_name==='Shot').length}`)
view(`Protest = ${data.filter(d=>d.sub_event_name==='Protest').length}`)
view(`Hand foul = ${data.filter(d=>d.sub_event_name==='Hand foul').length}`)
view(`Out of game foul = ${data.filter(d=>d.sub_event_name==='Out of game foul').length}`)
view(`Time lost foul = ${data.filter(d=>d.sub_event_name==='Time lost foul').length}`)
view(`Protest = ${data.filter(d=>d.sub_event_name==='Protest').length}`)
view(`Violent Foul = ${data.filter(d=>d.sub_event_name==='Violent Foul').length}`)
view(`Late card foul = ${data.filter(d=>d.sub_event_name==='Late card foul').length}`)
view(`Simulation = ${data.filter(d=>d.sub_event_name==='Simulation').length}`)
view(`Goalkeeper leaving line = ${data.filter(d=>d.sub_event_name==='Goalkeeper leaving line').length}`)
view(`Offside = ${data.filter(d=>d.event_name==='Offside').length}`)
```

<div id="single-event">
    <div class="chart"></div>
</div>


## References

- A public data set of spatio-temporal match events in soccer competitions (https://www.nature.com/articles/s41597-019-0247-7)
- Metadata record for: A public data set of spatio-temporal match events in soccer competitions (https://springernature.figshare.com/articles/dataset/Metadata_record_for_A_public_data_set_of_spatio-temporal_match_events_in_soccer_competitions/9711164)
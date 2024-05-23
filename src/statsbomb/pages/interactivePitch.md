
```js
import {require} from "npm:d3-require";
import InteractivePitch from "../components/seminars/football/InteractivePitch.js";
```

```js
require("d3-soccer").then(soccer=>{
    new InteractivePitch([], "#interactivePitch .chart", {
        width: width,
        height: 300,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        soccerModule: soccer
    }).draw();
});
```

```js
view(Inputs.radio(["In-swing", "Out-swing"]))
view(Inputs.radio(["Left", "Right"]))
```


<div id="interactivePitch">
    <div class="chart"></div>
    <div class="currentLocation"></div>
    <div class="locationList"></div>
</div>
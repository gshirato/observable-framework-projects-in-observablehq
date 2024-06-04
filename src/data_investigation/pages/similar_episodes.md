---
toc: false
---

# Similar episodes

```js
const data = FileAttachment("../data/World_Cup.csv").csv({typed: true});
```

```js
import LengthDistributionChart from "../components/lengthDistribution.js";
import addEmoji from "../components/countryEmojis.js";
import drawSmallMultiples from "../components/drawSmallMultiples.js";
import getUniqueArray from '../../chart/components/utils.js';
```

```js
const groupedData = d3.group(data, d => d.match_id, d => d.episode);

const results = Array.from(groupedData, ([matchId, episodes]) => (
        Array.from(episodes, ([episode, events]) => {
            const successful = events[events.length - 1].sub_event_name === "Corner";
            return {
                successful,
                matchId,
                episode,
            };
        })
    ));
```

```js
```

```js
import {require} from "npm:d3-require";
import aggregateData from "../components/aggregateEpisode.js";
import successfulEpisode from "../components/successfulEpisode.js";
```

```js
const characterized = aggregateData(data);
const successful = successfulEpisode(data);
const features = characterized.map((d) => Object.values(d).slice(2, -1))
```

```js
import {require} from "npm:d3-require";
const UMAP = (await require("umap-js@1.3.1")).UMAP;

const fixed = new UMAP({
    nComponents: 2,
    minDist: 0.1,
    nNeighbors: 15,
}).fit(features)
```

```js
import UmapChart from '../components/umap/chart.js';
```

```js
d3.extent(characterized, d=>d['episode'])
```

```js
new UmapChart(fixed, '#umap .chart', {
    width: width / 2,
    height: width / 2,
    margin: {top: 30, right: 10, bottom: 25, left: 25},
    characterized: characterized,
    successful: successful,
    highlight: 'successful'
}).draw()
```

<div id="umap">
    <div class="chart"></div>
</div>


```js
const charts = d3.select('#small-multiples .overview')
// charts.selectAll('*').remove()
const names = ['eventCount', 'eventDuration', 'progressionOfX', 'averageX', 'averageY', 'hullArea']

names.forEach((feature) => {
    console.log(feature)
    charts.append('div').attr('class', feature)
    new UmapChart(fixed, `#small-multiples .overview .${feature}`, {
        width: width / 3,
        height: width / 3,
        margin: {top: 10, right: 10, bottom: 25, left: 25},
        characterized: characterized,
        successful: successful,
        highlight: feature
    }).draw()
})

```


<div id="small-multiples">
    <div class="overview grid grid-cols-3"></div>
</div>

## Data

```js
view(data)
view(characterized)

```

## References

- A public data set of spatio-temporal match events in soccer competitions (https://www.nature.com/articles/s41597-019-0247-7)
- Metadata record for: A public data set of spatio-temporal match events in soccer competitions (https://springernature.figshare.com/articles/dataset/Metadata_record_for_A_public_data_set_of_spatio-temporal_match_events_in_soccer_competitions/9711164)


<style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: Arial, sans-serif;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 60%;
      overflow-y: auto;
      padding: 10px;
      background-color: #f8f8f8;
      border-right: 1px solid #ddd;
    }

    .content {
      width: 40%;
      position: relative;
    }

    .detail {
        flex: 1;
        position: fixed;
        top: 100;
        right: 20;
        width: 50%;
        height: 100%;
        padding: 20px;
        background-color: none;
    }

    .table-container {
        position: relative;
        top:400px;
        height: 500px;
        width: 500px;
        overflow-x: auto;
        overflow-y: auto;
        padding: 10px;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .table th {
        background-color: #f4f4f4;
        text-align: left;
    }
</style>

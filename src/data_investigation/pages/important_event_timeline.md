---
toc: false
---

# Similar episodes

```js
const data = FileAttachment("../data/events/World_Cup.csv").csv({typed: true});
const summary = FileAttachment("../data/summary/World_Cup.csv").csv({typed: true});
```

```js
import LengthDistributionChart from "../components/lengthDistribution.js";
import addEmoji from "../components/countryEmojis.js";
import tagsStr2List from '../components/tagsStr2List.js';
import drawSmallMultiples from "../components/drawSmallMultiples.js";
import getUniqueArray from '../../chart/components/utils.js';
```

```js
import {require} from "npm:d3-require";
```

```js
import EventTimelineChart from "../components/event-timeline/chart.js";
```

```js
const match_id = view(Inputs.select(d3.union(data.map(d=>d.match_id)), {
    label: "Match ID",
    format: d => `${getUniqueArray(data.filter(e => e.match_id === d).map(d=>addEmoji(d.team_name))).join(' vs ')}`,
}));
```


```js
new EventTimelineChart(data.filter(d=>d.match_id === match_id), '#timeline .chart', {
    width: width,
    height: 200,
    margin: {top: 20, right: 20, bottom: 20, left: 25},
}).draw();
```



```js
getUniqueArray(data.map(d => tagsStr2List(d.tags)).flat())
```

```js
```

<div id="timeline">
    <div class="chart"></div>
</div>

## Data

```js
view(data)

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

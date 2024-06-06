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
import tagsStr2List from '../components/tagsStr2List.js';
import getUniqueArray from '../../chart/components/utils.js';
import addEmoji from "../components/emoji/addEmoji.js";
import addEmojiToLabel from "../components/emoji/addToLabel.js";
```

```js
import {require} from "npm:d3-require";
```

```js
import EventTimelineChart from "../components/event-timeline/chart.js";
```

---

## Charts


```js
let _ = require("d3-soccer").then(soccer=>{
  summary.map(d=>d.match_id).forEach(match_id=>{
        const container = d3.select('#timeline .charts').append('div')
        container.append('h3').html(addEmojiToLabel(summary.find(d => d.match_id === match_id).label))
        container.append('div').attr('class', `id-${match_id}`)


        new EventTimelineChart(data.filter(d=>d.match_id === match_id), `#timeline .charts .id-${match_id}`, {
        width: width / 2,
        height: 150,
        margin: {top: 15, right: 10, bottom: 20, left: 25},
        summary: summary.find(d => d.match_id === match_id),
        soccerModule: soccer
    }).draw();
  })
})

```



<div id="timeline" class="grid grid-cols-2">
    <div class="charts sidebar"></div>
    <div class="content">
      <div class="episodes">
        <div class="before grid grid-cols-2">
          <div class="episode-0"></div>
          <div class="episode-1"></div>
        </div>
        <div class="selected-episode"></div>
        <div class="after grid grid-cols-2">
          <div class="episode-0"></div>
          <div class="episode-1"></div>
        </div>
      </div>
    </div>
</div>

## Data

```js
view(data)
view(summary)

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
      width: 105%;
      height: 600px;
      overflow-y: auto;
      padding: 10px;
      background-color: #f8f8f8;
      border-right: 1px solid #ddd;
    }

    .content {
      width: 40%;
      position: relative;
    }

    .episodes {
        flex: 1;
        position: fixed;
        top: 20;
        right: 20;
        width: 50%;
        height: 100%;
        padding: 20px;
        background-color: none;
    }
</style>

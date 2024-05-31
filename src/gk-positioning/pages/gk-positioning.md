---
theme: dashboard
---

# Where should a goalkeeper stand?

This is a visualization of the theoretical positions a goalkeeper should take relative to the location of a shot.

Both the theory and the visualization have room for improvement.

Feel free to contact me if you have any feedback or suggestions.

## Visualization


```js
import GKPositioningChart from '../components/GKPositioningChart.js';
import GoalFromBack from '../components/goalFromBack.js';
```

```js
import {require} from "npm:d3-require";
require("d3-soccer").then(soccer=>{
    new GKPositioningChart([], "#gkPositioning .chart", {
        height: 500,
        width: width,
        margin: { top: 0, bottom: 0, left: 20, right: 10 },
        ball: { x: 20, y: 30 },
        ratio: 1,
        soccerModule: soccer
    }).draw();
});
```


```html
<div id="gkPositioning">
    <div class="debug"></div>
    <div class="chart"></div>
    <div class="card fromBack"></div>
</div>
```

---
## References

- [ジョアン・ミレッ 世界レベルのGK講座 (Joan Miret)](https://www.amazon.co.jp/%E3%82%B8%E3%83%A7%E3%82%A2%E3%83%B3%E3%83%BB%E3%83%9F%E3%83%AC%E3%83%83-%E4%B8%96%E7%95%8C%E3%83%AC%E3%83%99%E3%83%AB%E3%81%AEGK%E8%AC%9B%E5%BA%A7-%E5%80%89%E6%9C%AC%E5%92%8C%E6%98%8C/dp/4862555330)
- [ジョアン・ミレッ 世界レベルのGK講座 技術編 (Joan Miret)](https://www.amazon.co.jp/dp/4862556426/ref=sspa_dk_detail_0?psc=1&pd_rd_i=4862556426&pd_rd_w=hmdci&content-id=amzn1.sym.4519c587-1a66-4b67-a87f-559231103a05&pf_rd_p=4519c587-1a66-4b67-a87f-559231103a05&pf_rd_r=69DTFK25PVNPWZRFBTY6&pd_rd_wg=0lE3Q&pd_rd_r=bc7288d9-7d02-403c-b38b-ecffa7582dfe&s=books&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy)

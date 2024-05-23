# Concast


```js
const data = FileAttachment("../data/meta/concast/concast-episodes.csv").json();
```

```js
view(Inputs.table(data))
```

```js
import Episode from '../components/episode.js';
```

<div id="episodes" class='grid grid-cols-2'>
    <div class="list grid grid-cols-2"></div>
    <div class="detail"></div>
</div>


```js
for (const episode of data) {
    const div = d3.select('#episodes .list')
        .append('div')
        .attr('class', `episode-${episode.Number}`)

    new Episode(episode, `#episodes .list .episode-${episode.Number}`, {
        width: 400,
        height: 250,
        margin: { top: 10, right: 10, bottom: 10, left: 10 }
    }).draw();
}
```
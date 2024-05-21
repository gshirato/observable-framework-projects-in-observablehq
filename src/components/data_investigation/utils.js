import * as d3 from 'npm:d3';
import SmallMultiplesChart from './smallMultiples.js';
import addEmoji from './countryEmojis.js';


export default function drawSmallMultiples(data, selector, config) {
    const nCols = config['nCols'];
    const soccer = config['soccerModule'];

    const matchIds = Array.from(d3.union(data.map(d => d.match_id))).sort((a, b) => d3.ascending(a, b));

    const charts = d3.select(selector)
    charts
        .selectAll('*')
        .remove();

    for (const matchId of matchIds.slice(0, 5)) {
        const episodes = Array.from(d3.union(data.filter(d => d.match_id === matchId).map(d => d.episode)));
        if (data.filter(d => d.match_id === matchId).length === 0) {continue;}

        const teamNames = Array.from(d3.union(data.filter(d=>d.match_id === matchId).map(d => addEmoji(d.team_name))));
        charts.append('h3').text(`${teamNames.join(' vs ')} #=${episodes.length}`);

        const matchElem = charts
            .append('div')
            .attr('class', `match-${matchId} grid grid-cols-${nCols}`);

        for (let i = 0; i < 18; i++) {
            const episode = episodes[i];
            const filtered = data.filter(d => (d.episode === episode) && (d.match_id === matchId));

            if (filtered.length === 0) {continue;}
            matchElem
                .append('div')
                .attr('class', `episode-${episode}`);

            new SmallMultiplesChart(filtered,
                `${selector} .match-${matchId} .episode-${episode}`, {
                width: 300,
                height: 120,
                margin: {top: 20, right: 0, bottom: 20, left: 0},
                soccerModule: soccer,
                legend: i === 0
            }).draw();
        }
    }
}
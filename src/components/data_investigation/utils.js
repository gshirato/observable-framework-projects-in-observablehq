import * as d3 from 'npm:d3';
import SmallMultiplesChart from './smallMultiples.js';
import addEmoji from './countryEmojis.js';

function getPlayingTeams(data, matchId) {
    return Array.from(d3.union(data.filter(d=>d.match_id === matchId).map(d => addEmoji(d.team_name)))).join(' vs ')
}
let currentPages = {};
const episodesPerPage = 5;

export default function drawSmallMultiples(data, selector, config) {
    const nCols = config['nCols'];
    const soccer = config['soccerModule'];
    const matchIds = Array.from(d3.union(data.map(d => d.match_id))).sort((a, b) => d3.ascending(a, b));

    const charts = d3.select(selector);
    charts.selectAll('*').remove();

    const overview = d3.select(`#overview`);
    overview.selectAll('*').remove();

    overview
        .append('div')
        .attr('class', 'grid grid-cols-3')
        .selectAll('div')
        .data(matchIds)
        .enter()
        .append('div')
        .attr('class', d => `card match-overview match-${d}`)
        .style('padding', '3px')
        .style('text-align', 'center')
        .text(d => getPlayingTeams(data, d))
        .on('click', function(event, d) {
            d3.selectAll('.match-overview').style('background-color', 'white');
            d3.select(this).style('background-color', 'lightgrey');
            const matchClass = d3.select(this).attr('class').split(' ')[2];
            const matchSelector = `${selector} .${matchClass}`;
            d3.select(matchSelector).node().scrollIntoView({ behavior: 'smooth' });
        });

    for (const matchId of matchIds) {
        const episodes = Array.from(d3.union(data.filter(d => d.match_id === matchId).map(d => d.episode)));
        if (episodes.length === 0) { continue; }

        charts.append('h3')
            .attr('class', `match-${matchId}`)
            .text(`${getPlayingTeams(data, matchId)} (#=${episodes.length})`);

        const matchElem = charts
            .append('div')
            .attr('class', `match-${matchId} grid grid-cols-${nCols}`);

        currentPages[matchId] = 0;

        drawEpisodes(data, selector, matchId, nCols, soccer);

        matchElem
            .append('div')
            .attr('class', `load-more match-${matchId}`)
            .style('text-align', 'center')
            .style('cursor', 'pointer')
            .text('Load more')
            .on('click', function() {
                currentPages[matchId]++;
                drawEpisodes(data, selector, matchId, nCols, soccer);
            });
    }
}

function drawEpisodes(data, selector, matchId, nCols, soccer) {
    const matchElem = d3.select(selector).select(`.match-${matchId}`).attr('class', `match-${matchId} grid grid-cols-${nCols}`);
    const episodes = Array.from(d3.union(data.filter(d => d.match_id === matchId).map(d => d.episode)));
    const start = currentPages[matchId] * episodesPerPage;
    const end = Math.min(start + episodesPerPage, episodes.length);

    for (let i = start; i < end; i++) {
        const episode = episodes[i];
        const filtered = data.filter(d => (d.episode === episode) && (d.match_id === matchId));

        if (filtered.length === 0) { continue; }
        matchElem
            .append('div')
            .attr('class', `episode-${episode}`);

        new SmallMultiplesChart(filtered,
            `${selector} .match-${matchId} .episode-${episode}`, {
                width: 300,
                height: 120,
                margin: { top: 20, right: 0, bottom: 20, left: 0 },
                soccerModule: soccer,
                legend: i === 0
            }).draw();
    }

    // Load more button visibility toggle
    if (end >= episodes.length) {
        matchElem.select(`.load-more.match-${matchId}`).style('display', 'none');
    } else {
        matchElem.select(`.load-more.match-${matchId}`).style('display', 'block');
    }
}
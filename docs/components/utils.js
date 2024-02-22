import * as d3 from 'npm:d3';

function getPossessionData(events) {
    return Array.from(d3.group(events, (d) => d.possession));
}

export default getPossessionData;
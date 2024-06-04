import * as d3 from 'npm:d3';

function calculateConvexHullArea(points) {
    const hull = d3.polygonHull(points);
    if (hull === null) return 0; // if there are not enough points to form a hull
    return Math.abs(d3.polygonArea(hull));
}

export default function aggregateData(data) {
    const groupedData = d3.group(data, d => d.match_id, d => d.episode);

    const result = Array.from(groupedData, ([matchId, episodes]) => (
        Array.from(episodes, ([episode, events]) => {
            const eventCount = events.length;
            const eventDuration = events[events.length - 1].event_sec - events[0].event_sec;
            const progressionOfX = events[events.length - 1].start_x - events[0].start_x;
            const avgPosition = {
                avgX: d3.mean(events, d => d.start_x),
                avgY: d3.mean(events, d => d.start_y),
            };
            const positions = events.map(d => [d.start_x, d.start_y]);
            const hullArea = calculateConvexHullArea(positions);

            return {
                matchId,
                episode,
                eventCount,
                eventDuration,
                progressionOfX,
                avgPosition,
                hullArea
            };
        })
    ));

    return result.flat();
}
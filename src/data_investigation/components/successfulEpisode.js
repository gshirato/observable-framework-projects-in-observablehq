import * as d3 from 'npm:d3';

function isSuccessfulLastEvent(events) {
    const lastEvent = events[events.length - 1];
    if (['Shot', 'Goalkeeper leaving line'].includes(lastEvent.event_name)) return true;

    // if (lastEvent.start_x >= 105 * 0.8) {
    //     return ['Duel', 'Others on the ball', 'Pass'].includes(lastEvent.event_name);
    // }
    return false;
}

export default function successfulEpisode(data) {
    const groupedData = d3.group(data, d => d.match_id, d => d.episode);

    const result = Array.from(groupedData, ([matchId, episodes]) => (
        Array.from(episodes, ([episode, events]) => {
            const successful = isSuccessfulLastEvent(events);
            return {
                successful,
                matchId,
                episode,
            };
        })
    ));

    return result.flat();
}
import * as d3 from "npm:d3";


export function getEvents(match_id) {
    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${match_id}.json`
    );
}

export function getThreeSixty(game, competitions) {
    const competition = competitions.find(
      (d) =>
        d.competition_id === game.competition.competition_id &&
        d.season_id === game.season.season_id
    );

    if (competition.match_available_360 === null) return "No 360 data available";

    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/three-sixty/${game.match_id}.json`
    );
}


export default function getMatches(competition_id, season_id) {
    console.log(`https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/${competition_id}/${season_id}.json`)
    return d3.json(
      `https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/${competition_id}/${season_id}.json`
    );
}


export function getMatchDataInCompetition(comp) {
    return getCompetition(comp.competition_id, comp.season_id)
}
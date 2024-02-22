import * as d3 from "npm:d3";
function sortCompetitions(competitions) {
    return d3.sort(
        competitions,
        (a, b) =>
        d3.ascending(a.competition_id, b.competition_id) ||
        d3.ascending(a.season_name, b.season_name) ||
        d3.ascending(a.competition_gender, b.competition_gender)
    );
}

function competitionRepresentation(d) {
    function available_360(d) {
      return d.match_available_360 === null ? "" : " *360 data available";
    }
    return `${d.competition_name} (${d.competition_gender}, ${
      d.season_name
    })${available_360(d)}`;
}

export default sortCompetitions;
// export { sortCompetitions, competitionRepresentation };

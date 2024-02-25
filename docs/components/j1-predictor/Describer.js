import * as d3 from 'npm:d3';

export default class Describer{
    constructor(config) {
        this.config = config;
    }

    init(selector) {
        if (d3.select(selector).empty()) {
        }
        else {
            d3.select(selector).selectAll('*').remove()
        }
    }

    summary(selector){
        this.init(selector);
        const sel = d3.select(selector);
        const predictions = this.config['prediction'];
        const predictor = this.config['predictor'];
        const diff = differenceBetweenPredictions(predictions.find(d=>d['予想']===predictor), predictions.find(d=>d['予想']===this.config['compareTo']));
        const format = d3.format(".2f");

        sel
            .append('div')
            .text(`
            ${predictor}さんの予想です。前年の最終順位と比べて平均で${format(d3.mean(Object.values(diff), d=>Math.abs(d)))}位の違いがあります。

            前年の最終順位とくらべてどれだけ極端な予想をしたかをしめす指標は${format(d3.deviation(Object.values(diff), d=>Math.abs(d)))}です。

            ${this.mostDifferentTeamDescription(diff)}
            `)
        console.log(predictions)
    }

    mostDifferentTeamDescription(diff){
        const mostDifference = Object.entries(diff).sort((a,b)=>d3.descending(Math.abs(a[1]), Math.abs(b[1])))[0]
        const team = mostDifference[0];
        const difference = Math.abs(mostDifference[1]);
        const sign = difference > 0 ? `上` : `下`;

        return `最も前年順位と異なる予想をしたチームは${team}に対してで、前年順位より${difference}位${sign}の予想となっています。`
    }

}



function differenceBetweenPredictions(pred1, pred2){
    // difference in index when comparing the same teams
    // pred: {1: team1, 2: team2, 3: team3, 4: team4}...
    const diff = {};
    for (let i=1; i<=18; i++){
        const team = pred1[i]
        const otherIndex = findKeyByValue(pred2, team);
        diff[team] = i - otherIndex;
    }

    return diff;
}

function findKeyByValue(obj, queryValue) {
    /**
     * FIXIT: This function is duplicated in the original code and should be moved to a separate file
   */
  for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === queryValue) {
          return key;
      }
  }
  return null;
}
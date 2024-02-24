import * as d3 from 'npm:d3';

export default class SeasonDescriber{
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

    seasonSummary(selector){
        this.init(selector);
        const sel = d3.select(selector);
        const officialGames = this.config['seasonData'].filter(d=>d['公式戦']);
        sel
            .append('div')
            .text(
                `${this.config['seasonData'][0].year}シーズン、浦和は公式戦${officialGames.length}試合を戦いました。`
                )
    }

    j1Summary(selector){
        this.init(selector);
        const sel = d3.select(selector);
        const gainedPoints = this.config['j1Data'].map(d => {
            return {'W': 3, 'D': 1, 'L': 0}[d.result]
        });
        const sumPoints = d3.sum(gainedPoints);

        const mostMarginWinGame = this.config['j1Data'].filter(d=>d.result==='W').sort((a, b) =>d3.descending(a.得点 - a.失点, b.得点 - b.失点))[0];

        sel
            .append('div')
            .text(
                `J1リーグでは${this.config['j1Data'].length}試合を戦い、${this.config['j1Data'].filter(d=>d.result==='W').length}勝${this.config['j1Data'].filter(d=>d.result==='D').length}分${this.config['j1Data'].filter(d=>d.result==='L').length}敗の成績 (勝ち点: ${sumPoints})でした。

                ${this.getDescriptionOfMostMarginalWinGame()}
                `

            )
    }

    getDescriptionOfMostMarginalWinGame(){
        const mostMarginalWinGame = this.config['j1Data'].filter(d=>d.result==='W').sort((a, b) =>d3.descending(a.得点 - a.失点, b.得点 - b.失点) || d3.descending(a.得点, b.得点))[0];

        const mostMarginalWinGames = this.config['j1Data'].filter(d=>d.result==='W').filter(d=>d.得点 - d.失点 === mostMarginalWinGame.得点 - mostMarginalWinGame.失点).sort((a, b) =>d3.descending(a.得点 - a.失点, b.得点 - b.失点) || d3.descending(a.得点, b.得点)).slice(1);


        return `最も大差をつけて勝った試合の一つは${mostMarginalWinGame.year}年${mostMarginalWinGame.month+1}月${mostMarginalWinGame.day}日の${mostMarginalWinGame.相手チーム}戦 (${mostMarginalWinGame['H/A']}, ${mostMarginalWinGame.会場}) で、${mostMarginalWinGame.得点}対${mostMarginalWinGame.失点}でした。${this.getDescriptionOfOtherMarginalWinGames(mostMarginalWinGames, mostMarginalWinGame.得点 - mostMarginalWinGame.失点)}`
    }

    getDescriptionOfOtherMarginalWinGames(wingames, diff){

        const otherGames = wingames.filter(d=>d.得点 - d.失点 === diff).sort((a, b) =>d3.descending(a.得点 - a.失点, b.得点 - b.失点) || d3.descending(a.得点, b.得点));
        if (otherGames.length > 0){
            return `${diff}点差での勝利は他にも${otherGames.length}試合あります(${otherGames.map(d=>`${d.相手チーム} ${d.得点}対${d.失点}`)})。`
        }
        return "";
    }
}
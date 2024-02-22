import * as d3 from "npm:d3";

export function getCumsum(data, genre, team) {
    let filteredData = data
        .filter((d) => d["大分類"] === genre)
        .filter((d) => !["合計", "小計"].includes(d["小分類"]));
    let cumsum = 0;
    return filteredData.map((d) => {
        cumsum += parseFormattedNumber(d[team]);
        return { value: cumsum, name: getKey(d) };
    });
    }

export function parseFormattedNumber(formattedNumber) {
    return Number(`${formattedNumber}`.replace(/,/g, "").replace(/▲ /g, "-"));
}

export function getKey(d) {
    return `${d["大分類"]}-${d["小分類"]}`;
}

export function getPLKeys(plData) {
    return plData
      .filter((d) => !["合計", "小計"].includes(d["小分類"]))
      .map((d) => getKey(d));
  }


export function normalize(data) {
    const res = [];
    for (const teamInfo of data) {
        const info = { team: teamInfo.team };
        const s = d3
        .scaleLinear()
        .domain(d3.extent(Object.values(teamInfo).splice(1)))
        .range([-1, 1]);

        for (const item of Object.keys(teamInfo).splice(1)) {
            info[item] = s(parseFormattedNumber(teamInfo[item]));
        }
        res.push(info);
    }
    return res;
}

export function transpose(data) {
    const res = [];
    const teams = Object.keys(data[0]).filter(
        (d) => !["大分類", "小分類", ""].includes(d) & !d.includes("\n")
        );
        for (const team of teams) {
            const teamInfo = { team: team };

            for (const item of data) {
                if (item["大分類"] == "") continue;
                const largeCategory = item["大分類"];
                teamInfo[largeCategory] = parseFormattedNumber(item[team]);
            }
            if (Object.values(teamInfo).includes(NaN)) continue;
            res.push(teamInfo);
        }
        return res;
}
export default getPLKeys;
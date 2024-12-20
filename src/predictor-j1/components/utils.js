export function calculateDifferences(data) {
  // Assuming '結果' is the key for the actual results in your data
    const nTeams = Object.keys(data[0]).length - 1;
    const differences = {};
    const actualResults = data.find((item) => item.予想 === "結果");
    for (let j = 1; j <= nTeams; j++) {
      differences[actualResults[j]] = j;
    }


    const res = data.map((item) => {
      const diff = {};
      for (let i = 1; i <= nTeams; i++) {
        const actualPos = findKeyByValue(actualResults, item[i]);
        diff[actualPos] = Math.abs(i - differences[item[i]]);
        // console.log('aa:', diff, actualPos, item[i], differences[item[i]], actualResults)
      }

      return { ...item, diff };
    });

    return res;
  }

export function findKeyByValue(obj, queryValue) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === queryValue) {
            return key;
        }
    }
    return null;
}

export function calculateCumulativeDifferences(diff) {
    const res = [...diff];

    for (const item of res) {
      let cumsum = 0;
      item["cumsum"] = {};
      for (let j = 1; j <= Object.keys(item["diff"]).length; ++j) {
        cumsum += item["diff"][j];
        item["cumsum"][j] = cumsum;
      }
    }
    return res;
  }

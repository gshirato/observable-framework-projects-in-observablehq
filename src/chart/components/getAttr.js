export default function getAttr(config, col, init) {
    console.log(col, config[col]);
    if (config[col] === undefined) {
        if (init === undefined) {
            throw new Error(`Attribute ${col} is required`);
        }
        return  init;
    }
    return config[col];
}
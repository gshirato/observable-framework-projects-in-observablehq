import emojis from "./list.js";


export function getEmoji(country) {
    if (emojis[country] === undefined) {
        return "🌍";
    }
    return emojis[country];
}

export default function addEmoji(country, emojiPos="before") {
    if (emojiPos === "before") {
        return `${getEmoji(country)} ${country}`;
    }
    return `${country} ${getEmoji(country)}`;
}
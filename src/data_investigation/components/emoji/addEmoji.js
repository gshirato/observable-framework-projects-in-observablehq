import getEmoji from "./getEmoji.js";


export default function addEmoji(country, emojiPos="before") {
    if (emojiPos === "before") {
        return `${getEmoji(country)} ${country}`;
    }
    return `${country} ${getEmoji(country)}`;
}
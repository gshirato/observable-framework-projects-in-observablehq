import emojis from './list.js'

export default function getEmoji(country) {
    if (emojis[country] === undefined) {
        return "🌍";
    }
    return emojis[country];
}

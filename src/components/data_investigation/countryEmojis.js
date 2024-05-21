const emojis = {
    "Croatia": "🇭🇷",
    "France": "🇫🇷",
    "Belgium": "🇧🇪",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿",
    "Russia": "🇷🇺",
    "Sweden": "🇸🇪",
    "Brazil": "🇧🇷",
    "Uruguay": "🇺🇾",
    "Colombia": "🇨🇴",
    "Switzerland": "🇨🇭",
    "Japan": "🇯🇵",
    "Mexico": "🇲🇽",
    "Denmark": "🇩🇰",
    "Spain": "🇪🇸",
    "Portugal": "🇵🇹",
    "Argentina": "🇦🇷",
    "Panama": "🇵🇦",
    "Tunisia": "🇹🇳",
    "Poland": "🇵🇱",
    "Senegal": "🇸🇳",
    "Serbia": "🇷🇸",
    "Costa Rica": "🇨🇷",
    "Germany": "🇩🇪",
    "Korea Republic": "🇰🇷",
    "Nigeria": "🇳🇬",
    "Iceland": "🇮🇸",
    "Peru": "🇵🇪",
    "Australia": "🇦🇺",
    "Morocco": "🇲🇦",
    "Iran": "🇮🇷",
    "Egypt": "🇪🇬",
    "Saudi Arabia": "🇸🇦"
}

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
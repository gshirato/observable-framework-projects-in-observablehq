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

export default function getEmoji(country) {
    if (emojis[country] === undefined) {
        return "🌍";
    }
    return emojis[country];
}
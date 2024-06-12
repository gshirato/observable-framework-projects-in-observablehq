import addEmoji from './addEmoji.js';

export default function addEmojiToLabel(label) {
    const [teams, score] = label.split(', ');
    const emojis = teams.split(' - ').map(team => addEmoji(team)).join(' vs ');
    return `${emojis} (${score})`;
}
export default function sec2mmss(sec) {
    return new Date(sec * 1000).toISOString().substr(14, 5)
}
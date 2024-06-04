export default function tagsStr2List(tagsStr) {
    return tagsStr.replace(
        /[\[\]']+/g, ''
    ).
    split(',').map(tag => +tag.trim());
}
export default function shuffle<T>(array: Array<T>): Array<T> {
    const copiedArray = array.slice(0);

    let currentIndex = copiedArray.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = copiedArray[currentIndex];
        copiedArray[currentIndex] = copiedArray[randomIndex];
        copiedArray[randomIndex] = temporaryValue;
    }

    return copiedArray;
}

import Player from "../structs/player";

export default function getMostDuplicates(array: Array<Player>): Array<Player> {
    interface Hash {
        [details: string]: { count: number; value: Player };
    }

    const length = array.length;
    const objectCounter: Hash = {};
    let newArray: Array<[string, { count: number; value: Player }]> = [];

    for (let i = 0; i < length; i++) {
        const currentMemberOfArrayKey = array[i].id;

        //I check if the property currentMemberOfArrayKey of the object is undefined,
        //which is the default value of unset properties
        if (objectCounter[currentMemberOfArrayKey] === undefined) {
            //If the property is undefined, this is the first time i have this value
            //in the array, so i add it to ArrayWithUniqueValues
            //I set the current key of the object to one: this is both for counting
            //reasons and for avoiding duplicates because  the next time
            //objectCounter[currentMemberOfArrayKey] === undefined will be false and
            // the value will not be added to ArrayWithUniqueValues
            objectCounter[currentMemberOfArrayKey] = { count: 1, value: array[i] };
        } else {
            //The key was already present, augment the counter by one
            objectCounter[currentMemberOfArrayKey].count++;
        }
    }

    Object.entries(objectCounter).forEach(item => newArray.push(item));
    newArray = newArray.sort((a, b) => b[1].count - a[1].count);

    const values = [];
    for (let i = 0; i < newArray.length; i++) {
        if (values.length === 0) {
            values.push(newArray[i]);
        } else if (newArray[0][1].count === newArray[i][1].count) {
            values.push(newArray[i]);
        } else {
            break;
        }
    }

    return values.map(v => v[1].value);
}

// export function getDuplicateCounts(array: Array<Player>): Array<string> {
//     interface Hash {
//         [details: string]: number;
//     }
//
//     const length = array.length;
//     const objectCounter: Hash = {};
//     let newArray: Array<[string, number]> = [];
//
//     for (let i = 0; i < length; i++) {
//         const currentMemberOfArrayKey = JSON.stringify(array[i].role.name);
//
//         //I check if the property currentMemberOfArrayKey of the object is undefined,
//         //which is the default value of unset properties
//         if (objectCounter[currentMemberOfArrayKey] === undefined) {
//             //If the property is undefined, this is the first time i have this value
//             //in the array, so i add it to ArrayWithUniqueValues
//             //I set the current key of the object to one: this is both for counting
//             //reasons and for avoiding duplicates because  the next time
//             //objectCounter[currentMemberOfArrayKey] === undefined will be false and
//             // the value will not be added to ArrayWithUniqueValues
//             objectCounter[currentMemberOfArrayKey] = 1;
//         } else {
//             //The key was already present, augment the counter by one
//             objectCounter[currentMemberOfArrayKey] += 1;
//         }
//     }
//
//     Object.entries(objectCounter).forEach(item => newArray.push(item));
//     newArray = newArray.sort((a, b) => b[1] - a[1]);
//
//     return newArray.map(v => `\`${v[1]}\` ${v[0]}`);
// }

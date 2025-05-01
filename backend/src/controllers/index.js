const findMaxRepeatAlphabetFirst = (str) => {
    let obj = {};

    for (let i = 0; i < str.length; i++) {
        let char = str[i].toLowerCase();
        if (!obj[char]) {
            obj[char] = { value: 1, index: i };
        } else {
            obj[char].value += 1;
        }
    }

    let maxChar = null;

    for (let key in obj) {
        if (
            !maxChar ||
            obj[key].value > obj[maxChar].value ||
            (obj[key].value === obj[maxChar].value && obj[key].index < obj[maxChar].index)
        ) {
            maxChar = key;
        }
    }

    return maxChar;
};

console.log(findMaxRepeatAlphabetFirst("bbbbbbaaabbccdd"));

const RECORD_LIMIT = 10;

export function setName() {
    let name = document.getElementById("namePlayer");
    name.textContent = localStorage["username"];
}

export function saveResult(score, lvl) {
    if (!localStorage[`records${lvl}`]) {
        localStorage[`records${lvl}`] = JSON.stringify({});
    }
    let storage = JSON.parse(localStorage.getItem(`records${lvl}`));
    storage[localStorage["username"]] = score;
    let sortable = sortStorage(storage);
    if (Object.keys(storage).length >= RECORD_LIMIT) {
        let lastName = Object.keys(sortable)[RECORD_LIMIT - 1];
        delete sortable[lastName];
    }
    localStorage[`records${lvl}`] = JSON.stringify(sortable);
}

function sortStorage(storage) {
    let sortableStorage = {};
    let sortable = [];
    for (let key in storage) {
        sortable.push([key, storage[key]]);
    }
    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });
    sortable.reverse();
    for (let el in sortable) {
        sortableStorage[sortable[el][0]] = sortable[el][1];
    }
    return sortableStorage;
}
function storeName() {
    let namePlayer = document.getElementById("playerName").value;
    if (namePlayer === "") {
        namePlayer = "Nemo";
    }
    localStorage["username"] = namePlayer;
}



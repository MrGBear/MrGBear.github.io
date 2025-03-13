
function setPlayerData(player) {
    Validator.validatePlayer(player);
    localStorage.setItem(player.player_id, JSON.stringify(player));
}

function getPlayerData(player_id) {
    let player = JSON.parse(localStorage.getItem(player_id));

    if (!player) {
        console.error(`Player with the id ${player_id} not found in the local storage`);
        return
    }

    try {
        validator.validatePlayer(player);
    } catch (e) {
        console.error(e);
        console.assert(false, 'Error while validating player data from the local storage');
        return
    }
    return player
}


// EXPORT
export const localStorageStore = {
    setPlayerData,
    getPlayerData
}

it(`Test setting and reading from local storage`, () => {
    localStorageStore.setPlayerData(test_player_data);
    let player = localStorageStore.getPlayerData(test_player_data.player_id);
    assertEqualObj(player, player_data);
});

it(`Modifying player data and saving it to local storage`, () => {
    localStorageStore.setPlayerData(player_data);
    let player = localStorageStore.getPlayerData(test_player_data.player_id);
    assertEqualObj(player, player_data);


    test_player_data.games.at(0).game.course_name = "New Course Name";
    localStorageStore.setPlayerData(player_data);
    player = localStorageStore.getPlayerData(test_player_data.player_id);
    assertEqualObj(player, test_player_data);
});
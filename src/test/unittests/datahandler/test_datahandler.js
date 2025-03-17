import { it, assertEqualObj } from '../../framework/test_util.js';
import { backendCalc } from '../../../code/datahandler.js';
import { testdata } from '../../data/test_data.js';

export function test_addGame() {

    const name = "TestUser"
    backendCalc.addUser({ user_name: name, role: "spieler" });

    // Switching context to the test user
    const users = backendCalc.getUsers();

    console.log("Users: ", users);

    const user = users.find(user => user.name == name);

    console.log("Testuser: ", user);

    backendCalc.switchUser(user.id);

    for (let id of testdata.getEgaGameIds()) {

        const index = id - 1;
        const expected = testdata.getExpectedHdcChange(index).hdc_after;

        it(`Integration Test case EGA for game ${id}`, function () {
            // Test code
            const gameData = testdata.getGameData(index);

            gameData.game_id = undefined;

            backendCalc.addGame(gameData);
            const games = backendCalc.getGames();

            assertEqualObj(expected * -1, games[games.length - 1].ega);
        });
    }

    // Delete test data
    backendCalc.removeUser(user.id)
}
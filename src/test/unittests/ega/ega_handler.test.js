import { testdata } from "../../data/test_data.js";
import { it, assertEqualObj } from "../../framework/test_util.js";
import { ega_calc } from "../../../code/ega_handicap.js"

export function test_calculate_one_game() {
    for (let id of testdata.getEgaGameIds()) {

        const index = id - 1;
        const oldValue = testdata.getExpectedHdcChange(index).hdc_before
        const expected = testdata.getExpectedHdcChange(index).hdc_after;

        it(`Test case EGA for game ${id}, Expect change from ${oldValue} to expected ${expected}`, function () {
            // Test code
            const gameData = testdata.getGameData(index);

            const ega = ega_calc(gameData, oldValue).ega;
            assertEqualObj(expected, ega);
        });
    }
}
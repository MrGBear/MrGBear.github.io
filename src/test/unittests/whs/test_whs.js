import { it, assert } from '../../framework/test_util.js';
import { whs_testpackage } from '../../../code/whs_handicap.js';
import { testdata } from '../../data/test_data.js';

export function test_whs() { 


    console.log(whs_testpackage.calculateWHS(testdata.getTestData().gameData));
    //Setup
    const calculateCouseDifferential = whs_testpackage.calculateCouseDifferential;

    //Get the number of pre defined test Games
    const testGamesCount = testdata.getGameData("all").length;
    
    //Check for every Game if the calculation works
    for(let gameNumber = 1; gameNumber <= testGamesCount; gameNumber++){

        //Get Data and expected results for current game
        let gameData = testdata.getGameData(gameNumber - 1).game;

        //Insert the previous Handicap in the gameData
        gameData.handicap_index = testdata.getTestData().expect.hdc_change[gameNumber - 1].hdc_before;
        const expectedResult = testdata.getExpectedHdcChange(gameNumber - 1);


        //Test the Game Data
    
        //Score Differential 
        const SDExp = expectedResult.score_differential;
        const SDCalc = calculateCouseDifferential(gameData);
        it(`Game ${gameNumber}, ScoreDifferential: Expected: ${SDExp}, Result: ${SDCalc}`, function() {
            assert(SDExp === SDCalc);
        });

    } 
};
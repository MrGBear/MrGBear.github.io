import { it, assert } from '../../framework/test_util.js';
import { whs_testpackage } from '../../../code/whs_handicap.js';
import { datav2 } from '../../data/datav2.js';

export function test_whs() { 

    const calc_whs = whs_testpackage.calculateWHS;
    let test_data = [
        {
            "game_id": 1,
            "course_name": "Green Valley Golf Course",
            "course_id": null,
            "course_rating": 72.5,
            "slope_rating": 113,
            "ppc": 0,
            "handicap_index": 12.4,
            "date": "2023-10-15",
            "score_differential": 28,
            "stableford": 36,
            "ega": 11.9,
            "whs": 30,
            "holes": [
                {
                    pos: 1,
                    par: 3,
                    hdc: 4,
                    gbe: 5
                },
                {
                    pos: 2,
                    par: 4,
                    hdc: 16,
                    gbe: 6
                },
                {
                    pos: 3,
                    par: 4,
                    hdc: 1,
                    gbe: 8
                },
                {
                    pos: 4,
                    par: 5,
                    hdc: 10,
                    gbe: 7
                },
                {
                    pos: 5,
                    par: 4,
                    hdc: 7,
                    gbe: 6
                },
                {
                    pos: 6,
                    par: 4,
                    hdc: 13,
                    gbe: 6
                },
                {
                    pos: 7,
                    par: 3,
                    hdc: 5,
                    gbe: 6
                },
                {
                    pos: 8,
                    par: 4,
                    hdc: 17,
                    gbe: 6
                },
                {
                    pos: 9,
                    par: 4,
                    hdc: 2,
                    gbe: 6
                },
                {
                    pos: 10,
                    par: 5,
                    hdc: 11,
                    gbe: 7
                },
                {
                    pos: 11,
                    par: 4,
                    hdc: 8,
                    gbe: 6
                },
                {
                    pos: 12,
                    par: 4,
                    hdc: 14,
                    gbe: 6
                },
                {
                    pos: 13,
                    par: 3,
                    hdc: 6,
                    gbe: 5
                },
                {
                    pos: 14,
                    par: 4,
                    hdc: 18,
                    gbe: 6
                },
                {
                    pos: 15,
                    par: 4,
                    hdc: 3,
                    gbe: 6
                },
                {
                    pos: 16,
                    par: 5,
                    hdc: 12,
                    gbe: 6
                },
                {
                    pos: 17,
                    par: 4,
                    hdc: 9,
                    gbe: 5
                },
                {
                    pos: 18,
                    par: 4,
                    hdc: 16,
                    gbe: 6
                }
            ]
        },
        {
            "game_id": 2,
            "course_name": "Green Valley Golf Course",
            "course_id": null,
            "course_rating": 72.5,
            "slope_rating": 113,
            "ppc": 0,
            "handicap_index": 12.4,
            "date": "2023-10-15",
            "score_differential": 28,
            "stableford": 36,
            "ega": 11.9,
            "whs": 12.1,
            "holes": [
                {
                    pos: 1,
                    par: 3,
                    hdc: 4,
                    gbe: 4
                },
                {
                    pos: 2,
                    par: 4,
                    hdc: 16,
                    gbe: 5
                },
                {
                    pos: 3,
                    par: 4,
                    hdc: 1,
                    gbe: 5
                },
                {
                    pos: 4,
                    par: 5,
                    hdc: 10,
                    gbe: 6
                },
                {
                    pos: 5,
                    par: 4,
                    hdc: 7,
                    gbe: 6
                },
                {
                    pos: 6,
                    par: 4,
                    hdc: 13,
                    gbe: 5
                },
                {
                    pos: 7,
                    par: 3,
                    hdc: 5,
                    gbe: 6
                },
                {
                    pos: 8,
                    par: 4,
                    hdc: 17,
                    gbe: 9
                },
                {
                    pos: 9,
                    par: 4,
                    hdc: 2,
                    gbe: 5
                },
                {
                    pos: 10,
                    par: 5,
                    hdc: 11,
                    gbe: 5
                },
                {
                    pos: 11,
                    par: 4,
                    hdc: 8,
                    gbe: 6
                },
                {
                    pos: 12,
                    par: 4,
                    hdc: 14,
                    gbe: 6
                },
                {
                    pos: 13,
                    par: 3,
                    hdc: 6,
                    gbe: 5
                },
                {
                    pos: 14,
                    par: 4,
                    hdc: 18,
                    gbe: 6
                },
                {
                    pos: 15,
                    par: 4,
                    hdc: 3,
                    gbe: 6
                },
                {
                    pos: 16,
                    par: 5,
                    hdc: 12,
                    gbe: 6
                },
                {
                    pos: 17,
                    par: 4,
                    hdc: 9,
                    gbe: 5
                },
                {
                    pos: 18,
                    par: 4,
                    hdc: 15,
                    gbe: 6
                }
            ]
        } 
    ];

    calc_whs(test_data);



    return; 
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
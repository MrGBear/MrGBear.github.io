//EXPORT 
// export function calculateWHS()


// Berechnung des Handicaps nach dem WHS ab 1.1.2021
// Benötigt wird eine Liste der letzten 20/alle Spielergebnisse
//Alternativ: Scoring Record: Umfasst die jeweils 20 jünsten (oder weniger) Ergebnisse -> Beste Option
export function calculateWHS(data) {
    const prevHCI = data.length >= 2? data[data.length - 2].whs : 54;
    //Calculate the course differential 
    const score_differential = calculateCourseDifferential(data[data.length - 1], prevHCI);
    data[data.length - 1].score_differential = score_differential;
    console.log(JSON.stringify(data[data.length - 1].score_differential));
    console.log("SR: " + JSON.stringify(data))
    //Final calculation
    const scoringRecord = data.slice(Math.max(0, data.length - 21), data.length);
    console.log(JSON.stringify(scoringRecord))
    //functions that may be used for calculation
    const avg_best = (arr, n) => arr.sort((a, b) => a - b).slice(0, n).reduce((a, b) => a + b, 0) / n;
    const lowest_delta = (arr, d) => arr.sort((a, b) => a - b)[0] + d;

    const game_count = scoringRecord.length;

    const whs = getWHS(scoringRecord);
    console.log("WHS value:" + JSON.stringify(whs));

    return({whs: whs, scoringRecord: scoringRecord});


    // determine the correct calculation method based on the number of games played 
    function getWHS(scoringRecord){
        let srcd = JSON.parse(JSON.stringify(scoringRecord));
        console.log(srcd.length)
        srcd = srcd.map((x) => x.score_differential); //FEHER HIER
        console.log(JSON.stringify(srcd))
        switch(true){
            case(game_count <= 3):
                return lowest_delta(srcd, 2);
            case(game_count === 4):
                return lowest_delta(srcd, 1);
            case(game_count === 5):
                return lowest_delta(srcd, 0);
            case(game_count === 6):
                return avg_best(srcd, 2) + 1;
            case(game_count <= 8):
                return avg_best(srcd, 2);
            case(game_count <= 11):
                return avg_best(srcd, 3);
            case(game_count <= 14):
                return avg_best(srcd, 4);
            case(game_count <= 16):
                return avg_best(srcd, 5);
            case(game_count <= 18):
                return avg_best(srcd, 6);
            case(game_count === 19):
                return avg_best(srcd, 7);
            case(game_count === 20):
                return avg_best(srcd, 8);
            default:
                throw new Error("Invalid game count");
        }
    }
    /*
    // Berechnung der Ergebnisse der letzten 20 Spiele

    => Durchschnitt ermitteln 


    ### < 20 Spiele:
    anz S.  Gewertete Spiele                Score diff. Anpassung
    1 – 3 	Das niedrigste Ergebnis 	    -2,0
    4 	    Das niedrigste Ergebnis 	    -1,0
    5 	    Das niedrigste Ergebnis 	    keine
    6 	    Durchschnitt aus den besten 2 	-1,0
    7-8 	Durchschnitt aus den besten 2 	keine
    9-11 	Durchschnitt aus den besten 3 	keine
    12-14 	Durchschnitt aus den besten 4 	keine
    15-16 	Durchschnitt aus den besten 5 	keine
    17-18 	Durchschnitt aus den besten 6 	keine
    19 	    Durchschnitt aus den besten 7 	keine
    20 	    Durchschnitt aus den besten 8 	keine
    */
}


// Ensures no Value is greater than netto doubleboggy 
//returns the holes array with added value: doubleboggy
function calculateNettoDoubleboggy(holes, player_handicap = 54){

    //Currently only working with positive Handicap. 
    // Q: How is the data range for the Handicap internally defined (positive/negative)?
    player_handicap = player_handicap > 0? player_handicap : player_handicap * -1;
    player_handicap = Math.floor(player_handicap);
    //TODO: Anpassung an 9 Loch spiele: Handicap muss verringert werden. 

    //Order holes by difficulty, DESC
    holes.sort(function(a, b){return b.hdc - a.hdc});



    // Disperse handicap on holes
    let j = 0
    for(let i = player_handicap; i > 0; i--){
        // Property doubleboggy should exist 
        if(!holes[j].doubleboggy){holes[j].doubleboggy = holes[j].par + 2};
        if(holes[j].hdc == (18 -j)){
            holes[j].doubleboggy++;}
        //holes[j].doubleboggy++;

        if(j == holes.length - 1){
            j = 0
        } else {
            j++;
        }
    }
    return holes
}


//Calculates the couseDifferential for a game
//if stableford = true, The Stableford Point system will be used
function calculateCourseDifferential(gameData, HCI, stableford = false){

    const slope_rating = gameData.slope_rating;
    const course_rating = gameData.course_rating;
    const ppc = gameData.ppc;
    const prevHCI = HCI;
    const par = gameData.holes.reduce((a, b) => {return a + b.par}, 0);
    let handicapData = gameData.handicap_index;
    let unplayedNineHoleCorrection = 0;

    //Calculation of values that depent on the number of holes
    if(gameData.holes.length === 9){
        handicapData = Math.floor(handicapData / 2); // This is important for the course handicap
        unplayedNineHoleCorrection = nineHoleCorrection(prevHCI);
    }
    // When using course_handicap game 3 will calculate correctly but 2 will not, 
    // wehn using just the prevHCI its the other way around.
    const course_handicap = handicapData * (slope_rating/113) + (course_rating - par);
    const holes = calculateNettoDoubleboggy(gameData.holes, prevHCI);

    if(stableford){
        throw new Error("Stableford calculation not implemented");
    } else {
        const hits = holes.map((x) => Math.min(x.gbe, x.doubleboggy)); //Hit value used vor calculation
        const brutto_value = hits.reduce((a, b) => {return a + b}, 0);
        const course_differential = (113/slope_rating) * (brutto_value + unplayedNineHoleCorrection - course_rating - ppc)
        return Math.round( course_differential* 10) / 10  //round to on decimal
    }
}

// Calculates the correction for a 9 hole game
// Source: https://www.gcdw.de/club/aktuelles/nachrichten-einzelansicht/neu-in-2024-die-wertung-von-9-loch-turnieren.html
function nineHoleCorrection(HCPI){

    //Setup for easy Calculation (js is to stupid for float)
    HCPI += 5;
    HCPI *= 10;

    //Correction for missing 1 HCPI Point
    let SD = -14

    SD += HCPI < 0? Math.floor(HCPI * 0.5) : Math.floor(HCPI / 25) * 13 + Math.ceil(HCPI % 25 * 0.5)
    return SD /10
}

//EXPORT
export const whs_testpackage = {calculateCouseDifferential: calculateCourseDifferential, calculateNettoDoubleboggy, nineHoleCorrection, calculateWHS};
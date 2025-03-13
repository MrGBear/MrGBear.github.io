//Modul to test all unit tests
/* 
unit Test files should have the follwing structure:

import { it, assert } from '../../framework/test_util.js';

export function test_[name of the file](){
    Test code here
}
*/


//Import of unit Test
/* Example usage:

import test_[name of the file] from './[rel Path]/[name of the file].js';
-> import test_localstorage_store from './storage/localstorage_store.test.js';
*/

import { test_whs } from "./whs/test_whs.js";
import { test_calculate_one_game } from "./ega/ega_handler.test.js";
//Run the tests
function testall() {
    console.log("WHS:")
    //test_whs();

    console.log("EGA:")
    test_calculate_one_game();
}

//If you want to only test your current code: Comment the following line
testall();
import { it, assert } from '../../framework/test_util.js';
import { DataHandler } from '../../../code/datahandler.js';

export function test_datahandler(){
    const datahandler = new DataHandler();
    datahandler.addUser({"user_name":"testud"});
    console.log("testud:" + JSON.stringify(datahandler.getUsers()));

    /*
    it(`Dummy test 1`, () => {
        assert(false);
    });
*/
}


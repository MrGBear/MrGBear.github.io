import { it, assert } from '../../framework/test_util.js';


export function test_dummy(){
    it(`Dummy test 1`, () => {
        assert(false);
    });

    it(`Dummy test 2`, () => {
        assert(false);
    });
    it(`Dummy test 3`, () => {
        assert(true);
    });
}
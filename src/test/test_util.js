// Create test framework
/**
 * Describe the test and execute it
 * Errors will be caught and displayed in the console
 *
 * @param desc - description of the test
 * @param fn - test to execute
 */
function it(desc, fn) {
    try {
        fn();
        console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
        console.log('\n');
        console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
        console.error(error);
    }
}

/**
 * Throws an error if the condition is false
 * @param condition
 */
function assert(condition) {
    if (!condition) {
        throw new Error();
    }
}

// Export the test framework
window.it = it;
window.assert = assert;
/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(pathPlugin) {
	describe('symbols', () => {
		it.each([
			'PATH_PART',
			'GET_PATH_PART',
			'URL_PATH',
			'PARAMS',
			'PATH_UNCONSUMED'
		])('%s', (key) => {
			expect(typeof pathPlugin[key]).toBe('symbol');
		});
	});
};

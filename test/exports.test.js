/* --------------------
 * @overlook/plugin-path module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	pathPlugin = require('@overlook/plugin-path');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => {
	it('is an instance of Plugin class', () => {
		expect(pathPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(pathPlugin);
	});
});

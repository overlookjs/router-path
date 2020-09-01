/* --------------------
 * @overlook/plugin-path module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import pathPlugin, * as namedExports from '@overlook/plugin-path/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(pathPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(pathPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});

/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Route constructor
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const RoutePath = Route.extend(pathPlugin);

describe('RoutePath constructor', () => { // eslint-disable-line jest/lowercase-name
	it('initializes undefined [PATH_PART] property', () => {
		const route = new RoutePath();
		expect(Object.getOwnPropertySymbols(route)).toContain(PATH_PART);
		expect(route[PATH_PART]).toBeUndefined();
	});
});

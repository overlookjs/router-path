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

const PathRoute = Route.extend(pathPlugin);

describe('PathRoute constructor', () => {
	it('initializes undefined [PATH_PART] property', () => {
		const route = new PathRoute();
		expect(Object.getOwnPropertySymbols(route)).toContain(PATH_PART);
		expect(route[PATH_PART]).toBeUndefined();
	});
});

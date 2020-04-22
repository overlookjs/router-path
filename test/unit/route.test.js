/* --------------------
 * @overlook/router-path module
 * Tests
 * Route constructor
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	routerPath = require('../../index.js'),
	{PATH_PART} = routerPath;

// Init
require('../support/index.js');

// Tests

const RoutePath = Route.extend(routerPath);

describe('RoutePath constructor', () => { // eslint-disable-line jest/lowercase-name
	it('initializes undefined [PATH_PART] property', () => {
		const route = new RoutePath();
		expect(Object.getOwnPropertySymbols(route)).toContain(PATH_PART);
		expect(route[PATH_PART]).toBeUndefined();
	});
});

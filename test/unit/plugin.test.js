/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Extension function
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pluginMatch = require('@overlook/plugin-match'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	pathPlugin = require('@overlook/plugin-path');

// Init
require('../support/index.js');

// Tests

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an object', () => {
		expect(pathPlugin).toBeObject();
	});

	describe('when passed to `Route.extend()`', () => {
		let PathRoute;
		beforeEach(() => {
			PathRoute = Route.extend(pathPlugin);
		});

		it('returns subclass of Route', () => {
			expect(PathRoute).toBeFunction();
			expect(PathRoute.prototype).toBeInstanceOf(Route);
		});

		it('returns subclass of RouteMatch', () => {
			expect(PathRoute).toBeFunction();
			const RouteMatch = Route.extend(pluginMatch);
			expect(PathRoute.prototype).toBeInstanceOf(RouteMatch);
		});

		it('returns subclass of RouteOrdered', () => {
			expect(PathRoute).toBeFunction();
			const RouteOrdered = Route.extend(pluginMatch).extend(pluginOrdered);
			expect(PathRoute.prototype).toBeInstanceOf(RouteOrdered);
		});
	});

	describe('exports symbols', () => {
		it.each([
			['PATH_PART'],
			['GET_PATH_PART'],
			['PARAMS'],
			['PATH_UNCONSUMED']
		])('%s', (key) => {
			expect(typeof pathPlugin[key]).toBe('symbol');
		});
	});
});

/* --------------------
 * @overlook/router-path module
 * Tests
 * Extension function
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pluginMatch = require('@overlook/plugin-match'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	routerPath = require('@overlook/router-path');

// Init
require('../support/index.js');

// Tests

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an object', () => {
		expect(routerPath).toBeObject();
	});

	describe('when passed to `Route.extend()`', () => {
		let RoutePath;
		beforeEach(() => {
			RoutePath = Route.extend(routerPath);
		});

		it('returns subclass of Route', () => {
			expect(RoutePath).toBeFunction();
			expect(RoutePath.prototype).toBeInstanceOf(Route);
		});

		it('returns subclass of RouteMatch', () => {
			expect(RoutePath).toBeFunction();
			const RouteMatch = Route.extend(pluginMatch);
			expect(RoutePath.prototype).toBeInstanceOf(RouteMatch);
		});

		it('returns subclass of RouteOrdered', () => {
			expect(RoutePath).toBeFunction();
			const RouteOrdered = Route.extend(pluginMatch).extend(pluginOrdered);
			expect(RoutePath.prototype).toBeInstanceOf(RouteOrdered);
		});
	});

	describe('exports symbols', () => {
		it.each([
			['PATH_PART'],
			['PATH_UNCONSUMED'],
			['PARAMS']
		])('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});
});

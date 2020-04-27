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
		let RoutePath;
		beforeEach(() => {
			RoutePath = Route.extend(pathPlugin);
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
			['PATH'],
			['PATH_PART'],
			['PARAMS']
		])('%s', (key) => {
			expect(typeof pathPlugin[key]).toBe('symbol');
		});
	});
});

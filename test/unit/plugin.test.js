/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Extension function
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	pluginMatch = require('@overlook/plugin-match'),
	pluginOrder = require('@overlook/plugin-order'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	pathPlugin = require('@overlook/plugin-path');

// Init
require('../support/index.js');

// Tests

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(pathPlugin).toBeInstanceOf(Plugin);
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

		it('returns subclass of RouteOrder', () => {
			expect(PathRoute).toBeFunction();
			const RouteOrder = Route.extend(pluginMatch).extend(pluginOrder);
			expect(PathRoute.prototype).toBeInstanceOf(RouteOrder);
		});

		it('returns subclass of RouteOrdered', () => {
			expect(PathRoute).toBeFunction();
			const RouteOrdered = Route.extend(pluginMatch).extend(pluginOrder).extend(pluginOrdered);
			expect(PathRoute.prototype).toBeInstanceOf(RouteOrdered);
		});
	});
});

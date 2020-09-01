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

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(pathPlugin).toBeInstanceOf(Plugin);
	});

	describe('when passed to `Route.extend()`', () => {
		let PathRoute;
		beforeEach(() => {
			PathRoute = Route.extend(pathPlugin);
		});

		it('returns subclass of Route', () => {
			expect(PathRoute).toBeSubclassOf(Route);
		});

		it('returns subclass of RouteMatch', () => {
			const RouteMatch = Route.extend(pluginMatch);
			expect(PathRoute).toBeSubclassOf(RouteMatch);
		});

		it('returns subclass of RouteOrder', () => {
			const RouteOrder = Route.extend(pluginMatch).extend(pluginOrder);
			expect(PathRoute).toBeSubclassOf(RouteOrder);
		});

		it('returns subclass of RouteOrdered', () => {
			const RouteOrdered = Route.extend(pluginMatch).extend(pluginOrder).extend(pluginOrdered);
			expect(PathRoute).toBeSubclassOf(RouteOrdered);
		});
	});
});

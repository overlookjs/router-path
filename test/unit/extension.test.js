/* --------------------
 * @overlook/router-path module
 * Tests
 * Extension function
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	routerMatch = require('@overlook/router-match'),
	routerOrdered = require('@overlook/router-ordered'),
	routerPath = require('../../index.js'),
	{IDENTIFIER} = routerPath;

// Init
require('../support/index.js');

// Tests

describe('Extension', () => { // eslint-disable-line jest/lowercase-name
	it('is a function', () => {
		expect(routerPath).toBeFunction();
	});

	it('returns a subclass of input', () => {
		const RoutePath = routerPath(Route);
		expect(RoutePath).toBeFunction();
		expect(RoutePath.prototype).toBeInstanceOf(Route);
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
			const RouteMatch = Route.extend(routerMatch);
			expect(RoutePath.prototype).toBeInstanceOf(RouteMatch);
		});

		it('returns subclass of RouteOrdered', () => {
			expect(RoutePath).toBeFunction();
			const RouteOrdered = Route.extend(routerMatch).extend(routerOrdered);
			expect(RoutePath.prototype).toBeInstanceOf(RouteOrdered);
		});

		it('has identifier symbol', () => {
			expect(RoutePath[IDENTIFIER]).toBeTrue();
		});

		it('class instance has identifier symbol', () => {
			const route = new RoutePath();
			expect(route[IDENTIFIER]).toBeTrue();
		});

		it('has router-match identifier symbol', () => {
			expect(RoutePath[routerMatch.IDENTIFIER]).toBeTrue();
		});

		it('class instance has router-match identifier symbol', () => {
			const route = new RoutePath();
			expect(route[routerMatch.IDENTIFIER]).toBeTrue();
		});

		it('has router-ordered identifier symbol', () => {
			expect(RoutePath[routerOrdered.IDENTIFIER]).toBeTrue();
		});

		it('class instance has router-ordered identifier symbol', () => {
			const route = new RoutePath();
			expect(route[routerOrdered.IDENTIFIER]).toBeTrue();
		});
	});

	describe('exports symbols', () => {
		it.each([
			['IDENTIFIER'],
			['PATH_PART'],
			['PATH_UNCONSUMED'],
			['PARAMS']
		])('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});

	describe('exports symbols from router-match', () => {
		const symbolKeys = Object.getOwnPropertySymbols(routerMatch);
		it.each(symbolKeys.map(key => [key]))('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});

	describe('exports symbols from router-ordered', () => {
		const symbolKeys = Object.getOwnPropertySymbols(routerOrdered);
		it.each(symbolKeys.map(key => [key]))('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});
});

/* --------------------
 * @overlook/router-path module
 * Tests
 * Extension function
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	each = require('jest-each').default,
	routerMatch = require('@overlook/router-match'),
	routerOrdered = require('@overlook/router-ordered'),
	routerPath = require('../../index'),
	{identifier} = routerPath;

// Init
require('../support');

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
			expect(RoutePath[identifier]).toBeTrue();
		});

		it('class instance has identifier symbol', () => {
			const route = new RoutePath();
			expect(route[identifier]).toBeTrue();
		});

		it('has router-match identifier symbol', () => {
			expect(RoutePath[routerMatch.identifier]).toBeTrue();
		});

		it('class instance has router-match identifier symbol', () => {
			const route = new RoutePath();
			expect(route[routerMatch.identifier]).toBeTrue();
		});

		it('has router-ordered identifier symbol', () => {
			expect(RoutePath[routerOrdered.identifier]).toBeTrue();
		});

		it('class instance has router-ordered identifier symbol', () => {
			const route = new RoutePath();
			expect(route[routerOrdered.identifier]).toBeTrue();
		});
	});

	describe('exports symbols', () => {
		each([
			['identifier'],
			['PATH_PART'],
			['PATH_UNCONSUMED'],
			['PARAMS']
		]).it('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});

	describe('exports symbols from router-match', () => {
		const symbolKeys = Object.getOwnPropertySymbols(routerMatch);
		each(symbolKeys.map(key => [key])).it('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});

	describe('exports symbols from router-ordered', () => {
		const symbolKeys = Object.getOwnPropertySymbols(routerOrdered);
		each(symbolKeys.map(key => [key])).it('%s', (key) => {
			expect(typeof routerPath[key]).toBe('symbol');
		});
	});
});

/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [IS_BEFORE] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{IS_INITIALIZED} = Route,
	{IS_BEFORE} = require('@overlook/plugin-ordered'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const RoutePath = Route.extend(pathPlugin);

describe('`[IS_BEFORE]()`', () => {
	it('comparing path route to non-path route, returns null', () => {
		const route = new RoutePath(),
			route2 = new Route();
		const ret = route[IS_BEFORE](route2);
		expect(ret).toBeNull();
	});

	const PATH_PARTS = {
		named: 'abc',
		param: ':id',
		wildcard: '*'
	};

	describe.each([
		['named', [
			['named', null],
			['param', true],
			['wildcard', true]
		]],
		['param', [
			['named', false],
			['param', null],
			['wildcard', true]
		]],
		['wildcard', [
			['named', false],
			['param', false],
			['wildcard', null]
		]]
	])('comparing %s route to', (type1, comparisons) => {
		it.each(comparisons)('%s route returns %s', (type2, expected) => {
			const pathPart1 = PATH_PARTS[type1],
				pathPart2 = PATH_PARTS[type2];
			const route1 = new RoutePath({[PATH_PART]: pathPart1}),
				route2 = new RoutePath({[PATH_PART]: pathPart2});
			route1[IS_INITIALIZED] = true;
			route2[IS_INITIALIZED] = true;

			const ret = route1[IS_BEFORE](route2);
			expect(ret).toBe(expected);
		});
	});
});

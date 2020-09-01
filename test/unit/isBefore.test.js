/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [IS_BEFORE] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, IS_BEFORE} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

describe('`[IS_BEFORE]()`', () => {
	it('comparing path route to non-path route, returns undefined', () => {
		const route = new PathRoute(),
			route2 = new Route();
		const ret = route[IS_BEFORE](route2);
		expect(ret).toBeUndefined();
	});

	const PATH_PARTS = {
		named: 'abc',
		param: ':id',
		wildcard: '*'
	};

	describe.each([
		['named', [
			['named', undefined],
			['param', true],
			['wildcard', true]
		]],
		['param', [
			['named', false],
			['param', undefined],
			['wildcard', true]
		]],
		['wildcard', [
			['named', false],
			['param', false],
			['wildcard', undefined]
		]]
	])('comparing %s route to', (type1, comparisons) => {
		it.each(comparisons)('%s route returns %s', (type2, expected) => {
			const pathPart1 = PATH_PARTS[type1],
				pathPart2 = PATH_PARTS[type2];
			const route1 = new PathRoute({[PATH_PART]: pathPart1}),
				route2 = new PathRoute({[PATH_PART]: pathPart2});

			const ret = route1[IS_BEFORE](route2);
			expect(ret).toBe(expected);
		});
	});
});

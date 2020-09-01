/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Errors integration tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, URL_PATH, PATH, HANDLE_ROUTE} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

describe('Errors', () => {
	let root;
	beforeEach(async () => {
		root = new PathRoute();
		const child1 = new PathRoute({name: 'abc'});
		const child2 = new PathRoute({name: 'view', [PATH_PART]: ':def'});
		const child3 = new PathRoute({name: 'ghi'});
		root.attachChild(child1);
		child1.attachChild(child2);
		child2.attachChild(child3);

		child3[HANDLE_ROUTE] = () => {
			throw new Error('oops');
		};

		await root.init();
	});

	it('adds URL path to error message', () => {
		expect(() => root.handle({[PATH]: '/abc/123/ghi'})).toThrow(
			new Error('oops (router path /abc/view/ghi) (URL path /abc/:def/ghi)')
		);
	});

	it('records URL path as prop on error', () => {
		let err;
		try {
			root.handle({[PATH]: '/abc/123/ghi'});
		} catch (e) {
			err = e;
		}

		expect(err[URL_PATH]).toBe('/abc/:def/ghi');
	});
});

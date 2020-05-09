/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [INIT_ROUTE] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, GET_PATH_PART} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

describe('init', () => {
	let route;
	beforeEach(() => {
		route = new PathRoute();
	});

	it("[PATH_PART] defaults to '' if is root route", async () => {
		await route.init();
		expect(route[PATH_PART]).toBe('');
	});

	it("[PATH_PART] defaults to '' if no path route above", async () => {
		const parent = new Route();
		parent.attachChild(route);
		await parent.init();
		expect(route[PATH_PART]).toBe('');
	});

	it('[PATH_PART] defined by [GET_PATH_PART]()', async () => {
		const parent = new Route();
		parent.attachChild(route);
		route[GET_PATH_PART] = () => 'abc';
		await parent.init();
		expect(route[PATH_PART]).toBe('abc');
	});

	it('inherits [PATH_PART] from .name', async () => {
		const parent = new PathRoute();
		parent.attachChild(route);
		route.name = 'abc';
		await parent.init();
		expect(route[PATH_PART]).toBe('abc');
	});

	it('throws error if [PATH_PART] is undefined and another path route above', async () => {
		const parent = new PathRoute();
		parent.attachChild(route);
		await expect(parent.init()).rejects.toThrow(
			new Error('[plugin-path.PATH_PART] must be set on a path route (router path /?)')
		);
	});

	it('throws error if [PATH_PART] is null', async () => {
		route[PATH_PART] = null;
		await expect(route.init()).rejects.toThrow(
			new Error('[plugin-path.PATH_PART] must be set on a path route (router path /)')
		);
	});

	it('throws error if [PATH_PART] is not a string', async () => {
		route[PATH_PART] = 123;
		await expect(route.init()).rejects.toThrow(
			new Error('[plugin-path.PATH_PART] must be a string (router path /)')
		);
	});
});

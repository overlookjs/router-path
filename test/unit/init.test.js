/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [INIT_ROUTE] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, GET_PATH_PART, URL_PATH} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

describe('init', () => {
	let route;
	beforeEach(() => {
		route = new PathRoute();
	});

	describe('[PATH_PART]', () => {
		it("defaults to '' if is root route", async () => {
			await route.init();
			expect(route[PATH_PART]).toBe('');
		});

		it("defaults to '' if no path route above", async () => {
			const parent = new Route();
			parent.attachChild(route);
			await parent.init();
			expect(route[PATH_PART]).toBe('');
		});

		it('defined by [GET_PATH_PART]()', async () => {
			const parent = new Route();
			parent.attachChild(route);
			route[GET_PATH_PART] = () => 'abc';
			await parent.init();
			expect(route[PATH_PART]).toBe('abc');
		});

		it('inherited from .name', async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			route.name = 'abc';
			await parent.init();
			expect(route[PATH_PART]).toBe('abc');
		});

		it('throws error if undefined and another path route above', async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			await expect(parent.init()).rejects.toThrow(
				new Error('[plugin-path.PATH_PART] must be set on a path route (router path /?)')
			);
		});

		it('throws error if null', async () => {
			route[PATH_PART] = null;
			await expect(route.init()).rejects.toThrow(
				new Error('[plugin-path.PATH_PART] must be set on a path route (router path /)')
			);
		});

		it('throws error if not a string', async () => {
			route[PATH_PART] = 123;
			await expect(route.init()).rejects.toThrow(
				new Error('[plugin-path.PATH_PART] must be a string (router path /)')
			);
		});
	});

	describe('[URL_PATH]', () => {
		it("is '/' for root", async () => {
			await route.init();
			expect(route[URL_PATH]).toBe('/');
		});

		it("is '/*' for wildcard root", async () => {
			route[PATH_PART] = '*';
			await route.init();
			expect(route[URL_PATH]).toBe('/*');
		});

		it("is '/*name' for named wildcard root", async () => {
			route[PATH_PART] = '*abc';
			await route.init();
			expect(route[URL_PATH]).toBe('/*abc');
		});

		it("is '/name' for named route", async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			route.name = 'abc';
			await parent.init();
			expect(route[URL_PATH]).toBe('/abc');
		});

		it("is '/:param' for param route", async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			route.name = ':abc';
			await parent.init();
			expect(route[URL_PATH]).toBe('/:abc');
		});

		it("is '/*' for wildcard route", async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			route.name = '*';
			await parent.init();
			expect(route[URL_PATH]).toBe('/*');
		});

		it("is '/*name' for named wildcard route", async () => {
			const parent = new PathRoute();
			parent.attachChild(route);
			route.name = '*abc';
			await parent.init();
			expect(route[URL_PATH]).toBe('/*abc');
		});

		it('is inherited from parent', async () => {
			const root = new PathRoute();
			const child1 = new PathRoute({name: 'abc'});
			const child2 = new PathRoute({name: ':def'});
			const child3 = new PathRoute({name: 'ghi'});
			root.attachChild(child1);
			child1.attachChild(child2);
			child2.attachChild(child3);
			child3.attachChild(route);
			route.name = '*';
			await root.init();
			expect(route[URL_PATH]).toBe('/abc/:def/ghi/*');
		});
	});
});

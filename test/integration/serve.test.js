/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Tests works with `@overlook/plugin-serve-http`
 * ------------------*/

'use strict';

// Modules
const http = require('http'),
	Route = require('@overlook/route'),
	httpPlugin = require('@overlook/plugin-serve-http'),
	{PORT} = httpPlugin,
	{START, STOP} = require('@overlook/plugin-start'),
	{HANDLE_ROUTE} = require('@overlook/plugin-match'),
	axios = require('axios'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, PARAMS} = pathPlugin;

// Init
require('../support/index.js');

const spy = jest.fn;

// Constants
const TEST_PORT = 5000;

// Set-up

// Define route tree
const PathRoute = Route.extend(pathPlugin),
	RootRoute = PathRoute.extend(httpPlugin);

// Root
const root = new RootRoute({
	[HANDLE_ROUTE]: spy(req => req.res.end(`root serving ${req.url}`))
});

// Children
const childStatic = new PathRoute({
	[PATH_PART]: 'a',
	[HANDLE_ROUTE]: spy(req => req.res.end(`childStatic serving ${req.url}`))
});
root.attachChild(childStatic);

const childParam = new PathRoute({
	[PATH_PART]: ':prop',
	[HANDLE_ROUTE]: spy(req => req.res.end(`childParam serving ${req.url}`))
});
root.attachChild(childParam);

const childWildcard = new PathRoute({
	[PATH_PART]: '*',
	[HANDLE_ROUTE]: spy(req => req.res.end(`childWildcard serving ${req.url}`))
});
root.attachChild(childWildcard);

// Init router
root.init();
root[PORT] = TEST_PORT;

// Tests

beforeEach(async () => {
	jest.clearAllMocks();
	await root[START]();
});

afterEach(async () => {
	await root[STOP]();
});

describe('Serving with @overlook/plugin-serve-http', () => { // eslint-disable-line jest/lowercase-name
	describe('root', () => {
		let axiosRes;
		beforeEach(async () => {
			axiosRes = await axios(`http://localhost:${TEST_PORT}/`);
		});

		it('calls [HANDLE_ROUTE] on route', () => {
			expect(root[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
		});

		it('does not call [HANDLE_ROUTE] on children', () => {
			expect(childStatic[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childParam[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childWildcard[HANDLE_ROUTE]).not.toHaveBeenCalled();
		});

		it('calls [HANDLE_ROUTE] with req', () => {
			expect(root[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
			const args = root[HANDLE_ROUTE].mock.calls[0];
			expect(args).toBeArrayOfSize(1);
			const req = args[0];
			expect(req).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req.method', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.method).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req.url', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.url).toBe('/');
		});

		it('calls [HANDLE_ROUTE] with empty req[PARAMS]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({});
		});

		it('calls [HANDLE_ROUTE] with req.res', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.res).toBeInstanceOf(http.ServerResponse);
		});

		it('returns response to client', () => {
			expect(axiosRes.status).toBe(200);
			expect(axiosRes.data).toBe('root serving /');
		});
	});

	describe('static child', () => {
		let axiosRes;
		beforeEach(async () => {
			axiosRes = await axios(`http://localhost:${TEST_PORT}/a`);
		});

		it('calls [HANDLE_ROUTE] on child', () => {
			expect(childStatic[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
		});

		it('does not call [HANDLE_ROUTE] on root or other children', () => {
			expect(root[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childParam[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childWildcard[HANDLE_ROUTE]).not.toHaveBeenCalled();
		});

		it('calls [HANDLE_ROUTE] with req', () => {
			expect(childStatic[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
			const args = childStatic[HANDLE_ROUTE].mock.calls[0];
			expect(args).toBeArrayOfSize(1);
			const req = args[0];
			expect(req).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req.method', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.method).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req.url', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.url).toBe('/a');
		});

		it('calls [HANDLE_ROUTE] with empty req[PARAMS]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({});
		});

		it('calls [HANDLE_ROUTE] with req.res', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.res).toBeInstanceOf(http.ServerResponse);
		});

		it('returns response to client', () => {
			expect(axiosRes.status).toBe(200);
			expect(axiosRes.data).toBe('childStatic serving /a');
		});
	});

	describe('param child', () => {
		let axiosRes;
		beforeEach(async () => {
			axiosRes = await axios(`http://localhost:${TEST_PORT}/123`);
		});

		it('calls [HANDLE_ROUTE] on child', () => {
			expect(childParam[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
		});

		it('does not call [HANDLE_ROUTE] on root or other children', () => {
			expect(root[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childStatic[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childWildcard[HANDLE_ROUTE]).not.toHaveBeenCalled();
		});

		it('calls [HANDLE_ROUTE] with req', () => {
			expect(childParam[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
			const args = childParam[HANDLE_ROUTE].mock.calls[0];
			expect(args).toBeArrayOfSize(1);
			const req = args[0];
			expect(req).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req.method', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.method).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req.url', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.url).toBe('/123');
		});

		it('calls [HANDLE_ROUTE] with req[PARAMS]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({prop: '123'});
		});

		it('calls [HANDLE_ROUTE] with req.res', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.res).toBeInstanceOf(http.ServerResponse);
		});

		it('returns response to client', () => {
			expect(axiosRes.status).toBe(200);
			expect(axiosRes.data).toBe('childParam serving /123');
		});
	});

	describe('wildcard child', () => {
		let axiosRes;
		beforeEach(async () => {
			axiosRes = await axios(`http://localhost:${TEST_PORT}/123/456`);
		});

		it('calls [HANDLE_ROUTE] on child', () => {
			expect(childWildcard[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
		});

		it('does not call [HANDLE_ROUTE] on root or other children', () => {
			expect(root[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childStatic[HANDLE_ROUTE]).not.toHaveBeenCalled();
			expect(childParam[HANDLE_ROUTE]).not.toHaveBeenCalled();
		});

		it('calls [HANDLE_ROUTE] with req', () => {
			expect(childWildcard[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
			const args = childWildcard[HANDLE_ROUTE].mock.calls[0];
			expect(args).toBeArrayOfSize(1);
			const req = args[0];
			expect(req).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req.method', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.method).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req.url', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.url).toBe('/123/456');
		});

		it('calls [HANDLE_ROUTE] with req[PARAMS]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({'*': '123/456'});
		});

		it('calls [HANDLE_ROUTE] with req.res', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req.res).toBeInstanceOf(http.ServerResponse);
		});

		it('returns response to client', () => {
			expect(axiosRes.status).toBe(200);
			expect(axiosRes.data).toBe('childWildcard serving /123/456');
		});
	});
});

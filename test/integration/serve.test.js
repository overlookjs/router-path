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
	{PORT, REQ, RES, URL, METHOD} = httpPlugin,
	{START, STOP} = require('@overlook/plugin-start'),
	{HANDLE_ROUTE} = require('@overlook/plugin-match'),
	{REQ_TYPE, PATH} = require('@overlook/plugin-request'),
	axios = require('axios'),
	once = require('once'),
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
	[HANDLE_ROUTE]: spy(req => req[RES].end(`root serving ${req[URL]}`))
});

// Children
const childStatic = new PathRoute({
	[PATH_PART]: 'a',
	[HANDLE_ROUTE]: spy(req => req[RES].end(`childStatic serving ${req[URL]}`))
});
root.attachChild(childStatic);

const childParam = new PathRoute({
	[PATH_PART]: ':prop',
	[HANDLE_ROUTE]: spy(req => req[RES].end(`childParam serving ${req[URL]}`))
});
root.attachChild(childParam);

const childWildcard = new PathRoute({
	[PATH_PART]: '*',
	[HANDLE_ROUTE]: spy(req => req[RES].end(`childWildcard serving ${req[URL]}`))
});
root.attachChild(childWildcard);

// Tests

beforeEach(once(async () => {
	// Init router
	root[PORT] = TEST_PORT;
	await root.init();
}));

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
			expect(req).toBeObject();
		});

		it('calls [HANDLE_ROUTE] with req[REQ_TYPE]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ_TYPE]).toBe('HTTP');
		});

		it('calls [HANDLE_ROUTE] with req[METHOD]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[METHOD]).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req[URL]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[URL]).toBe('/');
		});

		it('calls [HANDLE_ROUTE] with req[PATH]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PATH]).toBe('/');
		});

		it('calls [HANDLE_ROUTE] with empty req[PARAMS]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({});
		});

		it('calls [HANDLE_ROUTE] with req[REQ]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ]).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req[RES]', () => {
			const req = root[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[RES]).toBeInstanceOf(http.ServerResponse);
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
			expect(req).toBeObject();
		});

		it('calls [HANDLE_ROUTE] with req[REQ_TYPE]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ_TYPE]).toBe('HTTP');
		});

		it('calls [HANDLE_ROUTE] with req[METHOD]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[METHOD]).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req[URL]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[URL]).toBe('/a');
		});

		it('calls [HANDLE_ROUTE] with req[PATH]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PATH]).toBe('/a');
		});

		it('calls [HANDLE_ROUTE] with empty req[PARAMS]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({});
		});

		it('calls [HANDLE_ROUTE] with req[REQ]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ]).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req[RES]', () => {
			const req = childStatic[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[RES]).toBeInstanceOf(http.ServerResponse);
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
			expect(req).toBeObject();
		});

		it('calls [HANDLE_ROUTE] with req[REQ_TYPE]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ_TYPE]).toBe('HTTP');
		});

		it('calls [HANDLE_ROUTE] with req[METHOD]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[METHOD]).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req[URL]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[URL]).toBe('/123');
		});

		it('calls [HANDLE_ROUTE] with req[PATH]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PATH]).toBe('/123');
		});

		it('calls [HANDLE_ROUTE] with req[PARAMS]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({prop: '123'});
		});

		it('calls [HANDLE_ROUTE] with req[REQ]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ]).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req[RES]', () => {
			const req = childParam[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[RES]).toBeInstanceOf(http.ServerResponse);
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
			expect(req).toBeObject();
		});

		it('calls [HANDLE_ROUTE] with req[REQ_TYPE]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ_TYPE]).toBe('HTTP');
		});

		it('calls [HANDLE_ROUTE] with req[METHOD]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[METHOD]).toBe('GET');
		});

		it('calls [HANDLE_ROUTE] with req[URL]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[URL]).toBe('/123/456');
		});

		it('calls [HANDLE_ROUTE] with req[PATH]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PATH]).toBe('/123/456');
		});

		it('calls [HANDLE_ROUTE] with req[PARAMS]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[PARAMS]).toEqual({'*': '123/456'});
		});

		it('calls [HANDLE_ROUTE] with req[REQ]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[REQ]).toBeInstanceOf(http.IncomingMessage);
		});

		it('calls [HANDLE_ROUTE] with req[RES]', () => {
			const req = childWildcard[HANDLE_ROUTE].mock.calls[0][0];
			expect(req[RES]).toBeInstanceOf(http.ServerResponse);
		});

		it('returns response to client', () => {
			expect(axiosRes.status).toBe(200);
			expect(axiosRes.data).toBe('childWildcard serving /123/456');
		});
	});
});

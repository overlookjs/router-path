/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [HANDLE_MATCH] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = require('@overlook/plugin-match'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH, PARAMS} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

describe('[HANDLE_MATCH]', () => {
	describe.each([
		['exact', true, 'HANDLE_ROUTE', HANDLE_ROUTE],
		['non-exact', false, 'HANDLE_CHILDREN', HANDLE_CHILDREN]
	])('%s match', (testName, exact, methodName, methodKey) => {
		describe(`[${methodName}] returns non-null`, () => {
			let route, handlerPath, handlerParams;
			beforeEach(() => {
				route = new PathRoute({
					[methodKey](req) {
						handlerPath = req[PATH];
						handlerParams = req[PARAMS];
						return true;
					}
				});
			});

			describe(`sets req[PATH] before calling [${methodName}]`, () => {
				it('when undefined', () => {
					route[HANDLE_MATCH](
						{url: 'abc/def'},
						{exact, pathConsumed: 'abc/'}
					);
					expect(handlerPath).toBe('def');
				});

				it('when defined already', () => {
					route[HANDLE_MATCH](
						{url: 'abc/def/ghi', [PATH]: 'def/ghi'},
						{exact, pathConsumed: 'def/'}
					);
					expect(handlerPath).toBe('ghi');
				});
			});

			describe(`sets req[PARAMS] before calling [${methodName}]`, () => {
				it('when undefined', () => {
					const params = {id: 'abc'};
					route[HANDLE_MATCH](
						{url: 'abc/def'},
						{exact, pathConsumed: 'abc/', params}
					);
					expect(handlerParams).not.toBe(params); // Input params not mutated
					expect(handlerParams).toEqual({id: 'abc'});
				});

				it('when defined', () => {
					route[HANDLE_MATCH](
						{url: 'abc/def', [PARAMS]: {existing: 'x'}},
						{exact, pathConsumed: 'abc/', params: {id: 'abc'}}
					);
					expect(handlerParams).toEqual({existing: 'x', id: 'abc'});
				});
			});
		});

		describe(`[${methodName}] returns null`, () => {
			let route;
			beforeEach(() => {
				route = new PathRoute({
					[methodKey]() {
						return null;
					}
				});
			});

			describe(`resets req[PATH] after calling [${methodName}]`, () => {
				it('when undefined', () => {
					const req = {url: 'abc/def'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/'});
					expect(req[PATH]).toBeUndefined();
				});

				it('when defined already', () => {
					const req = {url: 'abc/def/ghi', [PATH]: 'def/ghi'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/'});
					expect(req[PATH]).toBe('def/ghi');
				});
			});

			describe(`resets req[PARAMS] after calling [${methodName}]`, () => {
				it('when undefined', () => {
					const req = {url: 'abc/def'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/', params: {id: 'abc'}});
					expect(req[PARAMS]).toBeUndefined();
				});

				it('when defined', () => {
					const oldParams = {existing: 'x'};
					const req = {url: 'abc/def', [PARAMS]: oldParams};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/', params: {id: 'abc'}});
					expect(req[PARAMS]).toBe(oldParams);
				});
			});
		});
	});
});

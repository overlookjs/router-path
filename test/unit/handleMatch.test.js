/* --------------------
 * @overlook/router-path module
 * Tests
 * [HANDLE_MATCH] method
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	each = require('jest-each').default,
	routerPath = require('../../index'),
	{HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN, PATH_UNCONSUMED, PARAMS} = routerPath;

// Init
require('../support');

// Tests

const RoutePath = Route.extend(routerPath);

describe('[HANDLE_MATCH]', () => {
	each([
		['exact', true, 'HANDLE_ROUTE', HANDLE_ROUTE],
		['non-exact', false, 'HANDLE_CHILDREN', HANDLE_CHILDREN]
	]).describe('%s match', (testName, exact, methodName, methodKey) => {
		describe(`[${methodName}] returns non-null`, () => {
			let route, handlerPathUnconsumed, handlerParams;
			beforeEach(() => {
				route = new RoutePath({
					[methodKey](req) {
						handlerPathUnconsumed = req[PATH_UNCONSUMED];
						handlerParams = req[PARAMS];
						return true;
					}
				});
			});

			describe(`sets req[PATH_UNCONSUMED] before calling [${methodName}]`, () => {
				it('when undefined', () => {
					route[HANDLE_MATCH](
						{path: 'abc/def'},
						{exact, pathConsumed: 'abc/'}
					);
					expect(handlerPathUnconsumed).toBe('def');
				});

				it('when defined already', () => {
					route[HANDLE_MATCH](
						{path: 'abc/def/ghi', [PATH_UNCONSUMED]: 'def/ghi'},
						{exact, pathConsumed: 'def/'}
					);
					expect(handlerPathUnconsumed).toBe('ghi');
				});
			});

			describe(`sets req[PARAMS] before calling [${methodName}]`, () => {
				it('when undefined', () => {
					const params = {id: 'abc'};
					route[HANDLE_MATCH](
						{path: 'abc/def'},
						{exact, pathConsumed: 'abc/', params}
					);
					expect(handlerParams).not.toBe(params); // Input params not mutated
					expect(handlerParams).toEqual({id: 'abc'});
				});

				it('when defined', () => {
					route[HANDLE_MATCH](
						{path: 'abc/def', [PARAMS]: {existing: 'x'}},
						{exact, pathConsumed: 'abc/', params: {id: 'abc'}}
					);
					expect(handlerParams).toEqual({existing: 'x', id: 'abc'});
				});
			});
		});

		describe(`[${methodName}] returns null`, () => {
			let route;
			beforeEach(() => {
				route = new RoutePath({
					[methodKey]() {
						return null;
					}
				});
			});

			describe(`resets req[PATH_UNCONSUMED] after calling [${methodName}]`, () => {
				it('when undefined', () => {
					const req = {path: 'abc/def'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/'});
					expect(req[PATH_UNCONSUMED]).toBeUndefined();
				});

				it('when defined already', () => {
					const req = {path: 'abc/def/ghi', [PATH_UNCONSUMED]: 'def/ghi'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/'});
					expect(req[PATH_UNCONSUMED]).toBe('def/ghi');
				});
			});

			describe(`resets req[PARAMS] after calling [${methodName}]`, () => {
				it('when undefined', () => {
					const req = {path: 'abc/def'};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/', params: {id: 'abc'}});
					expect(req[PARAMS]).toBeUndefined();
				});

				it('when defined', () => {
					const oldParams = {existing: 'x'};
					const req = {path: 'abc/def', [PARAMS]: oldParams};
					route[HANDLE_MATCH](req, {exact, pathConsumed: 'abc/', params: {id: 'abc'}});
					expect(req[PARAMS]).toBe(oldParams);
				});
			});
		});
	});
});

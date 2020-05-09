/* --------------------
 * @overlook/plugin-path module
 * Tests
 * Matching integration tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{HANDLE_ROUTE} = require('@overlook/plugin-match'),
	{PATH} = require('@overlook/plugin-request'),
	once = require('once'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH_PART, PARAMS} = pathPlugin;

// Init
require('../support/index.js');

const spy = jest.fn;

// Set-up

// Define route tree
const PathRoute = Route.extend(pathPlugin);

// Root
const router = new PathRoute({[HANDLE_ROUTE]: spy(() => true)});

// Children
const routeA = new PathRoute({[PATH_PART]: 'a', [HANDLE_ROUTE]: spy(() => true)});
router.attachChild(routeA);

const routeB = new PathRoute({[PATH_PART]: 'b', [HANDLE_ROUTE]: spy(() => true)});
router.attachChild(routeB);

const routeP = new PathRoute({[PATH_PART]: ':paramP', [HANDLE_ROUTE]: spy(() => true)});
router.attachChild(routeP);

const routeW = new PathRoute({[PATH_PART]: '*', [HANDLE_ROUTE]: spy(() => true)});
router.attachChild(routeW);

// Children of named route
const routeAC = new PathRoute({[PATH_PART]: 'c', [HANDLE_ROUTE]: spy(() => true)});
routeA.attachChild(routeAC);

const routeAD = new PathRoute({[PATH_PART]: 'd', [HANDLE_ROUTE]: spy(() => true)});
routeA.attachChild(routeAD);

const routeAP = new PathRoute({[PATH_PART]: ':paramAP', [HANDLE_ROUTE]: spy(() => true)});
routeA.attachChild(routeAP);

const routeAW = new PathRoute({[PATH_PART]: '*', [HANDLE_ROUTE]: spy(() => true)});
routeA.attachChild(routeAW);

const routeBW = new PathRoute({[PATH_PART]: '*', [HANDLE_ROUTE]: spy(() => true)});
routeB.attachChild(routeBW);

// Children of param route
const routePE = new PathRoute({[PATH_PART]: 'e', [HANDLE_ROUTE]: spy(() => true)});
routeP.attachChild(routePE);

const routePF = new PathRoute({[PATH_PART]: 'f', [HANDLE_ROUTE]: spy(() => true)});
routeP.attachChild(routePF);

const routePP = new PathRoute({[PATH_PART]: ':paramPP', [HANDLE_ROUTE]: spy(() => true)});
routeP.attachChild(routePP);

const routePW = new PathRoute({[PATH_PART]: '*', [HANDLE_ROUTE]: spy(() => true)});
routeP.attachChild(routePW);

// Tests

beforeEach(once(async () => {
	// Init router
	await router.init();
}));

beforeEach(() => {
	jest.clearAllMocks();
});

function notHandledByOthersThan(handledByRoute) {
	describe('not handled by', () => {
		describe.each([
			['root level', [
				['root', router]
			]],
			['1st level', [
				['1st named child', routeA],
				['2nd named child', routeB],
				['1st param child', routeP],
				['wildcard', routeW]
			]],
			['2nd level', [
				['1st named child of named child', routeAC],
				['2nd named child of named child', routeAD],
				['param child of named child', routeAP],
				['wildcard of 1st named child', routeAW],
				['wildcard of 2nd named child', routeBW],
				['1st named child of param child', routePE],
				['2nd named child of param child', routePF],
				['param child of param child', routePP],
				['wildcard of param child', routePW]
			]]
		])('%s routes', (name, options) => {
			options = options.filter(option => option[1] !== handledByRoute);
			if (options.length === 0) return;

			it.each(options)('%s route', (name2, route) => {
				expect(route[HANDLE_ROUTE]).not.toHaveBeenCalled();
			});
		});
	});
}

describe('Matching', () => { // eslint-disable-line jest/lowercase-name
	describe('root path', () => {
		describe("when root route has [PATH_PART] = ''", () => {
			let req;
			beforeEach(() => {
				req = {[PATH]: '/'};
				router.handle(req);
			});

			it('handled by root route', () => {
				expect(router[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(router[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('req[PARAMS] is empty object', () => {
				expect(req[PARAMS]).toEqual({});
			});

			notHandledByOthersThan(router);
		});

		describe('when root route is wildcard', () => {
			let req;
			beforeEach(() => {
				req = {[PATH]: '/'};
				router[PATH_PART] = '*';
				router.handle(req);
			});

			afterEach(() => {
				router[PATH_PART] = '';
			});

			it('handled by wildcard route', () => {
				expect(router[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(router[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('param populated in req[PARAMS]', () => {
				expect(req[PARAMS]).toEqual({'*': ''});
			});

			notHandledByOthersThan(router);
		});
	});

	describe('child path', () => {
		describe('matching 1st named child', () => {
			let req;
			beforeEach(() => {
				req = {[PATH]: '/a'};
				router.handle(req);
			});

			it('handled by correct named child route', () => {
				expect(routeA[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(routeA[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('req[PARAMS] is empty object', () => {
				expect(req[PARAMS]).toEqual({});
			});

			notHandledByOthersThan(routeA);
		});

		describe('matching 2nd named child', () => {
			let req;
			beforeEach(() => {
				req = {[PATH]: '/b'};
				router.handle(req);
			});

			it('handled by correct named child route', () => {
				expect(routeB[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(routeB[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('req[PARAMS] is empty object', () => {
				expect(req[PARAMS]).toEqual({});
			});

			notHandledByOthersThan(routeB);
		});

		describe('matching no named child', () => {
			let req;
			beforeEach(() => {
				req = {[PATH]: '/p'};
				router.handle(req);
			});

			it('handled by param child route', () => {
				expect(routeP[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(routeP[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('param populated in req[PARAMS]', () => {
				expect(req[PARAMS]).toEqual({paramP: 'p'});
			});

			notHandledByOthersThan(routeP);
		});

		describe('matching no named child and no param child', () => {
			let req, removedIndex;
			beforeEach(() => {
				// Remove param child
				removedIndex = router.children.indexOf(routeP);
				router.children.splice(removedIndex, 1);

				req = {[PATH]: '/w'};
				router.handle(req);
			});

			afterEach(() => {
				// Add param child back
				router.children.splice(removedIndex, 0, routeP);
			});

			it('handled by wildcard route', () => {
				expect(routeW[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(routeW[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('param populated in req[PARAMS]', () => {
				expect(req[PARAMS]).toEqual({'*': 'w'});
			});

			notHandledByOthersThan(routeW);
		});
	});

	describe('2nd level path', () => {
		describe('matching 1st level named child', () => {
			describe('matching 1st named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/a/c'};
					router.handle(req);
				});

				it('handled by correct named child route', () => {
					expect(routeAC[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routeAC[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('req[PARAMS] is empty object', () => {
					expect(req[PARAMS]).toEqual({});
				});

				notHandledByOthersThan(routeAC);
			});

			describe('matching 2nd named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/a/d'};
					router.handle(req);
				});

				it('handled by correct named child route', () => {
					expect(routeAD[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routeAD[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('req[PARAMS] is empty object', () => {
					expect(req[PARAMS]).toEqual({});
				});

				notHandledByOthersThan(routeAD);
			});

			describe('matching no named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/a/ap'};
					router.handle(req);
				});

				it('handled by param child route', () => {
					expect(routeAP[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routeAP[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('param populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({paramAP: 'ap'});
				});

				notHandledByOthersThan(routeAP);
			});

			describe('matching no named child and no param child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/b/w'};
					router.handle(req);
				});

				it('handled by wildcard route', () => {
					expect(routeBW[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routeBW[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('param populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({'*': 'w'});
				});

				notHandledByOthersThan(routeBW);
			});
		});

		describe('matching no 1st level named child', () => {
			describe('matching 1st named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/p/e'};
					router.handle(req);
				});

				it('handled by correct named child route', () => {
					expect(routePE[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routePE[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('param populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({paramP: 'p'});
				});

				notHandledByOthersThan(routePE);
			});

			describe('matching 2nd named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/p/f'};
					router.handle(req);
				});

				it('handled by correct named child route', () => {
					expect(routePF[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routePF[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('param populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({paramP: 'p'});
				});

				notHandledByOthersThan(routePF);
			});

			describe('matching no named child', () => {
				let req;
				beforeEach(() => {
					req = {[PATH]: '/p/pp'};
					router.handle(req);
				});

				it('handled by param child route', () => {
					expect(routePP[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routePP[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('both params populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({paramP: 'p', paramPP: 'pp'});
				});

				notHandledByOthersThan(routePP);
			});

			describe('matching no named child and no param child', () => {
				let req, removedIndex;
				beforeEach(() => {
					// Remove param child
					removedIndex = routeP.children.indexOf(routePP);
					routeP.children.splice(removedIndex, 1);

					req = {[PATH]: '/p/w'};
					router.handle(req);
				});

				afterEach(() => {
					// Add param child back
					routeP.children.splice(removedIndex, 0, routePP);
				});

				it('handled by wildcard route', () => {
					expect(routePW[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
					expect(routePW[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});

				it('param populated in req[PARAMS]', () => {
					expect(req[PARAMS]).toEqual({paramP: 'p', '*': 'w'});
				});

				notHandledByOthersThan(routePW);
			});
		});

		describe('matching no 1st level named child and no param child', () => {
			let req, removedIndex;
			beforeEach(() => {
				// Remove param child
				removedIndex = router.children.indexOf(routeP);
				router.children.splice(removedIndex, 1);

				req = {[PATH]: '/w/x'};
				router.handle(req);
			});

			afterEach(() => {
				// Add param child back
				router.children.splice(removedIndex, 0, routeP);
			});

			it('handled by wildcard route', () => {
				expect(routeW[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				expect(routeW[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
			});

			it('param populated in req[PARAMS]', () => {
				expect(req[PARAMS]).toEqual({'*': 'w/x'});
			});

			notHandledByOthersThan(routeW);
		});
	});
});

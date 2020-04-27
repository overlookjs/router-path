/* --------------------
 * @overlook/plugin-path module
 * Tests
 * [MATCH] method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{MATCH} = require('@overlook/plugin-match'),
	pathPlugin = require('@overlook/plugin-path'),
	{PATH, PATH_PART} = pathPlugin;

// Init
require('../support/index.js');

// Tests

const PathRoute = Route.extend(pathPlugin);

let route;
beforeEach(() => {
	route = new PathRoute();
});

describe('[MATCH]', () => {
	describe('at base of path', () => {
		it('when no match, returns null', () => {
			route[PATH_PART] = 'abc';
			const ret = route[MATCH]({url: '/def'});
			expect(ret).toBeNull();
		});

		describe('when root exact match, returns', () => {
			let ret;
			beforeEach(() => {
				route[PATH_PART] = '';
				ret = route[MATCH]({url: '/'});
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=true', () => {
				expect(ret.exact).toBeTrue();
			});

			it(".pathConsumed=''", () => {
				expect(ret.pathConsumed).toBe('');
			});
		});

		describe('when root part match, returns', () => {
			let ret;
			beforeEach(() => {
				route[PATH_PART] = '';
				ret = route[MATCH]({url: '/abc'});
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=false', () => {
				expect(ret.exact).toBeFalse();
			});

			it(".pathConsumed=''", () => {
				expect(ret.pathConsumed).toBe('');
			});
		});

		describe('when named exact match', () => {
			describe('no trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = 'abc';
					ret = route[MATCH]({url: '/abc'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});
			});

			describe('trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = 'abc';
					ret = route[MATCH]({url: '/abc/'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});
			});
		});

		describe('when named part match, returns', () => {
			let ret;
			beforeEach(() => {
				route[PATH_PART] = 'abc';
				ret = route[MATCH]({url: '/abc/def'});
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=false', () => {
				expect(ret.exact).toBeFalse();
			});

			it('.pathConsumed=/<path part>', () => {
				expect(ret.pathConsumed).toBe('/abc');
			});
		});

		describe('when param exact match', () => {
			describe('no trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = ':id';
					ret = route[MATCH]({url: '/abc'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});

				it('.params={<param name>: <path part>}', () => {
					expect(ret.params).toEqual({id: 'abc'});
				});
			});

			describe('trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = ':id';
					ret = route[MATCH]({url: '/abc/'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});

				it('.params={<param name>: <path part>}', () => {
					expect(ret.params).toEqual({id: 'abc'});
				});
			});
		});

		describe('when param part match, returns', () => {
			let ret;
			beforeEach(() => {
				route[PATH_PART] = ':id';
				ret = route[MATCH]({url: '/abc/def'});
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=false', () => {
				expect(ret.exact).toBeFalse();
			});

			it('.pathConsumed=/<path part>', () => {
				expect(ret.pathConsumed).toBe('/abc');
			});

			it('.params={<param name>: <path part>}', () => {
				expect(ret.params).toEqual({id: 'abc'});
			});
		});

		describe('when wildcard match', () => {
			describe('when 1 part remaining, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = '*';
					ret = route[MATCH]({url: '/abc'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});

				it(".params={'*': <path minus start slash>}", () => {
					expect(ret.params).toEqual({'*': 'abc'});
				});
			});

			describe('when multiple parts remaining, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = '*';
					ret = route[MATCH]({url: '/a/b/c'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/a/b/c');
				});

				it(".params={'*': <path minus start slash>}", () => {
					expect(ret.params).toEqual({'*': 'a/b/c'});
				});
			});
		});

		describe('when wildcard param match', () => {
			describe('when 1 part remaining, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = '*id';
					ret = route[MATCH]({url: '/abc'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/abc');
				});

				it('.params={<param name>: <path minus start slash>}', () => {
					expect(ret.params).toEqual({id: 'abc'});
				});
			});

			describe('when multiple parts remaining, returns', () => {
				let ret;
				beforeEach(() => {
					route[PATH_PART] = '*id';
					ret = route[MATCH]({url: '/a/b/c'});
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/a/b/c');
				});

				it('.params={<param name>: <path minus start slash>}', () => {
					expect(ret.params).toEqual({id: 'a/b/c'});
				});
			});
		});
	});

	describe('when parts of path already consumed', () => {
		function createReq(path) {
			// Consume with first path part consumed
			return {
				path,
				[PATH]: path.slice(path.indexOf('/', 1))
			};
		}

		it('when no match, returns null', () => {
			const req = createReq('/abc/def');
			route[PATH_PART] = 'abc';
			const ret = route[MATCH](req);
			expect(ret).toBeNull();
		});

		describe('when named exact match', () => {
			describe('no trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def');
					route[PATH_PART] = 'def';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});
			});

			describe('trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def/');
					route[PATH_PART] = 'def';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});
			});
		});

		describe('when named part match, returns', () => {
			let ret;
			beforeEach(() => {
				const req = createReq('/abc/def/ghi');
				route[PATH_PART] = 'def';
				ret = route[MATCH](req);
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=false', () => {
				expect(ret.exact).toBeFalse();
			});

			it('.pathConsumed=/<path part>', () => {
				expect(ret.pathConsumed).toBe('/def');
			});
		});

		describe('when param exact match', () => {
			describe('no trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def');
					route[PATH_PART] = ':id';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});

				it('.params={<param name>: <path part>}', () => {
					expect(ret.params).toEqual({id: 'def'});
				});
			});

			describe('trailing slash, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def/');
					route[PATH_PART] = ':id';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=/<path part>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});

				it('.params={<param name>: <path part>}', () => {
					expect(ret.params).toEqual({id: 'def'});
				});
			});
		});

		describe('when param part match, returns', () => {
			let ret;
			beforeEach(() => {
				const req = createReq('/abc/def/ghi');
				route[PATH_PART] = ':id';
				ret = route[MATCH](req);
			});

			it('object', () => {
				expect(ret).toBeObject();
			});

			it('.exact=false', () => {
				expect(ret.exact).toBeFalse();
			});

			it('.pathConsumed=/<path part>', () => {
				expect(ret.pathConsumed).toBe('/def');
			});

			it('.params={<param name>: <path part>}', () => {
				expect(ret.params).toEqual({id: 'def'});
			});
		});

		describe('when wildcard match', () => {
			describe('when 1 part remaining, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def');
					route[PATH_PART] = '*';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});

				it(".params={'*': <path>}", () => {
					expect(ret.params).toEqual({'*': 'def'});
				});
			});

			describe('when multiple parts remaining, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/a/b/c/d');
					route[PATH_PART] = '*';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/b/c/d');
				});

				it(".params={'*': <path>}", () => {
					expect(ret.params).toEqual({'*': 'b/c/d'});
				});
			});
		});

		describe('when wildcard param match', () => {
			describe('when 1 part remaining, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/abc/def');
					route[PATH_PART] = '*id';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/def');
				});

				it('.params={<param name>: <path>}', () => {
					expect(ret.params).toEqual({id: 'def'});
				});
			});

			describe('when multiple parts remaining, returns', () => {
				let ret;
				beforeEach(() => {
					const req = createReq('/a/b/c/d');
					route[PATH_PART] = '*id';
					ret = route[MATCH](req);
				});

				it('object', () => {
					expect(ret).toBeObject();
				});

				it('.exact=true', () => {
					expect(ret.exact).toBeTrue();
				});

				it('.pathConsumed=<path>', () => {
					expect(ret.pathConsumed).toBe('/b/c/d');
				});

				it('.params={<param name>: <path>}', () => {
					expect(ret.params).toEqual({id: 'b/c/d'});
				});
			});
		});
	});
});

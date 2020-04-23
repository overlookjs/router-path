/* --------------------
 * @overlook/router-path module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE, IS_INITIALIZED} = require('@overlook/route'),
	pluginMatch = require('@overlook/plugin-match'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	{MATCH, HANDLE_MATCH} = pluginMatch,
	{IS_BEFORE} = pluginOrdered,
	{isString} = require('is-it-type'),
	hasOwnProp = require('has-own-prop');

// Imports
const pkg = require('../package.json');

// Exports

const pathPlugin = new Plugin(
	pkg,
	{
		symbols: ['PATH_PART', 'PATH_UNCONSUMED', 'PARAMS']
	},
	extend
);

module.exports = pathPlugin;

const {PATH_PART, PATH_UNCONSUMED, PARAMS} = pathPlugin;

function extend(Route) {
	// Extend class with plugin-match and plugin-ordered
	Route = Route.extend(pluginMatch)
		.extend(pluginOrdered);

	// Extend class
	return class PathRoute extends Route {
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);

			this[PATH_PART] = undefined;
		}

		[INIT_ROUTE](app) {
			super[INIT_ROUTE](app);

			// Inherit path part from name (or '' if this is top path route)
			let pathPart = this[PATH_PART];
			if (pathPart === undefined) {
				// Find path route above this one
				let parentPathRoute = this.parent;
				while (parentPathRoute && !hasOwnProp(parentPathRoute, PATH_PART)) {
					parentPathRoute = parentPathRoute.parent;
				}

				if (!parentPathRoute) {
					pathPart = '';
				} else {
					pathPart = this.name;
				}
				this[PATH_PART] = pathPart;
			}

			// Check path part valid
			if (pathPart == null) throw new Error('[routerPath.PATH_PART] must be set on a path route');
			if (!isString(pathPart)) throw new Error('[routerPath.PATH_PART] must be a string');
		}

		[MATCH](req) {
			// TODO Call `super[MATCH]` and deal with result

			// Get path to match against
			let path = req[PATH_UNCONSUMED];
			if (path === undefined) path = req.path;

			// Check if path matches

			// Handle root
			const pathPart = this[PATH_PART];
			if (pathPart === '') {
				return {
					exact: path === '/',
					pathConsumed: ''
				};
			}

			// Handle param
			if (pathPart[0] === ':') {
				const index = path.indexOf('/', 1);
				if (index === -1) {
					// Exact match
					return {
						exact: true,
						pathConsumed: path,
						params: {[pathPart.slice(1)]: path.slice(1)}
					};
				}

				return {
					exact: index === path.length - 1,
					pathConsumed: path.slice(0, index),
					params: {[pathPart.slice(1)]: path.slice(1, index)}
				};
			}

			// Handle wildcard
			if (pathPart === '*') {
				return {
					exact: true,
					pathConsumed: path,
					params: {'*': path.slice(1)}
				};
			}

			// Handle named match
			if (path.slice(1, pathPart.length + 1) === pathPart) {
				if (path.length === pathPart.length + 1) {
					return {
						exact: true,
						pathConsumed: path
					};
				}

				if (path[pathPart.length + 1] === '/') {
					return {
						exact: path.length === pathPart.length + 2,
						pathConsumed: `/${pathPart}`
					};
				}
			}

			// No match
			return null;
		}

		[HANDLE_MATCH](req, match) {
			// Record that part consumed
			const pathUnconsumedOld = req[PATH_UNCONSUMED];
			req[PATH_UNCONSUMED] = (pathUnconsumedOld === undefined ? req.path : pathUnconsumedOld)
				.slice(match.pathConsumed.length);

			// Record params
			const {params} = match;
			let paramsOld;
			if (params) {
				paramsOld = req[PARAMS];
				req[PARAMS] = {...paramsOld, ...params};
			}

			// Call superclass method
			const ret = super[HANDLE_MATCH](req, match);

			// If not handled, reverse above to leave req as it was previously
			if (ret == null) {
				req[PATH_UNCONSUMED] = pathUnconsumedOld;
				if (params) req[PARAMS] = paramsOld;
			}

			// Return handle result
			return ret;
		}

		[IS_BEFORE](sibling) {
			// If super method returns a result, use it
			const before = super[IS_BEFORE](sibling);
			if (before !== null) return before;

			// If sibling is not a path router, no preference
			if (!hasOwnProp(sibling, PATH_PART)) return null;

			// If sibling is not yet initialized, express no preference.
			// Siblings may be initialized in any order and may define PATH_PART in their
			// `[INIT_ROUTE]()` methods. So if the sibling has not yet initialized, its PATH_PART,
			// which ordering is based on, is not yet known.
			// Therefore, express no preference for relative order here, and allow the sibling to
			// define order when it initializes.
			if (!sibling[IS_INITIALIZED]) return null;

			// Determine which should go first
			const priorityRoute = priority(this),
				prioritySibling = priority(sibling);
			if (priorityRoute === prioritySibling) return null;
			return priorityRoute < prioritySibling;
		}
	};
}

// Helper functions
function priority(route) {
	const part = route[PATH_PART];
	if (part === '*') return 3;
	if (part[0] === ':') return 2;
	return 1;
}

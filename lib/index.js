/* --------------------
 * @overlook/plugin-path module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE} = require('@overlook/route'),
	pluginMatch = require('@overlook/plugin-match'),
	pluginOrder = require('@overlook/plugin-order'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	{PATH} = require('@overlook/plugin-request'),
	{isString} = require('is-it-type'),
	hasOwnProp = require('has-own-prop');

// Imports
const pkg = require('../package.json');

// Exports

const pathPlugin = new Plugin(
	pkg,
	{symbols: ['PATH_PART', 'GET_PATH_PART', 'PARAMS', 'PATH_UNCONSUMED']},
	[pluginMatch, pluginOrder, pluginOrdered],
	(Route, {
		PATH_PART, GET_PATH_PART, PARAMS, PATH_UNCONSUMED,
		MATCH, HANDLE_MATCH, // From @overlook/plugin-match
		IS_BEFORE // From @overlook/plugin-ordered
	}) => class PathRoute extends Route {
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);

			this[PATH_PART] = undefined;
		}

		/**
		 * Determine path part.
		 */
		async [INIT_ROUTE]() {
			// Call superior
			await super[INIT_ROUTE]();

			// Inherit path part from name (or '' if this is top path route)
			let pathPart = this[PATH_PART];
			if (pathPart === undefined) {
				pathPart = this[GET_PATH_PART]();

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
				}

				this[PATH_PART] = pathPart;
			}

			// Check path part valid
			if (pathPart == null) throw new Error('[plugin-path.PATH_PART] must be set on a path route');
			if (!isString(pathPart)) throw new Error('[plugin-path.PATH_PART] must be a string');
		}

		[MATCH](req) {
			// TODO Call `super[MATCH]` and deal with result

			// Get path to match against
			let path = req[PATH_UNCONSUMED];
			if (path === undefined) path = req[PATH];

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
			if (pathPart[0] === '*') {
				return {
					exact: true,
					pathConsumed: path,
					params: {[pathPart === '*' ? '*' : pathPart.slice(1)]: path.slice(1)}
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
			return undefined;
		}

		[HANDLE_MATCH](req, match) {
			// Record that part consumed
			const pathOld = req[PATH_UNCONSUMED];
			req[PATH_UNCONSUMED] = (pathOld === undefined ? req[PATH] : pathOld)
				.slice(match.pathConsumed.length);

			// Record params
			const {params} = match;
			const paramsOld = req[PARAMS];
			req[PARAMS] = {...paramsOld, ...params};

			// Call superclass method
			const ret = super[HANDLE_MATCH](req, match);

			// If not handled, reverse above to leave req as it was previously
			if (ret == null) {
				req[PATH_UNCONSUMED] = pathOld;
				req[PARAMS] = paramsOld;
			}

			// Return handle result
			return ret;
		}

		[IS_BEFORE](sibling) {
			// If super method returns a result, use it
			const isBefore = super[IS_BEFORE](sibling);
			if (isBefore != null) return isBefore;

			// If sibling is not a path route, no preference
			if (!hasOwnProp(sibling, PATH_PART)) return undefined;

			// Determine which should go first
			const priorityRoute = priority(this),
				prioritySibling = priority(sibling);
			if (priorityRoute === prioritySibling) return undefined;
			return priorityRoute < prioritySibling;
		}

		/**
		 * Get path part.
		 * This is only called if `[PATH_PART]` is undefined.
		 * Intended to be overriden in subclasses
		 */
		[GET_PATH_PART]() { // eslint-disable-line class-methods-use-this
			return undefined;
		}
	}
);

module.exports = pathPlugin;

// Helper functions

const {PATH_PART} = pathPlugin;
function priority(route) {
	const pathPart = route[PATH_PART];
	if (!pathPart) return 4;

	const partFirstChar = pathPart[0];
	if (partFirstChar === '*') return 3;
	if (partFirstChar === ':') return 2;
	return 1;
}

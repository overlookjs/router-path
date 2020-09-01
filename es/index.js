/* --------------------
 * @overlook/plugin-path module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import pathPlugin from '../lib/index.js';

export default pathPlugin;
export const {
	PATH_PART,
	GET_PATH_PART,
	URL_PATH,
	PARAMS,
	PATH_UNCONSUMED,
	PATH
} = pathPlugin;

/* --------------------
 * @overlook/plugin-path module
 * Tests ESLint config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^@overlook/plugin-path$']}],
		'node/no-missing-require': ['error', {allowModules: ['@overlook/plugin-path']}]
	}
};

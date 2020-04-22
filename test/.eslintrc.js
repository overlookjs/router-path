/* --------------------
 * @overlook/router-path module
 * Tests ESLint config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^@overlook/router-path$']}],
		'node/no-missing-require': ['error', {allowModules: ['@overlook/router-path']}]
	}
};

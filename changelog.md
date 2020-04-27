# Changelog

## 0.6.0

Breaking changes:

* Consume path from `req.url`
* Rename `PATH_UNCONSUMED` symbol to `PATH`

Features:

* `[GET_PATH_PART]` method
* Named wildcards

Bug fixes:

* Always create `req[PARAMS]`
* Determine `[PATH_PART]` before ordering

Dependencies:

* Update dependencies

Tests:

* With `@overlook/plugin-serve-http`
* Remove dependency on `@overlook/core`
* Rename vars [refactor]

Dev:

* Update dev dependencies

Docs:

* README

## 0.5.0

Breaking changes:

* Rename module `@overlook/plugin-path`
* Convert to plugin
* Drop support for Node v8

Bug fixes:

* Update debug instrumentation for latest `@overlook/core`

Refactor:

* Fix lint error
* Fully specify require file paths

No code:

* File header comments

Dependencies:

* Update `@overlook/router-match` dependency
* Update `@overlook/router-ordered` dependency
* Switch `core-util-is` for `is-it-type`

Tests:

* Remove `jest-each` dependency [refactor]
* Simplify unhandled rejection handling
* Import from package name [refactor]
* Run tests in dev mode

Dev:

* Update dev dependencies
* Bump insecure dependencies
* Run tests on CI on Node v13 + v14
* Replace `.npmignore` with `files` list in `package.json`
* `.editorconfig` config
* Simplify Jest config
* ESLint lint dot files
* ESLint igmore `coverage` dir
* Remove unnecessary line from `.gitignore`
* Remove `sudo` from Travis config

Docs:

* Add link to Overlook site in README
* Versioning policy
* Update license year

## 0.4.1

Dependencies:

* Update `@overlook/router-ordered` dependency

## 0.4.0

Breaking changes:

* Create errors with `.debugError`

## 0.3.0

Breaking changes:

* Root `[PATH_PART]` is ''
* `[MATCH]` consume start slash not trailing slash

Deps:

* Update `@overlook/router-match` dependency
* Update `@overlook/router-ordered` dependency

Dev:

* Update `@overlook/core` dev dependency

## 0.2.0

Breaking changes:

* Route extension identifier located at `.IDENTIFIER`

Bug fixes:

* `[IS_BEFORE]` only return result when sibling has initialized

## 0.1.0

* Initial release

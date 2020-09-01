[![NPM version](https://img.shields.io/npm/v/@overlook/plugin-path.svg)](https://www.npmjs.com/package/@overlook/plugin-path)
[![Build Status](https://img.shields.io/travis/overlookjs/plugin-path/master.svg)](http://travis-ci.org/overlookjs/plugin-path)
[![Dependency Status](https://img.shields.io/david/overlookjs/plugin-path.svg)](https://david-dm.org/overlookjs/plugin-path)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/plugin-path.svg)](https://david-dm.org/overlookjs/plugin-path)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookjs/plugin-path.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/plugin-path/master.svg)](https://coveralls.io/r/overlookjs/plugin-path)

# Overlook framework path plugin

Part of the [Overlook framework](https://overlookjs.github.io/).

## Abstract

Plugin which delegates handling of requests either to this route, or children, based on matching the request path.

Similar to [express](https://expressjs.com/)'s routing.

## Usage

### Building route paths

Extend routes with this plugin and then define the "path part" for each route via `[PATH_PART]` property or `[GET_PATH_PART]()` method. If neither is defined, `.name` is taken as path part.

Each route's path is its parent's path + the new path part. `/user` + `login` -> `/user/login`.

```js
const Route = require('@overlook/route');
const pathPlugin = require('@overlook/plugin-path');
const { PATH_PART } = pathPlugin;

const PathRoute = Route.extend( pathPlugin );

// URL: /
const root = new PathRoute();

// URL: /bands
const bands = new PathRoute( { name: 'bands' } );
root.attachChild( bands );

// URL: /bands/:bandId
const band = new PathRoute( {
  name: 'band',
  [PATH_PART]: ':bandId'
} );
bands.attachChild( band );

// URL: /bands/:bandId/albums
const albums = new PathRoute( { name: 'albums' } );
band.attachChild( albums );

// URL: /bands/:bandId/albums/:albumId
const album = new PathRoute( {
  name: 'album',
  [PATH_PART]: ':albumId'
} );
albums.attachChild( album );
```

A request for `http://example.com/bands/the-cure/albums/wish` will be routed to the `album` route.

#### Matching order

Routes can be added in any order, and the plugin will order them by priority automatically. Static matches (e.g. `bands`) take priority over parameterized matches (e.g. `:id`). The lowest priority is wildcard matches (`*`).

### Handing requests

To handle requests, define/extend the `[HANDLE_ROUTE]()` method.

If a route matches exactly, `[HANDLE_ROUTE]()` will be called with the request. If it only matches in part, the request will be forwarded on to the route's children to match.

`[HANDLE_ROUTE]` symbol is re-exported from [@overlook/plugin-match](https://www.npmjs.com/package/@overlook/plugin-match) (which this plugin extends).

```js
const Route = require('@overlook/route');
const pathPlugin = require('@overlook/plugin-path');
const { GET_PATH_PART, HANDLE_ROUTE } = pathPlugin;

const PathRoute = Route.extend( pathPlugin );

class BandsRoute extends PathRoute {
  [GET_PATH_PART]() {
    return 'bands';
  }

  [HANDLE_ROUTE]( req ) {
    // Handle the request
    // `req` = request object
  }
}
```

### Params

For parameterized routes (i.e. `:something`), the parameters can be accessed as `req[PARAMS]`.

```js
const { GET_PATH_PART, PARAMS } = require('@overlook/plugin-path');

class BandRoute extends PathRoute {
  [GET_PATH_PART]() {
    return ':bandId';
  }

  [HANDLE_ROUTE]( req ) {
    const params = req[PARAMS];
    // If URL = '/bands/the-cure'
    // params = { bandId: 'the-cure' }
  }
}
```

### Wildcard matching

For a wildcard match (i.e. match entire rest of path) use either:

* `[PATH_PART] = '*'`: Param will be called `*`
* `[PART_PATH] = '*something'`: Param will be called `something`

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/plugin-path/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/plugin-path/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)

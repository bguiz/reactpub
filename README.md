# reactpub

**Publish Websites using ReactJs**

Provides a minimal wrapper around
[ReactJs](https://npmjs.com/package/react),
[React Router](https://npmjs.com/package/react-router), and
[Static Site Generator Webpack Plugin](https://npmjs.com/package/static-site-generator-webpack-plugin).

Using using these, it generates an output folder,
ready for upload to a static file host,
such as Github pages.

This module is best suited for those who
want a ReactJs based static site generation tool
which **does just that and nothing else**.

BYO markdown conversion, templating, and the like!

## Usage

Install `reactpub`:

```bash
npm install save-dev reactpub
```

Create/ edit `webpack.config.js`:

```javascript
'use strict';

const webpack = require('webpack');
const reactpubWebpack = require('reactpub/webpack');

const data = {
  routes: ['/'],
  props: {
    title: 'Reactpub is sweet!',
  },
};

let webpackConfig = reactpubWebpack({
  data,
});

console.log(webpackConfig);

module.exports = webpackConfig;
```

Note that this is just a **regular** webpack config.
Feel free to modify it as you wish
to add your own plugins, loaders, etc,
and to override any values,
where the defaults provided are not what you want.

Create/ edit `app/entry.js`:

```javascript
'use strict';

const reactpubEntry = require('reactpub/entry');

// Routes defined using react-router@2.0.x
const routes = require('./routes.jsx');

let reactOnClient = true;

let renderServer = reactpubEntry({
  reactOnClient,
  routes,
});

module.exports = renderServer;
```

In an `app` folder, create `entry.js`.
Define your React `routes`, require them, and pass them as an option.

The `reactOnClient` flag simply indicates whether
the output bundle, containing the ReactJs application,
should be run on the client as well -
not just when pre-rendering all of your pages.
This value is `true` by default.

When `reactOnClient` is enabled,
and your pre-rendered pages are served on a static file server,
when the user navigates from one route to another,
they next page does not load,
instead React simply updates the DOM,
as in a single page application.

Terms used to describe this behaviour include
*Isomorphic Javascript* and *Universal Javascript*.
This is essentially the same thing,
except without the server rendering anything on the fly.
Instead all of the pages are pre-rendered (static site generation),
and served on a static site.

Development:

- Run `web-pack-dev-server` to serve a build locally

Deployment:

- Run `webpack` to build something you can upload to your host

## Author

[Brendan Graetz](http://bguiz.com/)

## Licence

GPL-3.0

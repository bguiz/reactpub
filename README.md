# reactpub

**Publish Websites using ReactJs**

Provides a minimal wrapper around
[ReactJs](https://npmjs.com/package/react),
[React Router](https://npmjs.com/package/react-router), and
[Static Site Generator Webpack Plugin](https://npmjs.com/package/static-site-generator-webpack-plugin).

Using using these, it generates an output folder,
ready for upload to a static file host,
(such as Github pages).

This module is best suited for those who
want a ReactJs based static site generation tool
which **does just that and nothing else**.

BYO markdown conversion, templating, and the like!

## Develop & deploy

- Run `web-pack-dev-server` during development
- Run `webpack` to build something ready to upload to a static file host

## Initial set up

Install `reactpub`:

```bash
npm install save-dev reactpub
```

Create/ edit `data/data.js`:

```javascript
module.exports = {
  routes: ['/'],
  props: {
    routes: {
      '/': {
        meta: {
          title: 'Home page',
        },
      }
    },
    aliases: {},
  },
};
```

If you have a directory of markdown files, etc,
you will most likely want to programmatically generate this file.

Create/ edit `webpack.config.js`:

```javascript
'use strict';

const webpack = require('webpack');
const reactpubWebpack = require('reactpub/webpack');
const data = require('./data/data.js');

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

const routes = require('./routes.jsx');
const data = require('./data/data.js');

let reactOnClient = true;

let renderServer = reactpubEntry({
  reactOnClient,
  routes,
  routeMetadata: data,
});

module.exports = renderServer;
```

In an `app` folder, create `entry.js`.
Define your React `routes`, require them, and pass them as an option.

**`reactOnClient`**

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
*Isomorphic Javascript* and *Universal Javascript*;
which are essentially the same thing,
except here you do not need a server to render things on the fly.
Instead, all of the pages are pre-rendered -
static site generation -
ready to be served on a static file host.

**`routes`**

Routes defined using `react-router@2.0.x`.

**`routeMetadata`**

The meta data describing the routes in `data/data.js` file we wrote earlier.

## Author

[Brendan Graetz](http://bguiz.com/)

## Licence

GPL-3.0

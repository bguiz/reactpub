'use strict';

const React = require('react');
const ReactDom = require('react-dom');
const ReactDomServer = require('react-dom/server');
const ReactRouter = require('react-router');
const History = require('history');

let Router = ReactRouter.Router;
let RouterContext = ReactRouter.RouterContext;

module.exports = getEntry;

function getEntry(options) {
  let reactOnClient =
    (options.reactOnClient === 'undefined') ? true : options.reactOnClient;
  let routes = options.routes;
  if (!routes) {
    throw 'Routes are necessary';
  }

  if (reactOnClient && typeof document !== 'undefined') {
    renderClient(); //Disabled for now
  }

  return renderServer;

  function renderClient() {
    let history = ReactRouter.useRouterHistory(
      History.createHistory)(
      { queryKey: false });
    var outlet = document.getElementById('outlet');
    ReactDom.render(
      <Router history={history} routes={routes} />,
      outlet);
    console.log('ReactJs has taken over page rendering.');
  }

  function renderServer(locals, callback) {
    let history = History.createMemoryHistory();
    let location = history.createLocation(locals.path);

    ReactRouter.match({
      routes,
      location,
    }, (err, redirectLocation, renderProps) => {
      if (!err && !redirectLocation && !renderProps) {
        return callback(`No route found matching: ${locals.path}, ${JSON.stringify(location)}`);
      }
      if (!!err || !renderProps) {
        return callback(err || 'Missing renderProps');
      }
      let post;
      if (!!options.routeMetadata &&
        !!options.routeMetadata.props &&
        !!options.routeMetadata.props.routes &&
        !!options.routeMetadata.props.aliases) {
        let path = options.routeMetadata.props.aliases[locals.path] || locals.path;
        post = options.routeMetadata.props.routes[path] || {};
      }
      post = post || {};
      renderProps = Object.assign(renderProps, post);

      let rendered = ReactDomServer.renderToStaticMarkup(
        <RouterContext {...renderProps} />);
      let html = templateHtml({
        rendered: rendered,
        title: (!!post.meta && post.meta.title) || locals.title,
        path: locals.path,
        assets: locals.assets,
      });
      console.log(`HTML generated for ${renderProps.location.pathname}`);
      callback(undefined, html);
    });
  }

  function templateHtml(locals) {
    let scriptTags = '';
    if (reactOnClient) {
      for (var key in locals.assets) {
        if (locals.assets.hasOwnProperty(key)) {
          scriptTags += `\n<script src="/${locals.assets[key]}"></script>`;
        }
      }
    }
    return `<!DOCTYPE html>
<html id="html" class="html">
  <head>
    <title>${locals.title}</title>
  </head>
  <body>
    <div id="outlet" class="outlet">${locals.rendered}</div>${scriptTags}
  </body>
</html>`;
  }
}



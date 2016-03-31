'use strict';

const path = require('path');

const webpack = require('webpack');
const staticSiteGenPlugin = require('static-site-generator-webpack-plugin');

module.exports = getWebpackConfig;

function getWebpackConfig(options) {
  let data = options.data;
  if (!data || !Array.isArray(data.routes) || data.routes.length < 1) {
    throw 'Must specify at least one route';
  }
  if (!data.props.routes || Object.keys(data.props.routes).length < 1) {
    throw 'Must specify props.routes';
  }
  if (!data.props.aliases) {
    throw 'Must specify props.aliases';
  }
  if (data.routes.length <
      (Object.keys(data.props.routes).length +
        Object.keys(data.props.aliases).length)) {
    throw `Numbers do not tally #routes (${data.routes.length}) should be at least
#props.routes (${Object.keys(data.props.routes).length}) +
#props.aliases (${Object.keys(data.props.aliases).length})`;
  }

  let cwd = process.cwd();

  let webpackConfig = {
    stats: {
      colors: true,
      progress: true,
    },

    devtool: 'source-map',

    entry: './app/entry.js',

    output: {
      filename: 'bundle.js',
      path: path.resolve(cwd, './dist'),
      // We want it to load both in browsers and in NodeJs
      libraryTarget: 'umd',
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'jsx',
        }
      ],
    },

    plugins: [

      // When compilation fails, do not publish
      new webpack.NoErrorsPlugin(),

      new staticSiteGenPlugin(
        'bundle.js',
        data.routes,
        data.props)
    ],
  };

  return webpackConfig;
}

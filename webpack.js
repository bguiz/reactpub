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
  if (!data.props || typeof data.props.title !== 'string') {
    throw 'Must specify props.title';
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
      path: path.normalize(cwd, 'dist'),
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

      new staticSiteGenPlugin('bundle.js', data.routes, data.props)
    ],
  };

  return webpackConfig;
}

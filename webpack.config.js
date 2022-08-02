const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Crx = require('crx-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
  entry: {
    car: './src/js/car.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  cache: true,
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [new CopyWebpackPlugin([{ from: './manifest.json' }])],
};

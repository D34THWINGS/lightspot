const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const helpers = require('./config/helpers.js');

const atModuleRegExp = /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/;

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  target: 'electron-renderer',

  resolve: {
    extensions: ['.ts', '.js', '.json', '.css', '.html'],
  },

  entry: {
    polyfills: './src/polyfills.ts',
    vendor: './src/vendor.ts',
    app: './src/app/app.ts',
  },

  module: {
    rules: [{
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: { configFileName: helpers.root('src', 'tsconfig.json') },
      }, 'angular2-template-loader'],
    }, {
      test: /\.html$/,
      use: 'html-loader',
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      use: 'file-loader?name=assets/[name].[hash].[ext]',
    }, {
      test: /\.css$/,
      exclude: helpers.root('src', 'app'),
      use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' }),
    }, {
      test: /\.css$/,
      include: helpers.root('src', 'app'),
      use: 'raw-loader',
    }],
  },

  plugins: [
    new webpack.ContextReplacementPlugin(atModuleRegExp, helpers.root('./src'), {}),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new ExtractTextPlugin('[name].css'),
  ],
};

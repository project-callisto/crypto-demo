var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var angularClient = path.join(__dirname, '/../angular-client/main.ts');
var polyfills = path.join(__dirname, '/../angular-client/polyfills.ts');

module.exports = {
  entry: {
    angularClient: angularClient,
    polyfills: polyfills,
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, '/../dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  watch: true,
  devtool: 'cheap-source-map',
  module: {
    rules: [
    {
      test: /\.ts$/,
      loaders: [
      {
        loader: 'awesome-typescript-loader',
        options: { configFileName: path.join(__dirname, '/../angular-client/tsconfig.json') }
      } , 'angular2-template-loader'
      ]
    },
    {
      test: /\.html$/,
      loader: 'html-loader'
    },
    {
      test: /\.css$/,
      exclude: path.join(__dirname, '/../angular-client/app'),
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    },
    {
      test: /\.css$/,
      include: path.join(__dirname, '/../angular-client/app'),
      loader: 'raw-loader'
    }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: [
        'angularClient',
        'polyfills',
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'angular-client/index.html'
    })
  ]
};

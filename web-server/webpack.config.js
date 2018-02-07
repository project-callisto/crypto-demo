var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var angularPolyfills = path.join(__dirname, '/../angular-client/polyfills.ts');
var angularVendor = path.join(__dirname, '/../angular-client/vendor.ts');
var angularMain = path.join(__dirname, '/../angular-client/main.ts');

module.exports = {
  entry: {
    angularPolyfills: angularPolyfills,
    angularVendor: angularVendor,
    angularMain: angularMain,
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
        options: { configFileName: path.join(__dirname, '/../tsconfig.json') }
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
        'angularPolyfills',
        'angularVendor',
        'angularMain',
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'angular-client/index.html'
    })
  ]
};

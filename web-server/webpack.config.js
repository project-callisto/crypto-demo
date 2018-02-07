var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var NpmInstallPlugin = require('npm-install-webpack-plugin');

module.exports = {
  entry: {
    vendor: [
      path.join(__dirname, '/../client/polyfills.ts'),
      path.join(__dirname, '/../client/vendor.ts'),
    ],
    app: path.join(__dirname, '/../client/main.ts'),
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
      exclude: path.join(__dirname, '/../client/app'),
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    },
    {
      test: /\.css$/,
      include: path.join(__dirname, '/../client/app'),
      loader: 'raw-loader'
    }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
    new NpmInstallPlugin()
  ]
};

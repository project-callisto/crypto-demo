const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {getIfUtils} = require('webpack-config-utils')

module.exports = function(env, argv) {
  const {ifDev} = getIfUtils(process.env.NODE_ENV || "dev")

  let config = {
    entry: {
      vendor: [
        path.join(__dirname, '/../client/polyfills.ts'),
        path.join(__dirname, '/../client/vendor.ts'),
      ],
      app: path.join(__dirname, '/../client/main.ts'),
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, '/../dist'),
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    watch: ifDev(),
    devtool: 'source-map',
    module: {
      rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: path.join(__dirname, '/../tsconfig.json') }
          },
          'angular2-template-loader',
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "dev"),
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
      }),
      new HtmlWebpackPlugin({
        template: 'client/index.html',
      }),
      new NpmInstallPlugin(),
      new CopyWebpackPlugin([{
        from: path.join(__dirname, '/../client/assets'),
        to: 'assets',
      }]),
    ]
  }

  return config

}

const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const production = require('./webpack-configs/production')
const development = require('./webpack-configs/development')
const PROD = process.env.NODE_ENV === 'production'
const modeConfig = PROD ? production : development

module.exports = webpackMerge(
  {
    entry: {
      'bulk-generator': './assets/react/index.js'
    },
    output: {
      path: __dirname + '/dist/',
      filename: '[name].min.js',
      chunkFilename: 'chunk-[name].[contenthash].js',
      publicPath: __dirname + '/dist/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { babelrc: true }
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  },
  modeConfig
)

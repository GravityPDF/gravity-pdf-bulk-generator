const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const production = require('./webpack-configs/production')
const development = require('./webpack-configs/development')
const PROD = process.env.NODE_ENV === 'production'
const modeConfig = PROD ? production : development

module.exports = webpackMerge(
  {
    entry: {
      'bulk-generator': './src/assets/react/index.js',
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
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

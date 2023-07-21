const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const WebpackBar = require('webpackbar')
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin')

const browsersyncConfig = require('./browsersync.config')

module.exports = {
  get: function (mode) {
    const plugins = [
      new CleanWebpackPlugin(),
      new ESLintPlugin({
        overrideConfigFile: path.resolve(__dirname, '../.eslintrc'),
        context: path.resolve(__dirname, '../src/js'),
        files: '**/*.js',
      }),
      new SpriteLoaderPlugin({
        plainSprite: true,
      }),
      new StyleLintPlugin({
        configFile: path.resolve(__dirname, '../.stylelintrc'),
        context: path.resolve(__dirname, '../src/scss'),
        files: '**/*.scss',
      }),
      new WebpackBar({
        color: '#ffe600',
      }),
      new DependencyExtractionWebpackPlugin(),
    ]

    if (mode === 'production') {
      plugins.push(
        new WebpackManifestPlugin({
          fileName: 'assets.json',
        }),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].min.css',
        })
      )
    } else {
      plugins.push(
        new BrowserSyncPlugin(browsersyncConfig.browserSyncOptions, browsersyncConfig.pluginOptions),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        })
      )
    }

    return plugins
  },
}

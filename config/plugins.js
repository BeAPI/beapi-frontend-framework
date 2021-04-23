const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const _BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const _ESLintPlugin = require('eslint-webpack-plugin')
const _MiniCssExtractPlugin = require('mini-css-extract-plugin')
const _StyleLintPlugin = require('stylelint-webpack-plugin')
const _SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const _WebpackBar = require('webpackbar')

const browsersyncConfig = require('./browsersync.config')

const BrowserSyncPlugin = new _BrowserSyncPlugin(browsersyncConfig.browserSyncOptions, browsersyncConfig.pluginOptions)

const ESLintPlugin = new _ESLintPlugin({
  overrideConfigFile: path.resolve(__dirname, '../.eslintrc'),
  context: path.resolve(__dirname, '../src/js'),
  files: '**/*.js',
})

const ManifestPlugin = new WebpackManifestPlugin({
  fileName: 'assets.json',
  filter: (file) => !file.isAsset,
})

const MiniCssExtractPluginDev = new _MiniCssExtractPlugin({
  filename: '[name].css',
})

const MiniCssExtractPluginProd = new _MiniCssExtractPlugin({
  filename: '[name].[contenthash:8].min.css',
})

const StyleLintPlugin = new _StyleLintPlugin({
  configFile: path.resolve(__dirname, '../.stylelintrc'),
  context: path.resolve(__dirname, '../src/scss'),
  files: '**/*.scss',
})

const SpriteLoaderPlugin = new _SpriteLoaderPlugin({
  plainSprite: true,
})

const WebpackBar = new _WebpackBar({
  color: '#ffe600',
})

module.exports = {
  BrowserSyncPlugin,
  CleanWebpackPlugin: new CleanWebpackPlugin(),
  ESLintPlugin,
  ManifestPlugin,
  MiniCssExtractPluginDev,
  MiniCssExtractPluginProd,
  StyleLintPlugin,
  SpriteLoaderPlugin,
  WebpackBar,
}

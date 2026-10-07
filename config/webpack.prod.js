const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const plugins = require('./plugins')
const loaders = require('./loaders')
const mode = 'production'

module.exports = merge(common, {
	mode,
	stats: 'minimal',
	output: {
		filename: '[name].js',
	},
	optimization: {
		concatenateModules: true,
	},
	plugins: plugins.get(mode),
	module: {
		rules: loaders.get(mode),
	},
})

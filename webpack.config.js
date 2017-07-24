const webpack = require('webpack');

const path = require('path');
var root = path.resolve( __dirname );

const ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('bundle.css');

module.exports = {
	entry: {
		app: ['./src/main.js']
		// app: ['./assets/css/style.scss', './assets/js/scripts.js']
	},
	output: {
		path: path.resolve( __dirname, './assets/js' ),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				include: root
			},
			{
				test: /\.css$/,
				loader: extractCSS.extract(['css-loader'])
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},
	plugins: [
		extractCSS,
		new webpack.optimize.UglifyJsPlugin({
			comments: false
		})
	]
}

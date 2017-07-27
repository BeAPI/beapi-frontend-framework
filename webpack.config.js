/**
 * Dependencies
 */
const webpack 					= require('webpack'),
	  path 						= require('path'),
	  ExtractTextPlugin 		= require('extract-text-webpack-plugin'),
	  OptimizeCssAssetsPlugin 	= require('optimize-css-assets-webpack-plugin');

var root = path.resolve( __dirname );

//var extractCSS = new ExtractTextPlugin('style.css');

module.exports = {
	entry: {
		app: ['./assets/css/style.scss', './assets/js/scripts.js']
	},
	output: {
		path: path.resolve( __dirname, './assets/js' ),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: root,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader?importLoaders=1', 'postcss-loader', 'resolve-url-loader' ],
				}),
			},
			{
		      	test: /\.(sass|scss)$/,
		      	loader: ExtractTextPlugin.extract([
		      		'css-loader',
		      		'sass-loader'
		      	])
		    },
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				use: ['url-loader?limit=100000']
			}
		]
	},
	plugins: [
		/**
		 * Styles
		 */
		
		// style.css
		new ExtractTextPlugin({
			filename: './../css/style.css',
			allChunks: true,
		}),
		// style.min.css
		new ExtractTextPlugin({
			filename: './../css/style.min.css',
			allChunks: true,
		}),
		// Minify style.min.css
		new OptimizeCssAssetsPlugin({
		    assetNameRegExp: /\.min\.css$/,
		    cssProcessorOptions: {
		    	discardComments: {
		    		removeAll: true
		    	}
		    }
		}),

		/**
		 * Scripts
		 */
		new webpack.optimize.UglifyJsPlugin({
			comments: false
		})
	]
}

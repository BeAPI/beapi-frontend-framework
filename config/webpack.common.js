const path = require('path')
const entries = require('./entries')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const svgoconfig = require('./svgo.config')

module.exports = {
	entry: entries,
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../dist'),
		publicPath: '',
		assetModuleFilename: 'assets/[hash][ext][query]',
	},
	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				minimizer: [
					{
						implementation: ImageMinimizerPlugin.sharpMinify,
						filter: (source, sourcePath) => !/\.svg$/i.test(sourcePath),
						options: {
							encodeOptions: {
								jpeg: {
									quality: 100,
									progressive: true,
								},
								jpg: {
									quality: 100,
									progressive: true,
								},
								png: {
									compressionLevel: 9,
								},
								gif: {},
							},
						},
					},
					{
						implementation: ImageMinimizerPlugin.svgoMinify,
						options: {
							encodeOptions: {
								multipass: true,
								...svgoconfig,
							},
						},
					},
				],
			}),
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					format: {
						comments: /translators:/i,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: ['__', '_n', '_nx', '_x'],
					},
				},
				extractComments: false,
			}),
		],
	},
	externals: {
		jquery: 'window.jQuery',
	},
}

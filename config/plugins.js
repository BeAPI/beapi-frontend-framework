const path = require('path')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const svgoconfig = require('./svgo.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const WebpackBar = require('webpackbar')
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const WebpackImageSizesPlugin = require('./webpack-image-sizes-plugin')
const WebpackThemeJsonPlugin = require('./webpack-theme-json-plugin')
const SpriteHashPlugin = require('./webpack-sprite-hash-plugin')
const WebpackStaticImagesPlugin = require('./webpack-static-images-plugin')

module.exports = {
	get: function (mode) {
		const isProduction = mode === 'production'
		// A single instance: `optimization.minimizer` is only `apply()`'d when `minimize: true`
		// (see webpack `WebpackOptionsApply.js`), so WebP `?as=webp` must live on the main
		// `plugins` list to work with `yarn start` / dev. Image minify runs on `processAssets`
		// from this same plugin in production only (keeps dev watch fast).
		const imageMinimizerOptions = {
			loader: true,
			generator: [
				{
					preset: 'webp',
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: ['imagemin-webp'],
					},
				},
			],
		}
		if (isProduction) {
			imageMinimizerOptions.minimizer = {
				implementation: ImageMinimizerPlugin.imageminMinify,
				options: {
					plugins: [
						['gifsicle', { interlaced: true }],
						['jpegtran', { progressive: true }],
						['optipng', { optimizationLevel: 5 }],
						['svgo', { svgoconfig }],
					],
				},
			}
		}
		const plugins = [
			new ImageMinimizerPlugin(imageMinimizerOptions),
			new WebpackThemeJsonPlugin({
				watch: mode !== 'production',
			}),
			new SpriteHashPlugin(),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['**/*', '!images', '!images/**'],
			}),
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
			new WebpackImageSizesPlugin({
				confImgPath: 'assets/conf-img', // Path to the conf-img folder
				sizesSubdir: 'sizes', // Subdirectory containing the sizes JSON files
				tplSubdir: 'tpl', // Subdirectory containing TPL templates
				outputImageLocations: 'image-locations.json', // Output locations file name
				outputImageSizes: 'image-sizes.json', // Output sizes file name
				generateDefaultImages: true, // Generate default images
				defaultImageSource: 'src/img/static/default.jpg', // Source image for generation
				defaultImagesOutputDir: 'dist/images', // Default images output directory
				defaultImageFormat: 'jpg', // Generated image format (jpg, png, webp, avif)
				silence: true, // Suppress console output
			}),
			new WebpackStaticImagesPlugin({
				inputDir: 'src/img/static',
				outputDir: 'dist/images',
				quality: 80,
				silence: false, // Suppress console output
			}),
		]

		if (mode === 'production') {
			plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: 'json',
					generateStatsFile: true,
				})
			)
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
				new MiniCssExtractPlugin({
					filename: '[name].css',
				})
			)
		}

		return plugins
	},
}

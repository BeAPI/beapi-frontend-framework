module.exports = [
	{
		loader: 'css-loader',
		options: {
			importLoaders: 1
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: (loader) => [
				require('autoprefixer')()
			]
		}
	}
];
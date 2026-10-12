module.exports = {
	plugins: [
		{
			name: 'preset-default',
		},
		{
			name: 'removeViewBox',
			active: false,
		},
		'removeTitle',
		'convertStyleToAttrs',
		'prefixIds',
	],
}

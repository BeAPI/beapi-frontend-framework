module.exports = {
	plugins: [
		{
			name: 'preset-default',
		},
		{
			name: 'removeViewBox',
			active: false,
		},
		// Plugins that are not in the "preset-default" and that you want to activate
		'removeTitle',
		'convertStyleToAttrs',
		'prefixIds',
	],
}

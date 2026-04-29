module.exports = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					// Disable a plugin included by default that you don't want (false)
					removeViewBox: false,
				},
			},
		},
		// Plugins that are not in the "preset-default" and that you want to activate
		'convertStyleToAttrs',
		'prefixIds',
	],
}

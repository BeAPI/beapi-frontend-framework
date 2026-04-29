/**
 * SVGO 3+ config for imagemin-svgo / svgo-loader.
 *
 * Format: SVGO 3 rejects the v2 style `{ cleanupAttrs: true }` (no `name` on plugin objects).
 *
 * Why not list every plugin like the old file?
 * - SVGO 3 expects either named plugins or `preset-default`, which bundles most optimizers
 *   (cleanupAttrs, removeComments, convertPathData, mergePaths, etc.) in a maintained order.
 *   Duplicating that full list in v3 `{ name, params }` form would be long and redundant.
 * - Reference: https://svgo.dev/docs/preset-default/
 *
 * Mapping from the previous v2 `{ plugin: boolean }` list:
 * - `true` on a built-in → usually covered by `preset-default` (see link above).
 * - `false` falls into two cases in SVGO 3:
 *   (A) Plugin is part of `preset-default` → turn it off with `params.overrides`
 *       (e.g. `removeViewBox: false` below — removeViewBox runs inside the preset by default).
 *   (B) Plugin is optional / not in the preset → do not list it; SVGO only runs plugins you
 *       declare. So “false” in v2 = omit the plugin name here.
 *       Examples from the old config:
 *       - removeDimensions: https://svgo.dev/docs/plugins/removeDimensions/ — optional; not in
 *         `preset-default`; we omit it so width/height stay (unless you add `'removeDimensions'`).
 *       - removeRasterImages: https://svgo.dev/docs/plugins/removeRasterImages/ — optional;
 *         not in `preset-default`; we omit it so embedded rasters are kept.
 * - Extra plugins the old list enabled but preset does not include:
 *   `convertStyleToAttrs`, `prefixIds` — listed explicitly below (sprites / ID stability).
 */
module.exports = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					removeViewBox: false,
				},
			},
		},
		'convertStyleToAttrs',
		'prefixIds',
	],
}

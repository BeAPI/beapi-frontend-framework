const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Webpack plugin to generate content hashes for SVG sprite files.
 * Creates a sprite-hashes.json file in the dist folder.
 */
class SpriteHashPlugin {
	constructor(options = {}) {
		this.options = {
			outputPath: options.outputPath || 'dist',
			spritePath: options.spritePath || 'dist/icons',
			outputFilename: options.outputFilename || 'sprite-hashes.json',
			hashLength: options.hashLength || 8,
		};
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync(
			'SpriteHashPlugin',
			(compilation, callback) => {
				const spriteDir = path.resolve(
					compiler.options.context,
					this.options.spritePath
				);
				const outputFile = path.resolve(
					compiler.options.context,
					this.options.outputPath,
					this.options.outputFilename
				);

				if (!fs.existsSync(spriteDir)) {
					console.warn(
						`SpriteHashPlugin: Sprite directory not found: ${spriteDir}`
					);
					callback();
					return;
				}

				const hashes = {};
				const files = fs
					.readdirSync(spriteDir)
					.filter((file) => file.endsWith('.svg'));

				files.forEach((file) => {
					const filePath = path.join(spriteDir, file);
					const content = fs.readFileSync(filePath);
					const hash = crypto
						.createHash('md5')
						.update(content)
						.digest('hex')
						.substring(0, this.options.hashLength);

					// Store with relative path as key
					const relativePath = `icons/${file}`;
					hashes[relativePath] = hash;
				});

				fs.writeFileSync(outputFile, JSON.stringify(hashes, null, 2));
				console.log(
					`SpriteHashPlugin: Generated ${
						this.options.outputFilename
					} with ${Object.keys(hashes).length} sprites`
				);

				callback();
			}
		);
	}
}

module.exports = SpriteHashPlugin;

const fs = require('fs')
const path = require('path')

let sharp

try {
	sharp = require('sharp')
} catch (error) {
	sharp = null
}

const IMAGE_EXT_PATTERN = /\.(png|jpe?g|gif|svg|webp|avif)$/i

/**
 * Parse intrinsic SVG dimensions (width/height attributes, then viewBox).
 *
 * @param {string} contents SVG file contents.
 * @return {{ width: number, height: number }|null}
 */
function getSvgDimensionsFromContents(contents) {
	if (!contents) {
		return null
	}

	const widthMatch = contents.match(/\bwidth="(\d+(?:\.\d+)?)"/)
	const heightMatch = contents.match(/\bheight="(\d+(?:\.\d+)?)"/)

	if (widthMatch && heightMatch) {
		return {
			width: Math.round(Number(widthMatch[1])),
			height: Math.round(Number(heightMatch[1])),
		}
	}

	const viewBoxMatch = contents.match(/\bviewBox="[\d.\s-]+?\s+([\d.]+)\s+([\d.]+)"/)

	if (viewBoxMatch) {
		return {
			width: Math.max(1, Math.round(Number(viewBoxMatch[1]))),
			height: Math.max(1, Math.round(Number(viewBoxMatch[2]))),
		}
	}

	return null
}

/**
 * Read width/height from a built image file under dist/.
 *
 * @param {string} filePath Absolute path to the image file.
 * @return {Promise<{ width: number, height: number }|null>}
 */
async function getImageDimensions(filePath) {
	if (!fs.existsSync(filePath)) {
		return null
	}

	if (/\.svg$/i.test(filePath)) {
		const contents = fs.readFileSync(filePath, 'utf8')
		return getSvgDimensionsFromContents(contents)
	}

	if (!sharp) {
		return null
	}

	try {
		const metadata = await sharp(filePath).metadata()

		if (!metadata.width || !metadata.height) {
			return null
		}

		return {
			width: metadata.width,
			height: metadata.height,
		}
	} catch (error) {
		return null
	}
}

/**
 * Webpack plugin: merge static image dimensions into dist/assets.json.
 */
class WebpackStaticImageDimensionsPlugin {
	constructor(options = {}) {
		this.options = {
			outputPath: 'dist',
			manifestFile: 'assets.json',
			imagesSubdir: 'images',
			...options,
		}
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync('WebpackStaticImageDimensionsPlugin', async (compilation, callback) => {
			try {
				const context = compiler.options.context
				const outputPath = path.resolve(context, this.options.outputPath)
				const manifestPath = path.join(outputPath, this.options.manifestFile)
				const imageDimensions = {}

				const assets = compilation.getAssets()

				for (const asset of assets) {
					if (!asset.name.startsWith(`${this.options.imagesSubdir}/`) || !IMAGE_EXT_PATTERN.test(asset.name)) {
						continue
					}

					const filePath = path.join(outputPath, asset.name)
					const dimensions = await getImageDimensions(filePath)

					if (!dimensions) {
						continue
					}

					const themeRelativePath = `dist/${asset.name.replace(/\\/g, '/')}`
					imageDimensions[themeRelativePath] = dimensions
				}

				let manifest = {}

				if (fs.existsSync(manifestPath)) {
					const raw = fs.readFileSync(manifestPath, 'utf8')
					const parsed = JSON.parse(raw)

					if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
						manifest = parsed
					}
				}

				manifest.imageDimensions = imageDimensions

				fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
				callback()
			} catch (error) {
				callback(error)
			}
		})
	}
}

module.exports = WebpackStaticImageDimensionsPlugin

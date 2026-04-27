const fs = require('fs')
const path = require('path')

// Try to require sharp, fallback gracefully if not available
let sharp
try {
	sharp = require('sharp')
} catch (error) {
	console.warn('⚠️ Sharp not available. WebP conversion will be disabled.')
}

/**
 * Webpack plugin to copy static images byte-for-byte and generate WebP derivatives with Sharp.
 */
class WebpackStaticImagesPlugin {
	/**
	 * Creates an instance of WebpackStaticImagesPlugin.
	 *
	 * @param {Object} [options={}] - Configuration options
	 * @param {string} [options.inputDir='src/img/static'] - Input directory
	 * @param {string} [options.outputDir='dist/images'] - Output directory
	 * @param {number} [options.quality=80] - WebP output quality (originals are not re-encoded)
	 * @param {boolean} [options.silence=false] - Disable console output
	 */
	constructor(options = {}) {
		this.options = {
			inputDir: 'src/img/static',
			outputDir: 'dist/images',
			quality: 80,
			silence: false,
			...options,
		}
		this.hasBeenBuiltOnce = false
	}

	/**
	 * Logs a message to the console if silence option is not enabled.
	 */
	log(level, ...args) {
		if (!this.options.silence) {
			console[level](...args)
		}
	}

	/**
	 * Entry point for Webpack.
	 */
	apply(compiler) {
		if (!sharp) {
			return
		} // If Sharp is not installed, silently cancel.

		compiler.hooks.compilation.tap('WebpackStaticImagesPlugin', (compilation) => {
			const inputPath = path.resolve(compiler.context, this.options.inputDir)
			if (fs.existsSync(inputPath)) {
				compilation.contextDependencies.add(inputPath)
			}
		})

		// Use afterEmit to ensure that Webpack has created the dist folder.
		compiler.hooks.afterEmit.tapPromise('WebpackStaticImagesPlugin', async (compilation) => {
			const { context } = compiler
			const inputPath = path.resolve(context, this.options.inputDir)
			const outputPath = path.resolve(context, this.options.outputDir)

			// Check if the source directory exists.
			if (!fs.existsSync(inputPath)) {
				this.log('warn', `⚠️ Source directory not found: ${inputPath}`)
				return
			}

			// Skip re-processing in watch when nothing under inputDir changed (see WebpackImageSizesPlugin).
			let hasChanges = false
			if (this.hasBeenBuiltOnce && compilation.modifiedFiles) {
				for (const filePath of compilation.modifiedFiles) {
					if (this.isFileUnderDir(filePath, inputPath)) {
						hasChanges = true
						break
					}
				}
			}

			if (this.hasBeenBuiltOnce && !hasChanges) {
				this.log('log', `✅ No changes detected in ${this.options.inputDir}`)
				return
			}

			this.hasBeenBuiltOnce = true

			// Create the output directory if it doesn't exist.
			if (!fs.existsSync(outputPath)) {
				fs.mkdirSync(outputPath, { recursive: true })
			}

			try {
				this.log('log', '🔄 Starting static images processing...')
				await this.processImages(inputPath, outputPath)
				this.log('log', '🎉 Static images processing completed!')
			} catch (error) {
				this.log('error', '❌ Error during static images processing:', error)
			}
		})
	}

	/**
	 * Returns true if `filePath` is `inputDir` or a file inside it (cross-platform).
	 */
	isFileUnderDir(filePath, inputDirResolved) {
		const resolvedFile = path.resolve(filePath)
		const resolvedDir = path.resolve(inputDirResolved)
		if (resolvedFile === resolvedDir) {
			return true
		}
		const relative = path.relative(resolvedDir, resolvedFile)
		return !relative.startsWith('..') && !path.isAbsolute(relative)
	}

	/**
	 * Processes the images in the directory.
	 */
	async processImages(inputPath, outputPath) {
		const files = fs.readdirSync(inputPath)
		const promises = []
		let count = 0

		for (const file of files) {
			// Only process JPG and PNG files.
			if (file.match(/\.(png|jpe?g)$/i)) {
				const filePath = path.join(inputPath, file)
				const fileName = path.parse(file).name

				// Create the output paths.
				const outputOriginal = path.join(outputPath, file)
				const outputWebp = path.join(outputPath, `${fileName}.webp`)

				// Byte copy preserves source quality, EXIF/ICC, etc. WebP is generated separately.
				const copyPromise = fs.promises.copyFile(filePath, outputOriginal)
				const webpPromise = sharp(filePath).webp({ quality: this.options.quality }).toFile(outputWebp)

				const filePromise = Promise.all([copyPromise, webpPromise])
					.then(() => {
						this.log('log', `  ✅ ${file} (original copied, .webp generated)`)
					})
					.catch((err) => {
						this.log('error', `  ❌ Error on ${file}:`, err.message)
					})

				promises.push(filePromise)
				count++
			}
		}

		// Wait for all images to be generated before returning to Webpack.
		if (count > 0) {
			await Promise.all(promises)
		} else {
			this.log('log', '  ℹ️ No images to process in the directory.')
		}
	}
}

module.exports = WebpackStaticImagesPlugin

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
 * Webpack plugin to copy and automatically convert static images in a folder to WebP.
 */
class WebpackStaticImagesPlugin {
	/**
	 * Creates an instance of WebpackStaticImagesPlugin.
	 *
	 * @param {Object} [options={}] - Configuration options
	 * @param {string} [options.inputDir='src/img/static'] - Input directory
	 * @param {string} [options.outputDir='dist/images'] - Output directory
	 * @param {number} [options.quality=80] - WebP compression quality
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

				// Prepare the Sharp instances.
				// (Sharp returns Promises, it is crucial to wait for them.)
				const copyPromise = sharp(filePath).toFile(outputOriginal)
				const webpPromise = sharp(filePath).webp({ quality: this.options.quality }).toFile(outputWebp)

				// Group the two actions for this file.
				const filePromise = Promise.all([copyPromise, webpPromise])
					.then(() => {
						this.log('log', `  ✅ Converted: ${file} (+ .webp version)`)
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

const fs = require('fs')
const path = require('path')
const { optimize } = require('svgo')
const svgoConfig = require('./svgo.config')

/**
 * Webpack plugin that writes optimized standalone SVG files from icon sources.
 * Sprite sheets under dist/icons are unchanged; this mirrors src/img/icons/** into dist/images/**.
 *
 * @class WebpackIconFilesPlugin
 */
class WebpackIconFilesPlugin {
	/**
	 * @param {Object} [options={}] Plugin options.
	 * @param {string} [options.sourcePath='src/img/icons'] Source icons directory.
	 * @param {string} [options.outputPath='dist/images'] Output directory (subfolders preserved).
	 * @param {boolean} [options.silence=false] Suppress console output.
	 */
	constructor(options = {}) {
		this.options = {
			sourcePath: 'src/img/icons',
			outputPath: 'dist/images',
			silence: false,
			...options,
		}
	}

	/**
	 * @param {string} level Log level.
	 * @param {...any} args Log arguments.
	 */
	log(level, ...args) {
		if (!this.options.silence) {
			console[level](...args)
		}
	}

	/**
	 * @param {string} directory Directory to scan.
	 * @return {string[]} Absolute paths to SVG files.
	 */
	collectSvgFiles(directory) {
		const files = []

		if (!fs.existsSync(directory)) {
			return files
		}

		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			const fullPath = path.join(directory, entry.name)

			if (entry.isDirectory()) {
				files.push(...this.collectSvgFiles(fullPath))
				continue
			}

			if (entry.name.endsWith('.svg')) {
				files.push(fullPath)
			}
		}

		return files
	}

	/**
	 * @param {import('webpack').Compiler} compiler Webpack compiler.
	 */
	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync('WebpackIconFilesPlugin', (compilation, callback) => {
			const context = compiler.options.context
			const sourceDir = path.resolve(context, this.options.sourcePath)
			const outputDir = path.resolve(context, this.options.outputPath)
			const svgFiles = this.collectSvgFiles(sourceDir)

			if (svgFiles.length === 0) {
				callback()
				return
			}

			let written = 0

			for (const sourceFile of svgFiles) {
				const relativePath = path.relative(sourceDir, sourceFile)
				const destFile = path.join(outputDir, relativePath)

				fs.mkdirSync(path.dirname(destFile), { recursive: true })

				const input = fs.readFileSync(sourceFile, 'utf8')
				const result = optimize(input, {
					path: sourceFile,
					...svgoConfig,
				})

				if (result.error) {
					console.warn(`WebpackIconFilesPlugin: SVGO failed for ${relativePath}: ${result.error}`)
					continue
				}

				fs.writeFileSync(destFile, result.data)
				written++
			}

			this.log('log', `WebpackIconFilesPlugin: Wrote ${written} optimized SVG(s) to ${this.options.outputPath}`)

			callback()
		})
	}
}

module.exports = WebpackIconFilesPlugin

const fs = require('fs')
const path = require('path')

// Try to require sharp, fallback gracefully if not available
let sharp
try {
  sharp = require('sharp')
} catch (error) {
  // Note: This warning is shown before plugin instantiation, so silence option doesn't apply here
  console.warn('⚠️  Sharp not available. Default image generation will be disabled.')
}

/**
 * Webpack plugin that generates image-locations.json and image-sizes.json files
 * by parsing JSON files in sizes/ subdirectory and TPL files in tpl/ subdirectory.
 *
 * @class WebpackImageSizesPlugin
 */
class WebpackImageSizesPlugin {
  /**
   * Creates an instance of WebpackImageSizesPlugin.
   *
   * @param {Object} [options={}] - Plugin configuration options
   * @param {string} [options.confImgPath='assets/conf-img'] - Path to the conf-img directory
   * @param {string} [options.sizesSubdir='sizes'] - Subdirectory containing JSON size files
   * @param {string} [options.tplSubdir='tpl'] - Subdirectory containing TPL template files
   * @param {string} [options.outputImageLocations='image-locations.json'] - Output filename for image locations
   * @param {string} [options.outputImageSizes='image-sizes.json'] - Output filename for image sizes
   * @param {boolean} [options.generateDefaultImages=false] - Whether to generate default images
   * @param {string} [options.defaultImageSource='src/img/static/default.jpg'] - Path to the source image for generating defaults
   * @param {string} [options.defaultImagesOutputDir='dist/images'] - Directory where default images will be generated
   * @param {string} [options.defaultImageFormat='jpg'] - Format for generated images (jpg, png, webp, avif)
   * @param {boolean} [options.silence=false] - Whether to suppress console output
   * @memberof WebpackImageSizesPlugin
   */
  constructor(options = {}) {
    this.options = {
      confImgPath: 'assets/conf-img',
      sizesSubdir: 'sizes',
      tplSubdir: 'tpl',
      outputImageLocations: 'image-locations.json',
      outputImageSizes: 'image-sizes.json',
      generateDefaultImages: false,
      defaultImageSource: 'src/img/static/default.jpg',
      defaultImagesOutputDir: 'dist/images',
      defaultImageFormat: 'jpg',
      silence: false,
      ...options,
    }

    this.hasBeenBuiltOnce = false
  }

  /**
   * Logs a message to the console if silence option is not enabled.
   *
   * @param {string} level - Log level ('log', 'warn', 'error')
   * @param {...any} args - Arguments to pass to console method
   * @memberof WebpackImageSizesPlugin
   */
  log(level, ...args) {
    if (!this.options.silence) {
      console[level](...args)
    }
  }

  /**
   * Applies the plugin to the webpack compiler.
   * Sets up hooks for initial build and watch mode rebuilds.
   *
   * @param {Object} compiler - The webpack compiler instance
   * @memberof WebpackImageSizesPlugin
   */
  apply(compiler) {
    const context = compiler.context
    const confImgPath = path.resolve(context, this.options.confImgPath)
    const sizesPath = path.join(confImgPath, this.options.sizesSubdir)
    const tplPath = path.join(confImgPath, this.options.tplSubdir)

    // Execute on first build and each rebuild
    const runGeneration = async (compilation, callback) => {
      try {
        let hasChanges = false

        // Check if there are any changes in the conf-img directory
        // Assumes that no modified files means the start of the build (yarn start || yarn build)
        if (this.hasBeenBuiltOnce && compilation.modifiedFiles) {
          for (const filePath of compilation.modifiedFiles) {
            if (filePath.includes(this.options.confImgPath)) {
              hasChanges = true
            }
          }
        }

        if (this.hasBeenBuiltOnce && !hasChanges) {
          this.log('log', `✅ No changes detected in ${this.options.confImgPath}`)

          if (callback) {
            callback()
          }

          return
        }

        this.hasBeenBuiltOnce = true

        this.log('log', '🔧 Starting WebpackImageSizesPlugin generation...')

        // Check for deleted/renamed files if output files already exist
        this.checkForDeletedFiles(confImgPath, sizesPath, tplPath)

        // Generate image-locations.json from JSON and TPL files
        const imageLocations = this.generateImageLocations(sizesPath, tplPath)

        // Generate image-sizes.json from JSON files and TPL files
        const imageSizes = this.generateImageSizes(sizesPath, tplPath, imageLocations)

        // Write output files
        const imageLocationsPath = path.join(confImgPath, this.options.outputImageLocations)
        const imageSizesPath = path.join(confImgPath, this.options.outputImageSizes)

        fs.writeFileSync(imageLocationsPath, JSON.stringify(imageLocations, null, 2))
        fs.writeFileSync(imageSizesPath, JSON.stringify(imageSizes, null, 2))

        this.log('log', `✅ Generated ${this.options.outputImageLocations} and ${this.options.outputImageSizes}`)

        // Generate default images if option is enabled
        if (this.options.generateDefaultImages) {
          await this.generateDefaultImages(context, imageSizes)
        }

        if (callback) {
          callback()
        }
      } catch (error) {
        this.log('error', '❌ Error in WebpackImageSizesPlugin:', error)
        if (callback) {
          callback(error)
        }
      }
    }

    // Hook for initial build
    compiler.hooks.emit.tapAsync('WebpackImageSizesPlugin', runGeneration)

    // Hook for rebuilds in watch mode
    compiler.hooks.watchRun.tapAsync('WebpackImageSizesPlugin', (compilation, callback) => {
      this.log('log', '👀 Watch mode: checking for conf-img changes...')
      runGeneration(compilation, callback)
    })

    // Add directories to watch
    compiler.hooks.compilation.tap('WebpackImageSizesPlugin', (compilation) => {
      // Watch configuration directories
      if (fs.existsSync(sizesPath)) {
        compilation.contextDependencies.add(sizesPath)
        this.log('log', '📁 Added sizes directory to watch dependencies')
      }
      if (fs.existsSync(tplPath)) {
        compilation.contextDependencies.add(tplPath)
        this.log('log', '📁 Added tpl directory to watch dependencies')
      }
    })
  }

  /**
   * Generates image sizes configuration by parsing JSON files in the sizes directory
   * and extracting sizes from TPL files.
   *
   * @param {string} sizesPath - Path to the sizes directory containing JSON files
   * @param {string} tplPath - Path to the tpl directory containing template files
   * @param {Array} imageLocations - Generated image locations to extract additional sizes
   * @returns {Array} Array containing image sizes configuration object
   * @memberof WebpackImageSizesPlugin
   */
  generateImageSizes(sizesPath, tplPath, imageLocations) {
    // Completely reset image sizes
    const imageSizes = [{}]
    const allSizes = new Set() // To avoid duplicates

    if (!fs.existsSync(sizesPath)) {
      this.log('warn', `⚠️  Sizes directory not found: ${sizesPath}`)
      return imageSizes
    }

    const sizeFiles = fs.readdirSync(sizesPath).filter((file) => file.endsWith('.json'))
    this.log('log', `📋 Processing ${sizeFiles.length} size files: ${sizeFiles.join(', ')}`)

    sizeFiles.forEach((file) => {
      try {
        const filePath = path.join(sizesPath, file)
        const sizesData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        // Convert sizes to image-sizes.json format
        sizesData.forEach((size) => {
          const sizeKey = `img-${size.width}-${size.height}`

          // Avoid duplicates between files
          if (!allSizes.has(sizeKey)) {
            allSizes.add(sizeKey)
            imageSizes[0][sizeKey] = {
              width: size.width.toString(),
              height: size.height.toString(),
              crop: size.crop,
            }
          }
        })
      } catch (error) {
        this.log('error', `❌ Error parsing ${file}:`, error)
      }
    })

    // Extract additional sizes from TPL files that are not in JSON files
    this.extractSizesFromTPLFiles(tplPath, imageLocations, imageSizes[0], allSizes)

    this.log('log', `📐 Generated ${Object.keys(imageSizes[0]).length} unique image sizes`)
    return imageSizes
  }

  /**
   * Extracts image sizes from TPL files and adds them to the sizes configuration.
   * This method parses image locations to find sizes that are referenced in TPL files
   * but not defined in JSON files.
   *
   * @param {string} tplPath - Path to the tpl directory
   * @param {Array} imageLocations - Generated image locations containing srcsets
   * @param {Object} imageSizesObj - Image sizes object to populate
   * @param {Set} allSizes - Set of already processed sizes to avoid duplicates
   * @memberof WebpackImageSizesPlugin
   */
  extractSizesFromTPLFiles(tplPath, imageLocations, imageSizesObj, allSizes) {
    if (!fs.existsSync(tplPath) || !imageLocations[0]) {
      return
    }

    // Extract all unique sizes from image locations
    const tplSizes = new Set()

    Object.values(imageLocations[0]).forEach((locationArray) => {
      locationArray.forEach((location) => {
        if (location.srcsets) {
          location.srcsets.forEach((srcset) => {
            if (srcset.size && srcset.size.startsWith('img-')) {
              tplSizes.add(srcset.size)
            }
          })
        }
      })
    })

    // Add sizes that are not already defined
    tplSizes.forEach((sizeKey) => {
      if (!allSizes.has(sizeKey)) {
        // Extract width and height from size key (e.g., "img-100-100" -> width: 100, height: 100)
        const matches = sizeKey.match(/img-(\d+)-(\d+)/)
        if (matches) {
          const width = matches[1]
          const height = matches[2]

          allSizes.add(sizeKey)
          imageSizesObj[sizeKey] = {
            width: width,
            height: height,
            crop: true, // Default crop value for TPL-extracted sizes
          }

          this.log('log', `🎨 Added size from TPL: ${sizeKey}`)
        }
      }
    })
  }

  /**
   * Generates image locations configuration by parsing JSON and TPL files.
   *
   * @param {string} sizesPath - Path to the sizes directory containing JSON files
   * @param {string} tplPath - Path to the tpl directory containing template files
   * @returns {Array} Array containing image locations configuration object
   * @memberof WebpackImageSizesPlugin
   */
  generateImageLocations(sizesPath, tplPath) {
    // Completely reset image locations
    const imageLocations = [{}]
    const processedFiles = new Set() // For tracking processed files

    if (!fs.existsSync(sizesPath)) {
      this.log('warn', `⚠️  Sizes directory not found: ${sizesPath}`)
      return imageLocations
    }

    // Process JSON files in sizes/ first
    const sizeFiles = fs.readdirSync(sizesPath).filter((file) => file.endsWith('.json'))
    this.log('log', `📋 Processing ${sizeFiles.length} JSON files from sizes/: ${sizeFiles.join(', ')}`)

    sizeFiles.forEach((file) => {
      try {
        const filename = path.basename(file, '.json')
        const filePath = path.join(sizesPath, file)
        const sizesData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        // Generate srcsets from sizes
        const srcsets = sizesData.map((size) => ({
          size: `img-${size.width}-${size.height}`,
        }))

        imageLocations[0][filename] = [
          {
            srcsets: srcsets,
          },
        ]

        processedFiles.add(filename)
      } catch (error) {
        this.log('error', `❌ Error parsing JSON ${file}:`, error)
      }
    })

    // Then process TPL files for unprocessed or missing files
    if (fs.existsSync(tplPath)) {
      const tplFiles = fs.readdirSync(tplPath).filter((file) => file.endsWith('.tpl'))
      this.log('log', `📋 Processing ${tplFiles.length} TPL files: ${tplFiles.join(', ')}`)

      tplFiles.forEach((file) => {
        try {
          const filename = path.basename(file, '.tpl')
          const filePath = path.join(tplPath, file)
          const tplContent = fs.readFileSync(filePath, 'utf8')

          // Extract sizes from templates (pattern %%img-width-height%%)
          const sizeMatches = tplContent.match(/%%img-(\d+)-(\d+)%%/g)

          // Process only if not already processed by a JSON file or no JSON match
          if (sizeMatches && !processedFiles.has(filename)) {
            const srcsets = [...new Set(sizeMatches)].map((match) => {
              const size = match.replace(/%%/g, '')
              return { size }
            })

            imageLocations[0][filename] = [
              {
                srcsets: srcsets,
              },
            ]

            processedFiles.add(filename)
            this.log('log', `📝 Added location from TPL: ${filename}`)
          }
        } catch (error) {
          this.log('error', `❌ Error parsing TPL ${file}:`, error)
        }
      })
    }

    const totalEntries = Object.keys(imageLocations[0]).length
    this.log('log', `📍 Generated ${totalEntries} image locations (${processedFiles.size} files processed)`)

    // Log processed files for debugging
    if (processedFiles.size > 0) {
      this.log('log', `✅ Processed files: ${Array.from(processedFiles).join(', ')}`)
    }

    return imageLocations
  }

  /**
   * Generates default images from the source image based on image sizes configuration.
   *
   * @param {string} compilerContext - The webpack compiler context path
   * @param {Array} imageSizes - Array containing image sizes configuration
   * @memberof WebpackImageSizesPlugin
   */
  async generateDefaultImages(compilerContext, imageSizes) {
    if (!sharp) {
      this.log('warn', '⚠️  Sharp not available. Skipping default image generation.')
      return
    }

    const sourceImagePath = path.resolve(compilerContext, this.options.defaultImageSource)
    const outputDir = path.resolve(compilerContext, this.options.defaultImagesOutputDir)

    if (!fs.existsSync(sourceImagePath)) {
      this.log('warn', `⚠️  Source image not found: ${sourceImagePath}`)
      return
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const sizesObj = imageSizes[0] || {}
    const sizeKeys = Object.keys(sizesObj)
    const format = this.options.defaultImageFormat.toLowerCase()

    // Validate format
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif']
    if (!supportedFormats.includes(format)) {
      this.log('warn', `⚠️  Unsupported format '${format}'. Using 'jpg' instead.`)
      this.options.defaultImageFormat = 'jpg'
    }

    this.log(
      'log',
      `🖼️  Generating ${sizeKeys.length} default images (${format.toUpperCase()}) from ${
        this.options.defaultImageSource
      }`
    )

    const promises = sizeKeys.map(async (sizeKey) => {
      const size = sizesObj[sizeKey]
      const width = parseInt(size.width)
      const height = parseInt(size.height)
      const outputFilename = `default-${width}-${height}.${this.options.defaultImageFormat}`
      const outputPath = path.join(outputDir, outputFilename)

      try {
        let sharpInstance = sharp(sourceImagePath)

        if (size.crop) {
          // Crop and resize to exact dimensions
          sharpInstance = sharpInstance.resize(width, height, {
            fit: 'cover',
            position: 'center',
          })
        } else {
          // Resize maintaining aspect ratio
          sharpInstance = sharpInstance.resize(width, height, {
            fit: 'inside',
            withoutEnlargement: false,
          })
        }

        // Apply format-specific options
        const formatOptions = this.getFormatOptions(this.options.defaultImageFormat)
        await sharpInstance[formatOptions.method](formatOptions.options).toFile(outputPath)

        this.log('log', `✨ Generated: ${outputFilename} (${width}x${height}${size.crop ? ', cropped' : ''})`)
      } catch (error) {
        this.log('error', `❌ Error generating ${outputFilename}:`, error.message)
      }
    })

    await Promise.all(promises)
    this.log('log', `🎉 Default image generation completed!`)
  }

  /**
   * Gets format-specific Sharp options for different image formats.
   *
   * @param {string} format - The image format (jpg, png, webp, avif)
   * @returns {Object} Object containing Sharp method and options
   * @memberof WebpackImageSizesPlugin
   */
  getFormatOptions(format) {
    const formatLower = format.toLowerCase()

    const formatConfigs = {
      jpg: {
        method: 'jpeg',
        options: { quality: 80, progressive: true },
      },
      jpeg: {
        method: 'jpeg',
        options: { quality: 80, progressive: true },
      },
      png: {
        method: 'png',
        options: { quality: 80, progressive: true },
      },
      webp: {
        method: 'webp',
        options: { quality: 80, effort: 4 },
      },
      avif: {
        method: 'avif',
        options: { quality: 80, effort: 4 },
      },
    }

    return formatConfigs[formatLower] || formatConfigs.jpg
  }

  /**
   * Checks for deleted or renamed files by comparing current files with existing configuration.
   *
   * @param {string} confImgPath - Path to the conf-img directory
   * @param {string} sizesPath - Path to the sizes directory
   * @param {string} tplPath - Path to the tpl directory
   * @memberof WebpackImageSizesPlugin
   */
  checkForDeletedFiles(confImgPath, sizesPath, tplPath) {
    const imageLocationsPath = path.join(confImgPath, this.options.outputImageLocations)

    // Check if image-locations.json file already exists
    if (!fs.existsSync(imageLocationsPath)) {
      this.log('log', '📄 No existing image-locations.json found, creating fresh files')
      return
    }

    try {
      // Read existing file
      const existingData = JSON.parse(fs.readFileSync(imageLocationsPath, 'utf8'))
      const existingEntries = Object.keys(existingData[0] || {})

      // Get current files
      const currentSizeFiles = fs.existsSync(sizesPath)
        ? fs
            .readdirSync(sizesPath)
            .filter((file) => file.endsWith('.json'))
            .map((file) => path.basename(file, '.json'))
        : []

      const currentTplFiles = fs.existsSync(tplPath)
        ? fs
            .readdirSync(tplPath)
            .filter((file) => file.endsWith('.tpl'))
            .map((file) => path.basename(file, '.tpl'))
        : []

      const currentFiles = [...new Set([...currentSizeFiles, ...currentTplFiles])]

      // Detect deleted files
      const deletedFiles = existingEntries.filter((entry) => !currentFiles.includes(entry))

      if (deletedFiles.length > 0) {
        this.log('log', `🗑️  Detected ${deletedFiles.length} deleted/renamed files: ${deletedFiles.join(', ')}`)
        this.log('log', '   → These entries will be removed from generated files')
      }

      // Detect new files
      const newFiles = currentFiles.filter((file) => !existingEntries.includes(file))

      if (newFiles.length > 0) {
        this.log('log', `📂 Detected ${newFiles.length} new files: ${newFiles.join(', ')}`)
        this.log('log', '   → These entries will be added to generated files')
      }

      if (deletedFiles.length === 0 && newFiles.length === 0) {
        this.log('log', '📋 No file changes detected')
      }
    } catch (error) {
      this.log('warn', '⚠️  Could not read existing image-locations.json:', error.message)
    }
  }
}

// ----
// export
// ----
module.exports = WebpackImageSizesPlugin

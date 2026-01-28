const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const logId = '[' + chalk.blue('WebpackThemeJsonPlugin') + ']'

class WebpackThemeJsonPlugin {
	/**
	 * constructor
	 * @param {Object} options = {
	 *                         context: string - default: '../src/theme-json'
	 *                         output: string - default: '../theme.json'
	 *                         scssOutput: string - default: '../src/scss/00-variables/_theme-json.scss'
	 *                         watch: boolean - default: false
	 *                         }
	 */
	constructor(options) {
		// folders
		this._context = options.context || path.resolve(__dirname, '../src/theme-json') + '/'
		this._output = options.output || path.resolve(__dirname, '../theme.json')
		this._scssOutput = options.scssOutput || path.resolve(__dirname, '../src/scss/01-abstract/_theme-json.scss')

		if (options.watch) {
			fs.watch(this._context, () => {
				this.refresh()
			})
		}

		this.refresh()
	}

	/**
	 * apply
	 */
	apply() {}

	/**
	 * Generate theme json file
	 */
	generateThemeJson() {
		const jsonFiles = fs.readdirSync(this._context, {
			withFileTypes: true,
		})
		const themeJson = {}

		jsonFiles.forEach((file) => {
			if (file.isFile() && file.name.endsWith('.json')) {
				let json = fs.readFileSync(this._context + file.name, 'utf8')

				try {
					json = JSON.parse(json)
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(logId, 'Error parsing JSON file:', file.name)
				}

				if (isPlainObject(json)) {
					extend(true, themeJson, json)
				} else {
					// eslint-disable-next-line no-console
					console.error(logId, 'JSON file is not a plain object:', file.name)
				}
			}
		})

		fs.writeFileSync(this._output, JSON.stringify(themeJson, null, 2))
		// eslint-disable-next-line no-console
		console.log(logId, 'JSON files successfully generated !')

		return this
	}

	/**
	 * Generate scss variables file
	 */
	generateScssVariables() {
		const comment = [
			'/**',
			' * Theme JSON',
			' * scss variables are extracted from theme.json',
			' *',
			" * !!! DON'T EDIT THIS FILE !!!",
			' *',
			' */',
		]
		const tasks = {
			'settings-color-palette'(key, value) {
				let result = ''
				const palette = []

				for (const color of value) {
					const colorVar = getVariableName('settings-color-' + color.slug)
					result += `${colorVar}: ${color.color};\n`
					palette.push(`${color.slug}: ${colorVar}`)
				}

				return result + `$settings-palette: (${palette.join(', ')});\n`
			},
			'settings-custom': 'default',
			'settings-spacing-spacingSizes'(key, value) {
				let result = ''

				for (const spacing of value) {
					result += `${getVariableName('settings-spacing-' + spacing.slug)}: ${spacing.size};\n`
				}

				return result
			},
		}
		// eslint-disable-next-line @wordpress/no-unused-vars-before-return
		const taskNames = Object.keys(tasks)
		let jsonFile = fs.readFileSync(this._output, 'utf8')

		// check if the theme.json file is valid
		try {
			jsonFile = JSON.parse(jsonFile)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(logId, 'Error parsing JSON file:', this._output)
			return this
		}

		// format the scss variable name
		function getVariableName(id) {
			return `$${id.replace(/([A-Z])/g, '-$1').toLowerCase()}`
		}

		// traverse the theme.json file and generate the scss variables
		function traverse(obj, parents = [], result = '') {
			for (const key in obj) {
				const id = (parents.length > 0 ? parents.join('-') + '-' : '') + key
				const taskName = taskNames.filter((t) => (id.startsWith(t) ? t : null))[0]
				const task = taskName ? tasks[taskName] : null

				if (isPlainObject(obj[key])) {
					result += traverse(obj[key], [...parents, key])
				} else if (task) {
					if (task === 'default' && typeof obj[key] === 'string') {
						result += `${getVariableName(id)}: ${obj[key]};\n`
					} else if (typeof task === 'function') {
						result += task(key, obj[key])
					}
				}
			}

			return result
		}

		fs.writeFileSync(this._scssOutput, comment.join('\n') + '\n' + traverse(jsonFile))

		return this
	}

	/**
	 * Refresh the theme json and scss variables files
	 */
	refresh() {
		this.generateThemeJson()
		this.generateScssVariables()
		return this
	}
}

// ----
// utils
// ----
function isPlainObject(o) {
	return o?.constructor === Object || Object.getPrototypeOf(o ?? 0) === null
}

function extend() {
	const args = arguments
	const firstArgIsBool = typeof args[0] === 'boolean'
	const deep = firstArgIsBool ? args[0] : false
	const start = firstArgIsBool ? 1 : 0
	const rt = isPlainObject(args[start]) ? args[start] : {}

	for (let i = start + 1; i < args.length; i++) {
		for (const prop in args[i]) {
			if (deep && isPlainObject(args[i][prop])) {
				rt[prop] = extend(true, {}, rt[prop], args[i][prop])
			} else if (typeof args[i][prop] !== 'undefined') {
				rt[prop] = args[i][prop]
			}
		}
	}

	return rt
}

module.exports = WebpackThemeJsonPlugin

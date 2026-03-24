const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const logId = '[' + chalk.blue('WebpackBrowserSyncPlugin') + ']'

/**
 * Dev-only: BrowserSync + HMR
 *
 * To use BrowserSync (BS) or Hot Module Replacement (HMR), you must define the following environment variables.
 * Two modes are available:
 * - BROWSER_SYNC_APP_URL
 * - BROWSER_SYNC_APP_PORT
 * - BROWSER_SYNC_APP_IP
 *
 * "host" mode
 * Enables live reloading in your local environment by using the domain name to configure the proxy.
 *
 * "ip" mode
 * Uses an IP address for the proxy.
 * By entering your local IP, you can access and preview your environment from another device (such as a mobile phone) on the same network.
 *
 * Use yarn scripts to start the development server: `yarn start:host` | `yarn start:ip`.
 */
class WebpackBrowserSyncPlugin {
	/**
	 * @param {'development'|'production'|string} mode Webpack mode from `plugins.get(mode)`.
	 * @returns {import('webpack').WebpackPluginInstance[]} Empty in production.
	 */
	static getPlugins(mode) {
		if (mode === 'production') {
			return []
		}

		const hotReload = this.resolveMode()

		if (hotReload === '') {
			return []
		}

		const env = this.getLocalAppEnv()
		const issues = this.collectBrowserSyncConfigIssues(hotReload, env)
		if (issues.missing.length > 0) {
			this.fatalConfig(hotReload, issues)
		}

		const parsed = this.parseAppConnection(env)
		if (!parsed) {
			this.fatalConfig(hotReload, { missing: ['BROWSER_SYNC_APP_URL'] })
		}

		const { appUrl, urlHadPort, wordPressPort, localAppPortStr } = parsed

		const browserSyncPort = this.pickBrowserSyncPort(wordPressPort, localAppPortStr, urlHadPort)

		let appHost = appUrl.replace(/^https?:\/\//i, '').replace(/:\d+$/, '')
		let appIp = String(env.BROWSER_SYNC_APP_IP || '')
			.trim()
			.replace(/:\d+$/, '')

		/** @type {import('browser-sync').Options} */
		const browserSyncConfig = {
			injectCss: true,
			proxy: appUrl,
			port: browserSyncPort,
			files: ['**/*.php', 'dist/images/**/*', 'dist/icons/**/*', 'dist/fonts/**/*', 'dist/**/*.css', 'dist/**/*.js'],
			open: false,
			reloadDelay: 0,
			notify: true,
			injectNotification: true,
		}

		if (hotReload === 'host') {
			Object.assign(browserSyncConfig, { host: appHost })
		}

		if (hotReload === 'ip') {
			Object.assign(browserSyncConfig, { host: appIp })
		}

		// eslint-disable-next-line no-console
		console.log(logId, 'BrowserSync enabled (' + chalk.green(hotReload) + '), proxy:', chalk.cyan(appUrl))
		// eslint-disable-next-line no-console
		console.log(
			logId,
			chalk.dim(
				'BS listen: ' +
					chalk.bold(':' + browserSyncPort) +
					'  |  WordPress port (proxy): ' +
					chalk.bold(String(wordPressPort)) +
					(urlHadPort
						? localAppPortStr
							? '  |  BROWSER_SYNC_APP_PORT = BrowserSync port'
							: '  |  BROWSER_SYNC_APP_PORT unset → BS default port'
						: '  |  BROWSER_SYNC_APP_PORT = WordPress port (URL had no port)')
			)
		)
		// eslint-disable-next-line no-console
		console.log(logId, chalk.dim('Use BrowserSync Local / External URL below, not the WordPress URL directly.'))

		return [
			new webpack.HotModuleReplacementPlugin(),
			new BrowserSyncPlugin(browserSyncConfig, {
				reload: false,
			}),
		]
	}

	/**
	 * @returns {null|{ appUrl: string, urlHadPort: boolean, wordPressPort: number, localAppPortStr: string }}
	 */
	static parseAppConnection(env) {
		let base = String(env.BROWSER_SYNC_APP_URL || '').trim()
		const localPort = String(env.BROWSER_SYNC_APP_PORT || '').trim()

		if (!base) {
			return null
		}

		if (!/^https?:\/\//i.test(base)) {
			base = 'http://' + base
		}

		try {
			const url = new URL(base)
			const urlHadPort = Boolean(url.port)
			if (!urlHadPort && localPort) {
				url.port = localPort
			}
			const appUrl = url.toString().replace(/\/+$/, '')
			const u2 = new URL(appUrl)
			const wordPressPort = u2.port ? Number.parseInt(u2.port, 10) : u2.protocol === 'https:' ? 443 : 80

			return {
				appUrl,
				urlHadPort,
				wordPressPort,
				localAppPortStr: localPort,
			}
		} catch {
			return null
		}
	}

	/**
	 * @param {number} wordPressPort
	 * @param {string} localAppPortStr
	 * @param {boolean} urlHadPort
	 * @returns {number}
	 */
	static pickBrowserSyncPort(wordPressPort, localAppPortStr, urlHadPort) {
		const wp = wordPressPort
		const preferredRaw = Number.parseInt(String(localAppPortStr || '').trim(), 10)
		const hasPreferred = Number.isFinite(preferredRaw) && preferredRaw > 0

		let candidate
		if (urlHadPort) {
			if (hasPreferred) {
				candidate = preferredRaw
			} else {
				candidate = 8080
			}
		} else {
			candidate = 8080
		}

		let warned = false
		let safety = 0
		while (candidate === wp && safety < 10000) {
			if (!warned) {
				warned = true
				// eslint-disable-next-line no-console
				console.warn(
					logId,
					chalk.yellow('BrowserSync port would match WordPress port ' + wp + '. Using next available port.')
				)
			}
			candidate++
			if (candidate > 65535) {
				candidate = 3000
			}
			safety++
		}

		return candidate
	}

	/**
	 * @returns {''|'host'|'ip'}
	 */
	static resolveMode() {
		const fromEnv = String(process.env.BROWSERSYNC_MODE || '')
			.trim()
			.toLowerCase()
		if (fromEnv === 'host' || fromEnv === 'ip') {
			return fromEnv
		}
		return ''
	}

	static getLocalAppEnv() {
		const defaults = this.readWpEnvConfigDefaults()
		return {
			BROWSER_SYNC_APP_URL: process.env.BROWSER_SYNC_APP_URL ?? defaults.BROWSER_SYNC_APP_URL ?? '',
			BROWSER_SYNC_APP_PORT: process.env.BROWSER_SYNC_APP_PORT ?? defaults.BROWSER_SYNC_APP_PORT ?? '',
			BROWSER_SYNC_APP_IP: process.env.BROWSER_SYNC_APP_IP ?? defaults.BROWSER_SYNC_APP_IP ?? '',
		}
	}

	/**
	 * Reads `config` from `.wp-env.json` (project root). Env vars take precedence later.
	 *
	 * @returns {{ BROWSER_SYNC_APP_URL: string, BROWSER_SYNC_APP_PORT: string, BROWSER_SYNC_APP_IP: string }}
	 */
	static readWpEnvConfigDefaults() {
		const empty = { BROWSER_SYNC_APP_URL: '', BROWSER_SYNC_APP_PORT: '', BROWSER_SYNC_APP_IP: '' }
		const file = path.resolve(__dirname, '../.wp-env.json')

		try {
			if (!fs.existsSync(file)) {
				return empty
			}
			const json = JSON.parse(fs.readFileSync(file, 'utf8'))
			const cfg = json.config

			if (!cfg || typeof cfg !== 'object') {
				return empty
			}

			return {
				BROWSER_SYNC_APP_URL: cfg.BROWSER_SYNC_APP_URL != null ? String(cfg.BROWSER_SYNC_APP_URL) : '',
				BROWSER_SYNC_APP_PORT: cfg.BROWSER_SYNC_APP_PORT != null ? String(cfg.BROWSER_SYNC_APP_PORT) : '',
				BROWSER_SYNC_APP_IP: cfg.BROWSER_SYNC_APP_IP != null ? String(cfg.BROWSER_SYNC_APP_IP) : '',
			}
		} catch {
			return empty
		}
	}

	/**
	 * @returns {{ missing: string[] }}
	 */
	static collectBrowserSyncConfigIssues(hotReload, env) {
		const missing = []

		const urlRaw = String(env.BROWSER_SYNC_APP_URL || '').trim()
		if (!urlRaw) {
			missing.push('BROWSER_SYNC_APP_URL')
		} else {
			let base = urlRaw
			if (!/^https?:\/\//i.test(base)) {
				base = 'http://' + base
			}
			/** @type {URL|null} */
			let url = null
			try {
				url = new URL(base)
			} catch {
				missing.push('BROWSER_SYNC_APP_URL')
			}
			if (url) {
				const urlHadPort = Boolean(url.port)
				const portVar = String(env.BROWSER_SYNC_APP_PORT || '').trim()
				if (!urlHadPort && !portVar) {
					missing.push('BROWSER_SYNC_APP_PORT')
				}
			}
		}

		if (hotReload === 'ip') {
			const ip = String(env.BROWSER_SYNC_APP_IP || '')
				.trim()
				.replace(/:\d+$/, '')
			if (!ip) {
				missing.push('BROWSER_SYNC_APP_IP')
			}
		}

		return { missing }
	}

	/**
	 * First line: fatal summary. Second line: Missing vars only. then exit(1).
	 */
	static fatalConfig(hotReload, issues) {
		const head = `Cannot start BrowserSync with ${chalk.yellow('--' + hotReload)}.`
		// eslint-disable-next-line no-console
		console.error(`${logId} ${chalk.white.bold.bgRed(' ERROR ')} ${head}`)

		const names = [...new Set(issues.missing || [])]
		if (names.length > 0) {
			// eslint-disable-next-line no-console
			console.error(
				`${logId} ${chalk.red('Missing:')} ` + names.map((name) => chalk.yellow.bold(name)).join(chalk.dim(', '))
			)
		}
		process.exit(1)
	}
}

module.exports = WebpackBrowserSyncPlugin

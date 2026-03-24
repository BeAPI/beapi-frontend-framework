#!/usr/bin/env node

/**
 * Dev server entry: `package.json` script `start` runs this so extra CLI flags reach webpack safely.
 * Strips `--host` / `--ip` (webpack-cli rejects them) and sets `BROWSERSYNC_MODE` for BrowserSync.
 * Examples: `yarn start`, `yarn start -- --host`, `yarn start -- --ip` (or `yarn start:host` / `yarn start:ip`).
 */

const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const passed = process.argv.slice(2)

let browserSyncMode = ''
const webpackExtraArgs = passed.filter((arg) => {
	if (arg === '--host') {
		browserSyncMode = 'host'
		return false
	}
	if (arg === '--ip') {
		browserSyncMode = 'ip'
		return false
	}
	return true
})

const env = { ...process.env }
if (browserSyncMode) {
	env.BROWSERSYNC_MODE = browserSyncMode
}

const webpackCli = require.resolve('webpack-cli/bin/cli.js')
const childArgs = [webpackCli, '--watch', '--config', 'config/webpack.dev.js', ...webpackExtraArgs]

const result = spawnSync(process.execPath, childArgs, {
	cwd: root,
	stdio: 'inherit',
	env,
})

process.exit(result.status !== null && result.status !== undefined ? result.status : 1)

/**
 * Run non-critical work when the main thread is idle, to keep it free for the first interactions (INP).
 * Falls back to a short timeout when requestIdleCallback is not supported (Safari).
 *
 * @example
 * import deferInitialization from '../utils/deferInitialization'
 * deferInitialization(() => import('./classes/Slider'))
 *
 * @param {Function} callback
 * @param {number} timeout Maximum delay (ms) before the callback is forced to run.
 * @returns {undefined}
 */
export default function deferInitialization(callback, timeout = 2000) {
	if (typeof window.requestIdleCallback === 'function') {
		window.requestIdleCallback(callback, { timeout })
		return
	}

	setTimeout(callback, 100)
}

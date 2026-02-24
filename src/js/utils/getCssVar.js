/**
 * Get the value from a CSS custom property.
 *
 * @param {string} name CSS custom property name (ex: '--breakpoint-mobile-to-desktop-nav').
 * @param {HTMLElement} element The element to get the CSS custom property from.
 * @return {string} The value.
 * @example getCssVar('--breakpoint-mobile-to-desktop-nav') => '1200'
 */
export default function getCssVar(name, element = document.documentElement) {
	if (!name) {
		console.warn('getCssVar: No name provided.')
		return ''
	}

	const propName = name.startsWith('--') ? name : `--${name}`

	return getComputedStyle(element).getPropertyValue(propName).trim()
}

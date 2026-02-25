import getCssVar from './getCssVar'

/**
 * Check if the current viewport is mobile based on a CSS breakpoint.
 *
 * @param {string} breakpointVar CSS custom property name for the breakpoint.
 * @return {boolean} True if viewport is mobile, false otherwise.
 * @example isMobileNav() => true; !isMobileNav() => false
 */
export default function isMobileNav(breakpointVar = '--breakpoint-mobile-to-desktop-nav') {
	const rawValue = getCssVar(breakpointVar)

	if (!rawValue) {
		console.warn(`isMobileNav: Variable ${breakpointVar} is empty or undefined. Returning false.`)
		return false
	}

	const breakpoint = parseInt(rawValue, 10)

	if (isNaN(breakpoint)) {
		console.warn(`isMobileNav: Could not parse "${rawValue}" as a number.`)
		return false
	}

	return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
}

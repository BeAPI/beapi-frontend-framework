import getBreakpoint from './getBreakpoint'

/**
 * Check if the current viewport is mobile based on a CSS breakpoint.
 *
 * @param {string} breakpointVar CSS custom property name for the breakpoint.
 * @return {boolean} True if viewport is mobile, false otherwise.
 * @example isMobileNav() => true; !isMobileNav() => false
 */
export default function isMobileNav(breakpointVar = '--breakpoint-mobile-to-desktop-nav') {
	const breakpoint = parseInt(getBreakpoint(breakpointVar), 10)
	return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
}

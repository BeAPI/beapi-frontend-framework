/**
 * Get the breakpoint value from a CSS custom property.
 *
 * @param {string} breakpointVar CSS custom property name for the breakpoint.
 * @return {string} The breakpoint value.
 * @example getBreakpoint('--breakpoint-mobile-to-desktop-nav') => '1200'
 */
export default function getBreakpoint(breakpointVar = '--breakpoint-mobile-to-desktop-nav') {
	return getComputedStyle(document.documentElement).getPropertyValue(breakpointVar).trim()
}

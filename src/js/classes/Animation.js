import AbstractDomElement from './AbstractDomElement'
import { SplittedText } from 'oneloop.js'
import noop from '../utils/noop'

// ----
// shared variables
// ----
const instances = []
const animationClass = 'js-animation'
// one IntersectionObserver per rootMargin, shared by all instances using it
const observers = new Map()
const lastScroll = { x: window.scrollX, y: window.scrollY }

// ----
// class Animation
// ----
class Animation extends AbstractDomElement {
	/**
	 * Animation constructor
	 * @param {HTMLElement} element
	 * @param {object} options
	 */
	constructor(element, options) {
		const instance = super(element, options)

		// avoid double init :
		if (!instance.isNewInstance()) {
			return instance
		}

		const el = this._element
		const s = this._settings
		const callbacksSharedData = {}

		this._isVisible = false
		this._callbacksSharedData = callbacksSharedData

		// add to instances
		instances.push(this)

		if (instances.length === 1) {
			window.addEventListener('beforeprint', onBeforePrint)
			window.addEventListener('afterprint', onAfterPrint)
		}

		// add animation class
		el.classList.add(s.animationClass)

		// intialize callback
		s.onInit(el, getScrollInfos(), callbacksSharedData)

		// without IntersectionObserver support, never leave content hidden
		if (typeof IntersectionObserver === 'undefined') {
			this._show(getScrollInfos())
			return
		}

		this._rootMargin = getRootMargin(getValue(el, s.start), getValue(el, s.end), s.hideOnReachEnd)
		getObserver(this._rootMargin).observe(el)
	}

	/**
	 * Is visible
	 * @returns {boolean}
	 */
	isVisible() {
		return this._isVisible
	}

	/**
	 * Show the element
	 * @param {object} scrollInfos
	 * @returns {undefined}
	 */
	_show(scrollInfos) {
		const el = this._element
		const s = this._settings

		this._isVisible = true
		s.onShow(el, scrollInfos, this._callbacksSharedData)
		el.classList.add(s.visibleClass)

		// destroy if playOnce = true
		if (s.playOnce) {
			this.destroy()
		}
	}

	/**
	 * Hide the element
	 * @param {object} scrollInfos
	 * @returns {undefined}
	 */
	_hide(scrollInfos) {
		const el = this._element
		const s = this._settings

		this._isVisible = false
		s.onHide(el, scrollInfos, this._callbacksSharedData)
		el.classList.remove(s.visibleClass)
	}

	/**
	 * Handle an intersection change of the element
	 * @param {IntersectionObserverEntry} entry
	 * @param {object} scrollInfos
	 * @returns {undefined}
	 */
	_onIntersection(entry, scrollInfos) {
		if (entry.isIntersecting) {
			if (!this._isVisible) {
				this._show(scrollInfos)
			}
			return
		}

		if (!this._isVisible) {
			return
		}

		// element went back below the start line (scroll up), or above the end line when hideOnReachEnd is set
		if (entry.boundingClientRect.top > 0 || this._settings.hideOnReachEnd) {
			this._hide(scrollInfos)
		}
	}

	/**
	 * Destroy
	 * @returns {undefined}
	 */
	destroy() {
		const el = this._element
		const s = this._settings
		const index = instances.indexOf(this)
		const callbacksSharedData = this._callbacksSharedData
		const scrollInfos = getScrollInfos()

		if (index === -1) {
			return
		}

		super.destroy()

		instances.splice(index, 1)

		if (s.showOnDestroy) {
			s.onShow(el, scrollInfos, callbacksSharedData)
			el.classList.add(s.visibleClass)
		}

		if (this._rootMargin && observers.has(this._rootMargin)) {
			observers.get(this._rootMargin).unobserve(el)
		}

		if (instances.length === 0) {
			observers.forEach((observer) => observer.disconnect())
			observers.clear()
			window.removeEventListener('beforeprint', onBeforePrint)
			window.removeEventListener('afterprint', onAfterPrint)
		}

		this._settings.onDestroy(el, scrollInfos, callbacksSharedData)
	}

	/**
	 * Static destroy
	 * @returns {undefined}
	 */
	static destroy() {
		while (instances.length) {
			instances[0].destroy()
		}
	}

	/**
	 * Static are animations enabled
	 * @returns {boolean}
	 */
	static areAnimationsEnabled() {
		return document.documentElement.classList.contains(animationClass)
	}
}

// ----
// defaults
// ----
Animation.defaults = {
	// wanted animation, the class will be added on the element if is not already on it
	animationClass: 'js-animation-opacity',
	// class added when the element is in the start/end range
	visibleClass: 'is-visible',
	// start (relative to bottom of the screen), can be a float, a function (element) {} or an array of two values (range) []
	start: 0.25,
	// end (relative to bottom of the screen), can be a float, a function (element) {} or an array of two values (range) []
	// only used when hideOnReachEnd is true
	end: 0.75,
	// if true, the instance will be destroyed after the element is visible
	playOnce: false,
	// if true, remove the visible class when the element reach the end paramter value
	hideOnReachEnd: false,
	// if true, set the element visible on destroy whatever the current scroll value
	showOnDestroy: true,
	// for each callback : function (element, scrollInfos, callbacksSharedData)
	onInit: noop,
	onShow: noop,
	onHide: noop,
	onDestroy: noop,
}

// ----
// events
// ----
/**
 * Dispatch intersection entries to their instances
 * @param {IntersectionObserverEntry[]} entries
 * @returns {undefined}
 */
function onIntersection(entries) {
	const scrollInfos = getScrollInfos()

	for (const entry of entries) {
		const instance = entry.target.beapi && entry.target.beapi[Animation.nameSpace]

		if (instance) {
			instance._onIntersection(entry, scrollInfos)
		}
	}
}

/**
 * On before print
 * @returns {undefined}
 */
function onBeforePrint() {
	document.documentElement.classList.remove(animationClass)
}
/**
 * On after print
 * @returns {undefined}
 */
function onAfterPrint() {
	document.documentElement.classList.add(animationClass)
}

// ----
// utils
// ----
/**
 * get value
 * @param {HTMLElement} element
 * @param {mixed} value
 * @returns {mixed}
 */
function getValue(element, value) {
	let rt = value

	if (typeof value === 'function') {
		rt = value(element)
	} else if (Array.isArray(value)) {
		rt = Math.random() * (value[1] - value[0]) + value[0]
	}

	return rt
}

/**
 * Convert start / end settings (fractions of the viewport) to an IntersectionObserver rootMargin.
 * Values are rounded to whole percents so instances share observers.
 * @param {number} start
 * @param {number} end
 * @param {boolean} hideOnReachEnd
 * @returns {string}
 */
function getRootMargin(start, end, hideOnReachEnd) {
	const bottom = Math.round(clamp(start) * 100)
	const top = hideOnReachEnd ? Math.round((1 - clamp(end)) * 100) : 0

	return `-${top}% 0px -${bottom}% 0px`
}

/**
 * Clamp a value between 0 and 1
 * @param {number} value
 * @returns {number}
 */
function clamp(value) {
	return Math.min(1, Math.max(0, Number(value) || 0))
}

/**
 * Get (or create) the shared observer for a rootMargin
 * @param {string} rootMargin
 * @returns {IntersectionObserver}
 */
function getObserver(rootMargin) {
	if (!observers.has(rootMargin)) {
		observers.set(rootMargin, new IntersectionObserver(onIntersection, { rootMargin }))
	}

	return observers.get(rootMargin)
}

/**
 * Scroll infos passed to callbacks, same shape as oneloop.js ScrollObserver (direction.y = 1 when scrolling down).
 * Computed on demand: no scroll listener is attached.
 * @returns {object}
 */
function getScrollInfos() {
	const scroll = { x: window.scrollX, y: window.scrollY }
	const delta = { x: scroll.x - lastScroll.x, y: scroll.y - lastScroll.y }

	lastScroll.x = scroll.x
	lastScroll.y = scroll.y

	return {
		scroll,
		delta,
		direction: { x: Math.sign(delta.x), y: Math.sign(delta.y) },
	}
}

// ----
// presets
// ----
Animation.preset = {
	'.js-animation .js-animation-opacity': undefined,
	'.js-animation .js-animation-translation': {
		animationClass: 'js-animation-translation',
		start: [0.2, 0.25],
		end: [0.75, 0.8],
		onInit: function (el, scrollInfos, data) {
			data.translate = Math.round(Math.random() * 100 + 100) * -1
			el.children[0].style.transitionDuration = Math.random() * 0.75 + 0.75 + 's'
		},
		onShow: function (el, scrollInfos, data) {
			el.children[0].style.transform = 'translateY(' + scrollInfos.direction.y * data.translate + 'px)'
		},
		onHide: function (el, scrollInfos, data) {
			el.children[0].style.transform = 'translateY(' + scrollInfos.direction.y * data.translate + 'px)'
		},
	},
	'.js-animation .js-animation-title': {
		animationClass: 'js-animation-title',
		onInit: function (el, scrollInfos, data) {
			document.fonts.ready.then(function () {
				data.splittedText = new SplittedText(el, {
					byLine: true,
					lineWrapper: function (line) {
						return '<span class="st-line"><span>' + line + '</span></span>'
					},
				})

				const children = el.getElementsByClassName('st-line')
				const { length } = children
				let i

				if (length > 1) {
					for (i = 0; i < length; i++) {
						children[i].children[0].style.transitionDelay = i / (length - 1) / 5 + 's'
					}
				}

				el.classList.add('is-ready')
			})
		},
		onDestroy: function (el, scrollInfos, data) {
			if (data.splittedText) {
				data.splittedText.destroy()
			}
		},
	},
}

// ----
// presets
// ----
Animation.initFromPreset()

// ----
// export
// ----
export default Animation

import AbstractDomElement from './AbstractDomElement'
import { ScrollObserver, SplittedText, ThrottledEvent } from 'oneloop.js'
import noop from '../utils/noop'

// ----
// shared variables
// ----
const instances = []
const animationClass = 'js-animation'
let scrollObserver
let resize

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

		const that = this
		const el = this._element
		const s = this._settings
		const start = getValue(el, s.start)
		const end = getValue(el, s.end)
		const callbacksSharedData = {}

		this._elementHeight = this._element.offsetHeight
		this._windowHeight = window.innerHeight
		this._onResize = onResize.bind(this)
		this._isVisible = false
		this._callbacksSharedData = callbacksSharedData

		// add to instances
		instances.push(this)

		if (instances.length === 1) {
			window.addEventListener('beforeprint', onBeforePrint)
			window.addEventListener('afterprint', onAfterPrint)
		}

		// init scrollObserver and throttledEvent
		if (!scrollObserver) {
			scrollObserver = new ScrollObserver()
			resize = new ThrottledEvent(window, 'resize')
		}

		resize.add('resize', this._onResize)

		// add animation class
		el.classList.add(s.animationClass)

		// intialize callback
		s.onInit(el, scrollObserver.getScrollInfos(), callbacksSharedData)

		// add element to scrollObserver
		scrollObserver.observe(el, {
			onVisible: function (scrollInfos, percentRTW) {
				const pStart = (this.distanceRTW.y * percentRTW.y) / that._windowHeight
				const pEnd = (this.distanceRTW.y * percentRTW.y) / (that._windowHeight + that._elementHeight)

				if (!that._isVisible && pStart >= start && pEnd <= end) {
					// show element
					that._isVisible = true
					s.onShow(el, scrollInfos, callbacksSharedData)
					el.classList.add(s.visibleClass)

					// destroy if playOnce = true
					if (s.playOnce) {
						that.destroy(el, scrollInfos, callbacksSharedData)
					}
				} else if (that._isVisible && (pStart < start || (pEnd > end && s.hideOnReachEnd))) {
					// hide element
					that._isVisible = false
					s.onHide(el, scrollInfos, callbacksSharedData)
					el.classList.remove(s.visibleClass)
				}
			},
		})
	}

	/**
	 * Is visible
	 * @returns {boolean}
	 */
	isVisible() {
		return this._isVisible
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
		let scrollInfos

		if (index === -1) {
			return
		}

		super.destroy()

		scrollInfos = scrollObserver.getScrollInfos()
		instances.splice(index, 1)

		if (s.showOnDestroy) {
			s.onShow(el, scrollInfos, callbacksSharedData)
			el.classList.add(s.visibleClass)
		}

		scrollObserver.unobserve(el)
		resize.remove('resize', this._onResize)

		if (!scrollObserver.hasEntry()) {
			scrollObserver = scrollObserver.destroy()
			resize = resize.destroy()
		}

		if (instances.length === 0) {
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
 * onResize
 * @param {Object} event
 * @returns {undefined}
 */
function onResize() {
	this._elementHeight = this._element.offsetHeight
	this._windowHeight = window.innerHeight
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
			data.splittedText.destroy()
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

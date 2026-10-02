import AbstractDomElement from './AbstractDomElement'
import Swiper from 'swiper'
import { A11y, Navigation } from 'swiper/modules'
import { __ } from '@wordpress/i18n'
import noop from '../utils/noop'

/**
 * Thin wrapper around Swiper with project defaults (A11y + Navigation).
 *
 * Default modules are always kept; extra modules in `options.modules` are appended
 * without duplicates.
 *
 * - A11y messages are translated via `@wordpress/i18n`; override per instance via `options.a11y` (`prevSlideMessage`, `nextSlideMessage`, etc.).
 * - If slides are `<li>`, `slideRole` is cleared so Swiper does not set `role="group"` and break list semantics for screen readers (overridable via `options.a11y`).
 * - When `hideNavigationFromA11y` is true, prev/next are removed from the accessibility tree and `.swiper-notification` is removed (nav announcements are unused).
 * - When `hideNavigationFromA11y` is false, `.swiper-notification` is kept so Swiper can announce first/prev/next/last messages on keyboard activation of the nav controls.
 * - `wrapperLiveRegion` is left to Swiper’s default (`true`): `aria-live="polite"` without autoplay, `aria-live="off"` with autoplay (overridable via `options.a11y`).
 *
 * Markup (minimal):
 * ```html
 * <div class="swiper">
 *   <div class="swiper-wrapper">
 *     <div class="swiper-slide">…</div>
 *   </div>
 *   <!-- get_template_part('components/parts/common/swiper', 'controls') -->
 * </div>
 * ```
 *
 * @example
 * import Slider from './classes/Slider'
 * import { Pagination } from 'swiper/modules'
 *
 * Slider.init('.my-slider', {
 *   hideNavigationFromA11y: true,
 *   fixLastSlideActiveOnEnd: true,
 *   onChange() {},
 *   options: {
 *     slidesPerView: 'auto',
 *     modules: [Pagination],
 *     navigation: {
 *       prevEl: '.swiper-button-prev',
 *       nextEl: '.swiper-button-next',
 *     },
 *     a11y: {
 *       // Optional: override translated defaults per slider
 *       nextSlideMessage: 'Next news item',
 *     },
 *   },
 * })
 *
 * const slider = new Slider(el, { … })
 * slider.getInstance() // Swiper
 *
 * @extends AbstractDomElement
 */
export default class Slider extends AbstractDomElement {
	/**
	 * @param {HTMLElement} element - Root `.swiper` element
	 * @param {SliderOptions} [options]
	 */
	constructor(element, options) {
		const instance = super(element, options)

		// avoid double init :
		if (!instance.isNewInstance()) {
			return instance
		}

		this.init()
	}

	init() {
		const el = this._element
		const { options, onChange, hideNavigationFromA11y, fixLastSlideActiveOnEnd } = this._settings

		// Merge default modules with user modules, avoiding duplicates.
		// AbstractDomElement.extend() replaces arrays instead of concatenating:
		// - If user passes no modules: extend copies defaults → old merge duplicated them
		// - If user passes modules: extend replaces defaults → we lose A11y/Navigation
		// This merge ensures defaults are always present + user modules added without duplicates.
		const defaultModules = Slider.defaults.options.modules
		const userModules = options.modules || []
		const allModules = [...defaultModules, ...userModules.filter((mod) => !defaultModules.includes(mod))]

		// role="group" on <li> breaks list semantics for screen readers.
		const slidesAreListItems = el.querySelector('.swiper-slide')?.tagName === 'LI'

		// Temesis feedback: hide navigation buttons from accessibility tree
		// since slides are already keyboard accessible (e.g. cards with focusable content).
		const hideNavigationButtons = (swiper) => {
			if (!hideNavigationFromA11y) {
				return
			}

			swiper.navigation.prevEl?.setAttribute('tabindex', '-1')
			swiper.navigation.prevEl?.setAttribute('aria-hidden', 'true')
			swiper.navigation.nextEl?.setAttribute('tabindex', '-1')
			swiper.navigation.nextEl?.setAttribute('aria-hidden', 'true')
		}

		// Swiper usually sets .swiper-slide-active correctly for integer or half
		// slidesPerView (e.g. 2, 2.5). With 'auto' or other fractions (e.g. 2.75),
		// the last slide may not get that class when reaching the end.
		// Keeping activeIndex in sync also keeps keyboard focus consistent: focusing
		// content in the last slide scrolls it fully into view instead of leaving it cropped.
		const applyLastSlideActiveFix = (swiper) => {
			// When all slides fit, Swiper keeps isBeginning and isEnd true while activeIndex stays 0.
			if (!swiper.isEnd || swiper.isBeginning) {
				return
			}

			// Force the index on the last slide
			swiper.activeIndex = swiper.slides.length - 1
			// Ask Swiper to update the classes (.swiper-slide-active)
			swiper.updateSlidesClasses()
		}

		const mergedOptions = {
			...options,
			modules: allModules,
			a11y: {
				...(slidesAreListItems ? { slideRole: '' } : {}),
				...options.a11y,
			},
			on: {
				...options.on,
				afterInit: (swiper) => {
					hideNavigationButtons(swiper)

					// Live region announces nav messages on keyboard prev/next; keep it when
					// navigation is exposed to AT, remove it when nav is intentionally hidden.
					if (hideNavigationFromA11y) {
						swiper.el.querySelector('.swiper-notification')?.remove()
					}

					options.on?.afterInit?.(swiper)
				},
				// Swiper resets tabindex on slide change, so we need to hide buttons again
				transitionEnd: (swiper) => {
					hideNavigationButtons(swiper)
					options.on?.transitionEnd?.(swiper)
				},
				progress: function (swiper, progress) {
					if (fixLastSlideActiveOnEnd) {
						applyLastSlideActiveFix(swiper)
					}

					options.on?.progress?.call(this, swiper, progress)
				},
				slideChange: function (swiper) {
					if (fixLastSlideActiveOnEnd) {
						applyLastSlideActiveFix(swiper)
					}

					options.on?.slideChange?.call(this, swiper)
				},
			},
		}

		this.swiper = new Swiper(el, mergedOptions)

		this.swiper.on('slideChange', onChange.bind(this))
	}

	/**
	 * @returns {import('swiper').Swiper}
	 */
	getInstance() {
		return this.swiper
	}
}

/**
 * @typedef {Object} SliderOptions
 * @property {Function} [onChange] - Called on slideChange (`this` = Slider instance)
 * @property {boolean} [hideNavigationFromA11y=false] - Hide prev/next from AT when slides are already focusable; also removes `.swiper-notification`
 * @property {boolean} [fixLastSlideActiveOnEnd=false] - Fix `.swiper-slide-active` at the end with `slidesPerView: 'auto'` or fractional values other than halves (e.g. 2.75)
 * @property {import('swiper').SwiperOptions} [options] - Native Swiper options (merged with defaults)
 */

Slider.defaults = {
	onChange: noop,
	hideNavigationFromA11y: false,
	fixLastSlideActiveOnEnd: false,
	options: {
		modules: [A11y, Navigation],
		a11y: {
			prevSlideMessage: __('Previous slide', 'beapi-frontend-framework'),
			nextSlideMessage: __('Next slide', 'beapi-frontend-framework'),
			firstSlideMessage: __('This is the first slide', 'beapi-frontend-framework'),
			lastSlideMessage: __('This is the last slide', 'beapi-frontend-framework'),
			paginationBulletMessage: __('Go to slide {{index}}', 'beapi-frontend-framework'),
			slideLabelMessage: __('{{index}} of {{slidesLength}}', 'beapi-frontend-framework'),
		},
	},
}

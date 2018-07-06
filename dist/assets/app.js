/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/src/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function(window, factory) {
	var lazySizes = factory(window, window.document);
	window.lazySizes = lazySizes;
	if(typeof module == 'object' && module.exports){
		module.exports = lazySizes;
	}
}(window, function l(window, document) {
	'use strict';
	/*jshint eqnull:true */
	if(!document.getElementsByClassName){return;}

	var lazysizes, lazySizesConfig;

	var docElem = document.documentElement;

	var Date = window.Date;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	var addEventListener = window[_addEventListener];

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	var hasClass = function(ele, cls) {
		if(!regClassCache[cls]){
			regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	var addClass = function(ele, cls) {
		if (!hasClass(ele, cls)){
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	var removeClass = function(ele, cls) {
		var reg;
		if ((reg = hasClass(ele,cls))) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function(dom, fn, add){
		var action = add ? _addEventListener : 'removeEventListener';
		if(add){
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function(evt){
			dom[action](evt, fn);
		});
	};

	var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
		var event = document.createEvent('CustomEvent');

		if(!detail){
			detail = {};
		}

		detail.instance = lazysizes;

		event.initCustomEvent(name, !noBubbles, !noCancelable, detail);

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function (el, full){
		var polyfill;
		if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
			polyfill({reevaluate: true, elements: [el]});
		} else if(full && full.src){
			el.src = full.src;
		}
	};

	var getCSS = function (elem, style){
		return (getComputedStyle(elem, null) || {})[style];
	};

	var getWidth = function(elem, parent, width){
		width = width || elem.offsetWidth;

		while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
			width =  parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = (function(){
		var running, waiting;
		var firstFns = [];
		var secondFns = [];
		var fns = firstFns;

		var run = function(){
			var runFns = fns;

			fns = firstFns.length ? secondFns : firstFns;

			running = true;
			waiting = false;

			while(runFns.length){
				runFns.shift()();
			}

			running = false;
		};

		var rafBatch = function(fn, queue){
			if(running && !queue){
				fn.apply(this, arguments);
			} else {
				fns.push(fn);

				if(!waiting){
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	})();

	var rAFIt = function(fn, simple){
		return simple ?
			function() {
				rAF(fn);
			} :
			function(){
				var that = this;
				var args = arguments;
				rAF(function(){
					fn.apply(that, args);
				});
			}
		;
	};

	var throttle = function(fn){
		var running;
		var lastTime = 0;
		var gDelay = 125;
		var RIC_DEFAULT_TIMEOUT = 666;
		var rICTimeout = RIC_DEFAULT_TIMEOUT;
		var run = function(){
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback ?
			function(){
				requestIdleCallback(run, {timeout: rICTimeout});
				if(rICTimeout !== RIC_DEFAULT_TIMEOUT){
					rICTimeout = RIC_DEFAULT_TIMEOUT;
				}
			}:
			rAFIt(function(){
				setTimeout(run);
			}, true)
		;

		return function(isPriority){
			var delay;
			if((isPriority = isPriority === true)){
				rICTimeout = 44;
			}

			if(running){
				return;
			}

			running =  true;

			delay = gDelay - (Date.now() - lastTime);

			if(delay < 0){
				delay = 0;
			}

			if(isPriority || (delay < 9 && requestIdleCallback)){
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function(){
			timeout = null;
			func();
		};
		var later = function() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function() {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};


	var loader = (function(){
		var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

		var defaultExpand, preloadExpand, hFac;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function(e){
			isLoading--;
			if(e && e.target){
				addRemoveLoadEvents(e.target, resetPreloading);
			}

			if(!e || isLoading < 0 || !e.target){
				isLoading = 0;
			}
		};

		var isNestedVisible = function(elem, elemExpand){
			var outerRect;
			var parent = elem;
			var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
				visible = ((getCSS(parent, 'opacity') || 1) > 0);

				if(visible && getCSS(parent, 'overflow') != 'visible'){
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
					;
				}
			}

			return visible;
		};

		var checkElements = function() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

			var lazyloadElems = lazysizes.elements;

			if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

				i = 0;

				lowRuns++;

				if(preloadExpand == null){
					if(!('expand' in lazySizesConfig)){
						lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
					}

					defaultExpand = lazySizesConfig.expand;
					preloadExpand = defaultExpand * lazySizesConfig.expFactor;
				}

				if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
					currentExpand = preloadExpand;
					lowRuns = 0;
				} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
					currentExpand = defaultExpand;
				} else {
					currentExpand = shrinkExpand;
				}

				for(; i < eLlen; i++){

					if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

					if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

					if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
						elemExpand = currentExpand;
					}

					if(beforeExpandVal !== elemExpand){
						eLvW = innerWidth + (elemExpand * hFac);
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
						(eLtop = rect.top) <= elvH &&
						(eLright = rect.right) >= elemNegativeExpand * hFac &&
						(eLleft = rect.left) <= eLvW &&
						(eLbottom || eLright || eLleft || eLtop) &&
						(lazySizesConfig.loadHidden || getCSS(lazyloadElems[i], 'visibility') != 'hidden') &&
						((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if(isLoading > 9){break;}
					} else if(!loadedSomething && isCompleted && !autoLoadElem &&
						isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
						(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
						(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if(autoLoadElem && !loadedSomething){
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function(e){
			addClass(e.target, lazySizesConfig.loadedClass);
			removeClass(e.target, lazySizesConfig.loadingClass);
			addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
			triggerEvent(e.target, 'lazyloaded');
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function(e){
			rafedSwitchLoadingClass({target: e.target});
		};

		var changeIframeSrc = function(elem, src){
			try {
				elem.contentWindow.location.replace(src);
			} catch(e){
				elem.src = src;
			}
		};

		var handleSources = function(source){
			var customMedia;

			var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

			if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
				source.setAttribute('media', customMedia);
			}

			if(sourceSrcset){
				source.setAttribute('srcset', sourceSrcset);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
			var src, srcset, parent, isPicture, event, firesLoad;

			if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

				if(sizes){
					if(isAuto){
						addClass(elem, lazySizesConfig.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
				src = elem[_getAttribute](lazySizesConfig.srcAttr);

				if(isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

				event = {target: elem};

				if(firesLoad){
					addRemoveLoadEvents(elem, resetPreloading, true);
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);

					addClass(elem, lazySizesConfig.loadingClass);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if(isPicture){
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if(srcset){
					elem.setAttribute('srcset', srcset);
				} else if(src && !isPicture){
					if(regIframe.test(elem.nodeName)){
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if(isImg && (srcset || isPicture)){
					updatePolyfill(elem, {src: src});
				}
			}

			if(elem._lazyRace){
				delete elem._lazyRace;
			}
			removeClass(elem, lazySizesConfig.lazyClass);

			rAF(function(){
				if( !firesLoad || (elem.complete && elem.naturalWidth > 1)){
					if(firesLoad){
						resetPreloading(event);
					} else {
						isLoading--;
					}
					switchLoadingClass(event);
				}
			}, true);
		});

		var unveilElement = function (elem){
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if( (isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if(isAuto){
				 autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var onload = function(){
			if(isCompleted){return;}
			if(Date.now() - started < 999){
				setTimeout(onload, 999);
				return;
			}
			var afterScroll = debounce(function(){
				lazySizesConfig.loadMode = 3;
				throttledCheckElements();
			});

			isCompleted = true;

			lazySizesConfig.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', function(){
				if(lazySizesConfig.loadMode == 3){
					lazySizesConfig.loadMode = 2;
				}
				afterScroll();
			}, true);
		};

		return {
			_: function(){
				started = Date.now();

				lazysizes.elements = document.getElementsByClassName(lazySizesConfig.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
				hFac = lazySizesConfig.hFac;

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				if(window.MutationObserver){
					new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if((/d$|^c/.test(document.readyState))){
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if(lazysizes.elements.length){
					checkElements();
					rAF._lsFlush();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement
		};
	})();


	var autoSizer = (function(){
		var autosizesElems;

		var sizeElement = rAFIt(function(elem, parent, event, width){
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if(regPicture.test(parent.nodeName || '')){
				sources = parent.getElementsByTagName('source');
				for(i = 0, len = sources.length; i < len; i++){
					sources[i].setAttribute('sizes', width);
				}
			}

			if(!event.detail.dataAttr){
				updatePolyfill(elem, event.detail);
			}
		});
		var getSizeElement = function (elem, dataAttr, width){
			var event;
			var parent = elem.parentNode;

			if(parent){
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

				if(!event.defaultPrevented){
					width = event.detail.width;

					if(width && width !== elem._lazysizesWidth){
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function(){
			var i;
			var len = autosizesElems.length;
			if(len){
				i = 0;

				for(; i < len; i++){
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function(){
				autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	})();

	var init = function(){
		if(!init.i){
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	(function(){
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2,
			loadHidden: true,
		};

		lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

		for(prop in lazySizesDefaults){
			if(!(prop in lazySizesConfig)){
				lazySizesConfig[prop] = lazySizesDefaults[prop];
			}
		}

		window.lazySizesConfig = lazySizesConfig;

		setTimeout(function(){
			if(lazySizesConfig.init){
				init();
			}
		});
	})();

	lazysizes = {
		cfg: lazySizesConfig,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF,
	};

	return lazysizes;
}
));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(5);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(6);

__webpack_require__(7);

var _lazysizes = __webpack_require__(1);

var _lazysizes2 = _interopRequireDefault(_lazysizes);

var _ls = __webpack_require__(8);

var _ls2 = _interopRequireDefault(_ls);

__webpack_require__(9);

__webpack_require__(11);

__webpack_require__(12);

__webpack_require__(13);

var _accessibilityTests = __webpack_require__(14);

var _accessibilityTests2 = _interopRequireDefault(_accessibilityTests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lazysizes2.default.customMedia = {};

_ls2.default.customMedia = {};

var distPath = window.location.pathname;

if (distPath.match('/dist/').length === 1) {
  var accessibilityTests = new _accessibilityTests2.default();
  accessibilityTests.init();

  var __svg__ = { filename: __webpack_require__.p +"../icons/icons.svg" };
  __webpack_require__(16)(__svg__);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window) {
	var ua = navigator.userAgent;

	if (window.HTMLPictureElement && /ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45) {
		addEventListener("resize", function () {
			var timer;

			var dummySrc = document.createElement("source");

			var fixRespimg = function fixRespimg(img) {
				var source, sizes;
				var picture = img.parentNode;

				if (picture.nodeName.toUpperCase() === "PICTURE") {
					source = dummySrc.cloneNode();

					picture.insertBefore(source, picture.firstElementChild);
					setTimeout(function () {
						picture.removeChild(source);
					});
				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
					img._pfLastSize = img.offsetWidth;
					sizes = img.sizes;
					img.sizes += ",100vw";
					setTimeout(function () {
						img.sizes = sizes;
					});
				}
			};

			var findPictureImgs = function findPictureImgs() {
				var i;
				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
				for (i = 0; i < imgs.length; i++) {
					fixRespimg(imgs[i]);
				}
			};
			var onResize = function onResize() {
				clearTimeout(timer);
				timer = setTimeout(findPictureImgs, 99);
			};
			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
			var init = function init() {
				onResize();

				if (mq && mq.addListener) {
					mq.addListener(onResize);
				}
			};

			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			if (/^[c|i]|d$/.test(document.readyState || "")) {
				init();
			} else {
				document.addEventListener("DOMContentLoaded", init);
			}

			return onResize;
		}());
	}
})(window);

(function (window, document, undefined) {
	"use strict";

	document.createElement("picture");

	var warn, eminpx, alwaysCheckWDescriptor, evalId;

	var pf = {};
	var isSupportTestReady = false;
	var noop = function noop() {};
	var image = document.createElement("img");
	var getImgAttr = image.getAttribute;
	var setImgAttr = image.setAttribute;
	var removeImgAttr = image.removeAttribute;
	var docElem = document.documentElement;
	var types = {};
	var cfg = {
		algorithm: ""
	};
	var srcAttr = "data-pfsrc";
	var srcsetAttr = srcAttr + "set";

	var ua = navigator.userAgent;
	var supportAbort = /rident/.test(ua) || /ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35;
	var curSrcProp = "currentSrc";
	var regWDesc = /\s+\+?\d+(e\d+)?w/;
	var regSize = /(\([^)]+\))?\s*(.+)/;
	var setOptions = window.picturefillCFG;

	var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
	var fsCss = "font-size:100%!important;";
	var isVwDirty = true;

	var cssCache = {};
	var sizeLengthCache = {};
	var DPR = window.devicePixelRatio;
	var units = {
		px: 1,
		"in": 96
	};
	var anchor = document.createElement("a");

	var alreadyRun = false;

	var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
	    regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
	    regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
	    regexTrailingCommas = /[,]+$/,
	    regexNonNegativeInteger = /^\d+$/,
	    regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

	var on = function on(obj, evt, fn, capture) {
		if (obj.addEventListener) {
			obj.addEventListener(evt, fn, capture || false);
		} else if (obj.attachEvent) {
			obj.attachEvent("on" + evt, fn);
		}
	};

	var memoize = function memoize(fn) {
		var cache = {};
		return function (input) {
			if (!(input in cache)) {
				cache[input] = fn(input);
			}
			return cache[input];
		};
	};

	function isSpace(c) {
		return c === " " || c === "\t" || c === "\n" || c === "\f" || c === "\r";
	}

	var evalCSS = function () {

		var regLength = /^([\d\.]+)(em|vw|px)$/;
		var replace = function replace() {
			var args = arguments,
			    index = 0,
			    string = args[0];
			while (++index in args) {
				string = string.replace(args[index], args[++index]);
			}
			return string;
		};

		var buildStr = memoize(function (css) {

			return "return " + replace((css || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, "") + ";";
		});

		return function (css, length) {
			var parsedLength;
			if (!(css in cssCache)) {
				cssCache[css] = false;
				if (length && (parsedLength = css.match(regLength))) {
					cssCache[css] = parsedLength[1] * units[parsedLength[2]];
				} else {
					try {
						cssCache[css] = new Function("e", buildStr(css))(units);
					} catch (e) {}
				}
			}
			return cssCache[css];
		};
	}();

	var setResolution = function setResolution(candidate, sizesattr) {
		if (candidate.w) {
			candidate.cWidth = pf.calcListLength(sizesattr || "100vw");
			candidate.res = candidate.w / candidate.cWidth;
		} else {
			candidate.res = candidate.d;
		}
		return candidate;
	};

	var picturefill = function picturefill(opt) {

		if (!isSupportTestReady) {
			return;
		}

		var elements, i, plen;

		var options = opt || {};

		if (options.elements && options.elements.nodeType === 1) {
			if (options.elements.nodeName.toUpperCase() === "IMG") {
				options.elements = [options.elements];
			} else {
				options.context = options.elements;
				options.elements = null;
			}
		}

		elements = options.elements || pf.qsa(options.context || document, options.reevaluate || options.reselect ? pf.sel : pf.selShort);

		if (plen = elements.length) {

			pf.setupRun(options);
			alreadyRun = true;

			for (i = 0; i < plen; i++) {
				pf.fillImg(elements[i], options);
			}

			pf.teardownRun(options);
		}
	};

	warn = window.console && console.warn ? function (message) {
		console.warn(message);
	} : noop;

	if (!(curSrcProp in image)) {
		curSrcProp = "src";
	}

	types["image/jpeg"] = true;
	types["image/gif"] = true;
	types["image/png"] = true;

	function detectTypeSupport(type, typeUri) {
		var image = new window.Image();
		image.onerror = function () {
			types[type] = false;
			picturefill();
		};
		image.onload = function () {
			types[type] = image.width === 1;
			picturefill();
		};
		image.src = typeUri;
		return "pending";
	}

	types["image/svg+xml"] = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");

	function updateMetrics() {

		isVwDirty = false;
		DPR = window.devicePixelRatio;
		cssCache = {};
		sizeLengthCache = {};

		pf.DPR = DPR || 1;

		units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
		units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

		units.vw = units.width / 100;
		units.vh = units.height / 100;

		evalId = [units.height, units.width, DPR].join("-");

		units.em = pf.getEmValue();
		units.rem = units.em;
	}

	function chooseLowRes(lowerValue, higherValue, dprValue, isCached) {
		var bonusFactor, tooMuch, bonus, meanDensity;

		if (cfg.algorithm === "saveData") {
			if (lowerValue > 2.7) {
				meanDensity = dprValue + 1;
			} else {
				tooMuch = higherValue - dprValue;
				bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

				bonus = tooMuch * bonusFactor;

				if (isCached) {
					bonus += 0.1 * bonusFactor;
				}

				meanDensity = lowerValue + bonus;
			}
		} else {
			meanDensity = dprValue > 1 ? Math.sqrt(lowerValue * higherValue) : lowerValue;
		}

		return meanDensity > dprValue;
	}

	function applyBestCandidate(img) {
		var srcSetCandidates;
		var matchingSet = pf.getSet(img);
		var evaluated = false;
		if (matchingSet !== "pending") {
			evaluated = evalId;
			if (matchingSet) {
				srcSetCandidates = pf.setRes(matchingSet);
				pf.applySetCandidate(srcSetCandidates, img);
			}
		}
		img[pf.ns].evaled = evaluated;
	}

	function ascendingSort(a, b) {
		return a.res - b.res;
	}

	function setSrcToCur(img, src, set) {
		var candidate;
		if (!set && src) {
			set = img[pf.ns].sets;
			set = set && set[set.length - 1];
		}

		candidate = getCandidateForSrc(src, set);

		if (candidate) {
			src = pf.makeUrl(src);
			img[pf.ns].curSrc = src;
			img[pf.ns].curCan = candidate;

			if (!candidate.res) {
				setResolution(candidate, candidate.set.sizes);
			}
		}
		return candidate;
	}

	function getCandidateForSrc(src, set) {
		var i, candidate, candidates;
		if (src && set) {
			candidates = pf.parseSet(set);
			src = pf.makeUrl(src);
			for (i = 0; i < candidates.length; i++) {
				if (src === pf.makeUrl(candidates[i].url)) {
					candidate = candidates[i];
					break;
				}
			}
		}
		return candidate;
	}

	function getAllSourceElements(picture, candidates) {
		var i, len, source, srcset;

		var sources = picture.getElementsByTagName("source");

		for (i = 0, len = sources.length; i < len; i++) {
			source = sources[i];
			source[pf.ns] = true;
			srcset = source.getAttribute("srcset");

			if (srcset) {
				candidates.push({
					srcset: srcset,
					media: source.getAttribute("media"),
					type: source.getAttribute("type"),
					sizes: source.getAttribute("sizes")
				});
			}
		}
	}

	function parseSrcset(input, set) {

		function collectCharacters(regEx) {
			var chars,
			    match = regEx.exec(input.substring(pos));
			if (match) {
				chars = match[0];
				pos += chars.length;
				return chars;
			}
		}

		var inputLength = input.length,
		    url,
		    descriptors,
		    currentDescriptor,
		    state,
		    c,
		    pos = 0,
		    candidates = [];

		function parseDescriptors() {
			var pError = false,
			    w,
			    d,
			    h,
			    i,
			    candidate = {},
			    desc,
			    lastChar,
			    value,
			    intVal,
			    floatVal;

			for (i = 0; i < descriptors.length; i++) {
				desc = descriptors[i];

				lastChar = desc[desc.length - 1];
				value = desc.substring(0, desc.length - 1);
				intVal = parseInt(value, 10);
				floatVal = parseFloat(value);

				if (regexNonNegativeInteger.test(value) && lastChar === "w") {
					if (w || d) {
						pError = true;
					}

					if (intVal === 0) {
						pError = true;
					} else {
						w = intVal;
					}
				} else if (regexFloatingPoint.test(value) && lastChar === "x") {
					if (w || d || h) {
						pError = true;
					}

					if (floatVal < 0) {
						pError = true;
					} else {
						d = floatVal;
					}
				} else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
					if (h || d) {
						pError = true;
					}

					if (intVal === 0) {
						pError = true;
					} else {
						h = intVal;
					}
				} else {
					pError = true;
				}
			}
			if (!pError) {
				candidate.url = url;

				if (w) {
					candidate.w = w;
				}
				if (d) {
					candidate.d = d;
				}
				if (h) {
					candidate.h = h;
				}
				if (!h && !d && !w) {
					candidate.d = 1;
				}
				if (candidate.d === 1) {
					set.has1x = true;
				}
				candidate.set = set;

				candidates.push(candidate);
			}
		}
		function tokenize() {
			collectCharacters(regexLeadingSpaces);

			currentDescriptor = "";

			state = "in descriptor";

			while (true) {
				c = input.charAt(pos);

				if (state === "in descriptor") {
					if (isSpace(c)) {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
							currentDescriptor = "";
							state = "after descriptor";
						}
					} else if (c === ",") {
						pos += 1;
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;
					} else if (c === "(") {
						currentDescriptor = currentDescriptor + c;
						state = "in parens";
					} else if (c === "") {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;
					} else {
						currentDescriptor = currentDescriptor + c;
					}
				} else if (state === "in parens") {
					if (c === ")") {
						currentDescriptor = currentDescriptor + c;
						state = "in descriptor";
					} else if (c === "") {
						descriptors.push(currentDescriptor);
						parseDescriptors();
						return;
					} else {
						currentDescriptor = currentDescriptor + c;
					}
				} else if (state === "after descriptor") {
					if (isSpace(c)) {} else if (c === "") {
						parseDescriptors();
						return;
					} else {
						state = "in descriptor";
						pos -= 1;
					}
				}

				pos += 1;
			}
		}

		while (true) {
			collectCharacters(regexLeadingCommasOrSpaces);

			if (pos >= inputLength) {
				return candidates;
			}

			url = collectCharacters(regexLeadingNotSpaces);

			descriptors = [];

			if (url.slice(-1) === ",") {
				url = url.replace(regexTrailingCommas, "");

				parseDescriptors();
			} else {
				tokenize();
			}
		}
	}

	function parseSizes(strValue) {
		var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

		var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

		var i;
		var unparsedSizesList;
		var unparsedSizesListLength;
		var unparsedSize;
		var lastComponentValue;
		var size;

		function parseComponentValues(str) {
			var chrctr;
			var component = "";
			var componentArray = [];
			var listArray = [];
			var parenDepth = 0;
			var pos = 0;
			var inComment = false;

			function pushComponent() {
				if (component) {
					componentArray.push(component);
					component = "";
				}
			}

			function pushComponentArray() {
				if (componentArray[0]) {
					listArray.push(componentArray);
					componentArray = [];
				}
			}

			while (true) {
				chrctr = str.charAt(pos);

				if (chrctr === "") {
					pushComponent();
					pushComponentArray();
					return listArray;
				} else if (inComment) {
					if (chrctr === "*" && str[pos + 1] === "/") {
						inComment = false;
						pos += 2;
						pushComponent();
						continue;
					} else {
						pos += 1;
						continue;
					}
				} else if (isSpace(chrctr)) {
					if (str.charAt(pos - 1) && isSpace(str.charAt(pos - 1)) || !component) {
						pos += 1;
						continue;
					} else if (parenDepth === 0) {
						pushComponent();
						pos += 1;
						continue;
					} else {
						chrctr = " ";
					}
				} else if (chrctr === "(") {
					parenDepth += 1;
				} else if (chrctr === ")") {
					parenDepth -= 1;
				} else if (chrctr === ",") {
					pushComponent();
					pushComponentArray();
					pos += 1;
					continue;
				} else if (chrctr === "/" && str.charAt(pos + 1) === "*") {
					inComment = true;
					pos += 2;
					continue;
				}

				component = component + chrctr;
				pos += 1;
			}
		}

		function isValidNonNegativeSourceSizeValue(s) {
			if (regexCssLengthWithUnits.test(s) && parseFloat(s) >= 0) {
				return true;
			}
			if (regexCssCalc.test(s)) {
				return true;
			}

			if (s === "0" || s === "-0" || s === "+0") {
				return true;
			}
			return false;
		}

		unparsedSizesList = parseComponentValues(strValue);
		unparsedSizesListLength = unparsedSizesList.length;

		for (i = 0; i < unparsedSizesListLength; i++) {
			unparsedSize = unparsedSizesList[i];

			lastComponentValue = unparsedSize[unparsedSize.length - 1];

			if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
				size = lastComponentValue;
				unparsedSize.pop();
			} else {
				continue;
			}

			if (unparsedSize.length === 0) {
				return size;
			}

			unparsedSize = unparsedSize.join(" ");
			if (!pf.matchesMedia(unparsedSize)) {
				continue;
			}

			return size;
		}

		return "100vw";
	}

	pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

	pf.supSrcset = "srcset" in image;
	pf.supSizes = "sizes" in image;
	pf.supPicture = !!window.HTMLPictureElement;

	if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
		(function (image2) {
			image.srcset = "data:,a";
			image2.src = "data:,a";
			pf.supSrcset = image.complete === image2.complete;
			pf.supPicture = pf.supSrcset && pf.supPicture;
		})(document.createElement("img"));
	}

	if (pf.supSrcset && !pf.supSizes) {

		(function () {
			var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
			var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
			var img = document.createElement("img");
			var test = function test() {
				var width = img.width;

				if (width === 2) {
					pf.supSizes = true;
				}

				alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

				isSupportTestReady = true;

				setTimeout(picturefill);
			};

			img.onload = test;
			img.onerror = test;
			img.setAttribute("sizes", "9px");

			img.srcset = width1 + " 1w," + width2 + " 9w";
			img.src = width1;
		})();
	} else {
		isSupportTestReady = true;
	}

	pf.selShort = "picture>img,img[srcset]";
	pf.sel = pf.selShort;
	pf.cfg = cfg;

	pf.DPR = DPR || 1;
	pf.u = units;

	pf.types = types;

	pf.setSize = noop;

	pf.makeUrl = memoize(function (src) {
		anchor.href = src;
		return anchor.href;
	});

	pf.qsa = function (context, sel) {
		return "querySelector" in context ? context.querySelectorAll(sel) : [];
	};

	pf.matchesMedia = function () {
		if (window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches) {
			pf.matchesMedia = function (media) {
				return !media || matchMedia(media).matches;
			};
		} else {
			pf.matchesMedia = pf.mMQ;
		}

		return pf.matchesMedia.apply(this, arguments);
	};

	pf.mMQ = function (media) {
		return media ? evalCSS(media) : true;
	};

	pf.calcLength = function (sourceSizeValue) {

		var value = evalCSS(sourceSizeValue, true) || false;
		if (value < 0) {
			value = false;
		}

		return value;
	};

	pf.supportsType = function (type) {
		return type ? types[type] : true;
	};

	pf.parseSize = memoize(function (sourceSizeStr) {
		var match = (sourceSizeStr || "").match(regSize);
		return {
			media: match && match[1],
			length: match && match[2]
		};
	});

	pf.parseSet = function (set) {
		if (!set.cands) {
			set.cands = parseSrcset(set.srcset, set);
		}
		return set.cands;
	};

	pf.getEmValue = function () {
		var body;
		if (!eminpx && (body = document.body)) {
			var div = document.createElement("div"),
			    originalHTMLCSS = docElem.style.cssText,
			    originalBodyCSS = body.style.cssText;

			div.style.cssText = baseStyle;

			docElem.style.cssText = fsCss;
			body.style.cssText = fsCss;

			body.appendChild(div);
			eminpx = div.offsetWidth;
			body.removeChild(div);

			eminpx = parseFloat(eminpx, 10);

			docElem.style.cssText = originalHTMLCSS;
			body.style.cssText = originalBodyCSS;
		}
		return eminpx || 16;
	};

	pf.calcListLength = function (sourceSizeListStr) {
		if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
			var winningLength = pf.calcLength(parseSizes(sourceSizeListStr));

			sizeLengthCache[sourceSizeListStr] = !winningLength ? units.width : winningLength;
		}

		return sizeLengthCache[sourceSizeListStr];
	};

	pf.setRes = function (set) {
		var candidates;
		if (set) {

			candidates = pf.parseSet(set);

			for (var i = 0, len = candidates.length; i < len; i++) {
				setResolution(candidates[i], set.sizes);
			}
		}
		return candidates;
	};

	pf.setRes.res = setResolution;

	pf.applySetCandidate = function (candidates, img) {
		if (!candidates.length) {
			return;
		}
		var candidate, i, j, length, bestCandidate, curSrc, curCan, candidateSrc, abortCurSrc;

		var imageData = img[pf.ns];
		var dpr = pf.DPR;

		curSrc = imageData.curSrc || img[curSrcProp];

		curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

		if (curCan && curCan.set === candidates[0].set) {
			abortCurSrc = supportAbort && !img.complete && curCan.res - 0.1 > dpr;

			if (!abortCurSrc) {
				curCan.cached = true;

				if (curCan.res >= dpr) {
					bestCandidate = curCan;
				}
			}
		}

		if (!bestCandidate) {

			candidates.sort(ascendingSort);

			length = candidates.length;
			bestCandidate = candidates[length - 1];

			for (i = 0; i < length; i++) {
				candidate = candidates[i];
				if (candidate.res >= dpr) {
					j = i - 1;

					if (candidates[j] && (abortCurSrc || curSrc !== pf.makeUrl(candidate.url)) && chooseLowRes(candidates[j].res, candidate.res, dpr, candidates[j].cached)) {

						bestCandidate = candidates[j];
					} else {
						bestCandidate = candidate;
					}
					break;
				}
			}
		}

		if (bestCandidate) {

			candidateSrc = pf.makeUrl(bestCandidate.url);

			imageData.curSrc = candidateSrc;
			imageData.curCan = bestCandidate;

			if (candidateSrc !== curSrc) {
				pf.setSrc(img, bestCandidate);
			}
			pf.setSize(img);
		}
	};

	pf.setSrc = function (img, bestCandidate) {
		var origWidth;
		img.src = bestCandidate.url;

		if (bestCandidate.set.type === "image/svg+xml") {
			origWidth = img.style.width;
			img.style.width = img.offsetWidth + 1 + "px";

			if (img.offsetWidth + 1) {
				img.style.width = origWidth;
			}
		}
	};

	pf.getSet = function (img) {
		var i, set, supportsType;
		var match = false;
		var sets = img[pf.ns].sets;

		for (i = 0; i < sets.length && !match; i++) {
			set = sets[i];

			if (!set.srcset || !pf.matchesMedia(set.media) || !(supportsType = pf.supportsType(set.type))) {
				continue;
			}

			if (supportsType === "pending") {
				set = supportsType;
			}

			match = set;
			break;
		}

		return match;
	};

	pf.parseSets = function (element, parent, options) {
		var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

		var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
		var imageData = element[pf.ns];

		if (imageData.src === undefined || options.src) {
			imageData.src = getImgAttr.call(element, "src");
			if (imageData.src) {
				setImgAttr.call(element, srcAttr, imageData.src);
			} else {
				removeImgAttr.call(element, srcAttr);
			}
		}

		if (imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset) {
			srcsetAttribute = getImgAttr.call(element, "srcset");
			imageData.srcset = srcsetAttribute;
			srcsetParsed = true;
		}

		imageData.sets = [];

		if (hasPicture) {
			imageData.pic = true;
			getAllSourceElements(parent, imageData.sets);
		}

		if (imageData.srcset) {
			imageSet = {
				srcset: imageData.srcset,
				sizes: getImgAttr.call(element, "sizes")
			};

			imageData.sets.push(imageSet);

			isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

			if (!isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x) {
				imageSet.srcset += ", " + imageData.src;
				imageSet.cands.push({
					url: imageData.src,
					d: 1,
					set: imageSet
				});
			}
		} else if (imageData.src) {
			imageData.sets.push({
				srcset: imageData.src,
				sizes: null
			});
		}

		imageData.curCan = null;
		imageData.curSrc = undefined;

		imageData.supported = !(hasPicture || imageSet && !pf.supSrcset || isWDescripor && !pf.supSizes);

		if (srcsetParsed && pf.supSrcset && !imageData.supported) {
			if (srcsetAttribute) {
				setImgAttr.call(element, srcsetAttr, srcsetAttribute);
				element.srcset = "";
			} else {
				removeImgAttr.call(element, srcsetAttr);
			}
		}

		if (imageData.supported && !imageData.srcset && (!imageData.src && element.src || element.src !== pf.makeUrl(imageData.src))) {
			if (imageData.src === null) {
				element.removeAttribute("src");
			} else {
				element.src = imageData.src;
			}
		}

		imageData.parsed = true;
	};

	pf.fillImg = function (element, options) {
		var imageData;
		var extreme = options.reselect || options.reevaluate;

		if (!element[pf.ns]) {
			element[pf.ns] = {};
		}

		imageData = element[pf.ns];

		if (!extreme && imageData.evaled === evalId) {
			return;
		}

		if (!imageData.parsed || options.reevaluate) {
			pf.parseSets(element, element.parentNode, options);
		}

		if (!imageData.supported) {
			applyBestCandidate(element);
		} else {
			imageData.evaled = evalId;
		}
	};

	pf.setupRun = function () {
		if (!alreadyRun || isVwDirty || DPR !== window.devicePixelRatio) {
			updateMetrics();
		}
	};

	if (pf.supPicture) {
		picturefill = noop;
		pf.fillImg = noop;
	} else {
		(function () {
			var isDomReady;
			var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

			var run = function run() {
				var readyState = document.readyState || "";

				timerId = setTimeout(run, readyState === "loading" ? 200 : 999);
				if (document.body) {
					pf.fillImgs();
					isDomReady = isDomReady || regReady.test(readyState);
					if (isDomReady) {
						clearTimeout(timerId);
					}
				}
			};

			var timerId = setTimeout(run, document.body ? 9 : 99);

			var debounce = function debounce(func, wait) {
				var timeout, timestamp;
				var later = function later() {
					var last = new Date() - timestamp;

					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					} else {
						timeout = null;
						func();
					}
				};

				return function () {
					timestamp = new Date();

					if (!timeout) {
						timeout = setTimeout(later, wait);
					}
				};
			};
			var lastClientWidth = docElem.clientHeight;
			var onResize = function onResize() {
				isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
				lastClientWidth = docElem.clientHeight;
				if (isVwDirty) {
					pf.fillImgs();
				}
			};

			on(window, "resize", debounce(onResize, 99));
			on(document, "readystatechange", run);
		})();
	}

	pf.picturefill = picturefill;

	pf.fillImgs = picturefill;
	pf.teardownRun = noop;

	picturefill._ = pf;

	window.picturefillCFG = {
		pf: pf,
		push: function push(args) {
			var name = args.shift();
			if (typeof pf[name] === "function") {
				pf[name].apply(pf, args);
			} else {
				cfg[name] = args[0];
				if (alreadyRun) {
					pf.fillImgs({ reselect: true });
				}
			}
		}
	};

	while (setOptions && setOptions.length) {
		window.picturefillCFG.push(setOptions.shift());
	}

	window.picturefill = picturefill;

	if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
		module.exports = picturefill;
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return picturefill;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	if (!pf.supPicture) {
		types["image/webp"] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==");
	}
})(window, document);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback) {
    var T, k;

    if (this == null) {
      throw new TypeError(' this vaut null ou n est pas défini');
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' n est pas une fonction');
    }

    if (arguments.length > 1) {
      T = arguments[1];
    }

    k = 0;

    while (k < len) {
      var kValue;

      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

(function(window, factory) {
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(typeof module == 'object' && module.exports){
		factory(__webpack_require__(1));
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(window, function(window, document, lazySizes) {
	'use strict';
	if(!window.addEventListener){return;}

	var regWhite = /\s+/g;
	var regSplitSet = /\s*\|\s+|\s+\|\s*/g;
	var regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])?$/;
	var regBgUrlEscape = /\(|\)|'/;
	var allowedBackgroundSize = {contain: 1, cover: 1};
	var proxyWidth = function(elem){
		var width = lazySizes.gW(elem, elem.parentNode);

		if(!elem._lazysizesWidth || width > elem._lazysizesWidth){
			elem._lazysizesWidth = width;
		}
		return elem._lazysizesWidth;
	};
	var getBgSize = function(elem){
		var bgSize;

		bgSize = (getComputedStyle(elem) || {getPropertyValue: function(){}}).getPropertyValue('background-size');

		if(!allowedBackgroundSize[bgSize] && allowedBackgroundSize[elem.style.backgroundSize]){
			bgSize = elem.style.backgroundSize;
		}

		return bgSize;
	};
	var createPicture = function(sets, elem, img){
		var picture = document.createElement('picture');
		var sizes = elem.getAttribute(lazySizesConfig.sizesAttr);
		var ratio = elem.getAttribute('data-ratio');
		var optimumx = elem.getAttribute('data-optimumx');

		if(elem._lazybgset && elem._lazybgset.parentNode == elem){
			elem.removeChild(elem._lazybgset);
		}

		Object.defineProperty(img, '_lazybgset', {
			value: elem,
			writable: true
		});
		Object.defineProperty(elem, '_lazybgset', {
			value: picture,
			writable: true
		});

		sets = sets.replace(regWhite, ' ').split(regSplitSet);

		picture.style.display = 'none';
		img.className = lazySizesConfig.lazyClass;

		if(sets.length == 1 && !sizes){
			sizes = 'auto';
		}

		sets.forEach(function(set){
			var source = document.createElement('source');

			if(sizes && sizes != 'auto'){
				source.setAttribute('sizes', sizes);
			}

			if(set.match(regSource)){
				source.setAttribute(lazySizesConfig.srcsetAttr, RegExp.$1);
				if(RegExp.$2){
					source.setAttribute('media', lazySizesConfig.customMedia[RegExp.$2] || RegExp.$2);
				}
			}
			picture.appendChild(source);
		});

		if(sizes){
			img.setAttribute(lazySizesConfig.sizesAttr, sizes);
			elem.removeAttribute(lazySizesConfig.sizesAttr);
			elem.removeAttribute('sizes');
		}
		if(optimumx){
			img.setAttribute('data-optimumx', optimumx);
		}
		if(ratio) {
			img.setAttribute('data-ratio', ratio);
		}

		picture.appendChild(img);

		elem.appendChild(picture);
	};

	var proxyLoad = function(e){
		if(!e.target._lazybgset){return;}

		var image = e.target;
		var elem = image._lazybgset;
		var bg = image.currentSrc || image.src;

		if(bg){
			elem.style.backgroundImage = 'url(' + (regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg ) + ')';
		}

		if(image._lazybgsetLoading){
			lazySizes.fire(elem, '_lazyloaded', {}, false, true);
			delete image._lazybgsetLoading;
		}
	};

	addEventListener('lazybeforeunveil', function(e){
		var set, image, elem;

		if(e.defaultPrevented || !(set = e.target.getAttribute('data-bgset'))){return;}

		elem = e.target;
		image = document.createElement('img');

		image.alt = '';

		image._lazybgsetLoading = true;
		e.detail.firesLoad = true;

		createPicture(set, elem, image);

		setTimeout(function(){
			lazySizes.loader.unveil(image);

			lazySizes.rAF(function(){
				lazySizes.fire(image, '_lazyloaded', {}, true, true);
				if(image.complete) {
					proxyLoad({target: image});
				}
			});
		});

	});

	document.addEventListener('load', proxyLoad, true);

	window.addEventListener('lazybeforesizes', function(e){
		if(e.detail.instance != lazySizes){return;}
		if(e.target._lazybgset && e.detail.dataAttr){
			var elem = e.target._lazybgset;
			var bgSize = getBgSize(elem);

			if(allowedBackgroundSize[bgSize]){
				e.target._lazysizesParentFit = bgSize;

				lazySizes.rAF(function(){
					e.target.setAttribute('data-parent-fit', bgSize);
					if(e.target._lazysizesParentFit){
						delete e.target._lazysizesParentFit;
					}
				});
			}
		}
	}, true);

	document.documentElement.addEventListener('lazybeforesizes', function(e){
		if(e.defaultPrevented || !e.target._lazybgset || e.detail.instance != lazySizes){return;}
		e.detail.width = proxyWidth(e.target._lazybgset);
	});
}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

__webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = function () {
  function Menu() {
    _classCallCheck(this, Menu);

    this.menuBody = document.body;
    this.menu = document.querySelector('#menu');
    this.menuOpen = document.getElementById('js-menu-open');
    this.menuClose = document.getElementById('js-menu-close');
    this.buttonContainer = document.getElementById('js-menu-trigger');
    this.activeClass = 'menu-mobile--active';

    this.resizeBreakpoint = window.matchMedia('(min-width: 1024px)');
  }

  _createClass(Menu, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.menuOpen.addEventListener('click', this.openMenu.bind(this), false);
      this.menuClose.addEventListener('click', this.closeMenu.bind(this), false);

      document.addEventListener('click', function (event) {
        var menu = _this.menu.contains(event.target);
        var buttonContainer = _this.buttonContainer.contains(event.target);
        if (!menu && !buttonContainer) {
          _this.closeMenu();
        }
      });

      this.resizeBreakpoint.addListener(this.menuResizing.bind(this));
    }
  }, {
    key: 'sfMenuInit',
    value: function sfMenuInit() {
      (0, _jquery2.default)('.sf-menu').superfish();
    }
  }, {
    key: 'openMenu',
    value: function openMenu(e) {
      if (!this.menuBody.classList.contains(this.activeClass)) {
        this.menuBody.classList.add(this.activeClass);
      }
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu(e) {
      if (this.menuBody.classList.contains(this.activeClass)) {
        this.menuBody.classList.remove(this.activeClass);
      }
    }
  }, {
    key: 'menuResizing',
    value: function menuResizing() {
      var mediaQuery = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.resizeBreakpoint;

      if (mediaQuery.matches && this.menuBody.classList) {
        this.menuBody.classList.remove(this.activeClass);
      }
    }
  }]);

  return Menu;
}();

exports.default = Menu;


var menu = new Menu();
menu.init();
menu.sfMenuInit();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*
 * jQuery Superfish Menu Plugin - v1.7.10
 * Copyright (c) 2018 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

;(function ($, w) {
	"use strict";

	var methods = (function () {
		// private properties and methods go here
		var c = {
				bcClass: 'sf-breadcrumb',
				menuClass: 'sf-js-enabled',
				anchorClass: 'sf-with-ul',
				menuArrowClass: 'sf-arrows'
			},
			ios = (function () {
				var ios = /^(?![\w\W]*Windows Phone)[\w\W]*(iPhone|iPad|iPod)/i.test(navigator.userAgent);
				if (ios) {
					// tap anywhere on iOS to unfocus a submenu
					$('html').css('cursor', 'pointer').on('click', $.noop);
				}
				return ios;
			})(),
			wp7 = (function () {
				var style = document.documentElement.style;
				return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
			})(),
			unprefixedPointerEvents = (function () {
				return (!!w.PointerEvent);
			})(),
			toggleMenuClasses = function ($menu, o, add) {
				var classes = c.menuClass,
					method;
				if (o.cssArrows) {
					classes += ' ' + c.menuArrowClass;
				}
				method = (add) ? 'addClass' : 'removeClass';
				$menu[method](classes);
			},
			setPathToCurrent = function ($menu, o) {
				return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
					.addClass(o.hoverClass + ' ' + c.bcClass)
						.filter(function () {
							return ($(this).children(o.popUpSelector).hide().show().length);
						}).removeClass(o.pathClass);
			},
			toggleAnchorClass = function ($li, add) {
				var method = (add) ? 'addClass' : 'removeClass';
				$li.children('a')[method](c.anchorClass);
			},
			toggleTouchAction = function ($menu) {
				var msTouchAction = $menu.css('ms-touch-action');
				var touchAction = $menu.css('touch-action');
				touchAction = touchAction || msTouchAction;
				touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
				$menu.css({
					'ms-touch-action': touchAction,
					'touch-action': touchAction
				});
			},
			getMenu = function ($el) {
				return $el.closest('.' + c.menuClass);
			},
			getOptions = function ($el) {
				return getMenu($el).data('sfOptions');
			},
			over = function () {
				var $this = $(this),
					o = getOptions($this);
				clearTimeout(o.sfTimer);
				$this.siblings().superfish('hide').end().superfish('show');
			},
			close = function (o) {
				o.retainPath = ($.inArray(this[0], o.$path) > -1);
				this.superfish('hide');

				if (!this.parents('.' + o.hoverClass).length) {
					o.onIdle.call(getMenu(this));
					if (o.$path.length) {
						$.proxy(over, o.$path)();
					}
				}
			},
			out = function () {
				var $this = $(this),
					o = getOptions($this);
				if (ios) {
					$.proxy(close, $this, o)();
				}
				else {
					clearTimeout(o.sfTimer);
					o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
				}
			},
			touchHandler = function (e) {
				var $this = $(this),
					o = getOptions($this),
					$ul = $this.siblings(e.data.popUpSelector);

				if (o.onHandleTouch.call($ul) === false) {
					return this;
				}

				if ($ul.length > 0 && $ul.is(':hidden')) {
					$this.one('click.superfish', false);
					if (e.type === 'MSPointerDown' || e.type === 'pointerdown') {
						$this.trigger('focus');
					} else {
						$.proxy(over, $this.parent('li'))();
					}
				}
			},
			applyHandlers = function ($menu, o) {
				var targets = 'li:has(' + o.popUpSelector + ')';
				if ($.fn.hoverIntent && !o.disableHI) {
					$menu.hoverIntent(over, out, targets);
				}
				else {
					$menu
						.on('mouseenter.superfish', targets, over)
						.on('mouseleave.superfish', targets, out);
				}
				var touchevent = 'MSPointerDown.superfish';
				if (unprefixedPointerEvents) {
					touchevent = 'pointerdown.superfish';
				}
				if (!ios) {
					touchevent += ' touchend.superfish';
				}
				if (wp7) {
					touchevent += ' mousedown.superfish';
				}
				$menu
					.on('focusin.superfish', 'li', over)
					.on('focusout.superfish', 'li', out)
					.on(touchevent, 'a', o, touchHandler);
			};

		return {
			// public methods
			hide: function (instant) {
				if (this.length) {
					var $this = this,
						o = getOptions($this);
					if (!o) {
						return this;
					}
					var not = (o.retainPath === true) ? o.$path : '',
						$ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
						speed = o.speedOut;

					if (instant) {
						$ul.show();
						speed = 0;
					}
					o.retainPath = false;

					if (o.onBeforeHide.call($ul) === false) {
						return this;
					}

					$ul.stop(true, true).animate(o.animationOut, speed, function () {
						var $this = $(this);
						o.onHide.call($this);
					});
				}
				return this;
			},
			show: function () {
				var o = getOptions(this);
				if (!o) {
					return this;
				}
				var $this = this.addClass(o.hoverClass),
					$ul = $this.children(o.popUpSelector);

				if (o.onBeforeShow.call($ul) === false) {
					return this;
				}

				$ul.stop(true, true).animate(o.animation, o.speed, function () {
					o.onShow.call($ul);
				});
				return this;
			},
			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						o = $this.data('sfOptions'),
						$hasPopUp;
					if (!o) {
						return false;
					}
					$hasPopUp = $this.find(o.popUpSelector).parent('li');
					clearTimeout(o.sfTimer);
					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					// remove event handlers
					$this.off('.superfish').off('.hoverIntent');
					// clear animation's inline display style
					$hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
						if (typeof style !== 'undefined') {
							return style.replace(/display[^;]+;?/g, '');
						}
					});
					// reset 'current' path classes
					o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
					$this.find('.' + o.hoverClass).removeClass(o.hoverClass);
					o.onDestroy.call($this);
					$this.removeData('sfOptions');
				});
			},
			init: function (op) {
				return this.each(function () {
					var $this = $(this);
					if ($this.data('sfOptions')) {
						return false;
					}
					var o = $.extend({}, $.fn.superfish.defaults, op),
						$hasPopUp = $this.find(o.popUpSelector).parent('li');
					o.$path = setPathToCurrent($this, o);

					$this.data('sfOptions', o);

					toggleMenuClasses($this, o, true);
					toggleAnchorClass($hasPopUp, true);
					toggleTouchAction($this);
					applyHandlers($this, o);

					$hasPopUp.not('.' + c.bcClass).superfish('hide', true);

					o.onInit.call(this);
				});
			}
		};
	})();

	$.fn.superfish = function (method, args) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
		}
	};

	$.fn.superfish.defaults = {
		popUpSelector: 'ul,.sf-mega', // within menu context
		hoverClass: 'sfHover',
		pathClass: 'overrideThisToUse',
		pathLevels: 1,
		delay: 800,
		animation: {opacity: 'show'},
		animationOut: {opacity: 'hide'},
		speed: 'normal',
		speedOut: 'fast',
		cssArrows: true,
		disableHI: false,
		onInit: $.noop,
		onBeforeShow: $.noop,
		onShow: $.noop,
		onBeforeHide: $.noop,
		onHide: $.noop,
		onIdle: $.noop,
		onDestroy: $.noop,
		onHandleTouch: $.noop
	};

})(jQuery, window);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ButtonLink = function () {
  function ButtonLink(dataset) {
    _classCallCheck(this, ButtonLink);

    this.dataset = dataset;
    this.cntrlIsPressed = false;
    this.keyCode = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? 91 : 17;

    this.clickHandler = this.clickHandler.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);

    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
    document.addEventListener('click', this.clickHandler);
  }

  _createClass(ButtonLink, [{
    key: 'keyDown',
    value: function keyDown(e) {
      if (e.which !== this.keyCode) {
        return false;
      }
      this.cntrlIsPressed = true;
    }
  }, {
    key: 'keyUp',
    value: function keyUp(e) {
      if (e.which !== this.keyCode) {
        return false;
      }
      this.cntrlIsPressed = false;
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      var target = e.target;
      if (target.tagName !== 'BUTTON' || !target.dataset.hasOwnProperty(this.dataset)) {
        return false;
      }
      var download = target.getAttribute('data-target') === 'download';
      var isBlank = target.getAttribute('data-target') === '_blank';
      var href = target.getAttribute('data-href');
      var filename = target.getAttribute('data-filename');
      if (download) {
        this.createLink(href, filename);
      } else {
        if (isBlank || e.which === 2 || this.cntrlIsPressed) {
          window.open(href, '_blank');
        } else if (e.which === 1) {
          window.location.href = href;
        }
      }
    }
  }, {
    key: 'createLink',
    value: function createLink(href, filename) {
      var link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }]);

  return ButtonLink;
}();

exports.default = ButtonLink;


new ButtonLink('href');

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Select = function () {
  _createClass(Select, null, [{
    key: 'bind',
    value: function bind(selector) {
      ;[].forEach.call(document.querySelectorAll(selector), function (element) {
        return new Select(element);
      });
    }
  }]);

  function Select(element) {
    _classCallCheck(this, Select);

    this.element = element;
    this.init();
  }

  _createClass(Select, [{
    key: 'init',
    value: function init() {
      var inner = this.element.outerHTML;
      this.element.outerHTML = '<div class="select--custom">' + inner + '</div>';
    }
  }]);

  return Select;
}();

exports.default = Select;


var selects = ['.gform_wrapper select:not([multiple])'];[].forEach.call(selects, function (el) {
  return Select.bind(el);
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SeoLink = function () {
  _createClass(SeoLink, null, [{
    key: 'bind',
    value: function bind(selector) {
      ;[].forEach.call(document.querySelectorAll(selector), function (element) {
        return new SeoLink(element);
      });
    }
  }]);

  function SeoLink(element) {
    _classCallCheck(this, SeoLink);

    this.element = element;
    this.element.addEventListener('click', this.handleClick.bind(this), false);
  }

  _createClass(SeoLink, [{
    key: 'handleClick',
    value: function handleClick() {
      var url = this.element.querySelector('a').getAttribute('href');
      window.open(url, '_self');
    }
  }]);

  return SeoLink;
}();

exports.default = SeoLink;


SeoLink.bind('[data-seo]');

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axeCore = __webpack_require__(15);

var _axeCore2 = _interopRequireDefault(_axeCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccessibilityTests = function () {
  function AccessibilityTests() {
    _classCallCheck(this, AccessibilityTests);

    this.rules = ['wcag2a', 'wcag2aa'];
  }

  _createClass(AccessibilityTests, [{
    key: 'init',
    value: function init() {
      _axeCore2.default.getRules(this.rules);
      window.scroll(0, 0);
      _axeCore2.default.run(document, function (err, results) {
        if (err) throw err;
        console.log(results.violations);
      });
    }
  }]);

  return AccessibilityTests;
}();

exports.default = AccessibilityTests;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! aXe v3.0.2
 * Copyright (c) 2018 Deque Systems, Inc.
 *
 * Your use of this Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * This entire copyright notice must appear in every copy of this file you
 * distribute or in any file that contains substantial portions of this source
 * code.
 */
(function axeFunction(window) {
  var global = window;
  var document = window.document;
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  var axe = axe || {};
  axe.version = '3.0.2';
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      'use strict';
      return axe;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  if (( false ? 'undefined' : _typeof(module)) === 'object' && module.exports && typeof axeFunction.toString === 'function') {
    axe.source = '(' + axeFunction.toString() + ')(typeof window === "object" ? window : this);';
    module.exports = axe;
  }
  if (typeof window.getComputedStyle === 'function') {
    window.axe = axe;
  }
  var commons;
  function SupportError(error) {
    this.name = 'SupportError';
    this.cause = error.cause;
    this.message = '`' + error.cause + '` - feature unsupported in your environment.';
    if (error.ruleId) {
      this.ruleId = error.ruleId;
      this.message += ' Skipping ' + this.ruleId + ' rule.';
    }
    this.stack = new Error().stack;
  }
  SupportError.prototype = Object.create(Error.prototype);
  SupportError.prototype.constructor = SupportError;
  'use strict';
  var utils = axe.utils = {};
  'use strict';
  var helpers = {};
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  function getDefaultConfiguration(audit) {
    'use strict';
    var config;
    if (audit) {
      config = axe.utils.clone(audit);
      config.commons = audit.commons;
    } else {
      config = {};
    }
    config.reporter = config.reporter || null;
    config.rules = config.rules || [];
    config.checks = config.checks || [];
    config.data = Object.assign({
      checks: {},
      rules: {}
    }, config.data);
    return config;
  }
  function unpackToObject(collection, audit, method) {
    'use strict';
    var i, l;
    for (i = 0, l = collection.length; i < l; i++) {
      audit[method](collection[i]);
    }
  }
  function Audit(audit) {
    this.brand = 'axe';
    this.application = 'axeAPI';
    this.tagExclude = [ 'experimental' ];
    this.defaultConfig = audit;
    this._init();
  }
  Audit.prototype._init = function() {
    var audit = getDefaultConfiguration(this.defaultConfig);
    axe.commons = commons = audit.commons;
    this.reporter = audit.reporter;
    this.commands = {};
    this.rules = [];
    this.checks = {};
    unpackToObject(audit.rules, this, 'addRule');
    unpackToObject(audit.checks, this, 'addCheck');
    this.data = {};
    this.data.checks = audit.data && audit.data.checks || {};
    this.data.rules = audit.data && audit.data.rules || {};
    this.data.failureSummaries = audit.data && audit.data.failureSummaries || {};
    this.data.incompleteFallbackMessage = audit.data && audit.data.incompleteFallbackMessage || '';
    this._constructHelpUrls();
  };
  Audit.prototype.registerCommand = function(command) {
    'use strict';
    this.commands[command.id] = command.callback;
  };
  Audit.prototype.addRule = function(spec) {
    'use strict';
    if (spec.metadata) {
      this.data.rules[spec.id] = spec.metadata;
    }
    var rule = this.getRule(spec.id);
    if (rule) {
      rule.configure(spec);
    } else {
      this.rules.push(new Rule(spec, this));
    }
  };
  Audit.prototype.addCheck = function(spec) {
    'use strict';
    var metadata = spec.metadata;
    if ((typeof metadata === 'undefined' ? 'undefined' : _typeof(metadata)) === 'object') {
      this.data.checks[spec.id] = metadata;
      if (_typeof(metadata.messages) === 'object') {
        Object.keys(metadata.messages).filter(function(prop) {
          return metadata.messages.hasOwnProperty(prop) && typeof metadata.messages[prop] === 'string';
        }).forEach(function(prop) {
          if (metadata.messages[prop].indexOf('function') === 0) {
            metadata.messages[prop] = new Function('return ' + metadata.messages[prop] + ';')();
          }
        });
      }
    }
    if (this.checks[spec.id]) {
      this.checks[spec.id].configure(spec);
    } else {
      this.checks[spec.id] = new Check(spec);
    }
  };
  Audit.prototype.run = function(context, options, resolve, reject) {
    'use strict';
    this.normalizeOptions(options);
    axe._selectCache = [];
    var q = axe.utils.queue();
    this.rules.forEach(function(rule) {
      if (axe.utils.ruleShouldRun(rule, context, options)) {
        if (options.performanceTimer) {
          var markEnd = 'mark_rule_end_' + rule.id;
          var markStart = 'mark_rule_start_' + rule.id;
          axe.utils.performanceTimer.mark(markStart);
        }
        q.defer(function(res, rej) {
          rule.run(context, options, function(out) {
            if (options.performanceTimer) {
              axe.utils.performanceTimer.mark(markEnd);
              axe.utils.performanceTimer.measure('rule_' + rule.id, markStart, markEnd);
            }
            res(out);
          }, function(err) {
            if (!options.debug) {
              var errResult = Object.assign(new RuleResult(rule), {
                result: axe.constants.CANTTELL,
                description: 'An error occured while running this rule',
                message: err.message,
                stack: err.stack,
                error: err
              });
              res(errResult);
            } else {
              rej(err);
            }
          });
        });
      }
    });
    q.then(function(results) {
      axe._selectCache = undefined;
      resolve(results.filter(function(result) {
        return !!result;
      }));
    }).catch(reject);
  };
  Audit.prototype.after = function(results, options) {
    'use strict';
    var rules = this.rules;
    return results.map(function(ruleResult) {
      var rule = axe.utils.findBy(rules, 'id', ruleResult.id);
      if (!rule) {
        throw new Error('Result for unknown rule. You may be running mismatch aXe-core versions');
      }
      return rule.after(ruleResult, options);
    });
  };
  Audit.prototype.getRule = function(ruleId) {
    return this.rules.find(function(rule) {
      return rule.id === ruleId;
    });
  };
  Audit.prototype.normalizeOptions = function(options) {
    'use strict';
    var audit = this;
    if (_typeof(options.runOnly) === 'object') {
      if (Array.isArray(options.runOnly)) {
        options.runOnly = {
          type: 'tag',
          values: options.runOnly
        };
      }
      var only = options.runOnly;
      if (only.value && !only.values) {
        only.values = only.value;
        delete only.value;
      }
      if (!Array.isArray(only.values) || only.values.length === 0) {
        throw new Error('runOnly.values must be a non-empty array');
      }
      if ([ 'rule', 'rules' ].includes(only.type)) {
        only.type = 'rule';
        only.values.forEach(function(ruleId) {
          if (!audit.getRule(ruleId)) {
            throw new Error('unknown rule `' + ruleId + '` in options.runOnly');
          }
        });
      } else if ([ 'tag', 'tags', undefined ].includes(only.type)) {
        only.type = 'tag';
        var unmatchedTags = audit.rules.reduce(function(unmatchedTags, rule) {
          return unmatchedTags.length ? unmatchedTags.filter(function(tag) {
            return !rule.tags.includes(tag);
          }) : unmatchedTags;
        }, only.values);
        if (unmatchedTags.length !== 0) {
          throw new Error('Could not find tags `' + unmatchedTags.join('`, `') + '`');
        }
      } else {
        throw new Error('Unknown runOnly type \'' + only.type + '\'');
      }
    }
    if (_typeof(options.rules) === 'object') {
      Object.keys(options.rules).forEach(function(ruleId) {
        if (!audit.getRule(ruleId)) {
          throw new Error('unknown rule `' + ruleId + '` in options.rules');
        }
      });
    }
    return options;
  };
  Audit.prototype.setBranding = function(branding) {
    'use strict';
    var previous = {
      brand: this.brand,
      application: this.application
    };
    if (branding && branding.hasOwnProperty('brand') && branding.brand && typeof branding.brand === 'string') {
      this.brand = branding.brand;
    }
    if (branding && branding.hasOwnProperty('application') && branding.application && typeof branding.application === 'string') {
      this.application = branding.application;
    }
    this._constructHelpUrls(previous);
  };
  function getHelpUrl(_ref, ruleId, version) {
    var brand = _ref.brand, application = _ref.application;
    return axe.constants.helpUrlBase + brand + '/' + (version || axe.version.substring(0, axe.version.lastIndexOf('.'))) + '/' + ruleId + '?application=' + application;
  }
  Audit.prototype._constructHelpUrls = function() {
    var _this = this;
    var previous = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var version = (axe.version.match(/^[1-9][0-9]*\.[0-9]+/) || [ 'x.y' ])[0];
    this.rules.forEach(function(rule) {
      if (!_this.data.rules[rule.id]) {
        _this.data.rules[rule.id] = {};
      }
      var metaData = _this.data.rules[rule.id];
      if (typeof metaData.helpUrl !== 'string' || previous && metaData.helpUrl === getHelpUrl(previous, rule.id, version)) {
        metaData.helpUrl = getHelpUrl(_this, rule.id, version);
      }
    });
  };
  Audit.prototype.resetRulesAndChecks = function() {
    'use strict';
    this._init();
  };
  'use strict';
  function CheckResult(check) {
    'use strict';
    this.id = check.id;
    this.data = null;
    this.relatedNodes = [];
    this.result = null;
  }
  'use strict';
  function createExecutionContext(spec) {
    'use strict';
    if (typeof spec === 'string') {
      return new Function('return ' + spec + ';')();
    }
    return spec;
  }
  function Check(spec) {
    if (spec) {
      this.id = spec.id;
      this.configure(spec);
    }
  }
  Check.prototype.enabled = true;
  Check.prototype.run = function(node, options, resolve, reject) {
    'use strict';
    options = options || {};
    var enabled = options.hasOwnProperty('enabled') ? options.enabled : this.enabled, checkOptions = options.options || this.options;
    if (enabled) {
      var checkResult = new CheckResult(this);
      var checkHelper = axe.utils.checkHelper(checkResult, options, resolve, reject);
      var result;
      try {
        result = this.evaluate.call(checkHelper, node.actualNode, checkOptions, node);
      } catch (e) {
        reject(e);
        return;
      }
      if (!checkHelper.isAsync) {
        checkResult.result = result;
        setTimeout(function() {
          resolve(checkResult);
        }, 0);
      }
    } else {
      resolve(null);
    }
  };
  Check.prototype.configure = function(spec) {
    var _this = this;
    [ 'options', 'enabled' ].filter(function(prop) {
      return spec.hasOwnProperty(prop);
    }).forEach(function(prop) {
      return _this[prop] = spec[prop];
    });
    [ 'evaluate', 'after' ].filter(function(prop) {
      return spec.hasOwnProperty(prop);
    }).forEach(function(prop) {
      return _this[prop] = createExecutionContext(spec[prop]);
    });
  };
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  function pushUniqueFrame(collection, frame) {
    'use strict';
    if (axe.utils.isHidden(frame)) {
      return;
    }
    var fr = axe.utils.findBy(collection, 'node', frame);
    if (!fr) {
      collection.push({
        node: frame,
        include: [],
        exclude: []
      });
    }
  }
  function pushUniqueFrameSelector(context, type, selectorArray) {
    'use strict';
    context.frames = context.frames || [];
    var result, frame;
    var frames = document.querySelectorAll(selectorArray.shift());
    frameloop: for (var i = 0, l = frames.length; i < l; i++) {
      frame = frames[i];
      for (var j = 0, l2 = context.frames.length; j < l2; j++) {
        if (context.frames[j].node === frame) {
          context.frames[j][type].push(selectorArray);
          break frameloop;
        }
      }
      result = {
        node: frame,
        include: [],
        exclude: []
      };
      if (selectorArray) {
        result[type].push(selectorArray);
      }
      context.frames.push(result);
    }
  }
  function normalizeContext(context) {
    'use strict';
    if (context && (typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object' || context instanceof NodeList) {
      if (context instanceof Node) {
        return {
          include: [ context ],
          exclude: []
        };
      }
      if (context.hasOwnProperty('include') || context.hasOwnProperty('exclude')) {
        return {
          include: context.include && +context.include.length ? context.include : [ document ],
          exclude: context.exclude || []
        };
      }
      if (context.length === +context.length) {
        return {
          include: context,
          exclude: []
        };
      }
    }
    if (typeof context === 'string') {
      return {
        include: [ context ],
        exclude: []
      };
    }
    return {
      include: [ document ],
      exclude: []
    };
  }
  function parseSelectorArray(context, type) {
    'use strict';
    var item, result = [], nodeList;
    for (var i = 0, l = context[type].length; i < l; i++) {
      item = context[type][i];
      if (typeof item === 'string') {
        nodeList = Array.from(document.querySelectorAll(item));
        result = result.concat(nodeList.map(function(node) {
          return axe.utils.getNodeFromTree(context.flatTree[0], node);
        }));
        break;
      } else if (item && item.length && !(item instanceof Node)) {
        if (item.length > 1) {
          pushUniqueFrameSelector(context, type, item);
        } else {
          nodeList = Array.from(document.querySelectorAll(item[0]));
          result = result.concat(nodeList.map(function(node) {
            return axe.utils.getNodeFromTree(context.flatTree[0], node);
          }));
        }
      } else if (item instanceof Node) {
        if (item.documentElement instanceof Node) {
          result.push(context.flatTree[0]);
        } else {
          result.push(axe.utils.getNodeFromTree(context.flatTree[0], item));
        }
      }
    }
    return result.filter(function(r) {
      return r;
    });
  }
  function validateContext(context) {
    'use strict';
    if (context.include.length === 0) {
      if (context.frames.length === 0) {
        var env = axe.utils.respondable.isInFrame() ? 'frame' : 'page';
        return new Error('No elements found for include in ' + env + ' Context');
      }
      context.frames.forEach(function(frame, i) {
        if (frame.include.length === 0) {
          return new Error('No elements found for include in Context of frame ' + i);
        }
      });
    }
  }
  function getRootNode(_ref) {
    var include = _ref.include, exclude = _ref.exclude;
    var selectors = Array.from(include).concat(Array.from(exclude));
    var localDocument = selectors.reduce(function(result, item) {
      if (result) {
        return result;
      } else if (item instanceof Element) {
        return item.ownerDocument;
      } else if (item instanceof Document) {
        return item;
      }
    }, null);
    return (localDocument || document).documentElement;
  }
  function Context(spec) {
    'use strict';
    var _this = this;
    this.frames = [];
    this.initiator = spec && typeof spec.initiator === 'boolean' ? spec.initiator : true;
    this.page = false;
    spec = normalizeContext(spec);
    this.flatTree = axe.utils.getFlattenedTree(getRootNode(spec));
    this.exclude = spec.exclude;
    this.include = spec.include;
    this.include = parseSelectorArray(this, 'include');
    this.exclude = parseSelectorArray(this, 'exclude');
    axe.utils.select('frame, iframe', this).forEach(function(frame) {
      if (isNodeInContext(frame, _this)) {
        pushUniqueFrame(_this.frames, frame.actualNode);
      }
    });
    if (this.include.length === 1 && this.include[0].actualNode === document.documentElement) {
      this.page = true;
    }
    var err = validateContext(this);
    if (err instanceof Error) {
      throw err;
    }
    if (!Array.isArray(this.include)) {
      this.include = Array.from(this.include);
    }
    this.include.sort(axe.utils.nodeSorter);
  }
  'use strict';
  function RuleResult(rule) {
    'use strict';
    this.id = rule.id;
    this.result = axe.constants.NA;
    this.pageLevel = rule.pageLevel;
    this.impact = null;
    this.nodes = [];
  }
  'use strict';
  function Rule(spec, parentAudit) {
    'use strict';
    this._audit = parentAudit;
    this.id = spec.id;
    this.selector = spec.selector || '*';
    this.excludeHidden = typeof spec.excludeHidden === 'boolean' ? spec.excludeHidden : true;
    this.enabled = typeof spec.enabled === 'boolean' ? spec.enabled : true;
    this.pageLevel = typeof spec.pageLevel === 'boolean' ? spec.pageLevel : false;
    this.any = spec.any || [];
    this.all = spec.all || [];
    this.none = spec.none || [];
    this.tags = spec.tags || [];
    if (spec.matches) {
      this.matches = createExecutionContext(spec.matches);
    }
  }
  Rule.prototype.matches = function() {
    'use strict';
    return true;
  };
  Rule.prototype.gather = function(context) {
    'use strict';
    var elements = axe.utils.select(this.selector, context);
    if (this.excludeHidden) {
      return elements.filter(function(element) {
        return !axe.utils.isHidden(element.actualNode);
      });
    }
    return elements;
  };
  Rule.prototype.runChecks = function(type, node, options, resolve, reject) {
    'use strict';
    var self = this;
    var checkQueue = axe.utils.queue();
    this[type].forEach(function(c) {
      var check = self._audit.checks[c.id || c];
      var option = axe.utils.getCheckOption(check, self.id, options);
      checkQueue.defer(function(res, rej) {
        check.run(node, option, res, rej);
      });
    });
    checkQueue.then(function(results) {
      results = results.filter(function(check) {
        return check;
      });
      resolve({
        type: type,
        results: results
      });
    }).catch(reject);
  };
  Rule.prototype.run = function(context, options, resolve, reject) {
    var _this = this;
    var q = axe.utils.queue();
    var ruleResult = new RuleResult(this);
    var markStart = 'mark_runchecks_start_' + this.id;
    var markEnd = 'mark_runchecks_end_' + this.id;
    var nodes = void 0;
    try {
      nodes = this.gather(context).filter(function(node) {
        return _this.matches(node.actualNode, node);
      });
    } catch (error) {
      reject(new SupportError({
        cause: error,
        ruleId: this.id
      }));
      return;
    }
    if (options.performanceTimer) {
      axe.log('gather (', nodes.length, '):', axe.utils.performanceTimer.timeElapsed() + 'ms');
      axe.utils.performanceTimer.mark(markStart);
    }
    nodes.forEach(function(node) {
      q.defer(function(resolveNode, rejectNode) {
        var checkQueue = axe.utils.queue();
        checkQueue.defer(function(res, rej) {
          _this.runChecks('any', node, options, res, rej);
        });
        checkQueue.defer(function(res, rej) {
          _this.runChecks('all', node, options, res, rej);
        });
        checkQueue.defer(function(res, rej) {
          _this.runChecks('none', node, options, res, rej);
        });
        checkQueue.then(function(results) {
          if (results.length) {
            var hasResults = false, result = {};
            results.forEach(function(r) {
              var res = r.results.filter(function(result) {
                return result;
              });
              result[r.type] = res;
              if (res.length) {
                hasResults = true;
              }
            });
            if (hasResults) {
              result.node = new axe.utils.DqElement(node.actualNode, options);
              ruleResult.nodes.push(result);
            }
          }
          resolveNode();
        }).catch(function(err) {
          return rejectNode(err);
        });
      });
    });
    if (options.performanceTimer) {
      axe.utils.performanceTimer.mark(markEnd);
      axe.utils.performanceTimer.measure('runchecks_' + this.id, markStart, markEnd);
    }
    q.then(function() {
      return resolve(ruleResult);
    }).catch(function(error) {
      return reject(error);
    });
  };
  function findAfterChecks(rule) {
    'use strict';
    return axe.utils.getAllChecks(rule).map(function(c) {
      var check = rule._audit.checks[c.id || c];
      return check && typeof check.after === 'function' ? check : null;
    }).filter(Boolean);
  }
  function findCheckResults(nodes, checkID) {
    'use strict';
    var checkResults = [];
    nodes.forEach(function(nodeResult) {
      var checks = axe.utils.getAllChecks(nodeResult);
      checks.forEach(function(checkResult) {
        if (checkResult.id === checkID) {
          checkResults.push(checkResult);
        }
      });
    });
    return checkResults;
  }
  function filterChecks(checks) {
    'use strict';
    return checks.filter(function(check) {
      return check.filtered !== true;
    });
  }
  function sanitizeNodes(result) {
    'use strict';
    var checkTypes = [ 'any', 'all', 'none' ];
    var nodes = result.nodes.filter(function(detail) {
      var length = 0;
      checkTypes.forEach(function(type) {
        detail[type] = filterChecks(detail[type]);
        length += detail[type].length;
      });
      return length > 0;
    });
    if (result.pageLevel && nodes.length) {
      nodes = [ nodes.reduce(function(a, b) {
        if (a) {
          checkTypes.forEach(function(type) {
            a[type].push.apply(a[type], b[type]);
          });
          return a;
        }
      }) ];
    }
    return nodes;
  }
  Rule.prototype.after = function(result, options) {
    'use strict';
    var afterChecks = findAfterChecks(this);
    var ruleID = this.id;
    afterChecks.forEach(function(check) {
      var beforeResults = findCheckResults(result.nodes, check.id);
      var option = axe.utils.getCheckOption(check, ruleID, options);
      var afterResults = check.after(beforeResults, option);
      beforeResults.forEach(function(item) {
        if (afterResults.indexOf(item) === -1) {
          item.filtered = true;
        }
      });
    });
    result.nodes = sanitizeNodes(result);
    return result;
  };
  Rule.prototype.configure = function(spec) {
    'use strict';
    if (spec.hasOwnProperty('selector')) {
      this.selector = spec.selector;
    }
    if (spec.hasOwnProperty('excludeHidden')) {
      this.excludeHidden = typeof spec.excludeHidden === 'boolean' ? spec.excludeHidden : true;
    }
    if (spec.hasOwnProperty('enabled')) {
      this.enabled = typeof spec.enabled === 'boolean' ? spec.enabled : true;
    }
    if (spec.hasOwnProperty('pageLevel')) {
      this.pageLevel = typeof spec.pageLevel === 'boolean' ? spec.pageLevel : false;
    }
    if (spec.hasOwnProperty('any')) {
      this.any = spec.any;
    }
    if (spec.hasOwnProperty('all')) {
      this.all = spec.all;
    }
    if (spec.hasOwnProperty('none')) {
      this.none = spec.none;
    }
    if (spec.hasOwnProperty('tags')) {
      this.tags = spec.tags;
    }
    if (spec.hasOwnProperty('matches')) {
      if (typeof spec.matches === 'string') {
        this.matches = new Function('return ' + spec.matches + ';')();
      } else {
        this.matches = spec.matches;
      }
    }
  };
  'use strict';
  (function(axe) {
    var definitions = [ {
      name: 'NA',
      value: 'inapplicable',
      priority: 0,
      group: 'inapplicable'
    }, {
      name: 'PASS',
      value: 'passed',
      priority: 1,
      group: 'passes'
    }, {
      name: 'CANTTELL',
      value: 'cantTell',
      priority: 2,
      group: 'incomplete'
    }, {
      name: 'FAIL',
      value: 'failed',
      priority: 3,
      group: 'violations'
    } ];
    var constants = {
      helpUrlBase: 'https://dequeuniversity.com/rules/',
      results: [],
      resultGroups: [],
      resultGroupMap: {},
      impact: Object.freeze([ 'minor', 'moderate', 'serious', 'critical' ])
    };
    definitions.forEach(function(definition) {
      var name = definition.name;
      var value = definition.value;
      var priority = definition.priority;
      var group = definition.group;
      constants[name] = value;
      constants[name + '_PRIO'] = priority;
      constants[name + '_GROUP'] = group;
      constants.results[priority] = value;
      constants.resultGroups[priority] = group;
      constants.resultGroupMap[value] = group;
    });
    Object.freeze(constants.results);
    Object.freeze(constants.resultGroups);
    Object.freeze(constants.resultGroupMap);
    Object.freeze(constants);
    Object.defineProperty(axe, 'constants', {
      value: constants,
      enumerable: true,
      configurable: false,
      writable: false
    });
  })(axe);
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  axe.log = function() {
    'use strict';
    if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && console.log) {
      Function.prototype.apply.call(console.log, console, arguments);
    }
  };
  'use strict';
  function cleanupPlugins(resolve, reject) {
    'use strict';
    resolve = resolve || function() {};
    reject = reject || axe.log;
    if (!axe._audit) {
      throw new Error('No audit configured');
    }
    var q = axe.utils.queue();
    var cleanupErrors = [];
    Object.keys(axe.plugins).forEach(function(key) {
      q.defer(function(res) {
        var rej = function rej(err) {
          cleanupErrors.push(err);
          res();
        };
        try {
          axe.plugins[key].cleanup(res, rej);
        } catch (err) {
          rej(err);
        }
      });
    });
    var flattenedTree = axe.utils.getFlattenedTree(document.body);
    axe.utils.querySelectorAll(flattenedTree, 'iframe, frame').forEach(function(node) {
      q.defer(function(res, rej) {
        return axe.utils.sendCommandToFrame(node.actualNode, {
          command: 'cleanup-plugin'
        }, res, rej);
      });
    });
    q.then(function(results) {
      if (cleanupErrors.length === 0) {
        resolve(results);
      } else {
        reject(cleanupErrors);
      }
    }).catch(reject);
  }
  axe.cleanup = cleanupPlugins;
  'use strict';
  function configureChecksRulesAndBranding(spec) {
    'use strict';
    var audit;
    audit = axe._audit;
    if (!audit) {
      throw new Error('No audit configured');
    }
    if (spec.reporter && (typeof spec.reporter === 'function' || reporters[spec.reporter])) {
      audit.reporter = spec.reporter;
    }
    if (spec.checks) {
      spec.checks.forEach(function(check) {
        audit.addCheck(check);
      });
    }
    var modifiedRules = [];
    if (spec.rules) {
      spec.rules.forEach(function(rule) {
        modifiedRules.push(rule.id);
        audit.addRule(rule);
      });
    }
    if (spec.disableOtherRules) {
      audit.rules.forEach(function(rule) {
        if (modifiedRules.includes(rule.id) === false) {
          rule.enabled = false;
        }
      });
    }
    if (typeof spec.branding !== 'undefined') {
      audit.setBranding(spec.branding);
    } else {
      audit._constructHelpUrls();
    }
    if (spec.tagExclude) {
      audit.tagExclude = spec.tagExclude;
    }
  }
  axe.configure = configureChecksRulesAndBranding;
  'use strict';
  axe.getRules = function(tags) {
    'use strict';
    tags = tags || [];
    var matchingRules = !tags.length ? axe._audit.rules : axe._audit.rules.filter(function(item) {
      return !!tags.filter(function(tag) {
        return item.tags.indexOf(tag) !== -1;
      }).length;
    });
    var ruleData = axe._audit.data.rules || {};
    return matchingRules.map(function(matchingRule) {
      var rd = ruleData[matchingRule.id] || {};
      return {
        ruleId: matchingRule.id,
        description: rd.description,
        help: rd.help,
        helpUrl: rd.helpUrl,
        tags: matchingRule.tags
      };
    });
  };
  'use strict';
  function runCommand(data, keepalive, callback) {
    'use strict';
    var resolve = callback;
    var reject = function reject(err) {
      if (err instanceof Error === false) {
        err = new Error(err);
      }
      callback(err);
    };
    var context = data && data.context || {};
    if (context.hasOwnProperty('include') && !context.include.length) {
      context.include = [ document ];
    }
    var options = data && data.options || {};
    switch (data.command) {
     case 'rules':
      return runRules(context, options, function(results, cleanup) {
        resolve(results);
        cleanup();
      }, reject);

     case 'cleanup-plugin':
      return cleanupPlugins(resolve, reject);

     default:
      if (axe._audit && axe._audit.commands && axe._audit.commands[data.command]) {
        return axe._audit.commands[data.command](data, callback);
      }
    }
  }
  axe._load = function(audit) {
    'use strict';
    axe.utils.respondable.subscribe('axe.ping', function(data, keepalive, respond) {
      respond({
        axe: true
      });
    });
    axe.utils.respondable.subscribe('axe.start', runCommand);
    axe._audit = new Audit(audit);
  };
  'use strict';
  var axe = axe || {};
  axe.plugins = {};
  function Plugin(spec) {
    'use strict';
    this._run = spec.run;
    this._collect = spec.collect;
    this._registry = {};
    spec.commands.forEach(function(command) {
      axe._audit.registerCommand(command);
    });
  }
  Plugin.prototype.run = function() {
    'use strict';
    return this._run.apply(this, arguments);
  };
  Plugin.prototype.collect = function() {
    'use strict';
    return this._collect.apply(this, arguments);
  };
  Plugin.prototype.cleanup = function(done) {
    'use strict';
    var q = axe.utils.queue();
    var that = this;
    Object.keys(this._registry).forEach(function(key) {
      q.defer(function(done) {
        that._registry[key].cleanup(done);
      });
    });
    q.then(function() {
      done();
    });
  };
  Plugin.prototype.add = function(impl) {
    'use strict';
    this._registry[impl.id] = impl;
  };
  axe.registerPlugin = function(plugin) {
    'use strict';
    axe.plugins[plugin.id] = new Plugin(plugin);
  };
  'use strict';
  var reporters = {};
  var defaultReporter;
  axe.getReporter = function(reporter) {
    'use strict';
    if (typeof reporter === 'string' && reporters[reporter]) {
      return reporters[reporter];
    }
    if (typeof reporter === 'function') {
      return reporter;
    }
    return defaultReporter;
  };
  axe.addReporter = function registerReporter(name, cb, isDefault) {
    'use strict';
    reporters[name] = cb;
    if (isDefault) {
      defaultReporter = cb;
    }
  };
  'use strict';
  function resetConfiguration() {
    'use strict';
    var audit = axe._audit;
    if (!audit) {
      throw new Error('No audit configured');
    }
    audit.resetRulesAndChecks();
  }
  axe.reset = resetConfiguration;
  'use strict';
  function cleanup() {
    axe._tree = undefined;
    axe._selectorData = undefined;
  }
  function runRules(context, options, resolve, reject) {
    'use strict';
    try {
      context = new Context(context);
      axe._tree = context.flatTree;
      axe._selectorData = axe.utils.getSelectorData(context.flatTree);
    } catch (e) {
      cleanup();
      return reject(e);
    }
    var q = axe.utils.queue();
    var audit = axe._audit;
    if (options.performanceTimer) {
      axe.utils.performanceTimer.auditStart();
    }
    if (context.frames.length && options.iframes !== false) {
      q.defer(function(res, rej) {
        axe.utils.collectResultsFromFrames(context, options, 'rules', null, res, rej);
      });
    }
    var scrollState = void 0;
    q.defer(function(res, rej) {
      if (options.restoreScroll) {
        scrollState = axe.utils.getScrollState();
      }
      audit.run(context, options, res, rej);
    });
    q.then(function(data) {
      try {
        if (scrollState) {
          axe.utils.setScrollState(scrollState);
        }
        if (options.performanceTimer) {
          axe.utils.performanceTimer.auditEnd();
        }
        var results = axe.utils.mergeResults(data.map(function(results) {
          return {
            results: results
          };
        }));
        if (context.initiator) {
          results = audit.after(results, options);
          results.forEach(axe.utils.publishMetaData);
          results = results.map(axe.utils.finalizeRuleResult);
        }
        try {
          resolve(results, cleanup);
        } catch (e) {
          cleanup();
          axe.log(e);
        }
      } catch (e) {
        cleanup();
        reject(e);
      }
    }).catch(function(e) {
      cleanup();
      reject(e);
    });
  }
  axe._runRules = runRules;
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  function isContext(potential) {
    'use strict';
    switch (true) {
     case typeof potential === 'string':
     case Array.isArray(potential):
     case Node && potential instanceof Node:
     case NodeList && potential instanceof NodeList:
      return true;

     case (typeof potential === 'undefined' ? 'undefined' : _typeof(potential)) !== 'object':
      return false;

     case potential.include !== undefined:
     case potential.exclude !== undefined:
     case typeof potential.length === 'number':
      return true;

     default:
      return false;
    }
  }
  var noop = function noop() {};
  function normalizeRunParams(context, options, callback) {
    'use strict';
    var typeErr = new TypeError('axe.run arguments are invalid');
    if (!isContext(context)) {
      if (callback !== undefined) {
        throw typeErr;
      }
      callback = options;
      options = context;
      context = document;
    }
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      if (callback !== undefined) {
        throw typeErr;
      }
      callback = options;
      options = {};
    }
    if (typeof callback !== 'function' && callback !== undefined) {
      throw typeErr;
    }
    return {
      context: context,
      options: options,
      callback: callback || noop
    };
  }
  axe.run = function(context, options, callback) {
    'use strict';
    if (!axe._audit) {
      throw new Error('No audit configured');
    }
    var args = normalizeRunParams(context, options, callback);
    context = args.context;
    options = args.options;
    callback = args.callback;
    options.reporter = options.reporter || axe._audit.reporter || 'v1';
    if (options.performanceTimer) {
      axe.utils.performanceTimer.start();
    }
    var p = void 0;
    var reject = noop;
    var resolve = noop;
    if (window.Promise && callback === noop) {
      p = new Promise(function(_resolve, _reject) {
        reject = _reject;
        resolve = _resolve;
      });
    }
    axe._runRules(context, options, function(rawResults, cleanup) {
      var respond = function respond(results) {
        cleanup();
        try {
          callback(null, results);
        } catch (e) {
          axe.log(e);
        }
        resolve(results);
      };
      if (options.performanceTimer) {
        axe.utils.performanceTimer.end();
      }
      try {
        var reporter = axe.getReporter(options.reporter);
        var results = reporter(rawResults, options, respond);
        if (results !== undefined) {
          respond(results);
        }
      } catch (err) {
        cleanup();
        callback(err);
        reject(err);
      }
    }, function(err) {
      callback(err);
      reject(err);
    });
    return p;
  };
  'use strict';
  helpers.failureSummary = function failureSummary(nodeData) {
    'use strict';
    var failingChecks = {};
    failingChecks.none = nodeData.none.concat(nodeData.all);
    failingChecks.any = nodeData.any;
    return Object.keys(failingChecks).map(function(key) {
      if (!failingChecks[key].length) {
        return;
      }
      var sum = axe._audit.data.failureSummaries[key];
      if (sum && typeof sum.failureMessage === 'function') {
        return sum.failureMessage(failingChecks[key].map(function(check) {
          return check.message || '';
        }));
      }
    }).filter(function(i) {
      return i !== undefined;
    }).join('\n\n');
  };
  'use strict';
  helpers.incompleteFallbackMessage = function incompleteFallbackMessage() {
    'use strict';
    return axe._audit.data.incompleteFallbackMessage();
  };
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  function normalizeRelatedNodes(node, options) {
    'use strict';
    [ 'any', 'all', 'none' ].forEach(function(type) {
      if (!Array.isArray(node[type])) {
        return;
      }
      node[type].filter(function(checkRes) {
        return Array.isArray(checkRes.relatedNodes);
      }).forEach(function(checkRes) {
        checkRes.relatedNodes = checkRes.relatedNodes.map(function(relatedNode) {
          var res = {
            html: relatedNode.source
          };
          if (options.elementRef && !relatedNode.fromFrame) {
            res.element = relatedNode.element;
          }
          if (options.selectors !== false || relatedNode.fromFrame) {
            res.target = relatedNode.selector;
          }
          if (options.xpath) {
            res.xpath = relatedNode.xpath;
          }
          return res;
        });
      });
    });
  }
  var resultKeys = axe.constants.resultGroups;
  helpers.processAggregate = function(results, options) {
    var resultObject = axe.utils.aggregateResult(results);
    resultObject.timestamp = new Date().toISOString();
    resultObject.url = window.location.href;
    resultKeys.forEach(function(key) {
      if (options.resultTypes && !options.resultTypes.includes(key)) {
        (resultObject[key] || []).forEach(function(ruleResult) {
          if (Array.isArray(ruleResult.nodes) && ruleResult.nodes.length > 0) {
            ruleResult.nodes = [ ruleResult.nodes[0] ];
          }
        });
      }
      resultObject[key] = (resultObject[key] || []).map(function(ruleResult) {
        ruleResult = Object.assign({}, ruleResult);
        if (Array.isArray(ruleResult.nodes) && ruleResult.nodes.length > 0) {
          ruleResult.nodes = ruleResult.nodes.map(function(subResult) {
            if (_typeof(subResult.node) === 'object') {
              subResult.html = subResult.node.source;
              if (options.elementRef && !subResult.node.fromFrame) {
                subResult.element = subResult.node.element;
              }
              if (options.selectors !== false || subResult.node.fromFrame) {
                subResult.target = subResult.node.selector;
              }
              if (options.xpath) {
                subResult.xpath = subResult.node.xpath;
              }
            }
            delete subResult.result;
            delete subResult.node;
            normalizeRelatedNodes(subResult, options);
            return subResult;
          });
        }
        resultKeys.forEach(function(key) {
          return delete ruleResult[key];
        });
        delete ruleResult.pageLevel;
        delete ruleResult.result;
        return ruleResult;
      });
    });
    return resultObject;
  };
  'use strict';
  axe.addReporter('na', function(results, options, callback) {
    'use strict';
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    var out = helpers.processAggregate(results, options);
    callback({
      violations: out.violations,
      passes: out.passes,
      incomplete: out.incomplete,
      inapplicable: out.inapplicable,
      timestamp: out.timestamp,
      url: out.url
    });
  });
  'use strict';
  axe.addReporter('no-passes', function(results, options, callback) {
    'use strict';
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options.resultTypes = [ 'violations' ];
    var out = helpers.processAggregate(results, options);
    callback({
      violations: out.violations,
      timestamp: out.timestamp,
      url: out.url
    });
  });
  'use strict';
  axe.addReporter('raw', function(results, options, callback) {
    'use strict';
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    callback(results);
  });
  'use strict';
  axe.addReporter('v1', function(results, options, callback) {
    'use strict';
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    var out = helpers.processAggregate(results, options);
    out.violations.forEach(function(result) {
      return result.nodes.forEach(function(nodeResult) {
        nodeResult.failureSummary = helpers.failureSummary(nodeResult);
      });
    });
    callback({
      violations: out.violations,
      passes: out.passes,
      incomplete: out.incomplete,
      inapplicable: out.inapplicable,
      timestamp: out.timestamp,
      url: out.url
    });
  });
  'use strict';
  axe.addReporter('v2', function(results, options, callback) {
    'use strict';
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    var out = helpers.processAggregate(results, options);
    callback({
      violations: out.violations,
      passes: out.passes,
      incomplete: out.incomplete,
      inapplicable: out.inapplicable,
      timestamp: out.timestamp,
      url: out.url
    });
  }, true);
  'use strict';
  axe.utils.aggregate = function(map, values, initial) {
    values = values.slice();
    if (initial) {
      values.push(initial);
    }
    var sorting = values.map(function(val) {
      return map.indexOf(val);
    }).sort();
    return map[sorting.pop()];
  };
  'use strict';
  var _axe$constants = axe.constants, CANTTELL_PRIO = _axe$constants.CANTTELL_PRIO, FAIL_PRIO = _axe$constants.FAIL_PRIO;
  var checkMap = [];
  checkMap[axe.constants.PASS_PRIO] = true;
  checkMap[axe.constants.CANTTELL_PRIO] = null;
  checkMap[axe.constants.FAIL_PRIO] = false;
  var checkTypes = [ 'any', 'all', 'none' ];
  function anyAllNone(obj, functor) {
    return checkTypes.reduce(function(out, type) {
      out[type] = (obj[type] || []).map(function(val) {
        return functor(val, type);
      });
      return out;
    }, {});
  }
  axe.utils.aggregateChecks = function(nodeResOriginal) {
    var nodeResult = Object.assign({}, nodeResOriginal);
    anyAllNone(nodeResult, function(check, type) {
      var i = checkMap.indexOf(check.result);
      check.priority = i !== -1 ? i : axe.constants.CANTTELL_PRIO;
      if (type === 'none') {
        check.priority = 4 - check.priority;
      }
    });
    var priorities = {
      all: nodeResult.all.reduce(function(a, b) {
        return Math.max(a, b.priority);
      }, 0),
      none: nodeResult.none.reduce(function(a, b) {
        return Math.max(a, b.priority);
      }, 0),
      any: nodeResult.any.reduce(function(a, b) {
        return Math.min(a, b.priority);
      }, 4) % 4
    };
    nodeResult.priority = Math.max(priorities.all, priorities.none, priorities.any);
    var impacts = [];
    checkTypes.forEach(function(type) {
      nodeResult[type] = nodeResult[type].filter(function(check) {
        return check.priority === nodeResult.priority && check.priority === priorities[type];
      });
      nodeResult[type].forEach(function(check) {
        return impacts.push(check.impact);
      });
    });
    if ([ CANTTELL_PRIO, FAIL_PRIO ].includes(nodeResult.priority)) {
      nodeResult.impact = axe.utils.aggregate(axe.constants.impact, impacts);
    } else {
      nodeResult.impact = null;
    }
    anyAllNone(nodeResult, function(c) {
      delete c.result;
      delete c.priority;
    });
    nodeResult.result = axe.constants.results[nodeResult.priority];
    delete nodeResult.priority;
    return nodeResult;
  };
  'use strict';
  (function() {
    axe.utils.aggregateNodeResults = function(nodeResults) {
      var ruleResult = {};
      nodeResults = nodeResults.map(function(nodeResult) {
        if (nodeResult.any && nodeResult.all && nodeResult.none) {
          return axe.utils.aggregateChecks(nodeResult);
        } else if (Array.isArray(nodeResult.node)) {
          return axe.utils.finalizeRuleResult(nodeResult);
        } else {
          throw new TypeError('Invalid Result type');
        }
      });
      if (nodeResults && nodeResults.length) {
        var resultList = nodeResults.map(function(node) {
          return node.result;
        });
        ruleResult.result = axe.utils.aggregate(axe.constants.results, resultList, ruleResult.result);
      } else {
        ruleResult.result = 'inapplicable';
      }
      axe.constants.resultGroups.forEach(function(group) {
        return ruleResult[group] = [];
      });
      nodeResults.forEach(function(nodeResult) {
        var groupName = axe.constants.resultGroupMap[nodeResult.result];
        ruleResult[groupName].push(nodeResult);
      });
      var impactGroup = axe.constants.FAIL_GROUP;
      if (ruleResult[impactGroup].length === 0) {
        impactGroup = axe.constants.CANTTELL_GROUP;
      }
      if (ruleResult[impactGroup].length > 0) {
        var impactList = ruleResult[impactGroup].map(function(failure) {
          return failure.impact;
        });
        ruleResult.impact = axe.utils.aggregate(axe.constants.impact, impactList) || null;
      } else {
        ruleResult.impact = null;
      }
      return ruleResult;
    };
  })();
  'use strict';
  function copyToGroup(resultObject, subResult, group) {
    var resultCopy = Object.assign({}, subResult);
    resultCopy.nodes = (resultCopy[group] || []).concat();
    axe.constants.resultGroups.forEach(function(group) {
      delete resultCopy[group];
    });
    resultObject[group].push(resultCopy);
  }
  axe.utils.aggregateResult = function(results) {
    var resultObject = {};
    axe.constants.resultGroups.forEach(function(groupName) {
      return resultObject[groupName] = [];
    });
    results.forEach(function(subResult) {
      if (subResult.error) {
        copyToGroup(resultObject, subResult, axe.constants.CANTTELL_GROUP);
      } else if (subResult.result === axe.constants.NA) {
        copyToGroup(resultObject, subResult, axe.constants.NA_GROUP);
      } else {
        axe.constants.resultGroups.forEach(function(group) {
          if (Array.isArray(subResult[group]) && subResult[group].length > 0) {
            copyToGroup(resultObject, subResult, group);
          }
        });
      }
    });
    return resultObject;
  };
  'use strict';
  function areStylesSet(el, styles, stopAt) {
    'use strict';
    var styl = window.getComputedStyle(el, null);
    var set = false;
    if (!styl) {
      return false;
    }
    styles.forEach(function(att) {
      if (styl.getPropertyValue(att.property) === att.value) {
        set = true;
      }
    });
    if (set) {
      return true;
    }
    if (el.nodeName.toUpperCase() === stopAt.toUpperCase() || !el.parentNode) {
      return false;
    }
    return areStylesSet(el.parentNode, styles, stopAt);
  }
  axe.utils.areStylesSet = areStylesSet;
  'use strict';
  axe.utils.checkHelper = function checkHelper(checkResult, options, resolve, reject) {
    'use strict';
    return {
      isAsync: false,
      async: function async() {
        this.isAsync = true;
        return function(result) {
          if (result instanceof Error === false) {
            checkResult.result = result;
            resolve(checkResult);
          } else {
            reject(result);
          }
        };
      },
      data: function data(_data) {
        checkResult.data = _data;
      },
      relatedNodes: function relatedNodes(nodes) {
        nodes = nodes instanceof Node ? [ nodes ] : axe.utils.toArray(nodes);
        checkResult.relatedNodes = nodes.map(function(element) {
          return new axe.utils.DqElement(element, options);
        });
      }
    };
  };
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  axe.utils.clone = function(obj) {
    'use strict';
    var index, length, out = obj;
    if (obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      if (Array.isArray(obj)) {
        out = [];
        for (index = 0, length = obj.length; index < length; index++) {
          out[index] = axe.utils.clone(obj[index]);
        }
      } else {
        out = {};
        for (index in obj) {
          out[index] = axe.utils.clone(obj[index]);
        }
      }
    }
    return out;
  };
  'use strict';
  function err(message, node) {
    'use strict';
    var selector;
    if (axe._tree) {
      selector = axe.utils.getSelector(node);
    }
    return new Error(message + ': ' + (selector || node));
  }
  axe.utils.sendCommandToFrame = function(node, parameters, resolve, reject) {
    'use strict';
    var win = node.contentWindow;
    if (!win) {
      axe.log('Frame does not have a content window', node);
      resolve(null);
      return;
    }
    var timeout = setTimeout(function() {
      timeout = setTimeout(function() {
        if (!parameters.debug) {
          resolve(null);
        } else {
          reject(err('No response from frame', node));
        }
      }, 0);
    }, 500);
    axe.utils.respondable(win, 'axe.ping', null, undefined, function() {
      clearTimeout(timeout);
      var frameWaitTime = parameters.options && parameters.options.frameWaitTime || 6e4;
      timeout = setTimeout(function() {
        reject(err('Axe in frame timed out', node));
      }, frameWaitTime);
      axe.utils.respondable(win, 'axe.start', parameters, undefined, function(data) {
        clearTimeout(timeout);
        if (data instanceof Error === false) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  };
  function collectResultsFromFrames(context, options, command, parameter, resolve, reject) {
    'use strict';
    var q = axe.utils.queue();
    var frames = context.frames;
    frames.forEach(function(frame) {
      var params = {
        options: options,
        command: command,
        parameter: parameter,
        context: {
          initiator: false,
          page: context.page,
          include: frame.include || [],
          exclude: frame.exclude || []
        }
      };
      q.defer(function(res, rej) {
        var node = frame.node;
        axe.utils.sendCommandToFrame(node, params, function(data) {
          if (data) {
            return res({
              results: data,
              frameElement: node,
              frame: axe.utils.getSelector(node)
            });
          }
          res(null);
        }, rej);
      });
    });
    q.then(function(data) {
      resolve(axe.utils.mergeResults(data, options));
    }).catch(reject);
  }
  axe.utils.collectResultsFromFrames = collectResultsFromFrames;
  'use strict';
  axe.utils.contains = function(node, otherNode) {
    'use strict';
    function containsShadowChild(node, otherNode) {
      if (node.shadowId === otherNode.shadowId) {
        return true;
      }
      return !!node.children.find(function(child) {
        return containsShadowChild(child, otherNode);
      });
    }
    if (node.shadowId || otherNode.shadowId) {
      return containsShadowChild(node, otherNode);
    }
    if (typeof node.actualNode.contains === 'function') {
      return node.actualNode.contains(otherNode.actualNode);
    }
    return !!(node.actualNode.compareDocumentPosition(otherNode.actualNode) & 16);
  };
  'use strict';
  (function(axe) {
    /*!
  * The copyright below covers the code within this function block only
  *
  * Copyright (c) 2013 Dulin Marat
  * 
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  * 
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.
  * 
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  */
    function CssSelectorParser() {
      this.pseudos = {};
      this.attrEqualityMods = {};
      this.ruleNestingOperators = {};
      this.substitutesEnabled = false;
    }
    CssSelectorParser.prototype.registerSelectorPseudos = function(name) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        name = arguments[j];
        this.pseudos[name] = 'selector';
      }
      return this;
    };
    CssSelectorParser.prototype.unregisterSelectorPseudos = function(name) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        name = arguments[j];
        delete this.pseudos[name];
      }
      return this;
    };
    CssSelectorParser.prototype.registerNumericPseudos = function(name) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        name = arguments[j];
        this.pseudos[name] = 'numeric';
      }
      return this;
    };
    CssSelectorParser.prototype.unregisterNumericPseudos = function(name) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        name = arguments[j];
        delete this.pseudos[name];
      }
      return this;
    };
    CssSelectorParser.prototype.registerNestingOperators = function(operator) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        operator = arguments[j];
        this.ruleNestingOperators[operator] = true;
      }
      return this;
    };
    CssSelectorParser.prototype.unregisterNestingOperators = function(operator) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        operator = arguments[j];
        delete this.ruleNestingOperators[operator];
      }
      return this;
    };
    CssSelectorParser.prototype.registerAttrEqualityMods = function(mod) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        mod = arguments[j];
        this.attrEqualityMods[mod] = true;
      }
      return this;
    };
    CssSelectorParser.prototype.unregisterAttrEqualityMods = function(mod) {
      for (var j = 0, len = arguments.length; j < len; j++) {
        mod = arguments[j];
        delete this.attrEqualityMods[mod];
      }
      return this;
    };
    CssSelectorParser.prototype.enableSubstitutes = function() {
      this.substitutesEnabled = true;
      return this;
    };
    CssSelectorParser.prototype.disableSubstitutes = function() {
      this.substitutesEnabled = false;
      return this;
    };
    function isIdentStart(c) {
      return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '-' || c === '_';
    }
    function isIdent(c) {
      return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9' || c === '-' || c === '_';
    }
    function isHex(c) {
      return c >= 'a' && c <= 'f' || c >= 'A' && c <= 'F' || c >= '0' && c <= '9';
    }
    function isDecimal(c) {
      return c >= '0' && c <= '9';
    }
    function isAttrMatchOperator(chr) {
      return chr === '=' || chr === '^' || chr === '$' || chr === '*' || chr === '~';
    }
    var identSpecialChars = {
      '!': true,
      '"': true,
      '#': true,
      $: true,
      '%': true,
      '&': true,
      '\'': true,
      '(': true,
      ')': true,
      '*': true,
      '+': true,
      ',': true,
      '.': true,
      '/': true,
      ';': true,
      '<': true,
      '=': true,
      '>': true,
      '?': true,
      '@': true,
      '[': true,
      '\\': true,
      ']': true,
      '^': true,
      '`': true,
      '{': true,
      '|': true,
      '}': true,
      '~': true
    };
    var strReplacementsRev = {
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\f': '\\f',
      '\v': '\\v'
    };
    var singleQuoteEscapeChars = {
      n: '\n',
      r: '\r',
      t: '\t',
      f: '\f',
      '\\': '\\',
      '\'': '\''
    };
    var doubleQuotesEscapeChars = {
      n: '\n',
      r: '\r',
      t: '\t',
      f: '\f',
      '\\': '\\',
      '"': '"'
    };
    function ParseContext(str, pos, pseudos, attrEqualityMods, ruleNestingOperators, substitutesEnabled) {
      var chr, getIdent, getStr, l, skipWhitespace;
      l = str.length;
      chr = null;
      getStr = function getStr(quote, escapeTable) {
        var esc, hex, result;
        result = '';
        pos++;
        chr = str.charAt(pos);
        while (pos < l) {
          if (chr === quote) {
            pos++;
            return result;
          } else if (chr === '\\') {
            pos++;
            chr = str.charAt(pos);
            if (chr === quote) {
              result += quote;
            } else if (esc = escapeTable[chr]) {
              result += esc;
            } else if (isHex(chr)) {
              hex = chr;
              pos++;
              chr = str.charAt(pos);
              while (isHex(chr)) {
                hex += chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (chr === ' ') {
                pos++;
                chr = str.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            result += chr;
          }
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      };
      getIdent = function getIdent() {
        var result = '';
        chr = str.charAt(pos);
        while (pos < l) {
          if (isIdent(chr)) {
            result += chr;
          } else if (chr === '\\') {
            pos++;
            if (pos >= l) {
              throw Error('Expected symbol but end of file reached.');
            }
            chr = str.charAt(pos);
            if (identSpecialChars[chr]) {
              result += chr;
            } else if (isHex(chr)) {
              var hex = chr;
              pos++;
              chr = str.charAt(pos);
              while (isHex(chr)) {
                hex += chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (chr === ' ') {
                pos++;
                chr = str.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            return result;
          }
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      };
      skipWhitespace = function skipWhitespace() {
        chr = str.charAt(pos);
        var result = false;
        while (chr === ' ' || chr === '\t' || chr === '\n' || chr === '\r' || chr === '\f') {
          result = true;
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      };
      this.parse = function() {
        var res = this.parseSelector();
        if (pos < l) {
          throw Error('Rule expected but "' + str.charAt(pos) + '" found.');
        }
        return res;
      };
      this.parseSelector = function() {
        var res;
        var selector = res = this.parseSingleSelector();
        chr = str.charAt(pos);
        while (chr === ',') {
          pos++;
          skipWhitespace();
          if (res.type !== 'selectors') {
            res = {
              type: 'selectors',
              selectors: [ selector ]
            };
          }
          selector = this.parseSingleSelector();
          if (!selector) {
            throw Error('Rule expected after ",".');
          }
          res.selectors.push(selector);
        }
        return res;
      };
      this.parseSingleSelector = function() {
        skipWhitespace();
        var selector = {
          type: 'ruleSet'
        };
        var rule = this.parseRule();
        if (!rule) {
          return null;
        }
        var currentRule = selector;
        while (rule) {
          rule.type = 'rule';
          currentRule.rule = rule;
          currentRule = rule;
          skipWhitespace();
          chr = str.charAt(pos);
          if (pos >= l || chr === ',' || chr === ')') {
            break;
          }
          if (ruleNestingOperators[chr]) {
            var op = chr;
            pos++;
            skipWhitespace();
            rule = this.parseRule();
            if (!rule) {
              throw Error('Rule expected after "' + op + '".');
            }
            rule.nestingOperator = op;
          } else {
            rule = this.parseRule();
            if (rule) {
              rule.nestingOperator = null;
            }
          }
        }
        return selector;
      };
      this.parseRule = function() {
        var rule = null;
        while (pos < l) {
          chr = str.charAt(pos);
          if (chr === '*') {
            pos++;
            (rule = rule || {}).tagName = '*';
          } else if (isIdentStart(chr) || chr === '\\') {
            (rule = rule || {}).tagName = getIdent();
          } else if (chr === '.') {
            pos++;
            rule = rule || {};
            (rule.classNames = rule.classNames || []).push(getIdent());
          } else if (chr === '#') {
            pos++;
            (rule = rule || {}).id = getIdent();
          } else if (chr === '[') {
            pos++;
            skipWhitespace();
            var attr = {
              name: getIdent()
            };
            skipWhitespace();
            if (chr === ']') {
              pos++;
            } else {
              var operator = '';
              if (attrEqualityMods[chr]) {
                operator = chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (pos >= l) {
                throw Error('Expected "=" but end of file reached.');
              }
              if (chr !== '=') {
                throw Error('Expected "=" but "' + chr + '" found.');
              }
              attr.operator = operator + '=';
              pos++;
              skipWhitespace();
              var attrValue = '';
              attr.valueType = 'string';
              if (chr === '"') {
                attrValue = getStr('"', doubleQuotesEscapeChars);
              } else if (chr === '\'') {
                attrValue = getStr('\'', singleQuoteEscapeChars);
              } else if (substitutesEnabled && chr === '$') {
                pos++;
                attrValue = getIdent();
                attr.valueType = 'substitute';
              } else {
                while (pos < l) {
                  if (chr === ']') {
                    break;
                  }
                  attrValue += chr;
                  pos++;
                  chr = str.charAt(pos);
                }
                attrValue = attrValue.trim();
              }
              skipWhitespace();
              if (pos >= l) {
                throw Error('Expected "]" but end of file reached.');
              }
              if (chr !== ']') {
                throw Error('Expected "]" but "' + chr + '" found.');
              }
              pos++;
              attr.value = attrValue;
            }
            rule = rule || {};
            (rule.attrs = rule.attrs || []).push(attr);
          } else if (chr === ':') {
            pos++;
            var pseudoName = getIdent();
            var pseudo = {
              name: pseudoName
            };
            if (chr === '(') {
              pos++;
              var value = '';
              skipWhitespace();
              if (pseudos[pseudoName] === 'selector') {
                pseudo.valueType = 'selector';
                value = this.parseSelector();
              } else {
                pseudo.valueType = pseudos[pseudoName] || 'string';
                if (chr === '"') {
                  value = getStr('"', doubleQuotesEscapeChars);
                } else if (chr === '\'') {
                  value = getStr('\'', singleQuoteEscapeChars);
                } else if (substitutesEnabled && chr === '$') {
                  pos++;
                  value = getIdent();
                  pseudo.valueType = 'substitute';
                } else {
                  while (pos < l) {
                    if (chr === ')') {
                      break;
                    }
                    value += chr;
                    pos++;
                    chr = str.charAt(pos);
                  }
                  value = value.trim();
                }
                skipWhitespace();
              }
              if (pos >= l) {
                throw Error('Expected ")" but end of file reached.');
              }
              if (chr !== ')') {
                throw Error('Expected ")" but "' + chr + '" found.');
              }
              pos++;
              pseudo.value = value;
            }
            rule = rule || {};
            (rule.pseudos = rule.pseudos || []).push(pseudo);
          } else {
            break;
          }
        }
        return rule;
      };
      return this;
    }
    CssSelectorParser.prototype.parse = function(str) {
      var context = new ParseContext(str, 0, this.pseudos, this.attrEqualityMods, this.ruleNestingOperators, this.substitutesEnabled);
      return context.parse();
    };
    CssSelectorParser.prototype.escapeIdentifier = function(s) {
      var result = '';
      var i = 0;
      var len = s.length;
      while (i < len) {
        var chr = s.charAt(i);
        if (identSpecialChars[chr]) {
          result += '\\' + chr;
        } else {
          if (!(chr === '_' || chr === '-' || chr >= 'A' && chr <= 'Z' || chr >= 'a' && chr <= 'z' || i !== 0 && chr >= '0' && chr <= '9')) {
            var charCode = chr.charCodeAt(0);
            if ((charCode & 63488) === 55296) {
              var extraCharCode = s.charCodeAt(i++);
              if ((charCode & 64512) !== 55296 || (extraCharCode & 64512) !== 56320) {
                throw Error('UCS-2(decode): illegal sequence');
              }
              charCode = ((charCode & 1023) << 10) + (extraCharCode & 1023) + 65536;
            }
            result += '\\' + charCode.toString(16) + ' ';
          } else {
            result += chr;
          }
        }
        i++;
      }
      return result;
    };
    CssSelectorParser.prototype.escapeStr = function(s) {
      var result = '';
      var i = 0;
      var len = s.length;
      var chr, replacement;
      while (i < len) {
        chr = s.charAt(i);
        if (chr === '"') {
          chr = '\\"';
        } else if (chr === '\\') {
          chr = '\\\\';
        } else if (replacement = strReplacementsRev[chr]) {
          chr = replacement;
        }
        result += chr;
        i++;
      }
      return '"' + result + '"';
    };
    CssSelectorParser.prototype.render = function(path) {
      return this._renderEntity(path).trim();
    };
    CssSelectorParser.prototype._renderEntity = function(entity) {
      var currentEntity, parts, res;
      res = '';
      switch (entity.type) {
       case 'ruleSet':
        currentEntity = entity.rule;
        parts = [];
        while (currentEntity) {
          if (currentEntity.nestingOperator) {
            parts.push(currentEntity.nestingOperator);
          }
          parts.push(this._renderEntity(currentEntity));
          currentEntity = currentEntity.rule;
        }
        res = parts.join(' ');
        break;

       case 'selectors':
        res = entity.selectors.map(this._renderEntity, this).join(', ');
        break;

       case 'rule':
        if (entity.tagName) {
          if (entity.tagName === '*') {
            res = '*';
          } else {
            res = this.escapeIdentifier(entity.tagName);
          }
        }
        if (entity.id) {
          res += '#' + this.escapeIdentifier(entity.id);
        }
        if (entity.classNames) {
          res += entity.classNames.map(function(cn) {
            return '.' + this.escapeIdentifier(cn);
          }, this).join('');
        }
        if (entity.attrs) {
          res += entity.attrs.map(function(attr) {
            if (attr.operator) {
              if (attr.valueType === 'substitute') {
                return '[' + this.escapeIdentifier(attr.name) + attr.operator + '$' + attr.value + ']';
              } else {
                return '[' + this.escapeIdentifier(attr.name) + attr.operator + this.escapeStr(attr.value) + ']';
              }
            } else {
              return '[' + this.escapeIdentifier(attr.name) + ']';
            }
          }, this).join('');
        }
        if (entity.pseudos) {
          res += entity.pseudos.map(function(pseudo) {
            if (pseudo.valueType) {
              if (pseudo.valueType === 'selector') {
                return ':' + this.escapeIdentifier(pseudo.name) + '(' + this._renderEntity(pseudo.value) + ')';
              } else if (pseudo.valueType === 'substitute') {
                return ':' + this.escapeIdentifier(pseudo.name) + '($' + pseudo.value + ')';
              } else if (pseudo.valueType === 'numeric') {
                return ':' + this.escapeIdentifier(pseudo.name) + '(' + pseudo.value + ')';
              } else {
                return ':' + this.escapeIdentifier(pseudo.name) + '(' + this.escapeIdentifier(pseudo.value) + ')';
              }
            } else {
              return ':' + this.escapeIdentifier(pseudo.name);
            }
          }, this).join('');
        }
        break;

       default:
        throw Error('Unknown entity type: "' + entity.type(+'".'));
      }
      return res;
    };
    var parser = new CssSelectorParser();
    parser.registerNestingOperators('>');
    axe.utils.cssParser = parser;
  })(axe);
  'use strict';
  function truncate(str, maxLength) {
    maxLength = maxLength || 300;
    if (str.length > maxLength) {
      var index = str.indexOf('>');
      str = str.substring(0, index + 1);
    }
    return str;
  }
  function getSource(element) {
    var source = element.outerHTML;
    if (!source && typeof XMLSerializer === 'function') {
      source = new XMLSerializer().serializeToString(element);
    }
    return truncate(source || '');
  }
  function DqElement(element, options, spec) {
    this._fromFrame = !!spec;
    this.spec = spec || {};
    if (options && options.absolutePaths) {
      this._options = {
        toRoot: true
      };
    }
    this.source = this.spec.source !== undefined ? this.spec.source : getSource(element);
    this._element = element;
  }
  DqElement.prototype = {
    get selector() {
      return this.spec.selector || [ axe.utils.getSelector(this.element, this._options) ];
    },
    get xpath() {
      return this.spec.xpath || [ axe.utils.getXpath(this.element) ];
    },
    get element() {
      return this._element;
    },
    get fromFrame() {
      return this._fromFrame;
    },
    toJSON: function toJSON() {
      'use strict';
      return {
        selector: this.selector,
        source: this.source,
        xpath: this.xpath
      };
    }
  };
  DqElement.fromFrame = function(node, options, frame) {
    node.selector.unshift(frame.selector);
    node.xpath.unshift(frame.xpath);
    return new axe.utils.DqElement(frame.element, options, node);
  };
  axe.utils.DqElement = DqElement;
  'use strict';
  axe.utils.matchesSelector = function() {
    'use strict';
    var method;
    function getMethod(win) {
      var index, candidate, elProto = win.Element.prototype, candidates = [ 'matches', 'matchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector', 'msMatchesSelector' ], length = candidates.length;
      for (index = 0; index < length; index++) {
        candidate = candidates[index];
        if (elProto[candidate]) {
          return candidate;
        }
      }
    }
    return function(node, selector) {
      if (!method || !node[method]) {
        method = getMethod(node.ownerDocument.defaultView);
      }
      return node[method](selector);
    };
  }();
  'use strict';
  axe.utils.escapeSelector = function(value) {
    'use strict';
    var string = String(value);
    var length = string.length;
    var index = -1;
    var codeUnit;
    var result = '';
    var firstCodeUnit = string.charCodeAt(0);
    while (++index < length) {
      codeUnit = string.charCodeAt(index);
      if (codeUnit == 0) {
        throw new Error('INVALID_CHARACTER_ERR');
      }
      if (codeUnit >= 1 && codeUnit <= 31 || codeUnit >= 127 && codeUnit <= 159 || index == 0 && codeUnit >= 48 && codeUnit <= 57 || index == 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit == 45) {
        result += '\\' + codeUnit.toString(16) + ' ';
        continue;
      }
      if (index == 1 && codeUnit == 45 && firstCodeUnit == 45) {
        result += '\\' + string.charAt(index);
        continue;
      }
      if (codeUnit >= 128 || codeUnit == 45 || codeUnit == 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
        result += string.charAt(index);
        continue;
      }
      result += '\\' + string.charAt(index);
    }
    return result;
  };
  'use strict';
  axe.utils.extendMetaData = function(to, from) {
    Object.assign(to, from);
    Object.keys(from).filter(function(prop) {
      return typeof from[prop] === 'function';
    }).forEach(function(prop) {
      to[prop] = null;
      try {
        to[prop] = from[prop](to);
      } catch (e) {}
    });
  };
  'use strict';
  axe.utils.finalizeRuleResult = function(ruleResult) {
    Object.assign(ruleResult, axe.utils.aggregateNodeResults(ruleResult.nodes));
    delete ruleResult.nodes;
    return ruleResult;
  };
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  axe.utils.findBy = function(array, key, value) {
    if (Array.isArray(array)) {
      return array.find(function(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj[key] === value;
      });
    }
  };
  'use strict';
  var axe = axe || {
    utils: {}
  };
  function virtualDOMfromNode(node, shadowId) {
    return {
      shadowId: shadowId,
      children: [],
      actualNode: node
    };
  }
  function getSlotChildren(node) {
    var retVal = [];
    node = node.firstChild;
    while (node) {
      retVal.push(node);
      node = node.nextSibling;
    }
    return retVal;
  }
  axe.utils.getFlattenedTree = function(node, shadowId) {
    var retVal, realArray, nodeName;
    function reduceShadowDOM(res, child) {
      var replacements = axe.utils.getFlattenedTree(child, shadowId);
      if (replacements) {
        res = res.concat(replacements);
      }
      return res;
    }
    if (node.documentElement) {
      node = node.documentElement;
    }
    nodeName = node.nodeName.toLowerCase();
    if (axe.utils.isShadowRoot(node)) {
      retVal = virtualDOMfromNode(node, shadowId);
      shadowId = 'a' + Math.random().toString().substring(2);
      realArray = Array.from(node.shadowRoot.childNodes);
      retVal.children = realArray.reduce(reduceShadowDOM, []);
      return [ retVal ];
    } else {
      if (nodeName === 'content') {
        realArray = Array.from(node.getDistributedNodes());
        return realArray.reduce(reduceShadowDOM, []);
      } else if (nodeName === 'slot') {
        realArray = Array.from(node.assignedNodes());
        if (!realArray.length) {
          realArray = getSlotChildren(node);
        }
        var styl = window.getComputedStyle(node);
        if (false) {
          retVal = virtualDOMfromNode(node, shadowId);
          retVal.children = realArray.reduce(reduceShadowDOM, []);
          return [ retVal ];
        } else {
          return realArray.reduce(reduceShadowDOM, []);
        }
      } else {
        if (node.nodeType === 1) {
          retVal = virtualDOMfromNode(node, shadowId);
          realArray = Array.from(node.childNodes);
          retVal.children = realArray.reduce(reduceShadowDOM, []);
          return [ retVal ];
        } else if (node.nodeType === 3) {
          return [ virtualDOMfromNode(node) ];
        }
        return undefined;
      }
    }
  };
  axe.utils.getNodeFromTree = function(vNode, node) {
    var found;
    if (vNode.actualNode === node) {
      return vNode;
    }
    vNode.children.forEach(function(candidate) {
      var retVal;
      if (candidate.actualNode === node) {
        found = candidate;
      } else {
        retVal = axe.utils.getNodeFromTree(candidate, node);
        if (retVal) {
          found = retVal;
        }
      }
    });
    return found;
  };
  'use strict';
  axe.utils.getAllChecks = function getAllChecks(object) {
    'use strict';
    var result = [];
    return result.concat(object.any || []).concat(object.all || []).concat(object.none || []);
  };
  'use strict';
  axe.utils.getCheckOption = function(check, ruleID, options) {
    var ruleCheckOption = ((options.rules && options.rules[ruleID] || {}).checks || {})[check.id];
    var checkOption = (options.checks || {})[check.id];
    var enabled = check.enabled;
    var opts = check.options;
    if (checkOption) {
      if (checkOption.hasOwnProperty('enabled')) {
        enabled = checkOption.enabled;
      }
      if (checkOption.hasOwnProperty('options')) {
        opts = checkOption.options;
      }
    }
    if (ruleCheckOption) {
      if (ruleCheckOption.hasOwnProperty('enabled')) {
        enabled = ruleCheckOption.enabled;
      }
      if (ruleCheckOption.hasOwnProperty('options')) {
        opts = ruleCheckOption.options;
      }
    }
    return {
      enabled: enabled,
      options: opts,
      absolutePaths: options.absolutePaths
    };
  };
  'use strict';
  var _slicedToArray = function() {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) {
            break;
          }
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i['return']) {
            _i['return']();
          }
        } finally {
          if (_d) {
            throw _e;
          }
        }
      }
      return _arr;
    }
    return function(arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
      }
    };
  }();
  function isMostlyNumbers() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return str.length !== 0 && (str.match(/[0-9]/g) || '').length >= str.length / 2;
  }
  function splitString(str, splitIndex) {
    return [ str.substring(0, splitIndex), str.substring(splitIndex) ];
  }
  function uriParser(url) {
    var original = url;
    var protocol = '', domain = '', port = '', path = '', query = '', hash = '';
    if (url.includes('#')) {
      var _splitString = splitString(url, url.indexOf('#'));
      var _splitString2 = _slicedToArray(_splitString, 2);
      url = _splitString2[0];
      hash = _splitString2[1];
    }
    if (url.includes('?')) {
      var _splitString3 = splitString(url, url.indexOf('?'));
      var _splitString4 = _slicedToArray(_splitString3, 2);
      url = _splitString4[0];
      query = _splitString4[1];
    }
    if (url.includes('://')) {
      var _url$split = url.split('://');
      var _url$split2 = _slicedToArray(_url$split, 2);
      protocol = _url$split2[0];
      url = _url$split2[1];
      var _splitString5 = splitString(url, url.indexOf('/'));
      var _splitString6 = _slicedToArray(_splitString5, 2);
      domain = _splitString6[0];
      url = _splitString6[1];
    } else if (url.substr(0, 2) === '//') {
      url = url.substr(2);
      var _splitString7 = splitString(url, url.indexOf('/'));
      var _splitString8 = _slicedToArray(_splitString7, 2);
      domain = _splitString8[0];
      url = _splitString8[1];
    }
    if (domain.substr(0, 4) === 'www.') {
      domain = domain.substr(4);
    }
    if (domain && domain.includes(':')) {
      var _splitString9 = splitString(domain, domain.indexOf(':'));
      var _splitString10 = _slicedToArray(_splitString9, 2);
      domain = _splitString10[0];
      port = _splitString10[1];
    }
    path = url;
    return {
      original: original,
      protocol: protocol,
      domain: domain,
      port: port,
      path: path,
      query: query,
      hash: hash
    };
  }
  axe.utils.getFriendlyUriEnd = function getFriendlyUriEnd() {
    var uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (uri.length <= 1 || uri.substr(0, 5) === 'data:' || uri.substr(0, 11) === 'javascript:' || uri.includes('?')) {
      return;
    }
    var currentDomain = options.currentDomain, _options$maxLength = options.maxLength, maxLength = _options$maxLength === undefined ? 25 : _options$maxLength;
    var _uriParser = uriParser(uri), path = _uriParser.path, domain = _uriParser.domain, hash = _uriParser.hash;
    var pathEnd = path.substr(path.substr(0, path.length - 2).lastIndexOf('/') + 1);
    if (hash) {
      if (pathEnd && (pathEnd + hash).length <= maxLength) {
        return pathEnd + hash;
      } else if (pathEnd.length < 2 && hash.length > 2 && hash.length <= maxLength) {
        return hash;
      } else {
        return;
      }
    } else if (domain && domain.length < maxLength && path.length <= 1) {
      return domain + path;
    }
    if (path === '/' + pathEnd && domain && currentDomain && domain !== currentDomain && (domain + path).length <= maxLength) {
      return domain + path;
    }
    var lastDotIndex = pathEnd.lastIndexOf('.');
    if ((lastDotIndex === -1 || lastDotIndex > 1) && (lastDotIndex !== -1 || pathEnd.length > 2) && pathEnd.length <= maxLength && !pathEnd.match(/index(\.[a-zA-Z]{2-4})?/) && !isMostlyNumbers(pathEnd)) {
      return pathEnd;
    }
  };
  'use strict';
  var escapeSelector = axe.utils.escapeSelector;
  var isXHTML = void 0;
  var ignoredAttributes = [ 'class', 'style', 'id', 'selected', 'checked', 'disabled', 'tabindex', 'aria-checked', 'aria-selected', 'aria-invalid', 'aria-activedescendant', 'aria-busy', 'aria-disabled', 'aria-expanded', 'aria-grabbed', 'aria-pressed', 'aria-valuenow' ];
  var MAXATTRIBUTELENGTH = 31;
  function getAttributeNameValue(node, at) {
    var name = at.name;
    var atnv = void 0;
    if (name.indexOf('href') !== -1 || name.indexOf('src') !== -1) {
      var friendly = axe.utils.getFriendlyUriEnd(node.getAttribute(name));
      if (friendly) {
        var value = encodeURI(friendly);
        if (value) {
          atnv = escapeSelector(at.name) + '$="' + value + '"';
        } else {
          return;
        }
      } else {
        atnv = escapeSelector(at.name) + '="' + node.getAttribute(name) + '"';
      }
    } else {
      atnv = escapeSelector(name) + '="' + escapeSelector(at.value) + '"';
    }
    return atnv;
  }
  function countSort(a, b) {
    return a.count < b.count ? -1 : a.count === b.count ? 0 : 1;
  }
  function filterAttributes(at) {
    return !ignoredAttributes.includes(at.name) && at.name.indexOf(':') === -1 && (!at.value || at.value.length < MAXATTRIBUTELENGTH);
  }
  axe.utils.getSelectorData = function(domTree) {
    var data = {
      classes: {},
      tags: {},
      attributes: {}
    };
    domTree = Array.isArray(domTree) ? domTree : [ domTree ];
    var currentLevel = domTree.slice();
    var stack = [];
    var _loop = function _loop() {
      var current = currentLevel.pop();
      var node = current.actualNode;
      if (!!node.querySelectorAll) {
        var tag = node.nodeName;
        if (data.tags[tag]) {
          data.tags[tag]++;
        } else {
          data.tags[tag] = 1;
        }
        if (node.classList) {
          Array.from(node.classList).forEach(function(cl) {
            var ind = escapeSelector(cl);
            if (data.classes[ind]) {
              data.classes[ind]++;
            } else {
              data.classes[ind] = 1;
            }
          });
        }
        if (node.attributes) {
          Array.from(node.attributes).filter(filterAttributes).forEach(function(at) {
            var atnv = getAttributeNameValue(node, at);
            if (atnv) {
              if (data.attributes[atnv]) {
                data.attributes[atnv]++;
              } else {
                data.attributes[atnv] = 1;
              }
            }
          });
        }
      }
      if (current.children.length) {
        stack.push(currentLevel);
        currentLevel = current.children.slice();
      }
      while (!currentLevel.length && stack.length) {
        currentLevel = stack.pop();
      }
    };
    while (currentLevel.length) {
      _loop();
    }
    return data;
  };
  function uncommonClasses(node, selectorData) {
    var retVal = [];
    var classData = selectorData.classes;
    var tagData = selectorData.tags;
    if (node.classList) {
      Array.from(node.classList).forEach(function(cl) {
        var ind = escapeSelector(cl);
        if (classData[ind] < tagData[node.nodeName]) {
          retVal.push({
            name: ind,
            count: classData[ind],
            species: 'class'
          });
        }
      });
    }
    return retVal.sort(countSort);
  }
  function getNthChildString(elm, selector) {
    var siblings = elm.parentNode && Array.from(elm.parentNode.children || '') || [];
    var hasMatchingSiblings = siblings.find(function(sibling) {
      return sibling !== elm && axe.utils.matchesSelector(sibling, selector);
    });
    if (hasMatchingSiblings) {
      var nthChild = 1 + siblings.indexOf(elm);
      return ':nth-child(' + nthChild + ')';
    } else {
      return '';
    }
  }
  function getElmId(elm) {
    if (!elm.getAttribute('id')) {
      return;
    }
    var doc = elm.getRootNode && elm.getRootNode() || document;
    var id = '#' + escapeSelector(elm.getAttribute('id') || '');
    if (!id.match(/player_uid_/) && doc.querySelectorAll(id).length === 1) {
      return id;
    }
  }
  function getBaseSelector(elm) {
    if (typeof isXHTML === 'undefined') {
      isXHTML = axe.utils.isXHTML(document);
    }
    return escapeSelector(isXHTML ? elm.localName : elm.nodeName.toLowerCase());
  }
  function uncommonAttributes(node, selectorData) {
    var retVal = [];
    var attData = selectorData.attributes;
    var tagData = selectorData.tags;
    if (node.attributes) {
      Array.from(node.attributes).filter(filterAttributes).forEach(function(at) {
        var atnv = getAttributeNameValue(node, at);
        if (atnv && attData[atnv] < tagData[node.nodeName]) {
          retVal.push({
            name: atnv,
            count: attData[atnv],
            species: 'attribute'
          });
        }
      });
    }
    return retVal.sort(countSort);
  }
  function getThreeLeastCommonFeatures(elm, selectorData) {
    var selector = '';
    var features = void 0;
    var clss = uncommonClasses(elm, selectorData);
    var atts = uncommonAttributes(elm, selectorData);
    if (clss.length && clss[0].count === 1) {
      features = [ clss[0] ];
    } else if (atts.length && atts[0].count === 1) {
      features = [ atts[0] ];
      selector = getBaseSelector(elm);
    } else {
      features = clss.concat(atts);
      features.sort(countSort);
      features = features.slice(0, 3);
      if (!features.some(function(feat) {
        return feat.species === 'class';
      })) {
        selector = getBaseSelector(elm);
      } else {
        features.sort(function(a, b) {
          return a.species !== b.species && a.species === 'class' ? -1 : a.species === b.species ? 0 : 1;
        });
      }
    }
    return selector += features.reduce(function(val, feat) {
      switch (feat.species) {
       case 'class':
        return val + '.' + feat.name;

       case 'attribute':
        return val + '[' + feat.name + ']';
      }
      return val;
    }, '');
  }
  function generateSelector(elm, options, doc) {
    if (!axe._selectorData) {
      throw new Error('Expect axe._selectorData to be set up');
    }
    var _options$toRoot = options.toRoot, toRoot = _options$toRoot === undefined ? false : _options$toRoot;
    var selector = void 0;
    var similar = void 0;
    do {
      var features = getElmId(elm);
      if (!features) {
        features = getThreeLeastCommonFeatures(elm, axe._selectorData);
        features += getNthChildString(elm, features);
      }
      if (selector) {
        selector = features + ' > ' + selector;
      } else {
        selector = features;
      }
      if (!similar) {
        similar = Array.from(doc.querySelectorAll(selector));
      } else {
        similar = similar.filter(function(item) {
          return axe.utils.matchesSelector(item, selector);
        });
      }
      elm = elm.parentElement;
    } while ((similar.length > 1 || toRoot) && elm && elm.nodeType !== 11);
    if (similar.length === 1) {
      return selector;
    } else if (selector.indexOf(' > ') !== -1) {
      return ':root' + selector.substring(selector.indexOf(' > '));
    }
    return ':root';
  }
  axe.utils.getSelector = function createUniqueSelector(elm) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!elm) {
      return '';
    }
    var doc = elm.getRootNode && elm.getRootNode() || document;
    if (doc.nodeType === 11) {
      var stack = [];
      while (doc.nodeType === 11) {
        stack.push({
          elm: elm,
          doc: doc
        });
        elm = doc.host;
        doc = elm.getRootNode();
      }
      stack.push({
        elm: elm,
        doc: doc
      });
      return stack.reverse().map(function(comp) {
        return generateSelector(comp.elm, options, comp.doc);
      });
    } else {
      return generateSelector(elm, options, doc);
    }
  };
  'use strict';
  function getXPathArray(node, path) {
    var sibling, count;
    if (!node) {
      return [];
    }
    if (!path && node.nodeType === 9) {
      path = [ {
        str: 'html'
      } ];
      return path;
    }
    path = path || [];
    if (node.parentNode && node.parentNode !== node) {
      path = getXPathArray(node.parentNode, path);
    }
    if (node.previousSibling) {
      count = 1;
      sibling = node.previousSibling;
      do {
        if (sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
          count++;
        }
        sibling = sibling.previousSibling;
      } while (sibling);
      if (count === 1) {
        count = null;
      }
    } else if (node.nextSibling) {
      sibling = node.nextSibling;
      do {
        if (sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
          count = 1;
          sibling = null;
        } else {
          count = null;
          sibling = sibling.previousSibling;
        }
      } while (sibling);
    }
    if (node.nodeType === 1) {
      var element = {};
      element.str = node.nodeName.toLowerCase();
      var id = node.getAttribute && axe.utils.escapeSelector(node.getAttribute('id'));
      if (id && node.ownerDocument.querySelectorAll('#' + id).length === 1) {
        element.id = node.getAttribute('id');
      }
      if (count > 1) {
        element.count = count;
      }
      path.push(element);
    }
    return path;
  }
  function xpathToString(xpathArray) {
    return xpathArray.reduce(function(str, elm) {
      if (elm.id) {
        return '/' + elm.str + '[@id=\'' + elm.id + '\']';
      } else {
        return str + ('/' + elm.str) + (elm.count > 0 ? '[' + elm.count + ']' : '');
      }
    }, '');
  }
  axe.utils.getXpath = function getXpath(node) {
    var xpathArray = getXPathArray(node);
    return xpathToString(xpathArray);
  };
  'use strict';
  var styleSheet;
  function injectStyle(style) {
    'use strict';
    if (styleSheet && styleSheet.parentNode) {
      if (styleSheet.styleSheet === undefined) {
        styleSheet.appendChild(document.createTextNode(style));
      } else {
        styleSheet.styleSheet.cssText += style;
      }
      return styleSheet;
    }
    if (!style) {
      return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    if (styleSheet.styleSheet === undefined) {
      styleSheet.appendChild(document.createTextNode(style));
    } else {
      styleSheet.styleSheet.cssText = style;
    }
    head.appendChild(styleSheet);
    return styleSheet;
  }
  axe.utils.injectStyle = injectStyle;
  'use strict';
  axe.utils.isHidden = function isHidden(el, recursed) {
    'use strict';
    var parent;
    if (el.nodeType === 9) {
      return false;
    }
    if (el.nodeType === 11) {
      el = el.host;
    }
    var style = window.getComputedStyle(el, null);
    if (!style || !el.parentNode || style.getPropertyValue('display') === 'none' || !recursed && style.getPropertyValue('visibility') === 'hidden' || el.getAttribute('aria-hidden') === 'true') {
      return true;
    }
    parent = el.assignedSlot ? el.assignedSlot : el.parentNode;
    return axe.utils.isHidden(parent, true);
  };
  'use strict';
  var possibleShadowRoots = [ 'article', 'aside', 'blockquote', 'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main', 'nav', 'p', 'section', 'span' ];
  axe.utils.isShadowRoot = function isShadowRoot(node) {
    var nodeName = node.nodeName.toLowerCase();
    if (node.shadowRoot) {
      if (/^[a-z][a-z0-9_.-]*-[a-z0-9_.-]*$/.test(nodeName) || possibleShadowRoots.includes(nodeName)) {
        return true;
      }
    }
    return false;
  };
  'use strict';
  axe.utils.isXHTML = function(doc) {
    'use strict';
    if (!doc.createElement) {
      return false;
    }
    return doc.createElement('A').localName === 'A';
  };
  'use strict';
  function pushFrame(resultSet, options, frameElement, frameSelector) {
    'use strict';
    var frameXpath = axe.utils.getXpath(frameElement);
    var frameSpec = {
      element: frameElement,
      selector: frameSelector,
      xpath: frameXpath
    };
    resultSet.forEach(function(res) {
      res.node = axe.utils.DqElement.fromFrame(res.node, options, frameSpec);
      var checks = axe.utils.getAllChecks(res);
      if (checks.length) {
        checks.forEach(function(check) {
          check.relatedNodes = check.relatedNodes.map(function(node) {
            return axe.utils.DqElement.fromFrame(node, options, frameSpec);
          });
        });
      }
    });
  }
  function spliceNodes(target, to) {
    'use strict';
    var firstFromFrame = to[0].node, sorterResult, t;
    for (var i = 0, l = target.length; i < l; i++) {
      t = target[i].node;
      sorterResult = axe.utils.nodeSorter({
        actualNode: t.element
      }, {
        actualNode: firstFromFrame.element
      });
      if (sorterResult > 0 || sorterResult === 0 && firstFromFrame.selector.length < t.selector.length) {
        target.splice.apply(target, [ i, 0 ].concat(to));
        return;
      }
    }
    target.push.apply(target, to);
  }
  function normalizeResult(result) {
    'use strict';
    if (!result || !result.results) {
      return null;
    }
    if (!Array.isArray(result.results)) {
      return [ result.results ];
    }
    if (!result.results.length) {
      return null;
    }
    return result.results;
  }
  axe.utils.mergeResults = function mergeResults(frameResults, options) {
    'use strict';
    var result = [];
    frameResults.forEach(function(frameResult) {
      var results = normalizeResult(frameResult);
      if (!results || !results.length) {
        return;
      }
      results.forEach(function(ruleResult) {
        if (ruleResult.nodes && frameResult.frame) {
          pushFrame(ruleResult.nodes, options, frameResult.frameElement, frameResult.frame);
        }
        var res = axe.utils.findBy(result, 'id', ruleResult.id);
        if (!res) {
          result.push(ruleResult);
        } else {
          if (ruleResult.nodes.length) {
            spliceNodes(res.nodes, ruleResult.nodes);
          }
        }
      });
    });
    return result;
  };
  'use strict';
  axe.utils.nodeSorter = function nodeSorter(a, b) {
    'use strict';
    if (a.actualNode === b.actualNode) {
      return 0;
    }
    if (a.actualNode.compareDocumentPosition(b.actualNode) & 4) {
      return -1;
    }
    return 1;
  };
  'use strict';
  utils.performanceTimer = function() {
    'use strict';
    function now() {
      if (window.performance && window.performance) {
        return window.performance.now();
      }
    }
    var originalTime = null;
    var lastRecordedTime = now();
    return {
      start: function start() {
        this.mark('mark_axe_start');
      },
      end: function end() {
        this.mark('mark_axe_end');
        this.measure('axe', 'mark_axe_start', 'mark_axe_end');
        this.logMeasures('axe');
      },
      auditStart: function auditStart() {
        this.mark('mark_audit_start');
      },
      auditEnd: function auditEnd() {
        this.mark('mark_audit_end');
        this.measure('audit_start_to_end', 'mark_audit_start', 'mark_audit_end');
        this.logMeasures();
      },
      mark: function mark(markName) {
        if (window.performance && window.performance.mark !== undefined) {
          window.performance.mark(markName);
        }
      },
      measure: function measure(measureName, startMark, endMark) {
        if (window.performance && window.performance.measure !== undefined) {
          window.performance.measure(measureName, startMark, endMark);
        }
      },
      logMeasures: function logMeasures(measureName) {
        function log(req) {
          axe.log('Measure ' + req.name + ' took ' + req.duration + 'ms');
        }
        if (window.performance && window.performance.getEntriesByType !== undefined) {
          var measures = window.performance.getEntriesByType('measure');
          for (var i = 0; i < measures.length; ++i) {
            var req = measures[i];
            if (req.name === measureName) {
              log(req);
              return;
            }
            log(req);
          }
        }
      },
      timeElapsed: function timeElapsed() {
        return now() - lastRecordedTime;
      },
      reset: function reset() {
        if (!originalTime) {
          originalTime = now();
        }
        lastRecordedTime = now();
      }
    };
  }();
  'use strict';
  if (typeof Object.assign !== 'function') {
    (function() {
      Object.assign = function(target) {
        'use strict';
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output;
      };
    })();
  }
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      }
    });
  }
  axe.utils.pollyfillElementsFromPoint = function() {
    if (document.elementsFromPoint) {
      return document.elementsFromPoint;
    }
    if (document.msElementsFromPoint) {
      return document.msElementsFromPoint;
    }
    var usePointer = function() {
      var element = document.createElement('x');
      element.style.cssText = 'pointer-events:auto';
      return element.style.pointerEvents === 'auto';
    }();
    var cssProp = usePointer ? 'pointer-events' : 'visibility';
    var cssDisableVal = usePointer ? 'none' : 'hidden';
    var style = document.createElement('style');
    style.innerHTML = usePointer ? '* { pointer-events: all }' : '* { visibility: visible }';
    return function(x, y) {
      var current, i, d;
      var elements = [];
      var previousPointerEvents = [];
      document.head.appendChild(style);
      while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1) {
        elements.push(current);
        previousPointerEvents.push({
          value: current.style.getPropertyValue(cssProp),
          priority: current.style.getPropertyPriority(cssProp)
        });
        current.style.setProperty(cssProp, cssDisableVal, 'important');
      }
      if (elements.indexOf(document.documentElement) < elements.length - 1) {
        elements.splice(elements.indexOf(document.documentElement), 1);
        elements.push(document.documentElement);
      }
      for (i = previousPointerEvents.length; !!(d = previousPointerEvents[--i]); ) {
        elements[i].style.setProperty(cssProp, d.value ? d.value : '', d.priority);
      }
      document.head.removeChild(style);
      return elements;
    };
  };
  if (typeof window.addEventListener === 'function') {
    document.elementsFromPoint = axe.utils.pollyfillElementsFromPoint();
  }
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
          return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
          k = n;
        } else {
          k = len + n;
          if (k < 0) {
            k = 0;
          }
        }
        var currentElement;
        while (k < len) {
          currentElement = O[k];
          if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
            return true;
          }
          k++;
        }
        return false;
      }
    });
  }
  if (!Array.prototype.some) {
    Object.defineProperty(Array.prototype, 'some', {
      value: function value(fun) {
        'use strict';
        if (this == null) {
          throw new TypeError('Array.prototype.some called on null or undefined');
        }
        if (typeof fun !== 'function') {
          throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
          if (i in t && fun.call(thisArg, t[i], i, t)) {
            return true;
          }
        }
        return false;
      }
    });
  }
  if (!Array.from) {
    Object.defineProperty(Array, 'from', {
      value: function() {
        var toStr = Object.prototype.toString;
        var isCallable = function isCallable(fn) {
          return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function toInteger(value) {
          var number = Number(value);
          if (isNaN(number)) {
            return 0;
          }
          if (number === 0 || !isFinite(number)) {
            return number;
          }
          return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function toLength(value) {
          var len = toInteger(value);
          return Math.min(Math.max(len, 0), maxSafeInteger);
        };
        return function from(arrayLike) {
          var C = this;
          var items = Object(arrayLike);
          if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
          }
          var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
          var T;
          if (typeof mapFn !== 'undefined') {
            if (!isCallable(mapFn)) {
              throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            if (arguments.length > 2) {
              T = arguments[2];
            }
          }
          var len = toLength(items.length);
          var A = isCallable(C) ? Object(new C(len)) : new Array(len);
          var k = 0;
          var kValue;
          while (k < len) {
            kValue = items[k];
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
            k += 1;
          }
          A.length = len;
          return A;
        };
      }()
    });
  }
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  function getIncompleteReason(checkData, messages) {
    function getDefaultMsg(messages) {
      if (messages.incomplete && messages.incomplete.default) {
        return messages.incomplete.default;
      } else {
        return helpers.incompleteFallbackMessage();
      }
    }
    if (checkData && checkData.missingData) {
      try {
        var msg = messages.incomplete[checkData.missingData[0].reason];
        if (!msg) {
          throw new Error();
        }
        return msg;
      } catch (e) {
        if (typeof checkData.missingData === 'string') {
          return messages.incomplete[checkData.missingData];
        } else {
          return getDefaultMsg(messages);
        }
      }
    } else {
      return getDefaultMsg(messages);
    }
  }
  function extender(checksData, shouldBeTrue) {
    'use strict';
    return function(check) {
      var sourceData = checksData[check.id] || {};
      var messages = sourceData.messages || {};
      var data = Object.assign({}, sourceData);
      delete data.messages;
      if (check.result === undefined) {
        if (_typeof(messages.incomplete) === 'object') {
          data.message = function() {
            return getIncompleteReason(check.data, messages);
          };
        } else {
          data.message = messages.incomplete;
        }
      } else {
        data.message = check.result === shouldBeTrue ? messages.pass : messages.fail;
      }
      axe.utils.extendMetaData(check, data);
    };
  }
  axe.utils.publishMetaData = function(ruleResult) {
    'use strict';
    var checksData = axe._audit.data.checks || {};
    var rulesData = axe._audit.data.rules || {};
    var rule = axe.utils.findBy(axe._audit.rules, 'id', ruleResult.id) || {};
    ruleResult.tags = axe.utils.clone(rule.tags || []);
    var shouldBeTrue = extender(checksData, true);
    var shouldBeFalse = extender(checksData, false);
    ruleResult.nodes.forEach(function(detail) {
      detail.any.forEach(shouldBeTrue);
      detail.all.forEach(shouldBeTrue);
      detail.none.forEach(shouldBeFalse);
    });
    axe.utils.extendMetaData(ruleResult, axe.utils.clone(rulesData[ruleResult.id] || {}));
  };
  'use strict';
  var convertExpressions = function convertExpressions() {};
  var matchExpressions = function matchExpressions() {};
  function matchesTag(node, exp) {
    return node.nodeType === 1 && (exp.tag === '*' || node.nodeName.toLowerCase() === exp.tag);
  }
  function matchesClasses(node, exp) {
    return !exp.classes || exp.classes.reduce(function(result, cl) {
      return result && node.className && node.className.match(cl.regexp);
    }, true);
  }
  function matchesAttributes(node, exp) {
    return !exp.attributes || exp.attributes.reduce(function(result, att) {
      var nodeAtt = node.getAttribute(att.key);
      return result && nodeAtt !== null && (!att.value || att.test(nodeAtt));
    }, true);
  }
  function matchesId(node, exp) {
    return !exp.id || node.id === exp.id;
  }
  function matchesPseudos(target, exp) {
    if (!exp.pseudos || exp.pseudos.reduce(function(result, pseudo) {
      if (pseudo.name === 'not') {
        return result && !matchExpressions([ target ], pseudo.expressions, false).length;
      }
      throw new Error('the pseudo selector ' + pseudo.name + ' has not yet been implemented');
    }, true)) {
      return true;
    }
    return false;
  }
  var escapeRegExp = function() {
    /*! Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License */
    var from = /(?=[\-\[\]{}()*+?.\\\^$|,#\s])/g;
    var to = '\\';
    return function(string) {
      return string.replace(from, to);
    };
  }();
  var reUnescape = /\\/g;
  function convertAttributes(atts) {
    /*! Credit Mootools Copyright Mootools, MIT License */
    if (!atts) {
      return;
    }
    return atts.map(function(att) {
      var attributeKey = att.name.replace(reUnescape, '');
      var attributeValue = (att.value || '').replace(reUnescape, '');
      var test, regexp;
      switch (att.operator) {
       case '^=':
        regexp = new RegExp('^' + escapeRegExp(attributeValue));
        break;

       case '$=':
        regexp = new RegExp(escapeRegExp(attributeValue) + '$');
        break;

       case '~=':
        regexp = new RegExp('(^|\\s)' + escapeRegExp(attributeValue) + '(\\s|$)');
        break;

       case '|=':
        regexp = new RegExp('^' + escapeRegExp(attributeValue) + '(-|$)');
        break;

       case '=':
        test = function test(value) {
          return attributeValue === value;
        };
        break;

       case '*=':
        test = function test(value) {
          return value && value.includes(attributeValue);
        };
        break;

       case '!=':
        test = function test(value) {
          return attributeValue !== value;
        };
        break;

       default:
        test = function test(value) {
          return !!value;
        };
      }
      if (attributeValue === '' && /^[*$^]=$/.test(att.operator)) {
        test = function test() {
          return false;
        };
      }
      if (!test) {
        test = function test(value) {
          return value && regexp.test(value);
        };
      }
      return {
        key: attributeKey,
        value: attributeValue,
        test: test
      };
    });
  }
  function convertClasses(classes) {
    if (!classes) {
      return;
    }
    return classes.map(function(className) {
      className = className.replace(reUnescape, '');
      return {
        value: className,
        regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
      };
    });
  }
  function convertPseudos(pseudos) {
    if (!pseudos) {
      return;
    }
    return pseudos.map(function(p) {
      var expressions;
      if (p.name === 'not') {
        expressions = axe.utils.cssParser.parse(p.value);
        expressions = expressions.selectors ? expressions.selectors : [ expressions ];
        expressions = convertExpressions(expressions);
      }
      return {
        name: p.name,
        expressions: expressions,
        value: p.value
      };
    });
  }
  convertExpressions = function convertExpressions(expressions) {
    return expressions.map(function(exp) {
      var newExp = [];
      var rule = exp.rule;
      while (rule) {
        newExp.push({
          tag: rule.tagName ? rule.tagName.toLowerCase() : '*',
          combinator: rule.nestingOperator ? rule.nestingOperator : ' ',
          id: rule.id,
          attributes: convertAttributes(rule.attrs),
          classes: convertClasses(rule.classNames),
          pseudos: convertPseudos(rule.pseudos)
        });
        rule = rule.rule;
      }
      return newExp;
    });
  };
  function createLocalVariables(nodes, anyLevel, thisLevel, parentShadowId) {
    var retVal = {
      nodes: nodes.slice(),
      anyLevel: anyLevel,
      thisLevel: thisLevel,
      parentShadowId: parentShadowId
    };
    retVal.nodes.reverse();
    return retVal;
  }
  function matchesSelector(node, exp) {
    return matchesTag(node.actualNode, exp[0]) && matchesClasses(node.actualNode, exp[0]) && matchesAttributes(node.actualNode, exp[0]) && matchesId(node.actualNode, exp[0]) && matchesPseudos(node, exp[0]);
  }
  matchExpressions = function matchExpressions(domTree, expressions, recurse, filter) {
    var stack = [];
    var nodes = Array.isArray(domTree) ? domTree : [ domTree ];
    var currentLevel = createLocalVariables(nodes, expressions, [], domTree[0].shadowId);
    var result = [];
    while (currentLevel.nodes.length) {
      var node = currentLevel.nodes.pop();
      var childOnly = [];
      var childAny = [];
      var combined = currentLevel.anyLevel.slice().concat(currentLevel.thisLevel);
      var added = false;
      for (var i = 0; i < combined.length; i++) {
        var exp = combined[i];
        if (matchesSelector(node, exp) && (!exp[0].id || node.shadowId === currentLevel.parentShadowId)) {
          if (exp.length === 1) {
            if (!added && (!filter || filter(node))) {
              result.push(node);
              added = true;
            }
          } else {
            var rest = exp.slice(1);
            if ([ ' ', '>' ].includes(rest[0].combinator) === false) {
              throw new Error('axe.utils.querySelectorAll does not support the combinator: ' + exp[1].combinator);
            }
            if (rest[0].combinator === '>') {
              childOnly.push(rest);
            } else {
              childAny.push(rest);
            }
          }
        }
        if (currentLevel.anyLevel.includes(exp) && (!exp[0].id || node.shadowId === currentLevel.parentShadowId)) {
          childAny.push(exp);
        }
      }
      if (node.children && node.children.length && recurse) {
        stack.push(currentLevel);
        currentLevel = createLocalVariables(node.children, childAny, childOnly, node.shadowId);
      }
      while (!currentLevel.nodes.length && stack.length) {
        currentLevel = stack.pop();
      }
    }
    return result;
  };
  axe.utils.querySelectorAll = function(domTree, selector) {
    return axe.utils.querySelectorAllFilter(domTree, selector);
  };
  axe.utils.querySelectorAllFilter = function(domTree, selector, filter) {
    domTree = Array.isArray(domTree) ? domTree : [ domTree ];
    var expressions = axe.utils.cssParser.parse(selector);
    expressions = expressions.selectors ? expressions.selectors : [ expressions ];
    expressions = convertExpressions(expressions);
    return matchExpressions(domTree, expressions, true, filter);
  };
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  (function() {
    'use strict';
    function noop() {}
    function funcGuard(f) {
      if (typeof f !== 'function') {
        throw new TypeError('Queue methods require functions as arguments');
      }
    }
    function queue() {
      var tasks = [];
      var started = 0;
      var remaining = 0;
      var completeQueue = noop;
      var complete = false;
      var err;
      var defaultFail = function defaultFail(e) {
        err = e;
        setTimeout(function() {
          if (err !== undefined && err !== null) {
            axe.log('Uncaught error (of queue)', err);
          }
        }, 1);
      };
      var failed = defaultFail;
      function createResolve(i) {
        return function(r) {
          tasks[i] = r;
          remaining -= 1;
          if (!remaining && completeQueue !== noop) {
            complete = true;
            completeQueue(tasks);
          }
        };
      }
      function abort(msg) {
        completeQueue = noop;
        failed(msg);
        return tasks;
      }
      function pop() {
        var length = tasks.length;
        for (;started < length; started++) {
          var task = tasks[started];
          try {
            task.call(null, createResolve(started), abort);
          } catch (e) {
            abort(e);
          }
        }
      }
      var q = {
        defer: function defer(fn) {
          if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object' && fn.then && fn.catch) {
            var defer = fn;
            fn = function fn(resolve, reject) {
              defer.then(resolve).catch(reject);
            };
          }
          funcGuard(fn);
          if (err !== undefined) {
            return;
          } else if (complete) {
            throw new Error('Queue already completed');
          }
          tasks.push(fn);
          ++remaining;
          pop();
          return q;
        },
        then: function then(fn) {
          funcGuard(fn);
          if (completeQueue !== noop) {
            throw new Error('queue `then` already set');
          }
          if (!err) {
            completeQueue = fn;
            if (!remaining) {
              complete = true;
              completeQueue(tasks);
            }
          }
          return q;
        },
        catch: function _catch(fn) {
          funcGuard(fn);
          if (failed !== defaultFail) {
            throw new Error('queue `catch` already set');
          }
          if (!err) {
            failed = fn;
          } else {
            fn(err);
            err = null;
          }
          return q;
        },
        abort: abort
      };
      return q;
    }
    axe.utils.queue = queue;
  })();
  'use strict';
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  (function(exports) {
    'use strict';
    var messages = {}, subscribers = {}, errorTypes = Object.freeze([ 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError' ]);
    function _getSource() {
      var application = 'axeAPI', version = '', src;
      if (typeof axe !== 'undefined' && axe._audit && axe._audit.application) {
        application = axe._audit.application;
      }
      if (typeof axe !== 'undefined') {
        version = axe.version;
      }
      src = application + '.' + version;
      return src;
    }
    function verify(postedMessage) {
      if ((typeof postedMessage === 'undefined' ? 'undefined' : _typeof(postedMessage)) === 'object' && typeof postedMessage.uuid === 'string' && postedMessage._respondable === true) {
        var messageSource = _getSource();
        return postedMessage._source === messageSource || postedMessage._source === 'axeAPI.x.y.z' || messageSource === 'axeAPI.x.y.z';
      }
      return false;
    }
    function post(win, topic, message, uuid, keepalive, callback) {
      var error;
      if (message instanceof Error) {
        error = {
          name: message.name,
          message: message.message,
          stack: message.stack
        };
        message = undefined;
      }
      var data = {
        uuid: uuid,
        topic: topic,
        message: message,
        error: error,
        _respondable: true,
        _source: _getSource(),
        _keepalive: keepalive
      };
      if (typeof callback === 'function') {
        messages[uuid] = callback;
      }
      win.postMessage(JSON.stringify(data), '*');
    }
    function respondable(win, topic, message, keepalive, callback) {
      var id = uuid.v1();
      post(win, topic, message, id, keepalive, callback);
    }
    respondable.subscribe = function(topic, callback) {
      subscribers[topic] = callback;
    };
    respondable.isInFrame = function(win) {
      win = win || window;
      return !!win.frameElement;
    };
    function createResponder(source, topic, uuid) {
      return function(message, keepalive, callback) {
        post(source, topic, message, uuid, keepalive, callback);
      };
    }
    function publish(source, data, keepalive) {
      var topic = data.topic;
      var subscriber = subscribers[topic];
      if (subscriber) {
        var responder = createResponder(source, null, data.uuid);
        subscriber(data.message, keepalive, responder);
      }
    }
    function buildErrorObject(error) {
      var msg = error.message || 'Unknown error occurred';
      var errorName = errorTypes.includes(error.name) ? error.name : 'Error';
      var ErrConstructor = window[errorName] || Error;
      if (error.stack) {
        msg += '\n' + error.stack.replace(error.message, '');
      }
      return new ErrConstructor(msg);
    }
    function parseMessage(dataString) {
      var data;
      if (typeof dataString !== 'string') {
        return;
      }
      try {
        data = JSON.parse(dataString);
      } catch (ex) {}
      if (!verify(data)) {
        return;
      }
      if (_typeof(data.error) === 'object') {
        data.error = buildErrorObject(data.error);
      } else {
        data.error = undefined;
      }
      return data;
    }
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('message', function(e) {
        var data = parseMessage(e.data);
        if (!data) {
          return;
        }
        var uuid = data.uuid;
        var keepalive = data._keepalive;
        var callback = messages[uuid];
        if (callback) {
          var result = data.error || data.message;
          var responder = createResponder(e.source, data.topic, uuid);
          callback(result, keepalive, responder);
          if (!keepalive) {
            delete messages[uuid];
          }
        }
        if (!data.error) {
          try {
            publish(e.source, data, keepalive);
          } catch (err) {
            post(e.source, data.topic, err, uuid, false);
          }
        }
      }, false);
    }
    exports.respondable = respondable;
  })(utils);
  'use strict';
  function matchTags(rule, runOnly) {
    'use strict';
    var include, exclude, matching;
    var defaultExclude = axe._audit && axe._audit.tagExclude ? axe._audit.tagExclude : [];
    if (runOnly.hasOwnProperty('include') || runOnly.hasOwnProperty('exclude')) {
      include = runOnly.include || [];
      include = Array.isArray(include) ? include : [ include ];
      exclude = runOnly.exclude || [];
      exclude = Array.isArray(exclude) ? exclude : [ exclude ];
      exclude = exclude.concat(defaultExclude.filter(function(tag) {
        return include.indexOf(tag) === -1;
      }));
    } else {
      include = Array.isArray(runOnly) ? runOnly : [ runOnly ];
      exclude = defaultExclude.filter(function(tag) {
        return include.indexOf(tag) === -1;
      });
    }
    matching = include.some(function(tag) {
      return rule.tags.indexOf(tag) !== -1;
    });
    if (matching || include.length === 0 && rule.enabled !== false) {
      return exclude.every(function(tag) {
        return rule.tags.indexOf(tag) === -1;
      });
    } else {
      return false;
    }
  }
  axe.utils.ruleShouldRun = function(rule, context, options) {
    'use strict';
    var runOnly = options.runOnly || {};
    var ruleOptions = (options.rules || {})[rule.id];
    if (rule.pageLevel && !context.page) {
      return false;
    } else if (runOnly.type === 'rule') {
      return runOnly.values.indexOf(rule.id) !== -1;
    } else if (ruleOptions && typeof ruleOptions.enabled === 'boolean') {
      return ruleOptions.enabled;
    } else if (runOnly.type === 'tag' && runOnly.values) {
      return matchTags(rule, runOnly.values);
    } else {
      return matchTags(rule, []);
    }
  };
  'use strict';
  function getScroll(elm) {
    var style = window.getComputedStyle(elm);
    var visibleOverflowY = style.getPropertyValue('overflow-y') === 'visible';
    var visibleOverflowX = style.getPropertyValue('overflow-x') === 'visible';
    if (!visibleOverflowY && elm.scrollHeight > elm.clientHeight || !visibleOverflowX && elm.scrollWidth > elm.clientWidth) {
      return {
        elm: elm,
        top: elm.scrollTop,
        left: elm.scrollLeft
      };
    }
  }
  function setScroll(elm, top, left) {
    if (elm === window) {
      return elm.scroll(top, left);
    } else {
      elm.scrollTop = top;
      elm.scrollLeft = left;
    }
  }
  function getElmScrollRecursive(root) {
    return Array.from(root.children).reduce(function(scrolls, elm) {
      var scroll = getScroll(elm);
      if (scroll) {
        scrolls.push(scroll);
      }
      return scrolls.concat(getElmScrollRecursive(elm));
    }, []);
  }
  axe.utils.getScrollState = function getScrollState() {
    var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
    var root = win.document.documentElement;
    var windowScroll = [ win.pageXOffset !== undefined ? {
      elm: win,
      top: win.pageYOffset,
      left: win.pageXOffset
    } : {
      elm: root,
      top: root.scrollTop,
      left: root.scrollLeft
    } ];
    return windowScroll.concat(getElmScrollRecursive(document.body));
  };
  axe.utils.setScrollState = function setScrollState(scrollState) {
    scrollState.forEach(function(_ref) {
      var elm = _ref.elm, top = _ref.top, left = _ref.left;
      return setScroll(elm, top, left);
    });
  };
  'use strict';
  function getDeepest(collection) {
    'use strict';
    return collection.sort(function(a, b) {
      if (axe.utils.contains(a, b)) {
        return 1;
      }
      return -1;
    })[0];
  }
  function isNodeInContext(node, context) {
    'use strict';
    var include = context.include && getDeepest(context.include.filter(function(candidate) {
      return axe.utils.contains(candidate, node);
    }));
    var exclude = context.exclude && getDeepest(context.exclude.filter(function(candidate) {
      return axe.utils.contains(candidate, node);
    }));
    if (!exclude && include || exclude && axe.utils.contains(exclude, include)) {
      return true;
    }
    return false;
  }
  function pushNode(result, nodes) {
    'use strict';
    var temp;
    if (result.length === 0) {
      return nodes;
    }
    if (result.length < nodes.length) {
      temp = result;
      result = nodes;
      nodes = temp;
    }
    for (var i = 0, l = nodes.length; i < l; i++) {
      if (!result.includes(nodes[i])) {
        result.push(nodes[i]);
      }
    }
    return result;
  }
  function reduceIncludes(includes) {
    return includes.reduce(function(res, el) {
      if (!res.length || !res[res.length - 1].actualNode.contains(el.actualNode)) {
        res.push(el);
      }
      return res;
    }, []);
  }
  axe.utils.select = function select(selector, context) {
    'use strict';
    var result = [], candidate;
    if (axe._selectCache) {
      for (var j = 0, l = axe._selectCache.length; j < l; j++) {
        var item = axe._selectCache[j];
        if (item.selector === selector) {
          return item.result;
        }
      }
    }
    var curried = function(context) {
      return function(node) {
        return isNodeInContext(node, context);
      };
    }(context);
    var reducedIncludes = reduceIncludes(context.include);
    for (var i = 0; i < reducedIncludes.length; i++) {
      candidate = reducedIncludes[i];
      if (candidate.actualNode.nodeType === candidate.actualNode.ELEMENT_NODE && axe.utils.matchesSelector(candidate.actualNode, selector) && curried(candidate)) {
        result = pushNode(result, [ candidate ]);
      }
      result = pushNode(result, axe.utils.querySelectorAllFilter(candidate, selector, curried));
    }
    if (axe._selectCache) {
      axe._selectCache.push({
        selector: selector,
        result: result
      });
    }
    return result;
  };
  'use strict';
  axe.utils.toArray = function(thing) {
    'use strict';
    return Array.prototype.slice.call(thing);
  };
  axe.utils.uniqueArray = function(arr1, arr2) {
    return arr1.concat(arr2).filter(function(elem, pos, arr) {
      return arr.indexOf(elem) === pos;
    });
  };
  'use strict';
  var uuid;
  (function(_global) {
    var _rng;
    var _crypto = _global.crypto || _global.msCrypto;
    if (!_rng && _crypto && _crypto.getRandomValues) {
      var _rnds8 = new Uint8Array(16);
      _rng = function whatwgRNG() {
        _crypto.getRandomValues(_rnds8);
        return _rnds8;
      };
    }
    if (!_rng) {
      var _rnds = new Array(16);
      _rng = function _rng() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 3) === 0) {
            r = Math.random() * 4294967296;
          }
          _rnds[i] = r >>> ((i & 3) << 3) & 255;
        }
        return _rnds;
      };
    }
    var BufferClass = typeof _global.Buffer == 'function' ? _global.Buffer : Array;
    var _byteToHex = [];
    var _hexToByte = {};
    for (var i = 0; i < 256; i++) {
      _byteToHex[i] = (i + 256).toString(16).substr(1);
      _hexToByte[_byteToHex[i]] = i;
    }
    function parse(s, buf, offset) {
      var i = buf && offset || 0, ii = 0;
      buf = buf || [];
      s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
        if (ii < 16) {
          buf[i + ii++] = _hexToByte[oct];
        }
      });
      while (ii < 16) {
        buf[i + ii++] = 0;
      }
      return buf;
    }
    function unparse(buf, offset) {
      var i = offset || 0, bth = _byteToHex;
      return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
    }
    var _seedBytes = _rng();
    var _nodeId = [ _seedBytes[0] | 1, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5] ];
    var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 16383;
    var _lastMSecs = 0, _lastNSecs = 0;
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
      options = options || {};
      var clockseq = options.clockseq != null ? options.clockseq : _clockseq;
      var msecs = options.msecs != null ? options.msecs : new Date().getTime();
      var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;
      var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq == null) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      var tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      var node = options.node || _nodeId;
      for (var n = 0; n < 6; n++) {
        b[i + n] = node[n];
      }
      return buf ? buf : unparse(b);
    }
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == 'string') {
        buf = options == 'binary' ? new BufferClass(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || _rng)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ii++) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || unparse(rnds);
    }
    uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    uuid.parse = parse;
    uuid.unparse = unparse;
    uuid.BufferClass = BufferClass;
  })(window);
  'use strict';
  axe._load({
    data: {
      rules: {
        accesskeys: {
          description: 'Ensures every accesskey attribute value is unique',
          help: 'accesskey attribute value must be unique'
        },
        'area-alt': {
          description: 'Ensures <area> elements of image maps have alternate text',
          help: 'Active <area> elements must have alternate text'
        },
        'aria-allowed-attr': {
          description: 'Ensures ARIA attributes are allowed for an element\'s role',
          help: 'Elements must only use allowed ARIA attributes'
        },
        'aria-dpub-role-fallback': {
          description: 'Ensures unsupported DPUB roles are only used on elements with implicit fallback roles',
          help: 'Unsupported DPUB ARIA roles should be used on elements with implicit fallback roles'
        },
        'aria-hidden-body': {
          description: 'Ensures aria-hidden=\'true\' is not present on the document body.',
          help: 'aria-hidden=\'true\' must not be present on the document body'
        },
        'aria-required-attr': {
          description: 'Ensures elements with ARIA roles have all required ARIA attributes',
          help: 'Required ARIA attributes must be provided'
        },
        'aria-required-children': {
          description: 'Ensures elements with an ARIA role that require child roles contain them',
          help: 'Certain ARIA roles must contain particular children'
        },
        'aria-required-parent': {
          description: 'Ensures elements with an ARIA role that require parent roles are contained by them',
          help: 'Certain ARIA roles must be contained by particular parents'
        },
        'aria-roles': {
          description: 'Ensures all elements with a role attribute use a valid value',
          help: 'ARIA roles used must conform to valid values'
        },
        'aria-valid-attr-value': {
          description: 'Ensures all ARIA attributes have valid values',
          help: 'ARIA attributes must conform to valid values'
        },
        'aria-valid-attr': {
          description: 'Ensures attributes that begin with aria- are valid ARIA attributes',
          help: 'ARIA attributes must conform to valid names'
        },
        'audio-caption': {
          description: 'Ensures <audio> elements have captions',
          help: '<audio> elements must have a captions track'
        },
        blink: {
          description: 'Ensures <blink> elements are not used',
          help: '<blink> elements are deprecated and must not be used'
        },
        'button-name': {
          description: 'Ensures buttons have discernible text',
          help: 'Buttons must have discernible text'
        },
        bypass: {
          description: 'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content',
          help: 'Page must have means to bypass repeated blocks'
        },
        checkboxgroup: {
          description: 'Ensures related <input type="checkbox"> elements have a group and that the group designation is consistent',
          help: 'Checkbox inputs with the same name attribute value must be part of a group'
        },
        'color-contrast': {
          description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
          help: 'Elements must have sufficient color contrast'
        },
        'definition-list': {
          description: 'Ensures <dl> elements are structured correctly',
          help: '<dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script> or <template> elements'
        },
        dlitem: {
          description: 'Ensures <dt> and <dd> elements are contained by a <dl>',
          help: '<dt> and <dd> elements must be contained by a <dl>'
        },
        'document-title': {
          description: 'Ensures each HTML document contains a non-empty <title> element',
          help: 'Documents must have <title> element to aid in navigation'
        },
        'duplicate-id': {
          description: 'Ensures every id attribute value is unique',
          help: 'id attribute value must be unique'
        },
        'empty-heading': {
          description: 'Ensures headings have discernible text',
          help: 'Headings must not be empty'
        },
        'focus-order-semantics': {
          description: 'Ensures elements in the focus order have an appropriate role',
          help: 'Elements in the focus order need a role appropriate for interactive content'
        },
        'frame-tested': {
          description: 'Ensures <iframe> and <frame> elements contain the axe-core script',
          help: 'Frames must be tested with axe-core'
        },
        'frame-title-unique': {
          description: 'Ensures <iframe> and <frame> elements contain a unique title attribute',
          help: 'Frames must have a unique title attribute'
        },
        'frame-title': {
          description: 'Ensures <iframe> and <frame> elements contain a non-empty title attribute',
          help: 'Frames must have title attribute'
        },
        'heading-order': {
          description: 'Ensures the order of headings is semantically correct',
          help: 'Heading levels should only increase by one'
        },
        'hidden-content': {
          description: 'Informs users about hidden content.',
          help: 'Hidden content on the page cannot be analyzed'
        },
        'html-has-lang': {
          description: 'Ensures every HTML document has a lang attribute',
          help: '<html> element must have a lang attribute'
        },
        'html-lang-valid': {
          description: 'Ensures the lang attribute of the <html> element has a valid value',
          help: '<html> element must have a valid value for the lang attribute'
        },
        'image-alt': {
          description: 'Ensures <img> elements have alternate text or a role of none or presentation',
          help: 'Images must have alternate text'
        },
        'image-redundant-alt': {
          description: 'Ensure button and link text is not repeated as image alternative',
          help: 'Text of buttons and links should not be repeated in the image alternative'
        },
        'input-image-alt': {
          description: 'Ensures <input type="image"> elements have alternate text',
          help: 'Image buttons must have alternate text'
        },
        'label-title-only': {
          description: 'Ensures that every form element is not solely labeled using the title or aria-describedby attributes',
          help: 'Form elements should have a visible label'
        },
        label: {
          description: 'Ensures every form element has a label',
          help: 'Form elements must have labels'
        },
        'landmark-banner-is-top-level': {
          description: 'The banner landmark should not be contained in another landmark',
          help: 'Banner landmark must be at top level'
        },
        'landmark-contentinfo-is-top-level': {
          description: 'The contentinfo landmark should not be contained in another landmark',
          help: 'Contentinfo landmark must be at top level'
        },
        'landmark-main-is-top-level': {
          description: 'The main landmark should not be contained in another landmark',
          help: 'Main landmark is not at top level'
        },
        'landmark-no-duplicate-banner': {
          description: 'Ensures the document has no more than one banner landmark',
          help: 'Document contain at most one banner landmark'
        },
        'landmark-no-duplicate-contentinfo': {
          description: 'Ensures the document has no more than one contentinfo landmark',
          help: 'Document contain at most one contentinfo landmark'
        },
        'landmark-one-main': {
          description: 'Ensures a navigation point to the primary content of the page. If the page contains iframes, each iframe should contain either no main landmarks or just one',
          help: 'Page must contain one main landmark'
        },
        'layout-table': {
          description: 'Ensures presentational <table> elements do not use <th>, <caption> elements or the summary attribute',
          help: 'Layout tables must not use data table elements'
        },
        'link-in-text-block': {
          description: 'Links can be distinguished without relying on color',
          help: 'Links must be distinguished from surrounding text in a way that does not rely on color'
        },
        'link-name': {
          description: 'Ensures links have discernible text',
          help: 'Links must have discernible text'
        },
        list: {
          description: 'Ensures that lists are structured correctly',
          help: '<ul> and <ol> must only directly contain <li>, <script> or <template> elements'
        },
        listitem: {
          description: 'Ensures <li> elements are used semantically',
          help: '<li> elements must be contained in a <ul> or <ol>'
        },
        marquee: {
          description: 'Ensures <marquee> elements are not used',
          help: '<marquee> elements are deprecated and must not be used'
        },
        'meta-refresh': {
          description: 'Ensures <meta http-equiv="refresh"> is not used',
          help: 'Timed refresh must not exist'
        },
        'meta-viewport-large': {
          description: 'Ensures <meta name="viewport"> can scale a significant amount',
          help: 'Users should be able to zoom and scale the text up to 500%'
        },
        'meta-viewport': {
          description: 'Ensures <meta name="viewport"> does not disable text scaling and zooming',
          help: 'Zooming and scaling must not be disabled'
        },
        'object-alt': {
          description: 'Ensures <object> elements have alternate text',
          help: '<object> elements must have alternate text'
        },
        'p-as-heading': {
          description: 'Ensure p elements are not used to style headings',
          help: 'Bold, italic text and font-size are not used to style p elements as a heading'
        },
        'page-has-heading-one': {
          description: 'Ensure that the page, or at least one of its frames contains a level-one heading',
          help: 'Page must contain a level-one heading'
        },
        radiogroup: {
          description: 'Ensures related <input type="radio"> elements have a group and that the group designation is consistent',
          help: 'Radio inputs with the same name attribute value must be part of a group'
        },
        region: {
          description: 'Ensures all content is contained within a landmark region',
          help: 'Content should be contained in a landmark region'
        },
        'scope-attr-valid': {
          description: 'Ensures the scope attribute is used correctly on tables',
          help: 'scope attribute should be used correctly'
        },
        'server-side-image-map': {
          description: 'Ensures that server-side image maps are not used',
          help: 'Server-side image maps must not be used'
        },
        'skip-link': {
          description: 'Ensure all skip links have a focusable target',
          help: 'The skip-link target should exist and be focusable'
        },
        tabindex: {
          description: 'Ensures tabindex attribute values are not greater than 0',
          help: 'Elements should not have tabindex greater than zero'
        },
        'table-duplicate-name': {
          description: 'Ensure that tables do not have the same summary and caption',
          help: 'The <caption> element should not contain the same text as the summary attribute'
        },
        'table-fake-caption': {
          description: 'Ensure that tables with a caption use the <caption> element.',
          help: 'Data or header cells should not be used to give caption to a data table.'
        },
        'td-has-header': {
          description: 'Ensure that each non-empty data cell in a large table has one or more table headers',
          help: 'All non-empty td element in table larger than 3 by 3 must have an associated table header'
        },
        'td-headers-attr': {
          description: 'Ensure that each cell in a table using the headers refers to another cell in that table',
          help: 'All cells in a table element that use the headers attribute must only refer to other cells of that same table'
        },
        'th-has-data-cells': {
          description: 'Ensure that each table header in a data table refers to data cells',
          help: 'All th elements and elements with role=columnheader/rowheader must have data cells they describe'
        },
        'valid-lang': {
          description: 'Ensures lang attributes have valid values',
          help: 'lang attribute must have a valid value'
        },
        'video-caption': {
          description: 'Ensures <video> elements have captions',
          help: '<video> elements must have captions'
        },
        'video-description': {
          description: 'Ensures <video> elements have audio descriptions',
          help: '<video> elements must have an audio description track'
        }
      },
      checks: {
        accesskeys: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Accesskey attribute value is unique';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document has multiple elements with the same accesskey';
              return out;
            }
          }
        },
        'non-empty-alt': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has a non-empty alt attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has no alt attribute or the alt attribute is empty';
              return out;
            }
          }
        },
        'non-empty-title': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has a title attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has no title attribute or the title attribute is empty';
              return out;
            }
          }
        },
        'aria-label': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'aria-label attribute exists and is not empty';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'aria-label attribute does not exist or is empty';
              return out;
            }
          }
        },
        'aria-labelledby': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'aria-labelledby attribute exists and references elements that are visible to screen readers';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible';
              return out;
            }
          }
        },
        'aria-allowed-attr': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'ARIA attributes are used correctly for the defined role';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'ARIA attribute' + (it.data && it.data.length > 1 ? 's are' : ' is') + ' not allowed:';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        'implicit-role-fallback': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element’s implicit ARIA role is an appropriate fallback';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element’s implicit ARIA role is not a good fallback for the (unsupported) role';
              return out;
            }
          }
        },
        'aria-hidden-body': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'No aria-hidden attribute is present on document body';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'aria-hidden=true should not be present on the document body';
              return out;
            }
          }
        },
        'aria-required-attr': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'All required ARIA attributes are present';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Required ARIA attribute' + (it.data && it.data.length > 1 ? 's' : '') + ' not present:';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        'aria-required-children': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Required ARIA children are present';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Required ARIA ' + (it.data && it.data.length > 1 ? 'children' : 'child') + ' role not present:';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        'aria-required-parent': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Required ARIA parent role present';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Required ARIA parent' + (it.data && it.data.length > 1 ? 's' : '') + ' role not present:';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        invalidrole: {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'ARIA role is valid';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Role must be one of the valid ARIA roles';
              return out;
            }
          }
        },
        abstractrole: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Abstract roles are not used';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Abstract roles cannot be directly used';
              return out;
            }
          }
        },
        'aria-valid-attr-value': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'ARIA attribute values are valid';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Invalid ARIA attribute value' + (it.data && it.data.length > 1 ? 's' : '') + ':';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        'aria-errormessage': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Uses a supported aria-errormessage technique';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'aria-errormessage value' + (it.data && it.data.length > 1 ? 's' : '') + ' ';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' `' + value;
                }
              }
              out += '` must use a technique to announce the message (e.g., aria-live, aria-describedby, role=alert, etc.)';
              return out;
            }
          }
        },
        'aria-valid-attr': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'ARIA attribute name' + (it.data && it.data.length > 1 ? 's' : '') + ' are valid';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Invalid ARIA attribute name' + (it.data && it.data.length > 1 ? 's' : '') + ':';
              var arr1 = it.data;
              if (arr1) {
                var value, i1 = -1, l1 = arr1.length - 1;
                while (i1 < l1) {
                  value = arr1[i1 += 1];
                  out += ' ' + value;
                }
              }
              return out;
            }
          }
        },
        caption: {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'The multimedia element has a captions track';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The multimedia element does not have a captions track';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'A captions track for this element could not be found';
              return out;
            }
          }
        },
        'is-on-screen': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element is not visible';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element is visible';
              return out;
            }
          }
        },
        'non-empty-if-present': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element ';
              if (it.data) {
                out += 'has a non-empty value attribute';
              } else {
                out += 'does not have a value attribute';
              }
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has a value attribute and the value attribute is empty';
              return out;
            }
          }
        },
        'non-empty-value': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has a non-empty value attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has no value attribute or the value attribute is empty';
              return out;
            }
          }
        },
        'button-has-visible-text': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has inner text that is visible to screen readers';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element does not have inner text that is visible to screen readers';
              return out;
            }
          }
        },
        'role-presentation': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element\'s default semantics were overriden with role="presentation"';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element\'s default semantics were not overridden with role="presentation"';
              return out;
            }
          }
        },
        'role-none': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element\'s default semantics were overriden with role="none"';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element\'s default semantics were not overridden with role="none"';
              return out;
            }
          }
        },
        'focusable-no-name': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element is not in tab order or has accessible text';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element is in tab order and does not have accessible text';
              return out;
            }
          }
        },
        'internal-link-present': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Valid skip link found';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'No valid skip link found';
              return out;
            }
          }
        },
        'header-present': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Page has a header';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Page does not have a header';
              return out;
            }
          }
        },
        landmark: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Page has a landmark region';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Page does not have a landmark region';
              return out;
            }
          }
        },
        'group-labelledby': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'All elements with the name "' + it.data.name + '" reference the same element with aria-labelledby';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'All elements with the name "' + it.data.name + '" do not reference the same element with aria-labelledby';
              return out;
            }
          }
        },
        fieldset: {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element is contained in a fieldset';
              return out;
            },
            fail: function anonymous(it) {
              var out = '';
              var code = it.data && it.data.failureCode;
              if (code === 'no-legend') {
                out += 'Fieldset does not have a legend as its first child';
              } else if (code === 'empty-legend') {
                out += 'Legend does not have text that is visible to screen readers';
              } else if (code === 'mixed-inputs') {
                out += 'Fieldset contains unrelated inputs';
              } else if (code === 'no-group-label') {
                out += 'ARIA group does not have aria-label or aria-labelledby';
              } else if (code === 'group-mixed-inputs') {
                out += 'ARIA group contains unrelated inputs';
              } else {
                out += 'Element does not have a containing fieldset or ARIA group';
              }
              return out;
            }
          }
        },
        'color-contrast': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has sufficient color contrast of ' + it.data.contrastRatio;
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has insufficient color contrast of ' + it.data.contrastRatio + ' (foreground color: ' + it.data.fgColor + ', background color: ' + it.data.bgColor + ', font size: ' + it.data.fontSize + ', font weight: ' + it.data.fontWeight + '). Expected contrast ratio of ' + it.data.expectedContrastRatio;
              return out;
            },
            incomplete: {
              bgImage: 'Element\'s background color could not be determined due to a background image',
              bgGradient: 'Element\'s background color could not be determined due to a background gradient',
              imgNode: 'Element\'s background color could not be determined because element contains an image node',
              bgOverlap: 'Element\'s background color could not be determined because it is overlapped by another element',
              fgAlpha: 'Element\'s foreground color could not be determined because of alpha transparency',
              elmPartiallyObscured: 'Element\'s background color could not be determined because it\'s partially obscured by another element',
              elmPartiallyObscuring: 'Element\'s background color could not be determined because it partially overlaps other elements',
              outsideViewport: 'Element\'s background color could not be determined because it\'s outside the viewport',
              equalRatio: 'Element has a 1:1 contrast ratio with the background',
              default: 'Unable to determine contrast ratio'
            }
          }
        },
        'structured-dlitems': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'When not empty, element has both <dt> and <dd> elements';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'When not empty, element does not have at least one <dt> element followed by at least one <dd> element';
              return out;
            }
          }
        },
        'only-dlitems': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'List element only has direct children that are allowed inside <dt> or <dd> elements';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'List element has direct children that are not allowed inside <dt> or <dd> elements';
              return out;
            }
          }
        },
        dlitem: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Description list item has a <dl> parent element';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Description list item does not have a <dl> parent element';
              return out;
            }
          }
        },
        'doc-has-title': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Document has a non-empty <title> element';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document does not have a non-empty <title> element';
              return out;
            }
          }
        },
        'duplicate-id': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Document has no elements that share the same id attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document has multiple elements with the same id attribute: ' + it.data;
              return out;
            }
          }
        },
        'has-visible-text': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has text that is visible to screen readers';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element does not have text that is visible to screen readers';
              return out;
            }
          }
        },
        'has-widget-role': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has a widget role.';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element does not have a widget role.';
              return out;
            }
          }
        },
        'valid-scrollable-semantics': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has valid semantics for an element in the focus order.';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has invalid semantics for an element in the focus order.';
              return out;
            }
          }
        },
        'frame-tested': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'The iframe was tested with axe-core';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The iframe could not be tested with axe-core';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'The iframe still has to be tested with axe-core';
              return out;
            }
          }
        },
        'unique-frame-title': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element\'s title attribute is unique';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element\'s title attribute is not unique';
              return out;
            }
          }
        },
        'heading-order': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Heading order valid';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Heading order invalid';
              return out;
            }
          }
        },
        'hidden-content': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'All content on the page has been analyzed.';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'There were problems analyzing the content on this page.';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'There is hidden content on the page that was not analyzed. You will need to trigger the display of this content in order to analyze it.';
              return out;
            }
          }
        },
        'has-lang': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'The <html> element has a lang attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The <html> element does not have a lang attribute';
              return out;
            }
          }
        },
        'valid-lang': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Value of lang attribute is included in the list of valid languages';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Value of lang attribute not included in the list of valid languages';
              return out;
            }
          }
        },
        'has-alt': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element has an alt attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element does not have an alt attribute';
              return out;
            }
          }
        },
        'duplicate-img-label': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element does not duplicate existing text in <img> alt text';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element contains <img> element with alt text that duplicates existing text';
              return out;
            }
          }
        },
        'title-only': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Form element does not solely use title attribute for its label';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Only title used to generate label for form element';
              return out;
            }
          }
        },
        'implicit-label': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Form element has an implicit (wrapped) <label>';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Form element does not have an implicit (wrapped) <label>';
              return out;
            }
          }
        },
        'explicit-label': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Form element has an explicit <label>';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Form element does not have an explicit <label>';
              return out;
            }
          }
        },
        'help-same-as-label': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Help text (title or aria-describedby) does not duplicate label text';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Help text (title or aria-describedby) text is the same as the label text';
              return out;
            }
          }
        },
        'multiple-label': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Form element does not have multiple <label> elements';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Form element has multiple <label> elements';
              return out;
            }
          }
        },
        'landmark-is-top-level': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'The ' + it.data.role + ' landmark is at the top level.';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The ' + it.data.role + ' landmark is contained in another landmark.';
              return out;
            }
          }
        },
        'page-no-duplicate-banner': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Document has no more than one banner landmark';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document has more than one banner landmark';
              return out;
            }
          }
        },
        'page-no-duplicate-contentinfo': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Document has no more than one contentinfo landmark';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document has more than one contentinfo landmark';
              return out;
            }
          }
        },
        'page-has-main': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Page has at least one main landmark';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Page must have a main landmark';
              return out;
            }
          }
        },
        'page-no-duplicate-main': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Document has no more than one main landmark';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Document has more than one main landmark';
              return out;
            }
          }
        },
        'has-th': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Layout table does not use <th> elements';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Layout table uses <th> elements';
              return out;
            }
          }
        },
        'has-caption': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Layout table does not use <caption> element';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Layout table uses <caption> element';
              return out;
            }
          }
        },
        'has-summary': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Layout table does not use summary attribute';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Layout table uses summary attribute';
              return out;
            }
          }
        },
        'link-in-text-block': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Links can be distinguished from surrounding text in some way other than by color';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Links need to be distinguished from surrounding text in some way other than by color';
              return out;
            },
            incomplete: {
              bgContrast: 'Element\'s contrast ratio could not be determined. Check for a distinct hover/focus style',
              bgImage: 'Element\'s contrast ratio could not be determined due to a background image',
              bgGradient: 'Element\'s contrast ratio could not be determined due to a background gradient',
              imgNode: 'Element\'s contrast ratio could not be determined because element contains an image node',
              bgOverlap: 'Element\'s contrast ratio could not be determined because of element overlap',
              default: 'Unable to determine contrast ratio'
            }
          }
        },
        'only-listitems': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'List element only has direct children that are allowed inside <li> elements';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'List element has direct children that are not allowed inside <li> elements';
              return out;
            }
          }
        },
        listitem: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'List item has a <ul>, <ol> or role="list" parent element';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'List item does not have a <ul>, <ol> or role="list" parent element';
              return out;
            }
          }
        },
        'meta-refresh': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = '<meta> tag does not immediately refresh the page';
              return out;
            },
            fail: function anonymous(it) {
              var out = '<meta> tag forces timed refresh of page';
              return out;
            }
          }
        },
        'meta-viewport-large': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = '<meta> tag does not prevent significant zooming on mobile devices';
              return out;
            },
            fail: function anonymous(it) {
              var out = '<meta> tag limits zooming on mobile devices';
              return out;
            }
          }
        },
        'meta-viewport': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = '<meta> tag does not disable zooming on mobile devices';
              return out;
            },
            fail: function anonymous(it) {
              var out = '<meta> tag disables zooming on mobile devices';
              return out;
            }
          }
        },
        'p-as-heading': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = '<p> elements are not styled as headings';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Heading elements should be used instead of styled p elements';
              return out;
            }
          }
        },
        'page-has-heading-one': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Page has at least one level-one heading';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Page must have a level-one heading';
              return out;
            }
          }
        },
        region: {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Content contained by ARIA landmark';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Content not contained by an ARIA landmark';
              return out;
            }
          }
        },
        'html5-scope': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Scope attribute is only used on table header elements (<th>)';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'In HTML 5, scope attributes may only be used on table header elements (<th>)';
              return out;
            }
          }
        },
        'scope-value': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'Scope attribute is used correctly';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The value of the scope attribute may only be \'row\' or \'col\'';
              return out;
            }
          }
        },
        exists: {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element does not exist';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element exists';
              return out;
            }
          }
        },
        'skip-link': {
          impact: 'moderate',
          messages: {
            pass: function anonymous(it) {
              var out = 'Skip link target exists';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'Skip link target should become visible on activation';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'No skip link target';
              return out;
            }
          }
        },
        tabindex: {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'Element does not have a tabindex greater than 0';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Element has a tabindex greater than 0';
              return out;
            }
          }
        },
        'same-caption-summary': {
          impact: 'minor',
          messages: {
            pass: function anonymous(it) {
              var out = 'Content of summary attribute and <caption> are not duplicated';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Content of summary attribute and <caption> element are identical';
              return out;
            }
          }
        },
        'caption-faked': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'The first row of a table is not used as a caption';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The first row of the table should be a caption instead of a table cell';
              return out;
            }
          }
        },
        'td-has-header': {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'All non-empty data cells have table headers';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Some non-empty data cells do not have table headers';
              return out;
            }
          }
        },
        'td-headers-attr': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'The headers attribute is exclusively used to refer to other cells in the table';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The headers attribute is not exclusively used to refer to other cells in the table';
              return out;
            }
          }
        },
        'th-has-data-cells': {
          impact: 'serious',
          messages: {
            pass: function anonymous(it) {
              var out = 'All table header cells refer to data cells';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'Not all table header cells refer to data cells';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'Table data cells are missing or empty';
              return out;
            }
          }
        },
        description: {
          impact: 'critical',
          messages: {
            pass: function anonymous(it) {
              var out = 'The multimedia element has an audio description track';
              return out;
            },
            fail: function anonymous(it) {
              var out = 'The multimedia element does not have an audio description track';
              return out;
            },
            incomplete: function anonymous(it) {
              var out = 'An audio description track for this element could not be found';
              return out;
            }
          }
        }
      },
      failureSummaries: {
        any: {
          failureMessage: function anonymous(it) {
            var out = 'Fix any of the following:';
            var arr1 = it;
            if (arr1) {
              var value, i1 = -1, l1 = arr1.length - 1;
              while (i1 < l1) {
                value = arr1[i1 += 1];
                out += '\n  ' + value.split('\n').join('\n  ');
              }
            }
            return out;
          }
        },
        none: {
          failureMessage: function anonymous(it) {
            var out = 'Fix all of the following:';
            var arr1 = it;
            if (arr1) {
              var value, i1 = -1, l1 = arr1.length - 1;
              while (i1 < l1) {
                value = arr1[i1 += 1];
                out += '\n  ' + value.split('\n').join('\n  ');
              }
            }
            return out;
          }
        }
      },
      incompleteFallbackMessage: function anonymous(it) {
        var out = 'aXe couldn\'t tell the reason. Time to break out the element inspector!';
        return out;
      }
    },
    rules: [ {
      id: 'accesskeys',
      selector: '[accesskey]',
      excludeHidden: false,
      tags: [ 'wcag2a', 'wcag211', 'cat.keyboard' ],
      all: [],
      any: [],
      none: [ 'accesskeys' ]
    }, {
      id: 'area-alt',
      selector: 'map area[href]',
      excludeHidden: false,
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag111', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'non-empty-alt', 'non-empty-title', 'aria-label', 'aria-labelledby' ],
      none: []
    }, {
      id: 'aria-allowed-attr',
      matches: function matches(node, virtualNode) {
        var role = node.getAttribute('role');
        if (!role) {
          role = axe.commons.aria.implicitRole(node);
        }
        var allowed = axe.commons.aria.allowedAttr(role);
        if (role && allowed) {
          var aria = /^aria-/;
          if (node.hasAttributes()) {
            var attrs = node.attributes;
            for (var i = 0, l = attrs.length; i < l; i++) {
              if (aria.test(attrs[i].name)) {
                return true;
              }
            }
          }
        }
        return false;
      },
      tags: [ 'cat.aria', 'wcag2a', 'wcag411', 'wcag412' ],
      all: [],
      any: [ 'aria-allowed-attr' ],
      none: []
    }, {
      id: 'aria-dpub-role-fallback',
      selector: '[role]',
      matches: function matches(node, virtualNode) {
        var role = node.getAttribute('role');
        return [ 'doc-backlink', 'doc-biblioentry', 'doc-biblioref', 'doc-cover', 'doc-endnote', 'doc-glossref', 'doc-noteref' ].includes(role);
      },
      tags: [ 'cat.aria', 'wcag2a', 'wcag131' ],
      all: [ 'implicit-role-fallback' ],
      any: [],
      none: []
    }, {
      id: 'aria-hidden-body',
      selector: 'body',
      excludeHidden: false,
      tags: [ 'cat.aria', 'wcag2a', 'wcag412' ],
      all: [],
      any: [ 'aria-hidden-body' ],
      none: []
    }, {
      id: 'aria-required-attr',
      selector: '[role]',
      tags: [ 'cat.aria', 'wcag2a', 'wcag411', 'wcag412' ],
      all: [],
      any: [ 'aria-required-attr' ],
      none: []
    }, {
      id: 'aria-required-children',
      selector: '[role]',
      tags: [ 'cat.aria', 'wcag2a', 'wcag131' ],
      all: [],
      any: [ 'aria-required-children' ],
      none: []
    }, {
      id: 'aria-required-parent',
      selector: '[role]',
      tags: [ 'cat.aria', 'wcag2a', 'wcag131' ],
      all: [],
      any: [ 'aria-required-parent' ],
      none: []
    }, {
      id: 'aria-roles',
      selector: '[role]',
      tags: [ 'cat.aria', 'wcag2a', 'wcag131', 'wcag411', 'wcag412' ],
      all: [],
      any: [],
      none: [ 'invalidrole', 'abstractrole' ]
    }, {
      id: 'aria-valid-attr-value',
      matches: function matches(node, virtualNode) {
        var aria = /^aria-/;
        if (node.hasAttributes()) {
          var attrs = node.attributes;
          for (var i = 0, l = attrs.length; i < l; i++) {
            if (aria.test(attrs[i].name)) {
              return true;
            }
          }
        }
        return false;
      },
      tags: [ 'cat.aria', 'wcag2a', 'wcag131', 'wcag411', 'wcag412' ],
      all: [ {
        options: [],
        id: 'aria-valid-attr-value'
      }, 'aria-errormessage' ],
      any: [],
      none: []
    }, {
      id: 'aria-valid-attr',
      matches: function matches(node, virtualNode) {
        var aria = /^aria-/;
        if (node.hasAttributes()) {
          var attrs = node.attributes;
          for (var i = 0, l = attrs.length; i < l; i++) {
            if (aria.test(attrs[i].name)) {
              return true;
            }
          }
        }
        return false;
      },
      tags: [ 'cat.aria', 'wcag2a', 'wcag411' ],
      all: [],
      any: [ {
        options: [],
        id: 'aria-valid-attr'
      } ],
      none: []
    }, {
      id: 'audio-caption',
      selector: 'audio',
      excludeHidden: false,
      tags: [ 'cat.time-and-media', 'wcag2a', 'wcag121', 'section508', 'section508.22.a' ],
      all: [],
      any: [],
      none: [ 'caption' ]
    }, {
      id: 'blink',
      selector: 'blink',
      excludeHidden: false,
      tags: [ 'cat.time-and-media', 'wcag2a', 'wcag222', 'section508', 'section508.22.j' ],
      all: [],
      any: [],
      none: [ 'is-on-screen' ]
    }, {
      id: 'button-name',
      selector: 'button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]',
      tags: [ 'cat.name-role-value', 'wcag2a', 'wcag412', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'non-empty-if-present', 'non-empty-value', 'button-has-visible-text', 'aria-label', 'aria-labelledby', 'role-presentation', 'role-none', 'non-empty-title' ],
      none: [ 'focusable-no-name' ]
    }, {
      id: 'bypass',
      selector: 'html',
      pageLevel: true,
      matches: function matches(node, virtualNode) {
        return !!node.querySelector('a[href]');
      },
      tags: [ 'cat.keyboard', 'wcag2a', 'wcag241', 'section508', 'section508.22.o' ],
      all: [],
      any: [ 'internal-link-present', 'header-present', 'landmark' ],
      none: []
    }, {
      id: 'checkboxgroup',
      selector: 'input[type=checkbox][name]',
      tags: [ 'cat.forms', 'best-practice' ],
      all: [],
      any: [ 'group-labelledby', 'fieldset' ],
      none: []
    }, {
      id: 'color-contrast',
      matches: function matches(node, virtualNode) {
        var nodeName = node.nodeName.toUpperCase(), nodeType = node.type;
        if (node.getAttribute('aria-disabled') === 'true' || axe.commons.dom.findUpVirtual(virtualNode, '[aria-disabled="true"]')) {
          return false;
        }
        if (nodeName === 'INPUT') {
          return [ 'hidden', 'range', 'color', 'checkbox', 'radio', 'image' ].indexOf(nodeType) === -1 && !node.disabled;
        }
        if (nodeName === 'SELECT') {
          return !!node.options.length && !node.disabled;
        }
        if (nodeName === 'TEXTAREA') {
          return !node.disabled;
        }
        if (nodeName === 'OPTION') {
          return false;
        }
        if (nodeName === 'BUTTON' && node.disabled || axe.commons.dom.findUpVirtual(virtualNode, 'button[disabled]')) {
          return false;
        }
        if (nodeName === 'FIELDSET' && node.disabled || axe.commons.dom.findUpVirtual(virtualNode, 'fieldset[disabled]')) {
          return false;
        }
        var nodeParentLabel = axe.commons.dom.findUpVirtual(virtualNode, 'label');
        if (nodeName === 'LABEL' || nodeParentLabel) {
          var relevantNode = node;
          var relevantVirtualNode = virtualNode;
          if (nodeParentLabel) {
            relevantNode = nodeParentLabel;
            relevantVirtualNode = axe.utils.getNodeFromTree(axe._tree[0], nodeParentLabel);
          }
          var doc = axe.commons.dom.getRootNode(relevantNode);
          var candidate = relevantNode.htmlFor && doc.getElementById(relevantNode.htmlFor);
          if (candidate && candidate.disabled) {
            return false;
          }
          var candidate = axe.utils.querySelectorAll(relevantVirtualNode, 'input:not([type="hidden"]):not([type="image"])' + ':not([type="button"]):not([type="submit"]):not([type="reset"]), select, textarea');
          if (candidate.length && candidate[0].actualNode.disabled) {
            return false;
          }
        }
        if (node.getAttribute('id')) {
          var id = axe.commons.utils.escapeSelector(node.getAttribute('id'));
          var _doc = axe.commons.dom.getRootNode(node);
          var candidate = _doc.querySelector('[aria-labelledby~=' + id + ']');
          if (candidate && candidate.disabled) {
            return false;
          }
        }
        if (axe.commons.text.visibleVirtual(virtualNode, false, true) === '') {
          return false;
        }
        var range = document.createRange(), childNodes = virtualNode.children, length = childNodes.length, child, index;
        for (index = 0; index < length; index++) {
          child = childNodes[index];
          if (child.actualNode.nodeType === 3 && axe.commons.text.sanitize(child.actualNode.nodeValue) !== '') {
            range.selectNodeContents(child.actualNode);
          }
        }
        var rects = range.getClientRects();
        length = rects.length;
        for (index = 0; index < length; index++) {
          if (axe.commons.dom.visuallyOverlaps(rects[index], node)) {
            return true;
          }
        }
        return false;
      },
      excludeHidden: false,
      options: {
        noScroll: false
      },
      tags: [ 'cat.color', 'wcag2aa', 'wcag143' ],
      all: [],
      any: [ 'color-contrast' ],
      none: []
    }, {
      id: 'definition-list',
      selector: 'dl',
      matches: function matches(node, virtualNode) {
        return !node.getAttribute('role');
      },
      tags: [ 'cat.structure', 'wcag2a', 'wcag131' ],
      all: [],
      any: [],
      none: [ 'structured-dlitems', 'only-dlitems' ]
    }, {
      id: 'dlitem',
      selector: 'dd, dt',
      matches: function matches(node, virtualNode) {
        return !node.getAttribute('role');
      },
      tags: [ 'cat.structure', 'wcag2a', 'wcag131' ],
      all: [],
      any: [ 'dlitem' ],
      none: []
    }, {
      id: 'document-title',
      selector: 'html',
      matches: function matches(node, virtualNode) {
        return node.ownerDocument.defaultView.self === node.ownerDocument.defaultView.top;
      },
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag242' ],
      all: [],
      any: [ 'doc-has-title' ],
      none: []
    }, {
      id: 'duplicate-id',
      selector: '[id]',
      excludeHidden: false,
      tags: [ 'cat.parsing', 'wcag2a', 'wcag411' ],
      all: [],
      any: [ 'duplicate-id' ],
      none: []
    }, {
      id: 'empty-heading',
      selector: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
      matches: function matches(node, virtualNode) {
        var explicitRoles = void 0;
        if (node.hasAttribute('role')) {
          explicitRoles = node.getAttribute('role').split(/\s+/i).filter(axe.commons.aria.isValidRole);
        }
        if (explicitRoles && explicitRoles.length > 0) {
          return explicitRoles.includes('heading');
        } else {
          return axe.commons.aria.implicitRole(node) === 'heading';
        }
      },
      tags: [ 'cat.name-role-value', 'best-practice' ],
      all: [],
      any: [ 'has-visible-text' ],
      none: []
    }, {
      id: 'focus-order-semantics',
      selector: 'div, h1, h2, h3, h4, h5, h6, [role=heading], p, span',
      matches: function matches(node, virtualNode) {
        return axe.commons.dom.insertedIntoFocusOrder(node);
      },
      tags: [ 'cat.keyboard', 'best-practice', 'experimental' ],
      all: [],
      any: [ {
        options: [],
        id: 'has-widget-role'
      }, {
        options: [],
        id: 'valid-scrollable-semantics'
      } ],
      none: []
    }, {
      id: 'frame-tested',
      selector: 'frame, iframe',
      tags: [ 'cat.structure', 'review-item' ],
      all: [ {
        options: {
          isViolation: false
        },
        id: 'frame-tested'
      } ],
      any: [],
      none: []
    }, {
      id: 'frame-title-unique',
      selector: 'frame[title], iframe[title]',
      matches: function matches(node, virtualNode) {
        var title = node.getAttribute('title');
        return !!(title ? axe.commons.text.sanitize(title).trim() : '');
      },
      tags: [ 'cat.text-alternatives', 'best-practice' ],
      all: [],
      any: [],
      none: [ 'unique-frame-title' ]
    }, {
      id: 'frame-title',
      selector: 'frame, iframe',
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag241', 'section508', 'section508.22.i' ],
      all: [],
      any: [ 'aria-label', 'aria-labelledby', 'non-empty-title', 'role-presentation', 'role-none' ],
      none: []
    }, {
      id: 'heading-order',
      selector: 'h1, h2, h3, h4, h5, h6, [role=heading]',
      matches: function matches(node, virtualNode) {
        var explicitRoles = void 0;
        if (node.hasAttribute('role')) {
          explicitRoles = node.getAttribute('role').split(/\s+/i).filter(axe.commons.aria.isValidRole);
        }
        if (explicitRoles && explicitRoles.length > 0) {
          return explicitRoles.includes('heading');
        } else {
          return axe.commons.aria.implicitRole(node) === 'heading';
        }
      },
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ 'heading-order' ],
      none: []
    }, {
      id: 'hidden-content',
      selector: '*',
      excludeHidden: false,
      tags: [ 'cat.structure', 'experimental', 'review-item' ],
      all: [],
      any: [ 'hidden-content' ],
      none: []
    }, {
      id: 'html-has-lang',
      selector: 'html',
      tags: [ 'cat.language', 'wcag2a', 'wcag311' ],
      all: [],
      any: [ 'has-lang' ],
      none: []
    }, {
      id: 'html-lang-valid',
      selector: 'html[lang]',
      tags: [ 'cat.language', 'wcag2a', 'wcag311' ],
      all: [],
      any: [],
      none: [ 'valid-lang' ]
    }, {
      id: 'image-alt',
      selector: 'img, [role=\'img\']:not(svg)',
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag111', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'role-presentation', 'role-none' ],
      none: []
    }, {
      id: 'image-redundant-alt',
      selector: 'button, [role="button"], a[href], p, li, td, th',
      tags: [ 'cat.text-alternatives', 'best-practice' ],
      all: [],
      any: [],
      none: [ 'duplicate-img-label' ]
    }, {
      id: 'input-image-alt',
      selector: 'input[type="image"]',
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag111', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'non-empty-alt', 'aria-label', 'aria-labelledby', 'non-empty-title' ],
      none: []
    }, {
      id: 'label-title-only',
      selector: 'input, select, textarea',
      matches: function matches(node, virtualNode) {
        if (node.nodeName.toLowerCase() !== 'input' || node.hasAttribute('type') === false) {
          return true;
        }
        var type = node.getAttribute('type').toLowerCase();
        return [ 'hidden', 'image', 'button', 'submit', 'reset' ].includes(type) === false;
      },
      tags: [ 'cat.forms', 'best-practice' ],
      all: [],
      any: [],
      none: [ 'title-only' ]
    }, {
      id: 'label',
      selector: 'input, select, textarea',
      matches: function matches(node, virtualNode) {
        if (node.nodeName.toLowerCase() !== 'input' || node.hasAttribute('type') === false) {
          return true;
        }
        var type = node.getAttribute('type').toLowerCase();
        return [ 'hidden', 'image', 'button', 'submit', 'reset' ].includes(type) === false;
      },
      tags: [ 'cat.forms', 'wcag2a', 'wcag332', 'wcag131', 'section508', 'section508.22.n' ],
      all: [],
      any: [ 'aria-label', 'aria-labelledby', 'implicit-label', 'explicit-label', 'non-empty-title' ],
      none: [ 'help-same-as-label', 'multiple-label' ]
    }, {
      id: 'landmark-banner-is-top-level',
      selector: 'header:not([role]), [role=banner]',
      matches: function matches(node, virtualNode) {
        var nativeScopeFilter = 'article, aside, main, nav, section';
        return node.hasAttribute('role') || !axe.commons.dom.findUpVirtual(virtualNode, nativeScopeFilter);
      },
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ 'landmark-is-top-level' ],
      none: []
    }, {
      id: 'landmark-contentinfo-is-top-level',
      selector: 'footer:not([role]), [role=contentinfo]',
      matches: function matches(node, virtualNode) {
        var nativeScopeFilter = 'article, aside, main, nav, section';
        return node.hasAttribute('role') || !axe.commons.dom.findUpVirtual(virtualNode, nativeScopeFilter);
      },
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ 'landmark-is-top-level' ],
      none: []
    }, {
      id: 'landmark-main-is-top-level',
      selector: 'main:not([role]), [role=main]',
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ 'landmark-is-top-level' ],
      none: []
    }, {
      id: 'landmark-no-duplicate-banner',
      selector: 'html',
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ {
        options: {
          selector: 'header:not([role]), [role=banner]',
          nativeScopeFilter: 'article, aside, main, nav, section'
        },
        id: 'page-no-duplicate-banner'
      } ],
      none: []
    }, {
      id: 'landmark-no-duplicate-contentinfo',
      selector: 'html',
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [],
      any: [ {
        options: {
          selector: 'footer:not([role]), [role=contentinfo]',
          nativeScopeFilter: 'article, aside, main, nav, section'
        },
        id: 'page-no-duplicate-contentinfo'
      } ],
      none: []
    }, {
      id: 'landmark-one-main',
      selector: 'html',
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [ {
        options: {
          selector: 'main:not([role]), [role=\'main\']'
        },
        id: 'page-has-main'
      }, {
        options: {
          selector: 'main:not([role]), [role=\'main\']'
        },
        id: 'page-no-duplicate-main'
      } ],
      any: [],
      none: []
    }, {
      id: 'layout-table',
      selector: 'table',
      matches: function matches(node, virtualNode) {
        var role = (node.getAttribute('role') || '').toLowerCase();
        return !((role === 'presentation' || role === 'none') && !axe.commons.dom.isFocusable(node)) && !axe.commons.table.isDataTable(node);
      },
      tags: [ 'cat.semantics', 'wcag2a', 'wcag131' ],
      all: [],
      any: [],
      none: [ 'has-th', 'has-caption', 'has-summary' ]
    }, {
      id: 'link-in-text-block',
      selector: 'a[href], [role=link]',
      matches: function matches(node, virtualNode) {
        var text = axe.commons.text.sanitize(node.textContent);
        var role = node.getAttribute('role');
        if (role && role !== 'link') {
          return false;
        }
        if (!text) {
          return false;
        }
        if (!axe.commons.dom.isVisible(node, false)) {
          return false;
        }
        return axe.commons.dom.isInTextBlock(node);
      },
      excludeHidden: false,
      tags: [ 'cat.color', 'experimental', 'wcag2a', 'wcag141' ],
      all: [ 'link-in-text-block' ],
      any: [],
      none: []
    }, {
      id: 'link-name',
      selector: 'a[href], [role=link][href]',
      matches: function matches(node, virtualNode) {
        return node.getAttribute('role') !== 'button';
      },
      tags: [ 'cat.name-role-value', 'wcag2a', 'wcag111', 'wcag412', 'wcag244', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'has-visible-text', 'aria-label', 'aria-labelledby', 'role-presentation', 'role-none' ],
      none: [ 'focusable-no-name' ]
    }, {
      id: 'list',
      selector: 'ul, ol',
      matches: function matches(node, virtualNode) {
        return !node.getAttribute('role');
      },
      tags: [ 'cat.structure', 'wcag2a', 'wcag131' ],
      all: [],
      any: [],
      none: [ 'only-listitems' ]
    }, {
      id: 'listitem',
      selector: 'li',
      matches: function matches(node, virtualNode) {
        return !node.getAttribute('role');
      },
      tags: [ 'cat.structure', 'wcag2a', 'wcag131' ],
      all: [],
      any: [ 'listitem' ],
      none: []
    }, {
      id: 'marquee',
      selector: 'marquee',
      excludeHidden: false,
      tags: [ 'cat.parsing', 'wcag2a', 'wcag222' ],
      all: [],
      any: [],
      none: [ 'is-on-screen' ]
    }, {
      id: 'meta-refresh',
      selector: 'meta[http-equiv="refresh"]',
      excludeHidden: false,
      tags: [ 'cat.time', 'wcag2a', 'wcag2aaa', 'wcag221', 'wcag224', 'wcag325' ],
      all: [],
      any: [ 'meta-refresh' ],
      none: []
    }, {
      id: 'meta-viewport-large',
      selector: 'meta[name="viewport"]',
      excludeHidden: false,
      tags: [ 'cat.sensory-and-visual-cues', 'best-practice' ],
      all: [],
      any: [ {
        options: {
          scaleMinimum: 5,
          lowerBound: 2
        },
        id: 'meta-viewport-large'
      } ],
      none: []
    }, {
      id: 'meta-viewport',
      selector: 'meta[name="viewport"]',
      excludeHidden: false,
      tags: [ 'cat.sensory-and-visual-cues', 'wcag2aa', 'wcag144' ],
      all: [],
      any: [ {
        options: {
          scaleMinimum: 2
        },
        id: 'meta-viewport'
      } ],
      none: []
    }, {
      id: 'object-alt',
      selector: 'object',
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag111', 'section508', 'section508.22.a' ],
      all: [],
      any: [ 'has-visible-text', 'aria-label', 'aria-labelledby', 'non-empty-title' ],
      none: []
    }, {
      id: 'p-as-heading',
      selector: 'p',
      matches: function matches(node, virtualNode) {
        var children = Array.from(node.parentNode.childNodes);
        var nodeText = node.textContent.trim();
        var isSentence = /[.!?:;](?![.!?:;])/g;
        if (nodeText.length === 0 || (nodeText.match(isSentence) || []).length >= 2) {
          return false;
        }
        var siblingsAfter = children.slice(children.indexOf(node) + 1).filter(function(elm) {
          return elm.nodeName.toUpperCase() === 'P' && elm.textContent.trim() !== '';
        });
        return siblingsAfter.length !== 0;
      },
      tags: [ 'cat.semantics', 'wcag2a', 'wcag131', 'experimental' ],
      all: [ {
        options: {
          margins: [ {
            weight: 150,
            italic: true
          }, {
            weight: 150,
            size: 1.15
          }, {
            italic: true,
            size: 1.15
          }, {
            size: 1.4
          } ]
        },
        id: 'p-as-heading'
      } ],
      any: [],
      none: []
    }, {
      id: 'page-has-heading-one',
      selector: 'html',
      tags: [ 'cat.semantics', 'best-practice' ],
      all: [ {
        options: {
          selector: 'h1:not([role]), [role="heading"][aria-level="1"]'
        },
        id: 'page-has-heading-one'
      } ],
      any: [],
      none: []
    }, {
      id: 'radiogroup',
      selector: 'input[type=radio][name]',
      tags: [ 'cat.forms', 'best-practice' ],
      all: [],
      any: [ 'group-labelledby', 'fieldset' ],
      none: []
    }, {
      id: 'region',
      selector: 'html',
      pageLevel: true,
      tags: [ 'cat.keyboard', 'best-practice' ],
      all: [],
      any: [ 'region' ],
      none: []
    }, {
      id: 'scope-attr-valid',
      selector: 'td[scope], th[scope]',
      tags: [ 'cat.tables', 'best-practice' ],
      all: [ 'html5-scope', 'scope-value' ],
      any: [],
      none: []
    }, {
      id: 'server-side-image-map',
      selector: 'img[ismap]',
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag211', 'section508', 'section508.22.f' ],
      all: [],
      any: [],
      none: [ 'exists' ]
    }, {
      id: 'skip-link',
      selector: 'a[href]',
      matches: function matches(node, virtualNode) {
        return /^#[^\/!]/.test(node.getAttribute('href'));
      },
      tags: [ 'cat.keyboard', 'best-practice' ],
      all: [],
      any: [ 'skip-link' ],
      none: []
    }, {
      id: 'tabindex',
      selector: '[tabindex]',
      tags: [ 'cat.keyboard', 'best-practice' ],
      all: [],
      any: [ 'tabindex' ],
      none: []
    }, {
      id: 'table-duplicate-name',
      selector: 'table',
      tags: [ 'cat.tables', 'best-practice' ],
      all: [],
      any: [],
      none: [ 'same-caption-summary' ]
    }, {
      id: 'table-fake-caption',
      selector: 'table',
      matches: function matches(node, virtualNode) {
        return axe.commons.table.isDataTable(node);
      },
      tags: [ 'cat.tables', 'experimental', 'wcag2a', 'wcag131', 'section508', 'section508.22.g' ],
      all: [ 'caption-faked' ],
      any: [],
      none: []
    }, {
      id: 'td-has-header',
      selector: 'table',
      matches: function matches(node, virtualNode) {
        if (axe.commons.table.isDataTable(node)) {
          var tableArray = axe.commons.table.toArray(node);
          return tableArray.length >= 3 && tableArray[0].length >= 3 && tableArray[1].length >= 3 && tableArray[2].length >= 3;
        }
        return false;
      },
      tags: [ 'cat.tables', 'experimental', 'wcag2a', 'wcag131', 'section508', 'section508.22.g' ],
      all: [ 'td-has-header' ],
      any: [],
      none: []
    }, {
      id: 'td-headers-attr',
      selector: 'table',
      tags: [ 'cat.tables', 'wcag2a', 'wcag131', 'section508', 'section508.22.g' ],
      all: [ 'td-headers-attr' ],
      any: [],
      none: []
    }, {
      id: 'th-has-data-cells',
      selector: 'table',
      matches: function matches(node, virtualNode) {
        return axe.commons.table.isDataTable(node);
      },
      tags: [ 'cat.tables', 'wcag2a', 'wcag131', 'section508', 'section508.22.g' ],
      all: [ 'th-has-data-cells' ],
      any: [],
      none: []
    }, {
      id: 'valid-lang',
      selector: '[lang], [xml\\:lang]',
      matches: function matches(node, virtualNode) {
        return node.nodeName.toLowerCase() !== 'html';
      },
      tags: [ 'cat.language', 'wcag2aa', 'wcag312' ],
      all: [],
      any: [],
      none: [ 'valid-lang' ]
    }, {
      id: 'video-caption',
      selector: 'video',
      excludeHidden: false,
      tags: [ 'cat.text-alternatives', 'wcag2a', 'wcag122', 'section508', 'section508.22.a' ],
      all: [],
      any: [],
      none: [ 'caption' ]
    }, {
      id: 'video-description',
      selector: 'video',
      excludeHidden: false,
      tags: [ 'cat.text-alternatives', 'wcag2aa', 'wcag125', 'section508', 'section508.22.b' ],
      all: [],
      any: [],
      none: [ 'description' ]
    } ],
    checks: [ {
      id: 'abstractrole',
      evaluate: function evaluate(node, options, virtualNode) {
        return axe.commons.aria.getRoleType(node.getAttribute('role')) === 'abstract';
      }
    }, {
      id: 'aria-allowed-attr',
      evaluate: function evaluate(node, options, virtualNode) {
        options = options || {};
        var invalid = [];
        var attr, attrName, allowed, role = node.getAttribute('role'), attrs = node.attributes;
        if (!role) {
          role = axe.commons.aria.implicitRole(node);
        }
        allowed = axe.commons.aria.allowedAttr(role);
        if (Array.isArray(options[role])) {
          allowed = axe.utils.uniqueArray(options[role].concat(allowed));
        }
        if (role && allowed) {
          for (var i = 0, l = attrs.length; i < l; i++) {
            attr = attrs[i];
            attrName = attr.name;
            if (axe.commons.aria.validateAttr(attrName) && !allowed.includes(attrName)) {
              invalid.push(attrName + '="' + attr.nodeValue + '"');
            }
          }
        }
        if (invalid.length) {
          this.data(invalid);
          return false;
        }
        return true;
      }
    }, {
      id: 'aria-hidden-body',
      evaluate: function evaluate(node, options, virtualNode) {
        return node.getAttribute('aria-hidden') !== 'true';
      }
    }, {
      id: 'aria-errormessage',
      evaluate: function evaluate(node, options, virtualNode) {
        options = Array.isArray(options) ? options : [];
        var attr = node.getAttribute('aria-errormessage'), hasAttr = node.hasAttribute('aria-errormessage');
        var doc = axe.commons.dom.getRootNode(node);
        function validateAttrValue() {
          var idref = attr && doc.getElementById(attr);
          if (idref) {
            return idref.getAttribute('role') === 'alert' || idref.getAttribute('aria-live') === 'assertive' || axe.utils.tokenList(node.getAttribute('aria-describedby') || '').indexOf(attr) > -1;
          }
        }
        if (options.indexOf(attr) === -1 && hasAttr) {
          if (!validateAttrValue()) {
            this.data(attr);
            return false;
          }
        }
        return true;
      }
    }, {
      id: 'has-widget-role',
      evaluate: function evaluate(node, options, virtualNode) {
        var role = node.getAttribute('role');
        if (role === null) {
          return false;
        }
        var roleType = axe.commons.aria.getRoleType(role);
        return roleType === 'widget' || roleType === 'composite';
      },
      options: []
    }, {
      id: 'implicit-role-fallback',
      evaluate: function evaluate(node, options, virtualNode) {
        var role = node.getAttribute('role');
        if (role === null || !axe.commons.aria.isValidRole(role)) {
          return true;
        }
        var roleType = axe.commons.aria.getRoleType(role);
        return axe.commons.aria.implicitRole(node) === roleType;
      }
    }, {
      id: 'invalidrole',
      evaluate: function evaluate(node, options, virtualNode) {
        return !axe.commons.aria.isValidRole(node.getAttribute('role'));
      }
    }, {
      id: 'aria-required-attr',
      evaluate: function evaluate(node, options, virtualNode) {
        options = options || {};
        var missing = [];
        if (node.hasAttributes()) {
          var attr, role = node.getAttribute('role'), required = axe.commons.aria.requiredAttr(role);
          if (Array.isArray(options[role])) {
            required = axe.utils.uniqueArray(options[role], required);
          }
          if (role && required) {
            for (var i = 0, l = required.length; i < l; i++) {
              attr = required[i];
              if (!node.getAttribute(attr)) {
                missing.push(attr);
              }
            }
          }
        }
        if (missing.length) {
          this.data(missing);
          return false;
        }
        return true;
      }
    }, {
      id: 'aria-required-children',
      evaluate: function evaluate(node, options, virtualNode) {
        var requiredOwned = axe.commons.aria.requiredOwned, implicitNodes = axe.commons.aria.implicitNodes, matchesSelector = axe.commons.utils.matchesSelector, idrefs = axe.commons.dom.idrefs;
        function owns(node, virtualTree, role, ariaOwned) {
          if (node === null) {
            return false;
          }
          var implicit = implicitNodes(role), selector = [ '[role="' + role + '"]' ];
          if (implicit) {
            selector = selector.concat(implicit);
          }
          selector = selector.join(',');
          return ariaOwned ? matchesSelector(node, selector) || !!axe.utils.querySelectorAll(virtualTree, selector)[0] : !!axe.utils.querySelectorAll(virtualTree, selector)[0];
        }
        function ariaOwns(nodes, role) {
          var index, length;
          for (index = 0, length = nodes.length; index < length; index++) {
            if (nodes[index] === null) {
              continue;
            }
            var virtualTree = axe.utils.getNodeFromTree(axe._tree[0], nodes[index]);
            if (owns(nodes[index], virtualTree, role, true)) {
              return true;
            }
          }
          return false;
        }
        function missingRequiredChildren(node, childRoles, all, role) {
          var i, l = childRoles.length, missing = [], ownedElements = idrefs(node, 'aria-owns');
          for (i = 0; i < l; i++) {
            var r = childRoles[i];
            if (owns(node, virtualNode, r) || ariaOwns(ownedElements, r)) {
              if (!all) {
                return null;
              }
            } else {
              if (all) {
                missing.push(r);
              }
            }
          }
          if (role === 'combobox') {
            var textboxIndex = missing.indexOf('textbox');
            var textTypeInputs = [ 'text', 'search', 'email', 'url', 'tel' ];
            if (textboxIndex >= 0 && node.tagName === 'INPUT' && textTypeInputs.includes(node.type)) {
              missing.splice(textboxIndex, 1);
            }
            var listboxIndex = missing.indexOf('listbox');
            var expanded = node.getAttribute('aria-expanded');
            if (listboxIndex >= 0 && (!expanded || expanded === 'false')) {
              missing.splice(listboxIndex, 1);
            }
          }
          if (missing.length) {
            return missing;
          }
          if (!all && childRoles.length) {
            return childRoles;
          }
          return null;
        }
        var role = node.getAttribute('role');
        var required = requiredOwned(role);
        if (!required) {
          return true;
        }
        var all = false;
        var childRoles = required.one;
        if (!childRoles) {
          var all = true;
          childRoles = required.all;
        }
        var missing = missingRequiredChildren(node, childRoles, all, role);
        if (!missing) {
          return true;
        }
        this.data(missing);
        return false;
      }
    }, {
      id: 'aria-required-parent',
      evaluate: function evaluate(node, options, virtualNode) {
        function getSelector(role) {
          var impliedNative = axe.commons.aria.implicitNodes(role) || [];
          return impliedNative.concat('[role="' + role + '"]').join(',');
        }
        function getMissingContext(virtualNode, requiredContext, includeElement) {
          var index, length, role = virtualNode.actualNode.getAttribute('role'), missing = [];
          if (!requiredContext) {
            requiredContext = axe.commons.aria.requiredContext(role);
          }
          if (!requiredContext) {
            return null;
          }
          for (index = 0, length = requiredContext.length; index < length; index++) {
            if (includeElement && axe.utils.matchesSelector(virtualNode.actualNode, getSelector(requiredContext[index]))) {
              return null;
            }
            if (axe.commons.dom.findUpVirtual(virtualNode, getSelector(requiredContext[index]))) {
              return null;
            } else {
              missing.push(requiredContext[index]);
            }
          }
          return missing;
        }
        function getAriaOwners(element) {
          var owners = [], o = null;
          while (element) {
            if (element.getAttribute('id')) {
              var id = axe.commons.utils.escapeSelector(element.getAttribute('id'));
              var doc = axe.commons.dom.getRootNode(element);
              o = doc.querySelector('[aria-owns~=' + id + ']');
              if (o) {
                owners.push(o);
              }
            }
            element = element.parentElement;
          }
          return owners.length ? owners : null;
        }
        var missingParents = getMissingContext(virtualNode);
        if (!missingParents) {
          return true;
        }
        var owners = getAriaOwners(node);
        if (owners) {
          for (var i = 0, l = owners.length; i < l; i++) {
            missingParents = getMissingContext(axe.utils.getNodeFromTree(axe._tree[0], owners[i]), missingParents, true);
            if (!missingParents) {
              return true;
            }
          }
        }
        this.data(missingParents);
        return false;
      }
    }, {
      id: 'aria-valid-attr-value',
      evaluate: function evaluate(node, options, virtualNode) {
        options = Array.isArray(options) ? options : [];
        var invalid = [], aria = /^aria-/;
        var attr, attrName, attrs = node.attributes;
        var skipAttrs = [ 'aria-errormessage' ];
        for (var i = 0, l = attrs.length; i < l; i++) {
          attr = attrs[i];
          attrName = attr.name;
          if (!skipAttrs.includes(attrName)) {
            if (options.indexOf(attrName) === -1 && aria.test(attrName) && !axe.commons.aria.validateAttrValue(node, attrName)) {
              invalid.push(attrName + '="' + attr.nodeValue + '"');
            }
          }
        }
        if (invalid.length) {
          this.data(invalid);
          return false;
        }
        return true;
      },
      options: []
    }, {
      id: 'aria-valid-attr',
      evaluate: function evaluate(node, options, virtualNode) {
        options = Array.isArray(options) ? options : [];
        var invalid = [], aria = /^aria-/;
        var attr, attrs = node.attributes;
        for (var i = 0, l = attrs.length; i < l; i++) {
          attr = attrs[i].name;
          if (options.indexOf(attr) === -1 && aria.test(attr) && !axe.commons.aria.validateAttr(attr)) {
            invalid.push(attr);
          }
        }
        if (invalid.length) {
          this.data(invalid);
          return false;
        }
        return true;
      },
      options: []
    }, {
      id: 'valid-scrollable-semantics',
      evaluate: function evaluate(node, options, virtualNode) {
        var VALID_TAG_NAMES_FOR_SCROLLABLE_REGIONS = {
          ARTICLE: true,
          ASIDE: true,
          NAV: true,
          SECTION: true
        };
        var VALID_ROLES_FOR_SCROLLABLE_REGIONS = {
          banner: false,
          complementary: true,
          contentinfo: true,
          form: true,
          main: true,
          navigation: true,
          region: true,
          search: false
        };
        function validScrollableTagName(node) {
          var tagName = node.tagName.toUpperCase();
          return VALID_TAG_NAMES_FOR_SCROLLABLE_REGIONS[tagName] || false;
        }
        function validScrollableRole(node) {
          var role = node.getAttribute('role');
          if (!role) {
            return false;
          }
          return VALID_ROLES_FOR_SCROLLABLE_REGIONS[role.toLowerCase()] || false;
        }
        function validScrollableSemantics(node) {
          return validScrollableRole(node) || validScrollableTagName(node);
        }
        return validScrollableSemantics(node);
      },
      options: []
    }, {
      id: 'color-contrast',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!axe.commons.dom.isVisible(node, false)) {
          return true;
        }
        var noScroll = !!(options || {}).noScroll;
        var bgNodes = [], bgColor = axe.commons.color.getBackgroundColor(node, bgNodes, noScroll), fgColor = axe.commons.color.getForegroundColor(node, noScroll);
        var nodeStyle = window.getComputedStyle(node);
        var fontSize = parseFloat(nodeStyle.getPropertyValue('font-size'));
        var fontWeight = nodeStyle.getPropertyValue('font-weight');
        var bold = [ 'bold', 'bolder', '600', '700', '800', '900' ].indexOf(fontWeight) !== -1;
        var cr = axe.commons.color.hasValidContrastRatio(bgColor, fgColor, fontSize, bold);
        var truncatedResult = Math.floor(cr.contrastRatio * 100) / 100;
        var missing;
        if (bgColor === null) {
          missing = axe.commons.color.incompleteData.get('bgColor');
        }
        var equalRatio = false;
        if (truncatedResult === 1) {
          equalRatio = true;
          missing = axe.commons.color.incompleteData.set('bgColor', 'equalRatio');
        }
        var data = {
          fgColor: fgColor ? fgColor.toHexString() : undefined,
          bgColor: bgColor ? bgColor.toHexString() : undefined,
          contrastRatio: cr ? truncatedResult : undefined,
          fontSize: (fontSize * 72 / 96).toFixed(1) + 'pt',
          fontWeight: bold ? 'bold' : 'normal',
          missingData: missing,
          expectedContrastRatio: cr.expectedContrastRatio + ':1'
        };
        this.data(data);
        if (fgColor === null || bgColor === null || equalRatio) {
          missing = null;
          axe.commons.color.incompleteData.clear();
          this.relatedNodes(bgNodes);
          return undefined;
        } else if (!cr.isValid) {
          this.relatedNodes(bgNodes);
        }
        return cr.isValid;
      }
    }, {
      id: 'link-in-text-block',
      evaluate: function evaluate(node, options, virtualNode) {
        var _axe$commons = axe.commons, color = _axe$commons.color, dom = _axe$commons.dom;
        function getContrast(color1, color2) {
          var c1lum = color1.getRelativeLuminance();
          var c2lum = color2.getRelativeLuminance();
          return (Math.max(c1lum, c2lum) + .05) / (Math.min(c1lum, c2lum) + .05);
        }
        var blockLike = [ 'block', 'list-item', 'table', 'flex', 'grid', 'inline-block' ];
        function isBlock(elm) {
          var display = window.getComputedStyle(elm).getPropertyValue('display');
          return blockLike.indexOf(display) !== -1 || display.substr(0, 6) === 'table-';
        }
        if (isBlock(node)) {
          return false;
        }
        var parentBlock = dom.getComposedParent(node);
        while (parentBlock.nodeType === 1 && !isBlock(parentBlock)) {
          parentBlock = dom.getComposedParent(parentBlock);
        }
        this.relatedNodes([ parentBlock ]);
        if (color.elementIsDistinct(node, parentBlock)) {
          return true;
        } else {
          var nodeColor, parentColor;
          nodeColor = color.getForegroundColor(node);
          parentColor = color.getForegroundColor(parentBlock);
          if (!nodeColor || !parentColor) {
            return undefined;
          }
          var contrast = getContrast(nodeColor, parentColor);
          if (contrast === 1) {
            return true;
          } else if (contrast >= 3) {
            axe.commons.color.incompleteData.set('fgColor', 'bgContrast');
            this.data({
              missingData: axe.commons.color.incompleteData.get('fgColor')
            });
            axe.commons.color.incompleteData.clear();
            return undefined;
          }
          nodeColor = color.getBackgroundColor(node);
          parentColor = color.getBackgroundColor(parentBlock);
          if (!nodeColor || !parentColor || getContrast(nodeColor, parentColor) >= 3) {
            var reason = void 0;
            if (!nodeColor || !parentColor) {
              reason = axe.commons.color.incompleteData.get('bgColor');
            } else {
              reason = 'bgContrast';
            }
            axe.commons.color.incompleteData.set('fgColor', reason);
            this.data({
              missingData: axe.commons.color.incompleteData.get('fgColor')
            });
            axe.commons.color.incompleteData.clear();
            return undefined;
          }
        }
        return false;
      }
    }, {
      id: 'fieldset',
      evaluate: function evaluate(node, options, virtualNode) {
        var failureCode, self = this;
        function getUnrelatedElements(parent, name) {
          return axe.commons.utils.toArray(parent.querySelectorAll('select,textarea,button,input:not([name="' + name + '"]):not([type="hidden"])'));
        }
        function checkFieldset(group, name) {
          var firstNode = group.firstElementChild;
          if (!firstNode || firstNode.nodeName.toUpperCase() !== 'LEGEND') {
            self.relatedNodes([ group ]);
            failureCode = 'no-legend';
            return false;
          }
          if (!axe.commons.text.accessibleText(firstNode)) {
            self.relatedNodes([ firstNode ]);
            failureCode = 'empty-legend';
            return false;
          }
          var otherElements = getUnrelatedElements(group, name);
          if (otherElements.length) {
            self.relatedNodes(otherElements);
            failureCode = 'mixed-inputs';
            return false;
          }
          return true;
        }
        function checkARIAGroup(group, name) {
          var hasLabelledByText = axe.commons.dom.idrefs(group, 'aria-labelledby').some(function(element) {
            return element && axe.commons.text.accessibleText(element);
          });
          var ariaLabel = group.getAttribute('aria-label');
          if (!hasLabelledByText && !(ariaLabel && axe.commons.text.sanitize(ariaLabel))) {
            self.relatedNodes(group);
            failureCode = 'no-group-label';
            return false;
          }
          var otherElements = getUnrelatedElements(group, name);
          if (otherElements.length) {
            self.relatedNodes(otherElements);
            failureCode = 'group-mixed-inputs';
            return false;
          }
          return true;
        }
        function spliceCurrentNode(nodes, current) {
          return axe.commons.utils.toArray(nodes).filter(function(candidate) {
            return candidate !== current;
          });
        }
        function runCheck(virtualNode) {
          var name = axe.commons.utils.escapeSelector(virtualNode.actualNode.name);
          var root = axe.commons.dom.getRootNode(virtualNode.actualNode);
          var matchingNodes = root.querySelectorAll('input[type="' + axe.commons.utils.escapeSelector(virtualNode.actualNode.type) + '"][name="' + name + '"]');
          if (matchingNodes.length < 2) {
            return true;
          }
          var fieldset = axe.commons.dom.findUpVirtual(virtualNode, 'fieldset');
          var group = axe.commons.dom.findUpVirtual(virtualNode, '[role="group"]' + (virtualNode.actualNode.type === 'radio' ? ',[role="radiogroup"]' : ''));
          if (!group && !fieldset) {
            failureCode = 'no-group';
            self.relatedNodes(spliceCurrentNode(matchingNodes, virtualNode.actualNode));
            return false;
          } else if (fieldset) {
            return checkFieldset(fieldset, name);
          } else {
            return checkARIAGroup(group, name);
          }
        }
        var data = {
          name: node.getAttribute('name'),
          type: node.getAttribute('type')
        };
        var result = runCheck(virtualNode);
        if (!result) {
          data.failureCode = failureCode;
        }
        this.data(data);
        return result;
      },
      after: function after(results, options) {
        var seen = {};
        return results.filter(function(result) {
          if (result.result) {
            return true;
          }
          var data = result.data;
          if (data) {
            seen[data.type] = seen[data.type] || {};
            if (!seen[data.type][data.name]) {
              seen[data.type][data.name] = [ data ];
              return true;
            }
            var hasBeenSeen = seen[data.type][data.name].some(function(candidate) {
              return candidate.failureCode === data.failureCode;
            });
            if (!hasBeenSeen) {
              seen[data.type][data.name].push(data);
            }
            return !hasBeenSeen;
          }
          return false;
        });
      }
    }, {
      id: 'group-labelledby',
      evaluate: function evaluate(node, options, virtualNode) {
        this.data({
          name: node.getAttribute('name'),
          type: node.getAttribute('type')
        });
        var doc = axe.commons.dom.getRootNode(node);
        var matchingNodes = doc.querySelectorAll('input[type="' + axe.commons.utils.escapeSelector(node.type) + '"][name="' + axe.commons.utils.escapeSelector(node.name) + '"]');
        if (matchingNodes.length <= 1) {
          return true;
        }
        return [].map.call(matchingNodes, function(m) {
          var l = m.getAttribute('aria-labelledby');
          return l ? l.split(/\s+/) : [];
        }).reduce(function(prev, curr) {
          return prev.filter(function(n) {
            return curr.includes(n);
          });
        }).filter(function(n) {
          var labelNode = doc.getElementById(n);
          return labelNode && axe.commons.text.accessibleText(labelNode, true);
        }).length !== 0;
      },
      after: function after(results, options) {
        var seen = {};
        return results.filter(function(result) {
          var data = result.data;
          if (data) {
            seen[data.type] = seen[data.type] || {};
            if (!seen[data.type][data.name]) {
              seen[data.type][data.name] = true;
              return true;
            }
          }
          return false;
        });
      }
    }, {
      id: 'accesskeys',
      evaluate: function evaluate(node, options, virtualNode) {
        if (axe.commons.dom.isVisible(node, false)) {
          this.data(node.getAttribute('accesskey'));
          this.relatedNodes([ node ]);
        }
        return true;
      },
      after: function after(results, options) {
        var seen = {};
        return results.filter(function(r) {
          if (!r.data) {
            return false;
          }
          var key = r.data.toUpperCase();
          if (!seen[key]) {
            seen[key] = r;
            r.relatedNodes = [];
            return true;
          }
          seen[key].relatedNodes.push(r.relatedNodes[0]);
          return false;
        }).map(function(r) {
          r.result = !!r.relatedNodes.length;
          return r;
        });
      }
    }, {
      id: 'focusable-no-name',
      evaluate: function evaluate(node, options, virtualNode) {
        var tabIndex = node.getAttribute('tabindex'), inFocusOrder = axe.commons.dom.isFocusable(node) && tabIndex > -1;
        if (!inFocusOrder) {
          return false;
        }
        return !axe.commons.text.accessibleTextVirtual(virtualNode);
      }
    }, {
      id: 'landmark-is-top-level',
      evaluate: function evaluate(node, options, virtualNode) {
        var landmarks = axe.commons.aria.getRolesByType('landmark');
        var parent = axe.commons.dom.getComposedParent(node);
        this.data({
          role: node.getAttribute('role') || axe.commons.aria.implicitRole(node)
        });
        while (parent) {
          var role = parent.getAttribute('role');
          if (!role && parent.tagName.toLowerCase() !== 'form') {
            role = axe.commons.aria.implicitRole(parent);
          }
          if (role && landmarks.includes(role)) {
            return false;
          }
          parent = axe.commons.dom.getComposedParent(parent);
        }
        return true;
      }
    }, {
      id: 'page-has-heading-one',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!options || !options.selector || typeof options.selector !== 'string') {
          throw new TypeError('visible-in-page requires options.selector to be a string');
        }
        var matchingElms = axe.utils.querySelectorAll(virtualNode, options.selector);
        this.relatedNodes(matchingElms.map(function(vNode) {
          return vNode.actualNode;
        }));
        return matchingElms.length > 0;
      },
      after: function after(results, options) {
        var elmUsedAnywhere = results.some(function(frameResult) {
          return frameResult.result === true;
        });
        if (elmUsedAnywhere) {
          results.forEach(function(result) {
            result.result = true;
          });
        }
        return results;
      },
      options: {
        selector: 'h1:not([role]), [role="heading"][aria-level="1"]'
      }
    }, {
      id: 'page-has-main',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!options || !options.selector || typeof options.selector !== 'string') {
          throw new TypeError('visible-in-page requires options.selector to be a string');
        }
        var matchingElms = axe.utils.querySelectorAll(virtualNode, options.selector);
        this.relatedNodes(matchingElms.map(function(vNode) {
          return vNode.actualNode;
        }));
        return matchingElms.length > 0;
      },
      after: function after(results, options) {
        var elmUsedAnywhere = results.some(function(frameResult) {
          return frameResult.result === true;
        });
        if (elmUsedAnywhere) {
          results.forEach(function(result) {
            result.result = true;
          });
        }
        return results;
      },
      options: {
        selector: 'main:not([role]), [role=\'main\']'
      }
    }, {
      id: 'page-no-duplicate-banner',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!options || !options.selector || typeof options.selector !== 'string') {
          throw new TypeError('visible-in-page requires options.selector to be a string');
        }
        var elms = axe.utils.querySelectorAll(virtualNode, options.selector);
        if (typeof options.nativeScopeFilter === 'string') {
          elms = elms.filter(function(elm) {
            return elm.actualNode.hasAttribute('role') || !axe.commons.dom.findUpVirtual(elm, options.nativeScopeFilter);
          });
        }
        this.relatedNodes(elms.map(function(elm) {
          return elm.actualNode;
        }));
        return elms.length <= 1;
      },
      options: {
        selector: 'header:not([role]), [role=banner]',
        nativeScopeFilter: 'article, aside, main, nav, section'
      }
    }, {
      id: 'page-no-duplicate-contentinfo',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!options || !options.selector || typeof options.selector !== 'string') {
          throw new TypeError('visible-in-page requires options.selector to be a string');
        }
        var elms = axe.utils.querySelectorAll(virtualNode, options.selector);
        if (typeof options.nativeScopeFilter === 'string') {
          elms = elms.filter(function(elm) {
            return elm.actualNode.hasAttribute('role') || !axe.commons.dom.findUpVirtual(elm, options.nativeScopeFilter);
          });
        }
        this.relatedNodes(elms.map(function(elm) {
          return elm.actualNode;
        }));
        return elms.length <= 1;
      },
      options: {
        selector: 'footer:not([role]), [role=contentinfo]',
        nativeScopeFilter: 'article, aside, main, nav, section'
      }
    }, {
      id: 'page-no-duplicate-main',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!options || !options.selector || typeof options.selector !== 'string') {
          throw new TypeError('visible-in-page requires options.selector to be a string');
        }
        var elms = axe.utils.querySelectorAll(virtualNode, options.selector);
        if (typeof options.nativeScopeFilter === 'string') {
          elms = elms.filter(function(elm) {
            return elm.actualNode.hasAttribute('role') || !axe.commons.dom.findUpVirtual(elm, options.nativeScopeFilter);
          });
        }
        this.relatedNodes(elms.map(function(elm) {
          return elm.actualNode;
        }));
        return elms.length <= 1;
      },
      options: {
        selector: 'main:not([role]), [role=\'main\']'
      }
    }, {
      id: 'tabindex',
      evaluate: function evaluate(node, options, virtualNode) {
        return node.tabIndex <= 0;
      }
    }, {
      id: 'duplicate-img-label',
      evaluate: function evaluate(node, options, virtualNode) {
        var text = axe.commons.text.visibleVirtual(virtualNode, true).toLowerCase();
        if (text === '') {
          return false;
        }
        var images = axe.utils.querySelectorAll(virtualNode, 'img').filter(function(_ref) {
          var actualNode = _ref.actualNode;
          return axe.commons.dom.isVisible(actualNode) && ![ 'none', 'presentation' ].includes(actualNode.getAttribute('role'));
        });
        return images.some(function(img) {
          return text === axe.commons.text.accessibleTextVirtual(img).toLowerCase();
        });
      }
    }, {
      id: 'explicit-label',
      evaluate: function evaluate(node, options, virtualNode) {
        if (node.getAttribute('id')) {
          var root = axe.commons.dom.getRootNode(node);
          var id = axe.commons.utils.escapeSelector(node.getAttribute('id'));
          var label = root.querySelector('label[for="' + id + '"]');
          if (label) {
            return !!axe.commons.text.accessibleText(label);
          }
        }
        return false;
      }
    }, {
      id: 'help-same-as-label',
      evaluate: function evaluate(node, options, virtualNode) {
        var labelText = axe.commons.text.labelVirtual(virtualNode), check = node.getAttribute('title');
        if (!labelText) {
          return false;
        }
        if (!check) {
          check = '';
          if (node.getAttribute('aria-describedby')) {
            var ref = axe.commons.dom.idrefs(node, 'aria-describedby');
            check = ref.map(function(thing) {
              return thing ? axe.commons.text.accessibleText(thing) : '';
            }).join('');
          }
        }
        return axe.commons.text.sanitize(check) === axe.commons.text.sanitize(labelText);
      },
      enabled: false
    }, {
      id: 'implicit-label',
      evaluate: function evaluate(node, options, virtualNode) {
        var label = axe.commons.dom.findUpVirtual(virtualNode, 'label');
        if (label) {
          return !!axe.commons.text.accessibleTextVirtual(label);
        }
        return false;
      }
    }, {
      id: 'multiple-label',
      evaluate: function evaluate(node, options, virtualNode) {
        var id = axe.commons.utils.escapeSelector(node.getAttribute('id'));
        var labels = Array.from(document.querySelectorAll('label[for="' + id + '"]'));
        var parent = node.parentNode;
        if (labels.length) {
          labels = labels.filter(function(label, index) {
            if (index === 0 && !axe.commons.dom.isVisible(label, true) || axe.commons.dom.isVisible(label, true)) {
              return label;
            }
          });
        }
        while (parent) {
          if (parent.tagName === 'LABEL' && labels.indexOf(parent) === -1) {
            labels.push(parent);
          }
          parent = parent.parentNode;
        }
        this.relatedNodes(labels);
        return labels.length > 1;
      }
    }, {
      id: 'title-only',
      evaluate: function evaluate(node, options, virtualNode) {
        var labelText = axe.commons.text.labelVirtual(virtualNode);
        return !labelText && !!(node.getAttribute('title') || node.getAttribute('aria-describedby'));
      }
    }, {
      id: 'has-lang',
      evaluate: function evaluate(node, options, virtualNode) {
        return !!(node.getAttribute('lang') || node.getAttribute('xml:lang') || '').trim();
      }
    }, {
      id: 'valid-lang',
      evaluate: function evaluate(node, options, virtualNode) {
        function getBaseLang(lang) {
          return lang.trim().split('-')[0].toLowerCase();
        }
        var langs, invalid;
        langs = (options ? options : axe.commons.utils.validLangs()).map(getBaseLang);
        invalid = [ 'lang', 'xml:lang' ].reduce(function(invalid, langAttr) {
          var langVal = node.getAttribute(langAttr);
          if (typeof langVal !== 'string') {
            return invalid;
          }
          var baselangVal = getBaseLang(langVal);
          if (baselangVal !== '' && langs.indexOf(baselangVal) === -1) {
            invalid.push(langAttr + '="' + node.getAttribute(langAttr) + '"');
          }
          return invalid;
        }, []);
        if (invalid.length) {
          this.data(invalid);
          return true;
        }
        return false;
      }
    }, {
      id: 'dlitem',
      evaluate: function evaluate(node, options, virtualNode) {
        var parent = axe.commons.dom.getComposedParent(node);
        return parent.nodeName.toUpperCase() === 'DL';
      }
    }, {
      id: 'has-listitem',
      evaluate: function evaluate(node, options, virtualNode) {
        return virtualNode.children.every(function(_ref2) {
          var actualNode = _ref2.actualNode;
          return actualNode.nodeName.toUpperCase() !== 'LI';
        });
      }
    }, {
      id: 'listitem',
      evaluate: function evaluate(node, options, virtualNode) {
        var parent = axe.commons.dom.getComposedParent(node);
        return [ 'UL', 'OL' ].includes(parent.nodeName.toUpperCase()) || (parent.getAttribute('role') || '').toLowerCase() === 'list';
      }
    }, {
      id: 'only-dlitems',
      evaluate: function evaluate(node, options, virtualNode) {
        var bad = [], permitted = [ 'STYLE', 'META', 'LINK', 'MAP', 'AREA', 'SCRIPT', 'DATALIST', 'TEMPLATE' ], hasNonEmptyTextNode = false;
        virtualNode.children.forEach(function(_ref3) {
          var actualNode = _ref3.actualNode;
          var nodeName = actualNode.nodeName.toUpperCase();
          if (actualNode.nodeType === 1 && nodeName !== 'DT' && nodeName !== 'DD' && permitted.indexOf(nodeName) === -1) {
            bad.push(actualNode);
          } else if (actualNode.nodeType === 3 && actualNode.nodeValue.trim() !== '') {
            hasNonEmptyTextNode = true;
          }
        });
        if (bad.length) {
          this.relatedNodes(bad);
        }
        var retVal = !!bad.length || hasNonEmptyTextNode;
        return retVal;
      }
    }, {
      id: 'only-listitems',
      evaluate: function evaluate(node, options, virtualNode) {
        var bad = [], permitted = [ 'STYLE', 'META', 'LINK', 'MAP', 'AREA', 'SCRIPT', 'DATALIST', 'TEMPLATE' ], hasNonEmptyTextNode = false;
        virtualNode.children.forEach(function(_ref4) {
          var actualNode = _ref4.actualNode;
          var nodeName = actualNode.nodeName.toUpperCase();
          if (actualNode.nodeType === 1 && nodeName !== 'LI' && permitted.indexOf(nodeName) === -1) {
            bad.push(actualNode);
          } else if (actualNode.nodeType === 3 && actualNode.nodeValue.trim() !== '') {
            hasNonEmptyTextNode = true;
          }
        });
        if (bad.length) {
          this.relatedNodes(bad);
        }
        return !!bad.length || hasNonEmptyTextNode;
      }
    }, {
      id: 'structured-dlitems',
      evaluate: function evaluate(node, options, virtualNode) {
        var children = virtualNode.children;
        if (!children || !children.length) {
          return false;
        }
        var hasDt = false, hasDd = false, nodeName;
        for (var i = 0; i < children.length; i++) {
          nodeName = children[i].actualNode.nodeName.toUpperCase();
          if (nodeName === 'DT') {
            hasDt = true;
          }
          if (hasDt && nodeName === 'DD') {
            return false;
          }
          if (nodeName === 'DD') {
            hasDd = true;
          }
        }
        return hasDt || hasDd;
      }
    }, {
      id: 'caption',
      evaluate: function evaluate(node, options, virtualNode) {
        var tracks = axe.utils.querySelectorAll(virtualNode, 'track');
        if (tracks.length) {
          return !tracks.some(function(_ref5) {
            var actualNode = _ref5.actualNode;
            return (actualNode.getAttribute('kind') || '').toLowerCase() === 'captions';
          });
        }
        return undefined;
      }
    }, {
      id: 'description',
      evaluate: function evaluate(node, options, virtualNode) {
        var tracks = axe.utils.querySelectorAll(virtualNode, 'track');
        if (tracks.length) {
          var out = !tracks.some(function(_ref6) {
            var actualNode = _ref6.actualNode;
            return (actualNode.getAttribute('kind') || '').toLowerCase() === 'descriptions';
          });
          return out;
        }
        return undefined;
      }
    }, {
      id: 'frame-tested',
      evaluate: function evaluate(node, options, virtualNode) {
        var resolve = this.async();
        var _Object$assign = Object.assign({
          isViolation: false,
          timeout: 500
        }, options), isViolation = _Object$assign.isViolation, timeout = _Object$assign.timeout;
        var timer = setTimeout(function() {
          timer = setTimeout(function() {
            timer = null;
            resolve(isViolation ? false : undefined);
          }, 0);
        }, timeout);
        axe.utils.respondable(node.contentWindow, 'axe.ping', null, undefined, function() {
          if (timer !== null) {
            clearTimeout(timer);
            resolve(true);
          }
        });
      },
      options: {
        isViolation: false
      }
    }, {
      id: 'meta-viewport-large',
      evaluate: function evaluate(node, options, virtualNode) {
        options = options || {};
        var params, content = node.getAttribute('content') || '', parsedParams = content.split(/[;,]/), result = {}, minimum = options.scaleMinimum || 2, lowerBound = options.lowerBound || false;
        for (var i = 0, l = parsedParams.length; i < l; i++) {
          params = parsedParams[i].split('=');
          var key = params.shift().toLowerCase();
          if (key && params.length) {
            result[key.trim()] = params.shift().trim().toLowerCase();
          }
        }
        if (lowerBound && result['maximum-scale'] && parseFloat(result['maximum-scale']) < lowerBound) {
          return true;
        }
        if (!lowerBound && result['user-scalable'] === 'no') {
          return false;
        }
        if (result['maximum-scale'] && parseFloat(result['maximum-scale']) < minimum) {
          return false;
        }
        return true;
      },
      options: {
        scaleMinimum: 5,
        lowerBound: 2
      }
    }, {
      id: 'meta-viewport',
      evaluate: function evaluate(node, options, virtualNode) {
        options = options || {};
        var params, content = node.getAttribute('content') || '', parsedParams = content.split(/[;,]/), result = {}, minimum = options.scaleMinimum || 2, lowerBound = options.lowerBound || false;
        for (var i = 0, l = parsedParams.length; i < l; i++) {
          params = parsedParams[i].split('=');
          var key = params.shift().toLowerCase();
          if (key && params.length) {
            result[key.trim()] = params.shift().trim().toLowerCase();
          }
        }
        if (lowerBound && result['maximum-scale'] && parseFloat(result['maximum-scale']) < lowerBound) {
          return true;
        }
        if (!lowerBound && result['user-scalable'] === 'no') {
          return false;
        }
        if (result['maximum-scale'] && parseFloat(result['maximum-scale']) < minimum) {
          return false;
        }
        return true;
      },
      options: {
        scaleMinimum: 2
      }
    }, {
      id: 'header-present',
      evaluate: function evaluate(node, options, virtualNode) {
        return !!axe.utils.querySelectorAll(virtualNode, 'h1, h2, h3, h4, h5, h6, [role="heading"]')[0];
      }
    }, {
      id: 'heading-order',
      evaluate: function evaluate(node, options, virtualNode) {
        var ariaHeadingLevel = node.getAttribute('aria-level');
        if (ariaHeadingLevel !== null) {
          this.data(parseInt(ariaHeadingLevel, 10));
          return true;
        }
        var headingLevel = node.tagName.match(/H(\d)/);
        if (headingLevel) {
          this.data(parseInt(headingLevel[1], 10));
          return true;
        }
        return true;
      },
      after: function after(results, options) {
        if (results.length < 2) {
          return results;
        }
        var prevLevel = results[0].data;
        for (var i = 1; i < results.length; i++) {
          if (results[i].result && results[i].data > prevLevel + 1) {
            results[i].result = false;
          }
          prevLevel = results[i].data;
        }
        return results;
      }
    }, {
      id: 'internal-link-present',
      evaluate: function evaluate(node, options, virtualNode) {
        var links = axe.utils.querySelectorAll(virtualNode, 'a[href]');
        return links.some(function(vLink) {
          return /^#[^\/!]/.test(vLink.actualNode.getAttribute('href'));
        });
      }
    }, {
      id: 'landmark',
      evaluate: function evaluate(node, options, virtualNode) {
        return axe.utils.querySelectorAll(virtualNode, 'main, [role="main"]').length > 0;
      }
    }, {
      id: 'meta-refresh',
      evaluate: function evaluate(node, options, virtualNode) {
        var content = node.getAttribute('content') || '', parsedParams = content.split(/[;,]/);
        return content === '' || parsedParams[0] === '0';
      }
    }, {
      id: 'p-as-heading',
      evaluate: function evaluate(node, options, virtualNode) {
        var siblings = Array.from(node.parentNode.children);
        var currentIndex = siblings.indexOf(node);
        options = options || {};
        var margins = options.margins || [];
        var nextSibling = siblings.slice(currentIndex + 1).find(function(elm) {
          return elm.nodeName.toUpperCase() === 'P';
        });
        var prevSibling = siblings.slice(0, currentIndex).reverse().find(function(elm) {
          return elm.nodeName.toUpperCase() === 'P';
        });
        function getTextContainer(elm) {
          var nextNode = elm;
          var outerText = elm.textContent.trim();
          var innerText = outerText;
          while (innerText === outerText && nextNode !== undefined) {
            var i = -1;
            elm = nextNode;
            if (elm.children.length === 0) {
              return elm;
            }
            do {
              i++;
              innerText = elm.children[i].textContent.trim();
            } while (innerText === '' && i + 1 < elm.children.length);
            nextNode = elm.children[i];
          }
          return elm;
        }
        function normalizeFontWeight(weight) {
          switch (weight) {
           case 'lighter':
            return 100;

           case 'normal':
            return 400;

           case 'bold':
            return 700;

           case 'bolder':
            return 900;
          }
          weight = parseInt(weight);
          return !isNaN(weight) ? weight : 400;
        }
        function getStyleValues(node) {
          var style = window.getComputedStyle(getTextContainer(node));
          return {
            fontWeight: normalizeFontWeight(style.getPropertyValue('font-weight')),
            fontSize: parseInt(style.getPropertyValue('font-size')),
            isItalic: style.getPropertyValue('font-style') === 'italic'
          };
        }
        function isHeaderStyle(styleA, styleB, margins) {
          return margins.reduce(function(out, margin) {
            return out || (!margin.size || styleA.fontSize / margin.size > styleB.fontSize) && (!margin.weight || styleA.fontWeight - margin.weight > styleB.fontWeight) && (!margin.italic || styleA.isItalic && !styleB.isItalic);
          }, false);
        }
        var currStyle = getStyleValues(node);
        var nextStyle = nextSibling ? getStyleValues(nextSibling) : null;
        var prevStyle = prevSibling ? getStyleValues(prevSibling) : null;
        if (!nextStyle || !isHeaderStyle(currStyle, nextStyle, margins)) {
          return true;
        }
        var blockquote = axe.commons.dom.findUpVirtual(virtualNode, 'blockquote');
        if (blockquote && blockquote.nodeName.toUpperCase() === 'BLOCKQUOTE') {
          return undefined;
        }
        if (prevStyle && !isHeaderStyle(currStyle, prevStyle, margins)) {
          return undefined;
        }
        return false;
      },
      options: {
        margins: [ {
          weight: 150,
          italic: true
        }, {
          weight: 150,
          size: 1.15
        }, {
          italic: true,
          size: 1.15
        }, {
          size: 1.4
        } ]
      }
    }, {
      id: 'region',
      evaluate: function evaluate(node, options, virtualNode) {
        var _axe$commons2 = axe.commons, dom = _axe$commons2.dom, aria = _axe$commons2.aria;
        function getSkiplink(virtualNode) {
          var firstLink = axe.utils.querySelectorAll(virtualNode, 'a[href]')[0];
          if (firstLink && axe.commons.dom.getElementByReference(firstLink.actualNode, 'href')) {
            return firstLink.actualNode;
          }
        }
        var skipLink = getSkiplink(virtualNode);
        var landmarkRoles = aria.getRolesByType('landmark');
        var implicitLandmarks = landmarkRoles.reduce(function(arr, role) {
          return arr.concat(aria.implicitNodes(role));
        }, []).filter(function(r) {
          return r !== null;
        });
        function isSkipLink(vNode) {
          return skipLink && skipLink === vNode.actualNode;
        }
        function isLandmark(virtualNode) {
          var node = virtualNode.actualNode;
          var explictRole = (node.getAttribute('role') || '').trim().toLowerCase();
          if (explictRole) {
            if (explictRole === 'form') {
              return !!aria.labelVirtual(virtualNode);
            }
            return landmarkRoles.includes(explictRole);
          } else {
            return implicitLandmarks.some(function(implicitSelector) {
              var matches = axe.utils.matchesSelector(node, implicitSelector);
              if (node.tagName.toLowerCase() === 'form') {
                return matches && !!aria.labelVirtual(virtualNode);
              }
              return matches;
            });
          }
        }
        function findRegionlessElms(virtualNode) {
          var node = virtualNode.actualNode;
          if (isLandmark(virtualNode) || isSkipLink(virtualNode) || !dom.isVisible(node, true)) {
            return [];
          } else if (dom.hasContent(node, true)) {
            return [ node ];
          } else {
            return virtualNode.children.filter(function(_ref7) {
              var actualNode = _ref7.actualNode;
              return actualNode.nodeType === 1;
            }).map(findRegionlessElms).reduce(function(a, b) {
              return a.concat(b);
            }, []);
          }
        }
        var regionlessNodes = findRegionlessElms(virtualNode);
        this.relatedNodes(regionlessNodes);
        return regionlessNodes.length === 0;
      },
      after: function after(results, options) {
        return [ results[0] ];
      }
    }, {
      id: 'skip-link',
      evaluate: function evaluate(node, options, virtualNode) {
        var target = axe.commons.dom.getElementByReference(node, 'href');
        if (target) {
          return axe.commons.dom.isVisible(target, true) || undefined;
        }
        return false;
      }
    }, {
      id: 'unique-frame-title',
      evaluate: function evaluate(node, options, virtualNode) {
        var title = axe.commons.text.sanitize(node.title).trim().toLowerCase();
        this.data(title);
        return true;
      },
      after: function after(results, options) {
        var titles = {};
        results.forEach(function(r) {
          titles[r.data] = titles[r.data] !== undefined ? ++titles[r.data] : 0;
        });
        results.forEach(function(r) {
          r.result = !!titles[r.data];
        });
        return results;
      }
    }, {
      id: 'aria-label',
      evaluate: function evaluate(node, options, virtualNode) {
        var label = node.getAttribute('aria-label');
        return !!(label ? axe.commons.text.sanitize(label).trim() : '');
      }
    }, {
      id: 'aria-labelledby',
      evaluate: function evaluate(node, options, virtualNode) {
        var getIdRefs = axe.commons.dom.idrefs;
        return getIdRefs(node, 'aria-labelledby').some(function(elm) {
          return elm && axe.commons.text.accessibleText(elm, true);
        });
      }
    }, {
      id: 'button-has-visible-text',
      evaluate: function evaluate(node, options, virtualNode) {
        var nodeName = node.nodeName.toUpperCase();
        var role = node.getAttribute('role');
        var label = void 0;
        if (nodeName === 'BUTTON' || role === 'button' && nodeName !== 'INPUT') {
          label = axe.commons.text.accessibleTextVirtual(virtualNode);
          this.data(label);
          return !!label;
        } else {
          return false;
        }
      }
    }, {
      id: 'doc-has-title',
      evaluate: function evaluate(node, options, virtualNode) {
        var title = document.title;
        return !!(title ? axe.commons.text.sanitize(title).trim() : '');
      }
    }, {
      id: 'duplicate-id',
      evaluate: function evaluate(node, options, virtualNode) {
        var id = node.getAttribute('id').trim();
        if (!id) {
          return true;
        }
        var root = axe.commons.dom.getRootNode(node);
        var matchingNodes = Array.from(root.querySelectorAll('[id="' + axe.commons.utils.escapeSelector(id) + '"]')).filter(function(foundNode) {
          return foundNode !== node;
        });
        if (matchingNodes.length) {
          this.relatedNodes(matchingNodes);
        }
        this.data(id);
        return matchingNodes.length === 0;
      },
      after: function after(results, options) {
        var uniqueIds = [];
        return results.filter(function(r) {
          if (uniqueIds.indexOf(r.data) === -1) {
            uniqueIds.push(r.data);
            return true;
          }
          return false;
        });
      }
    }, {
      id: 'exists',
      evaluate: function evaluate(node, options, virtualNode) {
        return true;
      }
    }, {
      id: 'has-alt',
      evaluate: function evaluate(node, options, virtualNode) {
        var nn = node.nodeName.toLowerCase();
        return node.hasAttribute('alt') && (nn === 'img' || nn === 'input' || nn === 'area');
      }
    }, {
      id: 'has-visible-text',
      evaluate: function evaluate(node, options, virtualNode) {
        return axe.commons.text.accessibleTextVirtual(virtualNode).length > 0;
      }
    }, {
      id: 'is-on-screen',
      evaluate: function evaluate(node, options, virtualNode) {
        return axe.commons.dom.isVisible(node, false) && !axe.commons.dom.isOffscreen(node);
      }
    }, {
      id: 'non-empty-alt',
      evaluate: function evaluate(node, options, virtualNode) {
        var label = node.getAttribute('alt');
        return !!(label ? axe.commons.text.sanitize(label).trim() : '');
      }
    }, {
      id: 'non-empty-if-present',
      evaluate: function evaluate(node, options, virtualNode) {
        var nodeName = node.nodeName.toUpperCase();
        var type = (node.getAttribute('type') || '').toLowerCase();
        var label = node.getAttribute('value');
        this.data(label);
        if (nodeName === 'INPUT' && [ 'submit', 'reset' ].includes(type)) {
          return label === null;
        }
        return false;
      }
    }, {
      id: 'non-empty-title',
      evaluate: function evaluate(node, options, virtualNode) {
        var title = node.getAttribute('title');
        return !!(title ? axe.commons.text.sanitize(title).trim() : '');
      }
    }, {
      id: 'non-empty-value',
      evaluate: function evaluate(node, options, virtualNode) {
        var label = node.getAttribute('value');
        return !!(label ? axe.commons.text.sanitize(label).trim() : '');
      }
    }, {
      id: 'role-none',
      evaluate: function evaluate(node, options, virtualNode) {
        return node.getAttribute('role') === 'none';
      }
    }, {
      id: 'role-presentation',
      evaluate: function evaluate(node, options, virtualNode) {
        return node.getAttribute('role') === 'presentation';
      }
    }, {
      id: 'caption-faked',
      evaluate: function evaluate(node, options, virtualNode) {
        var table = axe.commons.table.toGrid(node);
        var firstRow = table[0];
        if (table.length <= 1 || firstRow.length <= 1 || node.rows.length <= 1) {
          return true;
        }
        return firstRow.reduce(function(out, curr, i) {
          return out || curr !== firstRow[i + 1] && firstRow[i + 1] !== undefined;
        }, false);
      }
    }, {
      id: 'has-caption',
      evaluate: function evaluate(node, options, virtualNode) {
        return !!node.caption;
      }
    }, {
      id: 'has-summary',
      evaluate: function evaluate(node, options, virtualNode) {
        return !!node.summary;
      }
    }, {
      id: 'has-th',
      evaluate: function evaluate(node, options, virtualNode) {
        var row, cell, badCells = [];
        for (var rowIndex = 0, rowLength = node.rows.length; rowIndex < rowLength; rowIndex++) {
          row = node.rows[rowIndex];
          for (var cellIndex = 0, cellLength = row.cells.length; cellIndex < cellLength; cellIndex++) {
            cell = row.cells[cellIndex];
            if (cell.nodeName.toUpperCase() === 'TH' || [ 'rowheader', 'columnheader' ].indexOf(cell.getAttribute('role')) !== -1) {
              badCells.push(cell);
            }
          }
        }
        if (badCells.length) {
          this.relatedNodes(badCells);
          return true;
        }
        return false;
      }
    }, {
      id: 'html5-scope',
      evaluate: function evaluate(node, options, virtualNode) {
        if (!axe.commons.dom.isHTML5(document)) {
          return true;
        }
        return node.nodeName.toUpperCase() === 'TH';
      }
    }, {
      id: 'same-caption-summary',
      evaluate: function evaluate(node, options, virtualNode) {
        return !!(node.summary && node.caption) && node.summary.toLowerCase() === axe.commons.text.accessibleText(node.caption).toLowerCase();
      }
    }, {
      id: 'scope-value',
      evaluate: function evaluate(node, options, virtualNode) {
        options = options || {};
        var value = node.getAttribute('scope').toLowerCase();
        var validVals = [ 'row', 'col', 'rowgroup', 'colgroup' ] || options.values;
        return validVals.indexOf(value) !== -1;
      }
    }, {
      id: 'td-has-header',
      evaluate: function evaluate(node, options, virtualNode) {
        var tableUtils = axe.commons.table;
        var badCells = [];
        var cells = tableUtils.getAllCells(node);
        cells.forEach(function(cell) {
          if (axe.commons.dom.hasContent(cell) && tableUtils.isDataCell(cell) && !axe.commons.aria.label(cell)) {
            var hasHeaders = tableUtils.getHeaders(cell);
            hasHeaders = hasHeaders.reduce(function(hasHeaders, header) {
              return hasHeaders || header !== null && !!axe.commons.dom.hasContent(header);
            }, false);
            if (!hasHeaders) {
              badCells.push(cell);
            }
          }
        });
        if (badCells.length) {
          this.relatedNodes(badCells);
          return false;
        }
        return true;
      }
    }, {
      id: 'td-headers-attr',
      evaluate: function evaluate(node, options, virtualNode) {
        var cells = [];
        for (var rowIndex = 0, rowLength = node.rows.length; rowIndex < rowLength; rowIndex++) {
          var row = node.rows[rowIndex];
          for (var cellIndex = 0, cellLength = row.cells.length; cellIndex < cellLength; cellIndex++) {
            cells.push(row.cells[cellIndex]);
          }
        }
        var ids = cells.reduce(function(ids, cell) {
          if (cell.getAttribute('id')) {
            ids.push(cell.getAttribute('id'));
          }
          return ids;
        }, []);
        var badCells = cells.reduce(function(badCells, cell) {
          var isSelf, notOfTable;
          var headers = (cell.getAttribute('headers') || '').split(/\s/).reduce(function(headers, header) {
            header = header.trim();
            if (header) {
              headers.push(header);
            }
            return headers;
          }, []);
          if (headers.length !== 0) {
            if (cell.getAttribute('id')) {
              isSelf = headers.indexOf(cell.getAttribute('id').trim()) !== -1;
            }
            notOfTable = headers.reduce(function(fail, header) {
              return fail || ids.indexOf(header) === -1;
            }, false);
            if (isSelf || notOfTable) {
              badCells.push(cell);
            }
          }
          return badCells;
        }, []);
        if (badCells.length > 0) {
          this.relatedNodes(badCells);
          return false;
        } else {
          return true;
        }
      }
    }, {
      id: 'th-has-data-cells',
      evaluate: function evaluate(node, options, virtualNode) {
        var tableUtils = axe.commons.table;
        var cells = tableUtils.getAllCells(node);
        var checkResult = this;
        var reffedHeaders = [];
        cells.forEach(function(cell) {
          var headers = cell.getAttribute('headers');
          if (headers) {
            reffedHeaders = reffedHeaders.concat(headers.split(/\s+/));
          }
          var ariaLabel = cell.getAttribute('aria-labelledby');
          if (ariaLabel) {
            reffedHeaders = reffedHeaders.concat(ariaLabel.split(/\s+/));
          }
        });
        var headers = cells.filter(function(cell) {
          if (axe.commons.text.sanitize(cell.textContent) === '') {
            return false;
          }
          return cell.nodeName.toUpperCase() === 'TH' || [ 'rowheader', 'columnheader' ].indexOf(cell.getAttribute('role')) !== -1;
        });
        var tableGrid = tableUtils.toGrid(node);
        var out = headers.reduce(function(res, header) {
          if (header.getAttribute('id') && reffedHeaders.includes(header.getAttribute('id'))) {
            return !res ? res : true;
          }
          var hasCell = false;
          var pos = tableUtils.getCellPosition(header, tableGrid);
          if (tableUtils.isColumnHeader(header)) {
            hasCell = tableUtils.traverse('down', pos, tableGrid).reduce(function(out, cell) {
              return out || axe.commons.dom.hasContent(cell) && !tableUtils.isColumnHeader(cell);
            }, false);
          }
          if (!hasCell && tableUtils.isRowHeader(header)) {
            hasCell = tableUtils.traverse('right', pos, tableGrid).reduce(function(out, cell) {
              return out || axe.commons.dom.hasContent(cell) && !tableUtils.isRowHeader(cell);
            }, false);
          }
          if (!hasCell) {
            checkResult.relatedNodes(header);
          }
          return res && hasCell;
        }, true);
        return out ? true : undefined;
      }
    }, {
      id: 'hidden-content',
      evaluate: function evaluate(node, options, virtualNode) {
        var whitelist = [ 'SCRIPT', 'HEAD', 'TITLE', 'NOSCRIPT', 'STYLE', 'TEMPLATE' ];
        if (!whitelist.includes(node.tagName.toUpperCase()) && axe.commons.dom.hasContentVirtual(virtualNode)) {
          var styles = window.getComputedStyle(node);
          if (styles.getPropertyValue('display') === 'none') {
            return undefined;
          } else if (styles.getPropertyValue('visibility') === 'hidden') {
            var parent = axe.commons.dom.getComposedParent(node);
            var parentStyle = parent && window.getComputedStyle(parent);
            if (!parentStyle || parentStyle.getPropertyValue('visibility') !== 'hidden') {
              return undefined;
            }
          }
        }
        return true;
      }
    } ],
    commons: function() {
      var commons = {};
      var aria = commons.aria = {}, lookupTable = aria.lookupTable = {};
      lookupTable.attributes = {
        'aria-activedescendant': {
          type: 'idref'
        },
        'aria-atomic': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-autocomplete': {
          type: 'nmtoken',
          values: [ 'inline', 'list', 'both', 'none' ]
        },
        'aria-busy': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-checked': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'mixed', 'undefined' ]
        },
        'aria-colcount': {
          type: 'int'
        },
        'aria-colindex': {
          type: 'int'
        },
        'aria-colspan': {
          type: 'int'
        },
        'aria-controls': {
          type: 'idrefs'
        },
        'aria-current': {
          type: 'nmtoken',
          values: [ 'page', 'step', 'location', 'date', 'time', 'true', 'false' ]
        },
        'aria-describedby': {
          type: 'idrefs'
        },
        'aria-disabled': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-dropeffect': {
          type: 'nmtokens',
          values: [ 'copy', 'move', 'reference', 'execute', 'popup', 'none' ]
        },
        'aria-errormessage': {
          type: 'idref'
        },
        'aria-expanded': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'undefined' ]
        },
        'aria-flowto': {
          type: 'idrefs'
        },
        'aria-grabbed': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'undefined' ]
        },
        'aria-haspopup': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'menu', 'listbox', 'tree', 'grid', 'dialog' ]
        },
        'aria-hidden': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-invalid': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'spelling', 'grammar' ]
        },
        'aria-keyshortcuts': {
          type: 'string'
        },
        'aria-label': {
          type: 'string'
        },
        'aria-labelledby': {
          type: 'idrefs',
          values: [ '' ]
        },
        'aria-level': {
          type: 'int'
        },
        'aria-live': {
          type: 'nmtoken',
          values: [ 'off', 'polite', 'assertive' ]
        },
        'aria-modal': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-multiline': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-multiselectable': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-orientation': {
          type: 'nmtoken',
          values: [ 'horizontal', 'vertical' ]
        },
        'aria-owns': {
          type: 'idrefs'
        },
        'aria-placeholder': {
          type: 'string'
        },
        'aria-posinset': {
          type: 'int'
        },
        'aria-pressed': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'mixed', 'undefined' ]
        },
        'aria-readonly': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-relevant': {
          type: 'nmtokens',
          values: [ 'additions', 'removals', 'text', 'all' ]
        },
        'aria-required': {
          type: 'boolean',
          values: [ 'true', 'false' ]
        },
        'aria-rowcount': {
          type: 'int'
        },
        'aria-rowindex': {
          type: 'int'
        },
        'aria-rowspan': {
          type: 'int'
        },
        'aria-selected': {
          type: 'nmtoken',
          values: [ 'true', 'false', 'undefined' ]
        },
        'aria-setsize': {
          type: 'int'
        },
        'aria-sort': {
          type: 'nmtoken',
          values: [ 'ascending', 'descending', 'other', 'none' ]
        },
        'aria-valuemax': {
          type: 'decimal'
        },
        'aria-valuemin': {
          type: 'decimal'
        },
        'aria-valuenow': {
          type: 'decimal'
        },
        'aria-valuetext': {
          type: 'string'
        }
      };
      lookupTable.globalAttributes = [ 'aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant' ];
      lookupTable.role = {
        alert: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        alertdialog: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-modal' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        application: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        article: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'article' ]
        },
        banner: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'header' ]
        },
        button: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-pressed' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'button', 'input[type="button"]', 'input[type="image"]', 'input[type="reset"]', 'input[type="submit"]', 'summary' ]
        },
        cell: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-colindex', 'aria-colspan', 'aria-rowindex', 'aria-rowspan' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'row' ],
          implicit: [ 'td', 'th' ]
        },
        checkbox: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-checked', 'aria-required' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'input[type="checkbox"]' ]
        },
        columnheader: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-colindex', 'aria-colspan', 'aria-expanded', 'aria-rowindex', 'aria-rowspan', 'aria-required', 'aria-readonly', 'aria-selected', 'aria-sort' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'row' ],
          implicit: [ 'th' ]
        },
        combobox: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-autocomplete', 'aria-required', 'aria-activedescendant', 'aria-orientation' ]
          },
          owned: {
            all: [ 'listbox', 'textbox' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        command: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        complementary: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'aside' ]
        },
        composite: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        contentinfo: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'footer' ]
        },
        definition: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'dd', 'dfn' ]
        },
        dialog: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-modal' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'dialog' ]
        },
        directory: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        document: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'body' ]
        },
        'doc-abstract': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        'doc-acknowledgments': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        'doc-afterword': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        'doc-appendix': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        'doc-backlink': {
          type: 'link',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        'doc-biblioentry': {
          type: 'listitem',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-level', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: [ 'doc-bibliography' ]
        },
        'doc-bibliography': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        'doc-biblioref': {
          type: 'link',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        'doc-chapter': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-colophon': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-conclusion': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-cover': {
          type: 'img',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-credit': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-credits': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-dedication': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-endnote': {
          type: 'listitem',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-level', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: [ 'doc-endnotes' ]
        },
        'doc-endnotes': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: [ 'doc-endnote' ],
          namefrom: [ 'author' ],
          context: null
        },
        'doc-epigraph': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-epilogue': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-errata': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-example': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-footnote': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-foreword': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-glossary': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: [ 'term', 'definition' ],
          namefrom: [ 'author' ],
          context: null
        },
        'doc-glossref': {
          type: 'link',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author', 'contents' ],
          context: null
        },
        'doc-index': {
          type: 'navigation',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-introduction': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-noteref': {
          type: 'link',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author', 'contents' ],
          context: null
        },
        'doc-notice': {
          type: 'note',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-pagebreak': {
          type: 'separator',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-pagelist': {
          type: 'navigation',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-part': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-preface': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-prologue': {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-pullquote': {
          type: 'none',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-qna': {
          type: 'section',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-subtitle': {
          type: 'sectionhead',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-tip': {
          type: 'note',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        'doc-toc': {
          type: 'navigation',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          namefrom: [ 'author' ],
          context: null
        },
        feed: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: {
            one: [ 'article' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        form: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'form' ]
        },
        grid: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded', 'aria-colcount', 'aria-level', 'aria-multiselectable', 'aria-readonly', 'aria-rowcount' ]
          },
          owned: {
            one: [ 'rowgroup', 'row' ]
          },
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'table' ]
        },
        gridcell: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-colindex', 'aria-colspan', 'aria-expanded', 'aria-rowindex', 'aria-rowspan', 'aria-selected', 'aria-readonly', 'aria-required' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'row' ],
          implicit: [ 'td', 'th' ]
        },
        group: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'details', 'optgroup' ]
        },
        heading: {
          type: 'structure',
          attributes: {
            required: [ 'aria-level' ],
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ]
        },
        img: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'img' ]
        },
        input: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        landmark: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        link: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'a[href]' ]
        },
        list: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: {
            all: [ 'listitem' ]
          },
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'ol', 'ul', 'dl' ]
        },
        listbox: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-multiselectable', 'aria-required', 'aria-expanded', 'aria-orientation' ]
          },
          owned: {
            all: [ 'option' ]
          },
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'select' ]
        },
        listitem: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-level', 'aria-posinset', 'aria-setsize', 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'list' ],
          implicit: [ 'li', 'dt' ]
        },
        log: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        main: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'main' ]
        },
        marquee: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        math: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'math' ]
        },
        menu: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded', 'aria-orientation' ]
          },
          owned: {
            one: [ 'menuitem', 'menuitemradio', 'menuitemcheckbox' ]
          },
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'menu[type="context"]' ]
        },
        menubar: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded', 'aria-orientation' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        menuitem: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-posinset', 'aria-setsize', 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'menu', 'menubar' ],
          implicit: [ 'menuitem[type="command"]' ]
        },
        menuitemcheckbox: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-checked', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'menu', 'menubar' ],
          implicit: [ 'menuitem[type="checkbox"]' ]
        },
        menuitemradio: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-checked', 'aria-selected', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'menu', 'menubar' ],
          implicit: [ 'menuitem[type="radio"]' ]
        },
        navigation: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'nav' ]
        },
        none: {
          type: 'structure',
          attributes: null,
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        note: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        option: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-selected', 'aria-posinset', 'aria-setsize', 'aria-checked' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'listbox' ],
          implicit: [ 'option' ]
        },
        presentation: {
          type: 'structure',
          attributes: null,
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        progressbar: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-valuetext', 'aria-valuenow', 'aria-valuemax', 'aria-valuemin' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'progress' ]
        },
        radio: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-checked', 'aria-selected', 'aria-posinset', 'aria-setsize', 'aria-required' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'input[type="radio"]' ]
        },
        radiogroup: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-required', 'aria-expanded' ]
          },
          owned: {
            all: [ 'radio' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        range: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        region: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'section[aria-label]', 'section[aria-labelledby]', 'section[title]' ]
        },
        roletype: {
          type: 'abstract'
        },
        row: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-colindex', 'aria-expanded', 'aria-level', 'aria-selected', 'aria-rowindex' ]
          },
          owned: {
            one: [ 'cell', 'columnheader', 'rowheader', 'gridcell' ]
          },
          nameFrom: [ 'author', 'contents' ],
          context: [ 'rowgroup', 'grid', 'treegrid', 'table' ],
          implicit: [ 'tr' ]
        },
        rowgroup: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded' ]
          },
          owned: {
            all: [ 'row' ]
          },
          nameFrom: [ 'author', 'contents' ],
          context: [ 'grid', 'table' ],
          implicit: [ 'tbody', 'thead', 'tfoot' ]
        },
        rowheader: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-colindex', 'aria-colspan', 'aria-expanded', 'aria-rowindex', 'aria-rowspan', 'aria-required', 'aria-readonly', 'aria-selected', 'aria-sort' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'row' ],
          implicit: [ 'th' ]
        },
        scrollbar: {
          type: 'widget',
          attributes: {
            required: [ 'aria-controls', 'aria-valuenow', 'aria-valuemax', 'aria-valuemin' ],
            allowed: [ 'aria-valuetext', 'aria-orientation' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        search: {
          type: 'landmark',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        searchbox: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-autocomplete', 'aria-multiline', 'aria-readonly', 'aria-required', 'aria-placeholder' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'input[type="search"]' ]
        },
        section: {
          nameFrom: [ 'author', 'contents' ],
          type: 'abstract'
        },
        sectionhead: {
          nameFrom: [ 'author', 'contents' ],
          type: 'abstract'
        },
        select: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        },
        separator: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded', 'aria-orientation' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'hr' ]
        },
        slider: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-valuetext', 'aria-orientation' ],
            required: [ 'aria-valuenow', 'aria-valuemax', 'aria-valuemin' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'input[type="range"]' ]
        },
        spinbutton: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-valuetext', 'aria-required' ],
            required: [ 'aria-valuenow', 'aria-valuemax', 'aria-valuemin' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'input[type="number"]' ]
        },
        status: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'output' ]
        },
        structure: {
          type: 'abstract'
        },
        switch: {
          type: 'widget',
          attributes: {
            required: [ 'aria-checked' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        tab: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-selected', 'aria-expanded', 'aria-setsize', 'aria-posinset' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'tablist' ]
        },
        table: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-colcount', 'aria-rowcount' ]
          },
          owned: {
            one: [ 'rowgroup', 'row' ]
          },
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'table' ]
        },
        tablist: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded', 'aria-level', 'aria-multiselectable', 'aria-orientation' ]
          },
          owned: {
            all: [ 'tab' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        tabpanel: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        term: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null,
          implicit: [ 'dt' ]
        },
        text: {
          type: 'structure',
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        textbox: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-autocomplete', 'aria-multiline', 'aria-readonly', 'aria-required', 'aria-placeholder' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'input[type="text"]', 'input[type="email"]', 'input[type="password"]', 'input[type="tel"]', 'input[type="url"]', 'input:not([type])', 'textarea' ]
        },
        timer: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null
        },
        toolbar: {
          type: 'structure',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author' ],
          context: null,
          implicit: [ 'menu[type="toolbar"]' ]
        },
        tooltip: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-expanded' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: null
        },
        tree: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-multiselectable', 'aria-required', 'aria-expanded', 'aria-orientation' ]
          },
          owned: {
            all: [ 'treeitem' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        treegrid: {
          type: 'composite',
          attributes: {
            allowed: [ 'aria-activedescendant', 'aria-colcount', 'aria-expanded', 'aria-level', 'aria-multiselectable', 'aria-readonly', 'aria-required', 'aria-rowcount', 'aria-orientation' ]
          },
          owned: {
            one: [ 'rowgroup', 'row' ]
          },
          nameFrom: [ 'author' ],
          context: null
        },
        treeitem: {
          type: 'widget',
          attributes: {
            allowed: [ 'aria-checked', 'aria-selected', 'aria-expanded', 'aria-level', 'aria-posinset', 'aria-setsize' ]
          },
          owned: null,
          nameFrom: [ 'author', 'contents' ],
          context: [ 'group', 'tree' ]
        },
        widget: {
          type: 'abstract'
        },
        window: {
          nameFrom: [ 'author' ],
          type: 'abstract'
        }
      };
      var color = {};
      commons.color = color;
      var dom = commons.dom = {};
      var table = commons.table = {};
      var text = commons.text = {
        EdgeFormDefaults: {}
      };
      var utils = commons.utils = axe.utils;
      aria.requiredAttr = function(role) {
        'use strict';
        var roles = aria.lookupTable.role[role], attr = roles && roles.attributes && roles.attributes.required;
        return attr || [];
      };
      aria.allowedAttr = function(role) {
        'use strict';
        var roles = aria.lookupTable.role[role], attr = roles && roles.attributes && roles.attributes.allowed || [], requiredAttr = roles && roles.attributes && roles.attributes.required || [];
        return attr.concat(aria.lookupTable.globalAttributes).concat(requiredAttr);
      };
      aria.validateAttr = function(att) {
        'use strict';
        return !!aria.lookupTable.attributes[att];
      };
      aria.validateAttrValue = function(node, attr) {
        'use strict';
        var matches, list, value = node.getAttribute(attr), attrInfo = aria.lookupTable.attributes[attr];
        var doc = dom.getRootNode(node);
        if (!attrInfo) {
          return true;
        }
        switch (attrInfo.type) {
         case 'boolean':
         case 'nmtoken':
          return typeof value === 'string' && attrInfo.values.indexOf(value.toLowerCase()) !== -1;

         case 'nmtokens':
          list = axe.utils.tokenList(value);
          return list.reduce(function(result, token) {
            return result && attrInfo.values.indexOf(token) !== -1;
          }, list.length !== 0);

         case 'idref':
          return !!(value && doc.getElementById(value));

         case 'idrefs':
          if (attrInfo.values && attrInfo.values.indexOf('') !== -1 && value.trim().length === 0) {
            return true;
          }
          list = axe.utils.tokenList(value);
          return list.reduce(function(result, token) {
            return !!(result && doc.getElementById(token));
          }, list.length !== 0);

         case 'string':
          return true;

         case 'decimal':
          matches = value.match(/^[-+]?([0-9]*)\.?([0-9]*)$/);
          return !!(matches && (matches[1] || matches[2]));

         case 'int':
          return /^[-+]?[0-9]+$/.test(value);
        }
      };
      aria.labelVirtual = function(_ref8) {
        var actualNode = _ref8.actualNode;
        var ref = void 0, candidate = void 0;
        if (actualNode.getAttribute('aria-labelledby')) {
          ref = dom.idrefs(actualNode, 'aria-labelledby');
          candidate = ref.map(function(thing) {
            var vNode = axe.utils.getNodeFromTree(axe._tree[0], thing);
            return vNode ? text.visibleVirtual(vNode, true) : '';
          }).join(' ').trim();
          if (candidate) {
            return candidate;
          }
        }
        candidate = actualNode.getAttribute('aria-label');
        if (candidate) {
          candidate = text.sanitize(candidate).trim();
          if (candidate) {
            return candidate;
          }
        }
        return null;
      };
      aria.label = function(node) {
        node = axe.utils.getNodeFromTree(axe._tree[0], node);
        return aria.labelVirtual(node);
      };
      aria.isValidRole = function(role) {
        'use strict';
        if (aria.lookupTable.role[role]) {
          return true;
        }
        return false;
      };
      aria.getRolesWithNameFromContents = function() {
        return Object.keys(aria.lookupTable.role).filter(function(r) {
          return aria.lookupTable.role[r].nameFrom && aria.lookupTable.role[r].nameFrom.indexOf('contents') !== -1;
        });
      };
      aria.getRolesByType = function(roleType) {
        return Object.keys(aria.lookupTable.role).filter(function(r) {
          return aria.lookupTable.role[r].type === roleType;
        });
      };
      aria.getRoleType = function(role) {
        var r = aria.lookupTable.role[role];
        return r && r.type || null;
      };
      aria.requiredOwned = function(role) {
        'use strict';
        var owned = null, roles = aria.lookupTable.role[role];
        if (roles) {
          owned = axe.utils.clone(roles.owned);
        }
        return owned;
      };
      aria.requiredContext = function(role) {
        'use strict';
        var context = null, roles = aria.lookupTable.role[role];
        if (roles) {
          context = axe.utils.clone(roles.context);
        }
        return context;
      };
      aria.implicitNodes = function(role) {
        'use strict';
        var implicit = null, roles = aria.lookupTable.role[role];
        if (roles && roles.implicit) {
          implicit = axe.utils.clone(roles.implicit);
        }
        return implicit;
      };
      aria.implicitRole = function(node) {
        'use strict';
        var isValidImplicitRole = function isValidImplicitRole(set, role) {
          var validForNodeType = function validForNodeType(implicitNodeTypeSelector) {
            return axe.utils.matchesSelector(node, implicitNodeTypeSelector);
          };
          if (role.implicit && role.implicit.some(validForNodeType)) {
            set.push(role.name);
          }
          return set;
        };
        var sortRolesByOptimalAriaContext = function sortRolesByOptimalAriaContext(roles, ariaAttributes) {
          var getScore = function getScore(role) {
            var allowedAriaAttributes = aria.allowedAttr(role);
            return allowedAriaAttributes.reduce(function(score, attribute) {
              return score + (ariaAttributes.indexOf(attribute) > -1 ? 1 : 0);
            }, 0);
          };
          var scored = roles.map(function(role) {
            return {
              score: getScore(role),
              name: role
            };
          });
          var sorted = scored.sort(function(scoredRoleA, scoredRoleB) {
            return scoredRoleB.score - scoredRoleA.score;
          });
          return sorted.map(function(sortedRole) {
            return sortedRole.name;
          });
        };
        var roles = Object.keys(aria.lookupTable.role).map(function(role) {
          var lookup = aria.lookupTable.role[role];
          return {
            name: role,
            implicit: lookup && lookup.implicit
          };
        });
        var availableImplicitRoles = roles.reduce(isValidImplicitRole, []);
        if (!availableImplicitRoles.length) {
          return null;
        }
        var nodeAttributes = node.attributes;
        var ariaAttributes = [];
        for (var i = 0, j = nodeAttributes.length; i < j; i++) {
          var attr = nodeAttributes[i];
          if (attr.name.match(/^aria-/)) {
            ariaAttributes.push(attr.name);
          }
        }
        return sortRolesByOptimalAriaContext(availableImplicitRoles, ariaAttributes).shift();
      };
      color.Color = function(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.toHexString = function() {
          var redString = Math.round(this.red).toString(16);
          var greenString = Math.round(this.green).toString(16);
          var blueString = Math.round(this.blue).toString(16);
          return '#' + (this.red > 15.5 ? redString : '0' + redString) + (this.green > 15.5 ? greenString : '0' + greenString) + (this.blue > 15.5 ? blueString : '0' + blueString);
        };
        var rgbRegex = /^rgb\((\d+), (\d+), (\d+)\)$/;
        var rgbaRegex = /^rgba\((\d+), (\d+), (\d+), (\d*(\.\d+)?)\)/;
        this.parseRgbString = function(colorString) {
          if (colorString === 'transparent') {
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.alpha = 0;
            return;
          }
          var match = colorString.match(rgbRegex);
          if (match) {
            this.red = parseInt(match[1], 10);
            this.green = parseInt(match[2], 10);
            this.blue = parseInt(match[3], 10);
            this.alpha = 1;
            return;
          }
          match = colorString.match(rgbaRegex);
          if (match) {
            this.red = parseInt(match[1], 10);
            this.green = parseInt(match[2], 10);
            this.blue = parseInt(match[3], 10);
            this.alpha = parseFloat(match[4]);
            return;
          }
        };
        this.getRelativeLuminance = function() {
          var rSRGB = this.red / 255;
          var gSRGB = this.green / 255;
          var bSRGB = this.blue / 255;
          var r = rSRGB <= .03928 ? rSRGB / 12.92 : Math.pow((rSRGB + .055) / 1.055, 2.4);
          var g = gSRGB <= .03928 ? gSRGB / 12.92 : Math.pow((gSRGB + .055) / 1.055, 2.4);
          var b = bSRGB <= .03928 ? bSRGB / 12.92 : Math.pow((bSRGB + .055) / 1.055, 2.4);
          return .2126 * r + .7152 * g + .0722 * b;
        };
      };
      color.flattenColors = function(fgColor, bgColor) {
        var alpha = fgColor.alpha;
        var r = (1 - alpha) * bgColor.red + alpha * fgColor.red;
        var g = (1 - alpha) * bgColor.green + alpha * fgColor.green;
        var b = (1 - alpha) * bgColor.blue + alpha * fgColor.blue;
        var a = fgColor.alpha + bgColor.alpha * (1 - fgColor.alpha);
        return new color.Color(r, g, b, a);
      };
      color.getContrast = function(bgColor, fgColor) {
        if (!fgColor || !bgColor) {
          return null;
        }
        if (fgColor.alpha < 1) {
          fgColor = color.flattenColors(fgColor, bgColor);
        }
        var bL = bgColor.getRelativeLuminance();
        var fL = fgColor.getRelativeLuminance();
        return (Math.max(fL, bL) + .05) / (Math.min(fL, bL) + .05);
      };
      color.hasValidContrastRatio = function(bg, fg, fontSize, isBold) {
        var contrast = color.getContrast(bg, fg);
        var isSmallFont = isBold && Math.ceil(fontSize * 72) / 96 < 14 || !isBold && Math.ceil(fontSize * 72) / 96 < 18;
        var expectedContrastRatio = isSmallFont ? 4.5 : 3;
        return {
          isValid: contrast > expectedContrastRatio,
          contrastRatio: contrast,
          expectedContrastRatio: expectedContrastRatio
        };
      };
      function _getFonts(style) {
        return style.getPropertyValue('font-family').split(/[,;]/g).map(function(font) {
          return font.trim().toLowerCase();
        });
      }
      function elementIsDistinct(node, ancestorNode) {
        var nodeStyle = window.getComputedStyle(node);
        if (nodeStyle.getPropertyValue('background-image') !== 'none') {
          return true;
        }
        var hasBorder = [ 'border-bottom', 'border-top', 'outline' ].reduce(function(result, edge) {
          var borderClr = new color.Color();
          borderClr.parseRgbString(nodeStyle.getPropertyValue(edge + '-color'));
          return result || nodeStyle.getPropertyValue(edge + '-style') !== 'none' && parseFloat(nodeStyle.getPropertyValue(edge + '-width')) > 0 && borderClr.alpha !== 0;
        }, false);
        if (hasBorder) {
          return true;
        }
        var parentStyle = window.getComputedStyle(ancestorNode);
        if (_getFonts(nodeStyle)[0] !== _getFonts(parentStyle)[0]) {
          return true;
        }
        var hasStyle = [ 'text-decoration-line', 'text-decoration-style', 'font-weight', 'font-style', 'font-size' ].reduce(function(result, cssProp) {
          return result || nodeStyle.getPropertyValue(cssProp) !== parentStyle.getPropertyValue(cssProp);
        }, false);
        var tDec = nodeStyle.getPropertyValue('text-decoration');
        if (tDec.split(' ').length < 3) {
          hasStyle = hasStyle || tDec !== parentStyle.getPropertyValue('text-decoration');
        }
        return hasStyle;
      }
      color.elementIsDistinct = elementIsDistinct;
      var graphicNodes = [ 'IMG', 'CANVAS', 'OBJECT', 'IFRAME', 'VIDEO', 'SVG' ];
      function elmHasImage(elm, style) {
        var nodeName = elm.nodeName.toUpperCase();
        if (graphicNodes.includes(nodeName)) {
          axe.commons.color.incompleteData.set('bgColor', 'imgNode');
          return true;
        }
        style = style || window.getComputedStyle(elm);
        var bgImageStyle = style.getPropertyValue('background-image');
        var hasBgImage = bgImageStyle !== 'none';
        if (hasBgImage) {
          var hasGradient = /gradient/.test(bgImageStyle);
          axe.commons.color.incompleteData.set('bgColor', hasGradient ? 'bgGradient' : 'bgImage');
        }
        return hasBgImage;
      }
      function getBgColor(elm, elmStyle) {
        elmStyle = elmStyle || window.getComputedStyle(elm);
        var bgColor = new color.Color();
        bgColor.parseRgbString(elmStyle.getPropertyValue('background-color'));
        if (bgColor.alpha !== 0) {
          var opacity = elmStyle.getPropertyValue('opacity');
          bgColor.alpha = bgColor.alpha * opacity;
        }
        return bgColor;
      }
      function contentOverlapping(targetElement, bgNode) {
        var targetRect = targetElement.getClientRects()[0];
        var obscuringElements = dom.shadowElementsFromPoint(targetRect.left, targetRect.top);
        if (obscuringElements) {
          for (var i = 0; i < obscuringElements.length; i++) {
            if (obscuringElements[i] !== targetElement && obscuringElements[i] === bgNode) {
              return true;
            }
          }
        }
        return false;
      }
      function calculateObscuringAlpha(elmIndex, elmStack, originalElm) {
        var totalAlpha = 0;
        if (elmIndex > 0) {
          for (var i = elmIndex - 1; i >= 0; i--) {
            var bgElm = elmStack[i];
            var bgElmStyle = window.getComputedStyle(bgElm);
            var bgColor = getBgColor(bgElm, bgElmStyle);
            if (bgColor.alpha && contentOverlapping(originalElm, bgElm)) {
              totalAlpha += bgColor.alpha;
            } else {
              elmStack.splice(i, 1);
            }
          }
        }
        return totalAlpha;
      }
      function elmPartiallyObscured(elm, bgElm, bgColor) {
        var obscured = elm !== bgElm && !dom.visuallyContains(elm, bgElm) && bgColor.alpha !== 0;
        if (obscured) {
          axe.commons.color.incompleteData.set('bgColor', 'elmPartiallyObscured');
        }
        return obscured;
      }
      function includeMissingElements(elmStack, elm) {
        var elementMap = {
          TD: [ 'TR', 'TBODY' ],
          TH: [ 'TR', 'THEAD' ],
          INPUT: [ 'LABEL' ]
        };
        var tagArray = elmStack.map(function(elm) {
          return elm.tagName;
        });
        var bgNodes = elmStack;
        for (var candidate in elementMap) {
          if (tagArray.includes(candidate)) {
            for (var candidateIndex in elementMap[candidate]) {
              if (candidate.hasOwnProperty(candidateIndex)) {
                var ancestorMatch = axe.commons.dom.findUp(elm, elementMap[candidate][candidateIndex]);
                if (ancestorMatch && elmStack.indexOf(ancestorMatch) === -1) {
                  var overlaps = axe.commons.dom.visuallyOverlaps(elm.getBoundingClientRect(), ancestorMatch);
                  if (overlaps) {
                    bgNodes.splice(tagArray.indexOf(candidate) + 1, 0, ancestorMatch);
                  }
                }
                if (elm.tagName === elementMap[candidate][candidateIndex] && tagArray.indexOf(elm.tagName) === -1) {
                  bgNodes.splice(tagArray.indexOf(candidate) + 1, 0, elm);
                }
              }
            }
          }
        }
        return bgNodes;
      }
      function sortPageBackground(elmStack) {
        var bodyIndex = elmStack.indexOf(document.body);
        var bgNodes = elmStack;
        if (bodyIndex > 1 && !elmHasImage(document.documentElement) && getBgColor(document.documentElement).alpha === 0) {
          bgNodes.splice(bodyIndex, 1);
          bgNodes.splice(elmStack.indexOf(document.documentElement), 1);
          bgNodes.push(document.body);
        }
        return bgNodes;
      }
      color.getCoords = function(rect) {
        var x = void 0, y = void 0;
        if (rect.left > window.innerWidth) {
          return;
        }
        if (rect.top > window.innerHeight) {
          return;
        }
        x = Math.min(Math.ceil(rect.left + rect.width / 2), window.innerWidth - 1);
        y = Math.min(Math.ceil(rect.top + rect.height / 2), window.innerHeight - 1);
        return {
          x: x,
          y: y
        };
      };
      color.getRectStack = function(elm) {
        var boundingCoords = color.getCoords(elm.getBoundingClientRect());
        if (boundingCoords) {
          var boundingStack = dom.shadowElementsFromPoint(boundingCoords.x, boundingCoords.y);
          var rects = Array.from(elm.getClientRects());
          if (rects && rects.length > 1) {
            var filteredArr = rects.filter(function(rect) {
              return rect.width && rect.width > 0;
            }).map(function(rect) {
              var coords = color.getCoords(rect);
              if (coords) {
                return dom.shadowElementsFromPoint(coords.x, coords.y);
              }
            });
            filteredArr.splice(0, 0, boundingStack);
            return filteredArr;
          } else {
            return [ boundingStack ];
          }
        }
        return null;
      };
      color.filteredRectStack = function(elm) {
        var rectStack = color.getRectStack(elm);
        if (rectStack && rectStack.length === 1) {
          return rectStack[0];
        } else if (rectStack && rectStack.length > 1) {
          var boundingStack = rectStack.shift();
          var isSame = void 0;
          rectStack.forEach(function(rectList, index) {
            if (index === 0) {
              return;
            }
            var rectA = rectStack[index - 1], rectB = rectStack[index];
            isSame = rectA.every(function(element, elementIndex) {
              return element === rectB[elementIndex];
            }) || boundingStack.includes(elm);
          });
          if (!isSame) {
            axe.commons.color.incompleteData.set('bgColor', 'elmPartiallyObscuring');
            return null;
          }
          return rectStack[0];
        } else {
          axe.commons.color.incompleteData.set('bgColor', 'outsideViewport');
          return null;
        }
      };
      color.getBackgroundStack = function(elm) {
        var elmStack = color.filteredRectStack(elm);
        if (elmStack === null) {
          return null;
        }
        elmStack = includeMissingElements(elmStack, elm);
        elmStack = dom.reduceToElementsBelowFloating(elmStack, elm);
        elmStack = sortPageBackground(elmStack);
        var elmIndex = elmStack.indexOf(elm);
        if (calculateObscuringAlpha(elmIndex, elmStack, elm) >= .99) {
          axe.commons.color.incompleteData.set('bgColor', 'bgOverlap');
          return null;
        }
        return elmIndex !== -1 ? elmStack : null;
      };
      color.getBackgroundColor = function(elm) {
        var bgElms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var noScroll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (noScroll !== true) {
          var alignToTop = elm.clientHeight - 2 >= window.innerHeight * 2;
          elm.scrollIntoView(alignToTop);
        }
        var bgColors = [];
        var elmStack = color.getBackgroundStack(elm);
        (elmStack || []).some(function(bgElm) {
          var bgElmStyle = window.getComputedStyle(bgElm);
          var bgColor = getBgColor(bgElm, bgElmStyle);
          if (elmPartiallyObscured(elm, bgElm, bgColor) || elmHasImage(bgElm, bgElmStyle)) {
            bgColors = null;
            bgElms.push(bgElm);
            return true;
          }
          if (bgColor.alpha !== 0) {
            bgElms.push(bgElm);
            bgColors.push(bgColor);
            return bgColor.alpha === 1;
          } else {
            return false;
          }
        });
        if (bgColors !== null && elmStack !== null) {
          bgColors.push(new color.Color(255, 255, 255, 1));
          var colors = bgColors.reduce(color.flattenColors);
          return colors;
        }
        return null;
      };
      dom.isOpaque = function(node) {
        var style = window.getComputedStyle(node);
        return elmHasImage(node, style) || getBgColor(node, style).alpha === 1;
      };
      color.getForegroundColor = function(node, noScroll) {
        var nodeStyle = window.getComputedStyle(node);
        var fgColor = new color.Color();
        fgColor.parseRgbString(nodeStyle.getPropertyValue('color'));
        var opacity = nodeStyle.getPropertyValue('opacity');
        fgColor.alpha = fgColor.alpha * opacity;
        if (fgColor.alpha === 1) {
          return fgColor;
        }
        var bgColor = color.getBackgroundColor(node, [], noScroll);
        if (bgColor === null) {
          var reason = axe.commons.color.incompleteData.get('bgColor');
          axe.commons.color.incompleteData.set('fgColor', reason);
          return null;
        }
        return color.flattenColors(fgColor, bgColor);
      };
      color.incompleteData = function() {
        var data = {};
        return {
          set: function set(key, reason) {
            if (typeof key !== 'string') {
              throw new Error('Incomplete data: key must be a string');
            }
            if (reason) {
              data[key] = reason;
            }
            return data[key];
          },
          get: function get(key) {
            return data[key];
          },
          clear: function clear() {
            data = {};
          }
        };
      }();
      dom.reduceToElementsBelowFloating = function(elements, targetNode) {
        var floatingPositions = [ 'fixed', 'sticky' ], finalElements = [], targetFound = false, index, currentNode, style;
        for (index = 0; index < elements.length; ++index) {
          currentNode = elements[index];
          if (currentNode === targetNode) {
            targetFound = true;
          }
          style = window.getComputedStyle(currentNode);
          if (!targetFound && floatingPositions.indexOf(style.position) !== -1) {
            finalElements = [];
            continue;
          }
          finalElements.push(currentNode);
        }
        return finalElements;
      };
      dom.findElmsInContext = function(_ref9) {
        var context = _ref9.context, value = _ref9.value, attr = _ref9.attr, _ref9$elm = _ref9.elm, elm = _ref9$elm === undefined ? '' : _ref9$elm;
        var root = void 0;
        var escapedValue = axe.utils.escapeSelector(value);
        if (context.nodeType === 9 || context.nodeType === 11) {
          root = context;
        } else {
          root = dom.getRootNode(context);
        }
        return Array.from(root.querySelectorAll(elm + '[' + attr + '=' + escapedValue + ']'));
      };
      dom.findUp = function(element, target) {
        return dom.findUpVirtual(axe.utils.getNodeFromTree(axe._tree[0], element), target);
      };
      dom.findUpVirtual = function(element, target) {
        var parent = void 0;
        parent = element.actualNode;
        if (!element.shadowId && typeof element.actualNode.closest === 'function') {
          var match = element.actualNode.closest(target);
          if (match) {
            return match;
          }
          return null;
        }
        do {
          parent = parent.assignedSlot ? parent.assignedSlot : parent.parentNode;
          if (parent && parent.nodeType === 11) {
            parent = parent.host;
          }
        } while (parent && !axe.utils.matchesSelector(parent, target) && parent !== document.documentElement);
        if (!axe.utils.matchesSelector(parent, target)) {
          return null;
        }
        return parent;
      };
      dom.getComposedParent = function getComposedParent(element) {
        if (element.assignedSlot) {
          return getComposedParent(element.assignedSlot);
        } else if (element.parentNode) {
          var parentNode = element.parentNode;
          if (parentNode.nodeType === 1) {
            return parentNode;
          } else if (parentNode.host) {
            return parentNode.host;
          }
        }
        return null;
      };
      dom.getElementByReference = function(node, attr) {
        var fragment = node.getAttribute(attr);
        if (fragment && fragment.charAt(0) === '#') {
          fragment = decodeURIComponent(fragment.substring(1));
          var candidate = document.getElementById(fragment);
          if (candidate) {
            return candidate;
          }
          candidate = document.getElementsByName(fragment);
          if (candidate.length) {
            return candidate[0];
          }
        }
        return null;
      };
      dom.getElementCoordinates = function(element) {
        'use strict';
        var scrollOffset = dom.getScrollOffset(document), xOffset = scrollOffset.left, yOffset = scrollOffset.top, coords = element.getBoundingClientRect();
        return {
          top: coords.top + yOffset,
          right: coords.right + xOffset,
          bottom: coords.bottom + yOffset,
          left: coords.left + xOffset,
          width: coords.right - coords.left,
          height: coords.bottom - coords.top
        };
      };
      dom.getRootNode = function(node) {
        var doc = node.getRootNode && node.getRootNode() || document;
        if (doc === node) {
          doc = document;
        }
        return doc;
      };
      dom.getScrollOffset = function(element) {
        'use strict';
        if (!element.nodeType && element.document) {
          element = element.document;
        }
        if (element.nodeType === 9) {
          var docElement = element.documentElement, body = element.body;
          return {
            left: docElement && docElement.scrollLeft || body && body.scrollLeft || 0,
            top: docElement && docElement.scrollTop || body && body.scrollTop || 0
          };
        }
        return {
          left: element.scrollLeft,
          top: element.scrollTop
        };
      };
      dom.getViewportSize = function(win) {
        'use strict';
        var body, doc = win.document, docElement = doc.documentElement;
        if (win.innerWidth) {
          return {
            width: win.innerWidth,
            height: win.innerHeight
          };
        }
        if (docElement) {
          return {
            width: docElement.clientWidth,
            height: docElement.clientHeight
          };
        }
        body = doc.body;
        return {
          width: body.clientWidth,
          height: body.clientHeight
        };
      };
      var hiddenTextElms = [ 'HEAD', 'TITLE', 'TEMPLATE', 'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'VIDEO', 'AUDIO', 'NOSCRIPT' ];
      function hasChildTextNodes(elm) {
        if (!hiddenTextElms.includes(elm.actualNode.nodeName.toUpperCase())) {
          return elm.children.some(function(_ref10) {
            var actualNode = _ref10.actualNode;
            return actualNode.nodeType === 3 && actualNode.nodeValue.trim();
          });
        }
      }
      dom.hasContentVirtual = function(elm, noRecursion) {
        return hasChildTextNodes(elm) || dom.isVisualContent(elm.actualNode) || !!aria.labelVirtual(elm) || !noRecursion && elm.children.some(function(child) {
          return child.actualNode.nodeType === 1 && dom.hasContentVirtual(child);
        });
      };
      dom.hasContent = function hasContent(elm, noRecursion) {
        elm = axe.utils.getNodeFromTree(axe._tree[0], elm);
        return dom.hasContentVirtual(elm, noRecursion);
      };
      dom.idrefs = function(node, attr) {
        'use strict';
        var index, length, doc = dom.getRootNode(node), result = [], idrefs = node.getAttribute(attr);
        if (idrefs) {
          idrefs = axe.utils.tokenList(idrefs);
          for (index = 0, length = idrefs.length; index < length; index++) {
            result.push(doc.getElementById(idrefs[index]));
          }
        }
        return result;
      };
      function focusDisabled(el) {
        return el.disabled || !dom.isVisible(el, true) && el.nodeName.toUpperCase() !== 'AREA';
      }
      dom.isFocusable = function(el) {
        'use strict';
        if (focusDisabled(el)) {
          return false;
        } else if (dom.isNativelyFocusable(el)) {
          return true;
        }
        var tabindex = el.getAttribute('tabindex');
        if (tabindex && !isNaN(parseInt(tabindex, 10))) {
          return true;
        }
        return false;
      };
      dom.isNativelyFocusable = function(el) {
        'use strict';
        if (!el || focusDisabled(el)) {
          return false;
        }
        switch (el.nodeName.toUpperCase()) {
         case 'A':
         case 'AREA':
          if (el.href) {
            return true;
          }
          break;

         case 'INPUT':
          return el.type !== 'hidden';

         case 'TEXTAREA':
         case 'SELECT':
         case 'DETAILS':
         case 'BUTTON':
          return true;
        }
        return false;
      };
      dom.insertedIntoFocusOrder = function(el) {
        return el.tabIndex > -1 && dom.isFocusable(el) && !dom.isNativelyFocusable(el);
      };
      dom.isHTML5 = function(doc) {
        var node = doc.doctype;
        if (node === null) {
          return false;
        }
        return node.name === 'html' && !node.publicId && !node.systemId;
      };
      function walkDomNode(node, functor) {
        if (functor(node.actualNode) !== false) {
          node.children.forEach(function(child) {
            return walkDomNode(child, functor);
          });
        }
      }
      var blockLike = [ 'block', 'list-item', 'table', 'flex', 'grid', 'inline-block' ];
      function isBlock(elm) {
        var display = window.getComputedStyle(elm).getPropertyValue('display');
        return blockLike.includes(display) || display.substr(0, 6) === 'table-';
      }
      function getBlockParent(node) {
        var parentBlock = dom.getComposedParent(node);
        while (parentBlock && !isBlock(parentBlock)) {
          parentBlock = dom.getComposedParent(parentBlock);
        }
        return axe.utils.getNodeFromTree(axe._tree[0], parentBlock);
      }
      dom.isInTextBlock = function isInTextBlock(node) {
        if (isBlock(node)) {
          return false;
        }
        var virtualParent = getBlockParent(node);
        var parentText = '';
        var linkText = '';
        var inBrBlock = 0;
        walkDomNode(virtualParent, function(currNode) {
          if (inBrBlock === 2) {
            return false;
          }
          if (currNode.nodeType === 3) {
            parentText += currNode.nodeValue;
          }
          if (currNode.nodeType !== 1) {
            return;
          }
          var nodeName = (currNode.nodeName || '').toUpperCase();
          if ([ 'BR', 'HR' ].includes(nodeName)) {
            if (inBrBlock === 0) {
              parentText = '';
              linkText = '';
            } else {
              inBrBlock = 2;
            }
          } else if (currNode.style.display === 'none' || currNode.style.overflow === 'hidden' || ![ '', null, 'none' ].includes(currNode.style.float) || ![ '', null, 'relative' ].includes(currNode.style.position)) {
            return false;
          } else if (nodeName === 'A' && currNode.href || (currNode.getAttribute('role') || '').toLowerCase() === 'link') {
            if (currNode === node) {
              inBrBlock = 1;
            }
            linkText += currNode.textContent;
            return false;
          }
        });
        parentText = axe.commons.text.sanitize(parentText);
        linkText = axe.commons.text.sanitize(linkText);
        return parentText.length > linkText.length;
      };
      dom.isNode = function(element) {
        'use strict';
        return element instanceof Node;
      };
      function noParentScrolled(element, offset) {
        element = dom.getComposedParent(element);
        while (element && element.nodeName.toLowerCase() !== 'html') {
          if (element.scrollTop) {
            offset += element.scrollTop;
            if (offset >= 0) {
              return false;
            }
          }
          element = dom.getComposedParent(element);
        }
        return true;
      }
      dom.isOffscreen = function(element) {
        var leftBoundary = void 0;
        var docElement = document.documentElement;
        var styl = window.getComputedStyle(element);
        var dir = window.getComputedStyle(document.body || docElement).getPropertyValue('direction');
        var coords = dom.getElementCoordinates(element);
        if (coords.bottom < 0 && (noParentScrolled(element, coords.bottom) || styl.position === 'absolute')) {
          return true;
        }
        if (coords.left === 0 && coords.right === 0) {
          return false;
        }
        if (dir === 'ltr') {
          if (coords.right <= 0) {
            return true;
          }
        } else {
          leftBoundary = Math.max(docElement.scrollWidth, dom.getViewportSize(window).width);
          if (coords.left >= leftBoundary) {
            return true;
          }
        }
        return false;
      };
      function isClipped(clip) {
        'use strict';
        var matches = clip.match(/rect\s*\(([0-9]+)px,?\s*([0-9]+)px,?\s*([0-9]+)px,?\s*([0-9]+)px\s*\)/);
        if (matches && matches.length === 5) {
          return matches[3] - matches[1] <= 0 && matches[2] - matches[4] <= 0;
        }
        return false;
      }
      dom.isVisible = function(el, screenReader, recursed) {
        'use strict';
        var style, nodeName, parent;
        if (el.nodeType === 9) {
          return true;
        }
        if (el.nodeType === 11) {
          el = el.host;
        }
        style = window.getComputedStyle(el, null);
        if (style === null) {
          return false;
        }
        nodeName = el.nodeName.toUpperCase();
        if (style.getPropertyValue('display') === 'none' || nodeName.toUpperCase() === 'STYLE' || nodeName.toUpperCase() === 'SCRIPT' || !screenReader && isClipped(style.getPropertyValue('clip')) || !recursed && (style.getPropertyValue('visibility') === 'hidden' || !screenReader && dom.isOffscreen(el)) || screenReader && el.getAttribute('aria-hidden') === 'true') {
          return false;
        }
        parent = el.assignedSlot ? el.assignedSlot : el.parentNode;
        if (parent) {
          return dom.isVisible(parent, screenReader, true);
        }
        return false;
      };
      var visualRoles = [ 'checkbox', 'img', 'radio', 'range', 'slider', 'spinbutton', 'textbox' ];
      dom.isVisualContent = function(element) {
        var role = element.getAttribute('role');
        if (role) {
          return visualRoles.indexOf(role) !== -1;
        }
        switch (element.tagName.toUpperCase()) {
         case 'IMG':
         case 'IFRAME':
         case 'OBJECT':
         case 'VIDEO':
         case 'AUDIO':
         case 'CANVAS':
         case 'SVG':
         case 'MATH':
         case 'BUTTON':
         case 'SELECT':
         case 'TEXTAREA':
         case 'KEYGEN':
         case 'PROGRESS':
         case 'METER':
          return true;

         case 'INPUT':
          return element.type !== 'hidden';

         default:
          return false;
        }
      };
      dom.shadowElementsFromPoint = function(nodeX, nodeY) {
        var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
        var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        if (i > 999) {
          throw new Error('Infinite loop detected');
        }
        return Array.from(root.elementsFromPoint(nodeX, nodeY)).filter(function(nodes) {
          return dom.getRootNode(nodes) === root;
        }).reduce(function(stack, elm) {
          if (axe.utils.isShadowRoot(elm)) {
            var shadowStack = dom.shadowElementsFromPoint(nodeX, nodeY, elm.shadowRoot, i + 1);
            stack = stack.concat(shadowStack);
            if (stack.length && axe.commons.dom.visuallyContains(stack[0], elm)) {
              stack.push(elm);
            }
          } else {
            stack.push(elm);
          }
          return stack;
        }, []);
      };
      dom.visuallyContains = function(node, parent) {
        var rectBound = node.getBoundingClientRect();
        var margin = .01;
        var rect = {
          top: rectBound.top + margin,
          bottom: rectBound.bottom - margin,
          left: rectBound.left + margin,
          right: rectBound.right - margin
        };
        var parentRect = parent.getBoundingClientRect();
        var parentTop = parentRect.top;
        var parentLeft = parentRect.left;
        var parentScrollArea = {
          top: parentTop - parent.scrollTop,
          bottom: parentTop - parent.scrollTop + parent.scrollHeight,
          left: parentLeft - parent.scrollLeft,
          right: parentLeft - parent.scrollLeft + parent.scrollWidth
        };
        var style = window.getComputedStyle(parent);
        if (style.getPropertyValue('display') === 'inline') {
          return true;
        }
        if (rect.left < parentScrollArea.left && rect.left < parentRect.left || rect.top < parentScrollArea.top && rect.top < parentRect.top || rect.right > parentScrollArea.right && rect.right > parentRect.right || rect.bottom > parentScrollArea.bottom && rect.bottom > parentRect.bottom) {
          return false;
        }
        if (rect.right > parentRect.right || rect.bottom > parentRect.bottom) {
          return style.overflow === 'scroll' || style.overflow === 'auto' || style.overflow === 'hidden' || parent instanceof HTMLBodyElement || parent instanceof HTMLHtmlElement;
        }
        return true;
      };
      dom.visuallyOverlaps = function(rect, parent) {
        var parentRect = parent.getBoundingClientRect();
        var parentTop = parentRect.top;
        var parentLeft = parentRect.left;
        var parentScrollArea = {
          top: parentTop - parent.scrollTop,
          bottom: parentTop - parent.scrollTop + parent.scrollHeight,
          left: parentLeft - parent.scrollLeft,
          right: parentLeft - parent.scrollLeft + parent.scrollWidth
        };
        if (rect.left > parentScrollArea.right && rect.left > parentRect.right || rect.top > parentScrollArea.bottom && rect.top > parentRect.bottom || rect.right < parentScrollArea.left && rect.right < parentRect.left || rect.bottom < parentScrollArea.top && rect.bottom < parentRect.top) {
          return false;
        }
        var style = window.getComputedStyle(parent);
        if (rect.left > parentRect.right || rect.top > parentRect.bottom) {
          return style.overflow === 'scroll' || style.overflow === 'auto' || parent instanceof HTMLBodyElement || parent instanceof HTMLHtmlElement;
        }
        return true;
      };
      table.getAllCells = function(tableElm) {
        var rowIndex, cellIndex, rowLength, cellLength;
        var cells = [];
        for (rowIndex = 0, rowLength = tableElm.rows.length; rowIndex < rowLength; rowIndex++) {
          for (cellIndex = 0, cellLength = tableElm.rows[rowIndex].cells.length; cellIndex < cellLength; cellIndex++) {
            cells.push(tableElm.rows[rowIndex].cells[cellIndex]);
          }
        }
        return cells;
      };
      table.getCellPosition = function(cell, tableGrid) {
        var rowIndex, index;
        if (!tableGrid) {
          tableGrid = table.toGrid(dom.findUp(cell, 'table'));
        }
        for (rowIndex = 0; rowIndex < tableGrid.length; rowIndex++) {
          if (tableGrid[rowIndex]) {
            index = tableGrid[rowIndex].indexOf(cell);
            if (index !== -1) {
              return {
                x: index,
                y: rowIndex
              };
            }
          }
        }
      };
      table.getHeaders = function(cell) {
        if (cell.hasAttribute('headers')) {
          return commons.dom.idrefs(cell, 'headers');
        }
        var tableGrid = commons.table.toGrid(commons.dom.findUp(cell, 'table'));
        var position = commons.table.getCellPosition(cell, tableGrid);
        var rowHeaders = table.traverse('left', position, tableGrid).filter(function(cell) {
          return table.isRowHeader(cell);
        });
        var colHeaders = table.traverse('up', position, tableGrid).filter(function(cell) {
          return table.isColumnHeader(cell);
        });
        return [].concat(rowHeaders, colHeaders).reverse();
      };
      table.getScope = function(cell) {
        var scope = cell.getAttribute('scope');
        var role = cell.getAttribute('role');
        if (cell instanceof Element === false || [ 'TD', 'TH' ].indexOf(cell.nodeName.toUpperCase()) === -1) {
          throw new TypeError('Expected TD or TH element');
        }
        if (role === 'columnheader') {
          return 'col';
        } else if (role === 'rowheader') {
          return 'row';
        } else if (scope === 'col' || scope === 'row') {
          return scope;
        } else if (cell.nodeName.toUpperCase() !== 'TH') {
          return false;
        }
        var tableGrid = table.toGrid(dom.findUp(cell, 'table'));
        var pos = table.getCellPosition(cell);
        var headerRow = tableGrid[pos.y].reduce(function(headerRow, cell) {
          return headerRow && cell.nodeName.toUpperCase() === 'TH';
        }, true);
        if (headerRow) {
          return 'col';
        }
        var headerCol = tableGrid.map(function(col) {
          return col[pos.x];
        }).reduce(function(headerCol, cell) {
          return headerCol && cell.nodeName.toUpperCase() === 'TH';
        }, true);
        if (headerCol) {
          return 'row';
        }
        return 'auto';
      };
      table.isColumnHeader = function(element) {
        return [ 'col', 'auto' ].indexOf(table.getScope(element)) !== -1;
      };
      table.isDataCell = function(cell) {
        if (!cell.children.length && !cell.textContent.trim()) {
          return false;
        }
        return cell.nodeName.toUpperCase() === 'TD';
      };
      table.isDataTable = function(node) {
        var role = (node.getAttribute('role') || '').toLowerCase();
        if ((role === 'presentation' || role === 'none') && !dom.isFocusable(node)) {
          return false;
        }
        if (node.getAttribute('contenteditable') === 'true' || dom.findUp(node, '[contenteditable="true"]')) {
          return true;
        }
        if (role === 'grid' || role === 'treegrid' || role === 'table') {
          return true;
        }
        if (commons.aria.getRoleType(role) === 'landmark') {
          return true;
        }
        if (node.getAttribute('datatable') === '0') {
          return false;
        }
        if (node.getAttribute('summary')) {
          return true;
        }
        if (node.tHead || node.tFoot || node.caption) {
          return true;
        }
        for (var childIndex = 0, childLength = node.children.length; childIndex < childLength; childIndex++) {
          if (node.children[childIndex].nodeName.toUpperCase() === 'COLGROUP') {
            return true;
          }
        }
        var cells = 0;
        var rowLength = node.rows.length;
        var row, cell;
        var hasBorder = false;
        for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
          row = node.rows[rowIndex];
          for (var cellIndex = 0, cellLength = row.cells.length; cellIndex < cellLength; cellIndex++) {
            cell = row.cells[cellIndex];
            if (cell.nodeName.toUpperCase() === 'TH') {
              return true;
            }
            if (!hasBorder && (cell.offsetWidth !== cell.clientWidth || cell.offsetHeight !== cell.clientHeight)) {
              hasBorder = true;
            }
            if (cell.getAttribute('scope') || cell.getAttribute('headers') || cell.getAttribute('abbr')) {
              return true;
            }
            if ([ 'columnheader', 'rowheader' ].includes((cell.getAttribute('role') || '').toLowerCase())) {
              return true;
            }
            if (cell.children.length === 1 && cell.children[0].nodeName.toUpperCase() === 'ABBR') {
              return true;
            }
            cells++;
          }
        }
        if (node.getElementsByTagName('table').length) {
          return false;
        }
        if (rowLength < 2) {
          return false;
        }
        var sampleRow = node.rows[Math.ceil(rowLength / 2)];
        if (sampleRow.cells.length === 1 && sampleRow.cells[0].colSpan === 1) {
          return false;
        }
        if (sampleRow.cells.length >= 5) {
          return true;
        }
        if (hasBorder) {
          return true;
        }
        var bgColor, bgImage;
        for (rowIndex = 0; rowIndex < rowLength; rowIndex++) {
          row = node.rows[rowIndex];
          if (bgColor && bgColor !== window.getComputedStyle(row).getPropertyValue('background-color')) {
            return true;
          } else {
            bgColor = window.getComputedStyle(row).getPropertyValue('background-color');
          }
          if (bgImage && bgImage !== window.getComputedStyle(row).getPropertyValue('background-image')) {
            return true;
          } else {
            bgImage = window.getComputedStyle(row).getPropertyValue('background-image');
          }
        }
        if (rowLength >= 20) {
          return true;
        }
        if (dom.getElementCoordinates(node).width > dom.getViewportSize(window).width * .95) {
          return false;
        }
        if (cells < 10) {
          return false;
        }
        if (node.querySelector('object, embed, iframe, applet')) {
          return false;
        }
        return true;
      };
      table.isHeader = function(cell) {
        if (table.isColumnHeader(cell) || table.isRowHeader(cell)) {
          return true;
        }
        if (cell.getAttribute('id')) {
          var id = axe.utils.escapeSelector(cell.getAttribute('id'));
          return !!document.querySelector('[headers~="' + id + '"]');
        }
        return false;
      };
      table.isRowHeader = function(cell) {
        return [ 'row', 'auto' ].includes(table.getScope(cell));
      };
      table.toGrid = function(node) {
        var table = [];
        var rows = node.rows;
        for (var i = 0, rowLength = rows.length; i < rowLength; i++) {
          var cells = rows[i].cells;
          table[i] = table[i] || [];
          var columnIndex = 0;
          for (var j = 0, cellLength = cells.length; j < cellLength; j++) {
            for (var colSpan = 0; colSpan < cells[j].colSpan; colSpan++) {
              for (var rowSpan = 0; rowSpan < cells[j].rowSpan; rowSpan++) {
                table[i + rowSpan] = table[i + rowSpan] || [];
                while (table[i + rowSpan][columnIndex]) {
                  columnIndex++;
                }
                table[i + rowSpan][columnIndex] = cells[j];
              }
              columnIndex++;
            }
          }
        }
        return table;
      };
      table.toArray = table.toGrid;
      (function(table) {
        var traverseTable = function traverseTable(dir, position, tableGrid, callback) {
          var result;
          var cell = tableGrid[position.y] ? tableGrid[position.y][position.x] : undefined;
          if (!cell) {
            return [];
          }
          if (typeof callback === 'function') {
            result = callback(cell, position, tableGrid);
            if (result === true) {
              return [ cell ];
            }
          }
          result = traverseTable(dir, {
            x: position.x + dir.x,
            y: position.y + dir.y
          }, tableGrid, callback);
          result.unshift(cell);
          return result;
        };
        table.traverse = function(dir, startPos, tableGrid, callback) {
          if (Array.isArray(startPos)) {
            callback = tableGrid;
            tableGrid = startPos;
            startPos = {
              x: 0,
              y: 0
            };
          }
          if (typeof dir === 'string') {
            switch (dir) {
             case 'left':
              dir = {
                x: -1,
                y: 0
              };
              break;

             case 'up':
              dir = {
                x: 0,
                y: -1
              };
              break;

             case 'right':
              dir = {
                x: 1,
                y: 0
              };
              break;

             case 'down':
              dir = {
                x: 0,
                y: 1
              };
              break;
            }
          }
          return traverseTable(dir, {
            x: startPos.x + dir.x,
            y: startPos.y + dir.y
          }, tableGrid, callback);
        };
      })(table);
      var defaultButtonValues = {
        submit: 'Submit',
        reset: 'Reset'
      };
      var inputTypes = [ 'text', 'search', 'tel', 'url', 'email', 'date', 'time', 'number', 'range', 'color' ];
      var phrasingElements = [ 'A', 'EM', 'STRONG', 'SMALL', 'MARK', 'ABBR', 'DFN', 'I', 'B', 'S', 'U', 'CODE', 'VAR', 'SAMP', 'KBD', 'SUP', 'SUB', 'Q', 'CITE', 'SPAN', 'BDO', 'BDI', 'BR', 'WBR', 'INS', 'DEL', 'IMG', 'EMBED', 'OBJECT', 'IFRAME', 'MAP', 'AREA', 'SCRIPT', 'NOSCRIPT', 'RUBY', 'VIDEO', 'AUDIO', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'LABEL', 'OUTPUT', 'DATALIST', 'KEYGEN', 'PROGRESS', 'COMMAND', 'CANVAS', 'TIME', 'METER' ];
      function findLabel(virtualNode) {
        var label = void 0;
        if (virtualNode.actualNode.id) {
          label = dom.findElmsInContext({
            elm: 'label',
            attr: 'for',
            value: virtualNode.actualNode.id,
            context: virtualNode.actualNode
          })[0];
        } else {
          label = dom.findUpVirtual(virtualNode, 'label');
        }
        return axe.utils.getNodeFromTree(axe._tree[0], label);
      }
      function isButton(_ref11) {
        var actualNode = _ref11.actualNode;
        return [ 'button', 'reset', 'submit' ].includes(actualNode.type.toLowerCase());
      }
      function isInput(_ref12) {
        var actualNode = _ref12.actualNode;
        var nodeName = actualNode.nodeName.toUpperCase();
        return nodeName === 'TEXTAREA' || nodeName === 'SELECT' || nodeName === 'INPUT' && actualNode.type.toLowerCase() !== 'hidden';
      }
      function shouldCheckSubtree(_ref13) {
        var actualNode = _ref13.actualNode;
        return [ 'BUTTON', 'SUMMARY', 'A' ].includes(actualNode.nodeName.toUpperCase());
      }
      function shouldNeverCheckSubtree(_ref14) {
        var actualNode = _ref14.actualNode;
        return [ 'TABLE', 'FIGURE' ].includes(actualNode.nodeName.toUpperCase());
      }
      function formValueText(_ref15) {
        var actualNode = _ref15.actualNode;
        var nodeName = actualNode.nodeName.toUpperCase();
        if (nodeName === 'INPUT') {
          if (!actualNode.hasAttribute('type') || inputTypes.includes(actualNode.type.toLowerCase())) {
            return actualNode.value;
          }
          return '';
        }
        if (nodeName === 'SELECT') {
          var opts = actualNode.options;
          if (opts && opts.length) {
            var returnText = '';
            for (var i = 0; i < opts.length; i++) {
              if (opts[i].selected) {
                returnText += ' ' + opts[i].text;
              }
            }
            return text.sanitize(returnText);
          }
          return '';
        }
        if (nodeName === 'TEXTAREA' && actualNode.value) {
          return actualNode.value;
        }
        return '';
      }
      function checkDescendant(_ref16, nodeName) {
        var actualNode = _ref16.actualNode;
        var candidate = actualNode.querySelector(nodeName.toLowerCase());
        if (candidate) {
          return text.accessibleText(candidate);
        }
        return '';
      }
      function isEmbeddedControl(elm) {
        if (!elm) {
          return false;
        }
        var actualNode = elm.actualNode;
        switch (actualNode.nodeName.toUpperCase()) {
         case 'SELECT':
         case 'TEXTAREA':
          return true;

         case 'INPUT':
          return !actualNode.hasAttribute('type') || inputTypes.includes(actualNode.getAttribute('type').toLowerCase());

         default:
          return false;
        }
      }
      function shouldCheckAlt(_ref17) {
        var actualNode = _ref17.actualNode;
        var nodeName = actualNode.nodeName.toUpperCase();
        return [ 'IMG', 'APPLET', 'AREA' ].includes(nodeName) || nodeName === 'INPUT' && actualNode.type.toLowerCase() === 'image';
      }
      function nonEmptyText(t) {
        return !!text.sanitize(t);
      }
      text.accessibleText = function accessibleText(element, inLabelledByContext) {
        var virtualNode = axe.utils.getNodeFromTree(axe._tree[0], element);
        return axe.commons.text.accessibleTextVirtual(virtualNode, inLabelledByContext);
      };
      text.accessibleTextVirtual = function accessibleTextVirtual(element, inLabelledByContext) {
        var accessibleNameComputation = void 0;
        var encounteredNodes = [];
        if (element instanceof Node) {
          element = axe.utils.getNodeFromTree(axe._tree[0], element);
        }
        function getInnerText(element, inLabelledByContext, inControlContext) {
          return element.children.reduce(function(returnText, child) {
            var actualNode = child.actualNode;
            if (actualNode.nodeType === 3) {
              returnText += actualNode.nodeValue;
            } else if (actualNode.nodeType === 1) {
              if (!phrasingElements.includes(actualNode.nodeName.toUpperCase())) {
                returnText += ' ';
              }
              returnText += accessibleNameComputation(child, inLabelledByContext, inControlContext);
            }
            return returnText;
          }, '');
        }
        function getLayoutTableText(element) {
          if (!axe.commons.table.isDataTable(element.actualNode) && axe.commons.table.getAllCells(element.actualNode).length === 1) {
            return getInnerText(element, false, false).trim();
          }
          return '';
        }
        function checkNative(element, inLabelledByContext, inControlContext) {
          var returnText = '';
          var actualNode = element.actualNode;
          var nodeName = actualNode.nodeName.toUpperCase();
          if (shouldCheckSubtree(element)) {
            returnText = getInnerText(element, false, false) || '';
            if (nonEmptyText(returnText)) {
              return returnText;
            }
          }
          if (nodeName === 'FIGURE') {
            returnText = checkDescendant(element, 'figcaption');
            if (nonEmptyText(returnText)) {
              return returnText;
            }
          }
          if (nodeName === 'TABLE') {
            returnText = checkDescendant(element, 'caption');
            if (nonEmptyText(returnText)) {
              return returnText;
            }
            returnText = actualNode.getAttribute('title') || actualNode.getAttribute('summary') || getLayoutTableText(element) || '';
            if (nonEmptyText(returnText)) {
              return returnText;
            }
          }
          if (shouldCheckAlt(element)) {
            return actualNode.getAttribute('alt') || '';
          }
          if (isInput(element) && !inControlContext) {
            if (isButton(element)) {
              return actualNode.value || actualNode.title || defaultButtonValues[actualNode.type] || '';
            }
            var labelElement = findLabel(element);
            if (labelElement) {
              return accessibleNameComputation(labelElement, inLabelledByContext, true);
            }
          }
          return '';
        }
        function checkARIA(element, inLabelledByContext, inControlContext) {
          var returnText = '';
          var actualNode = element.actualNode;
          if (!inLabelledByContext && actualNode.hasAttribute('aria-labelledby')) {
            returnText = text.sanitize(dom.idrefs(actualNode, 'aria-labelledby').map(function(label) {
              if (label !== null) {
                if (actualNode === label) {
                  encounteredNodes.pop();
                }
                var vLabel = axe.utils.getNodeFromTree(axe._tree[0], label);
                return accessibleNameComputation(vLabel, true, actualNode !== label);
              } else {
                return '';
              }
            }).join(' '));
          }
          if (!returnText && !(inControlContext && isEmbeddedControl(element)) && actualNode.hasAttribute('aria-label')) {
            return text.sanitize(actualNode.getAttribute('aria-label'));
          }
          return returnText;
        }
        accessibleNameComputation = function accessibleNameComputation(element, inLabelledByContext, inControlContext) {
          var returnText = void 0;
          if (!element || encounteredNodes.includes(element)) {
            return '';
          } else if (element !== null && element.actualNode instanceof Node !== true) {
            throw new Error('Invalid argument. Virtual Node must be provided');
          } else if (!inLabelledByContext && !dom.isVisible(element.actualNode, true)) {
            return '';
          }
          encounteredNodes.push(element);
          var role = element.actualNode.getAttribute('role');
          returnText = checkARIA(element, inLabelledByContext, inControlContext);
          if (nonEmptyText(returnText)) {
            return returnText;
          }
          returnText = checkNative(element, inLabelledByContext, inControlContext);
          if (nonEmptyText(returnText)) {
            return returnText;
          }
          if (inControlContext) {
            returnText = formValueText(element);
            if (nonEmptyText(returnText)) {
              return returnText;
            }
          }
          if (!shouldNeverCheckSubtree(element) && (!role || aria.getRolesWithNameFromContents().indexOf(role) !== -1)) {
            returnText = getInnerText(element, inLabelledByContext, inControlContext);
            if (nonEmptyText(returnText)) {
              return returnText;
            }
          }
          if (element.actualNode.hasAttribute('title')) {
            return element.actualNode.getAttribute('title');
          }
          return '';
        };
        return text.sanitize(accessibleNameComputation(element, inLabelledByContext));
      };
      text.labelVirtual = function(node) {
        var ref, candidate, doc;
        candidate = aria.labelVirtual(node);
        if (candidate) {
          return candidate;
        }
        if (node.actualNode.id) {
          var id = axe.commons.utils.escapeSelector(node.actualNode.getAttribute('id'));
          doc = axe.commons.dom.getRootNode(node.actualNode);
          ref = doc.querySelector('label[for="' + id + '"]');
          candidate = ref && text.visible(ref, true);
          if (candidate) {
            return candidate;
          }
        }
        ref = dom.findUpVirtual(node, 'label');
        candidate = ref && text.visible(ref, true);
        if (candidate) {
          return candidate;
        }
        return null;
      };
      text.label = function(node) {
        node = axe.utils.getNodeFromTree(axe._tree[0], node);
        return text.labelVirtual(node);
      };
      text.sanitize = function(str) {
        'use strict';
        return str.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ').replace(/[\s]{2,}/g, ' ').trim();
      };
      text.visibleVirtual = function(element, screenReader, noRecursing) {
        var result = element.children.map(function(child) {
          if (child.actualNode.nodeType === 3) {
            var nodeValue = child.actualNode.nodeValue;
            if (nodeValue && dom.isVisible(element.actualNode, screenReader)) {
              return nodeValue;
            }
          } else if (!noRecursing) {
            return text.visibleVirtual(child, screenReader);
          }
        }).join('');
        return text.sanitize(result);
      };
      text.visible = function(element, screenReader, noRecursing) {
        element = axe.utils.getNodeFromTree(axe._tree[0], element);
        return text.visibleVirtual(element, screenReader, noRecursing);
      };
      axe.utils.tokenList = function(str) {
        'use strict';
        return str.trim().replace(/\s{2,}/g, ' ').split(' ');
      };
      var langs = [ 'aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'in', 'io', 'is', 'it', 'iu', 'iw', 'ja', 'ji', 'jv', 'jw', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu', 'aaa', 'aab', 'aac', 'aad', 'aae', 'aaf', 'aag', 'aah', 'aai', 'aak', 'aal', 'aam', 'aan', 'aao', 'aap', 'aaq', 'aas', 'aat', 'aau', 'aav', 'aaw', 'aax', 'aaz', 'aba', 'abb', 'abc', 'abd', 'abe', 'abf', 'abg', 'abh', 'abi', 'abj', 'abl', 'abm', 'abn', 'abo', 'abp', 'abq', 'abr', 'abs', 'abt', 'abu', 'abv', 'abw', 'abx', 'aby', 'abz', 'aca', 'acb', 'acd', 'ace', 'acf', 'ach', 'aci', 'ack', 'acl', 'acm', 'acn', 'acp', 'acq', 'acr', 'acs', 'act', 'acu', 'acv', 'acw', 'acx', 'acy', 'acz', 'ada', 'adb', 'add', 'ade', 'adf', 'adg', 'adh', 'adi', 'adj', 'adl', 'adn', 'ado', 'adp', 'adq', 'adr', 'ads', 'adt', 'adu', 'adw', 'adx', 'ady', 'adz', 'aea', 'aeb', 'aec', 'aed', 'aee', 'aek', 'ael', 'aem', 'aen', 'aeq', 'aer', 'aes', 'aeu', 'aew', 'aey', 'aez', 'afa', 'afb', 'afd', 'afe', 'afg', 'afh', 'afi', 'afk', 'afn', 'afo', 'afp', 'afs', 'aft', 'afu', 'afz', 'aga', 'agb', 'agc', 'agd', 'age', 'agf', 'agg', 'agh', 'agi', 'agj', 'agk', 'agl', 'agm', 'agn', 'ago', 'agp', 'agq', 'agr', 'ags', 'agt', 'agu', 'agv', 'agw', 'agx', 'agy', 'agz', 'aha', 'ahb', 'ahg', 'ahh', 'ahi', 'ahk', 'ahl', 'ahm', 'ahn', 'aho', 'ahp', 'ahr', 'ahs', 'aht', 'aia', 'aib', 'aic', 'aid', 'aie', 'aif', 'aig', 'aih', 'aii', 'aij', 'aik', 'ail', 'aim', 'ain', 'aio', 'aip', 'aiq', 'air', 'ais', 'ait', 'aiw', 'aix', 'aiy', 'aja', 'ajg', 'aji', 'ajn', 'ajp', 'ajt', 'aju', 'ajw', 'ajz', 'akb', 'akc', 'akd', 'ake', 'akf', 'akg', 'akh', 'aki', 'akj', 'akk', 'akl', 'akm', 'ako', 'akp', 'akq', 'akr', 'aks', 'akt', 'aku', 'akv', 'akw', 'akx', 'aky', 'akz', 'ala', 'alc', 'ald', 'ale', 'alf', 'alg', 'alh', 'ali', 'alj', 'alk', 'all', 'alm', 'aln', 'alo', 'alp', 'alq', 'alr', 'als', 'alt', 'alu', 'alv', 'alw', 'alx', 'aly', 'alz', 'ama', 'amb', 'amc', 'ame', 'amf', 'amg', 'ami', 'amj', 'amk', 'aml', 'amm', 'amn', 'amo', 'amp', 'amq', 'amr', 'ams', 'amt', 'amu', 'amv', 'amw', 'amx', 'amy', 'amz', 'ana', 'anb', 'anc', 'and', 'ane', 'anf', 'ang', 'anh', 'ani', 'anj', 'ank', 'anl', 'anm', 'ann', 'ano', 'anp', 'anq', 'anr', 'ans', 'ant', 'anu', 'anv', 'anw', 'anx', 'any', 'anz', 'aoa', 'aob', 'aoc', 'aod', 'aoe', 'aof', 'aog', 'aoh', 'aoi', 'aoj', 'aok', 'aol', 'aom', 'aon', 'aor', 'aos', 'aot', 'aou', 'aox', 'aoz', 'apa', 'apb', 'apc', 'apd', 'ape', 'apf', 'apg', 'aph', 'api', 'apj', 'apk', 'apl', 'apm', 'apn', 'apo', 'app', 'apq', 'apr', 'aps', 'apt', 'apu', 'apv', 'apw', 'apx', 'apy', 'apz', 'aqa', 'aqc', 'aqd', 'aqg', 'aql', 'aqm', 'aqn', 'aqp', 'aqr', 'aqt', 'aqz', 'arb', 'arc', 'ard', 'are', 'arh', 'ari', 'arj', 'ark', 'arl', 'arn', 'aro', 'arp', 'arq', 'arr', 'ars', 'art', 'aru', 'arv', 'arw', 'arx', 'ary', 'arz', 'asa', 'asb', 'asc', 'asd', 'ase', 'asf', 'asg', 'ash', 'asi', 'asj', 'ask', 'asl', 'asn', 'aso', 'asp', 'asq', 'asr', 'ass', 'ast', 'asu', 'asv', 'asw', 'asx', 'asy', 'asz', 'ata', 'atb', 'atc', 'atd', 'ate', 'atg', 'ath', 'ati', 'atj', 'atk', 'atl', 'atm', 'atn', 'ato', 'atp', 'atq', 'atr', 'ats', 'att', 'atu', 'atv', 'atw', 'atx', 'aty', 'atz', 'aua', 'aub', 'auc', 'aud', 'aue', 'auf', 'aug', 'auh', 'aui', 'auj', 'auk', 'aul', 'aum', 'aun', 'auo', 'aup', 'auq', 'aur', 'aus', 'aut', 'auu', 'auw', 'aux', 'auy', 'auz', 'avb', 'avd', 'avi', 'avk', 'avl', 'avm', 'avn', 'avo', 'avs', 'avt', 'avu', 'avv', 'awa', 'awb', 'awc', 'awd', 'awe', 'awg', 'awh', 'awi', 'awk', 'awm', 'awn', 'awo', 'awr', 'aws', 'awt', 'awu', 'awv', 'aww', 'awx', 'awy', 'axb', 'axe', 'axg', 'axk', 'axl', 'axm', 'axx', 'aya', 'ayb', 'ayc', 'ayd', 'aye', 'ayg', 'ayh', 'ayi', 'ayk', 'ayl', 'ayn', 'ayo', 'ayp', 'ayq', 'ayr', 'ays', 'ayt', 'ayu', 'ayx', 'ayy', 'ayz', 'aza', 'azb', 'azc', 'azd', 'azg', 'azj', 'azm', 'azn', 'azo', 'azt', 'azz', 'baa', 'bab', 'bac', 'bad', 'bae', 'baf', 'bag', 'bah', 'bai', 'baj', 'bal', 'ban', 'bao', 'bap', 'bar', 'bas', 'bat', 'bau', 'bav', 'baw', 'bax', 'bay', 'baz', 'bba', 'bbb', 'bbc', 'bbd', 'bbe', 'bbf', 'bbg', 'bbh', 'bbi', 'bbj', 'bbk', 'bbl', 'bbm', 'bbn', 'bbo', 'bbp', 'bbq', 'bbr', 'bbs', 'bbt', 'bbu', 'bbv', 'bbw', 'bbx', 'bby', 'bbz', 'bca', 'bcb', 'bcc', 'bcd', 'bce', 'bcf', 'bcg', 'bch', 'bci', 'bcj', 'bck', 'bcl', 'bcm', 'bcn', 'bco', 'bcp', 'bcq', 'bcr', 'bcs', 'bct', 'bcu', 'bcv', 'bcw', 'bcy', 'bcz', 'bda', 'bdb', 'bdc', 'bdd', 'bde', 'bdf', 'bdg', 'bdh', 'bdi', 'bdj', 'bdk', 'bdl', 'bdm', 'bdn', 'bdo', 'bdp', 'bdq', 'bdr', 'bds', 'bdt', 'bdu', 'bdv', 'bdw', 'bdx', 'bdy', 'bdz', 'bea', 'beb', 'bec', 'bed', 'bee', 'bef', 'beg', 'beh', 'bei', 'bej', 'bek', 'bem', 'beo', 'bep', 'beq', 'ber', 'bes', 'bet', 'beu', 'bev', 'bew', 'bex', 'bey', 'bez', 'bfa', 'bfb', 'bfc', 'bfd', 'bfe', 'bff', 'bfg', 'bfh', 'bfi', 'bfj', 'bfk', 'bfl', 'bfm', 'bfn', 'bfo', 'bfp', 'bfq', 'bfr', 'bfs', 'bft', 'bfu', 'bfw', 'bfx', 'bfy', 'bfz', 'bga', 'bgb', 'bgc', 'bgd', 'bge', 'bgf', 'bgg', 'bgi', 'bgj', 'bgk', 'bgl', 'bgm', 'bgn', 'bgo', 'bgp', 'bgq', 'bgr', 'bgs', 'bgt', 'bgu', 'bgv', 'bgw', 'bgx', 'bgy', 'bgz', 'bha', 'bhb', 'bhc', 'bhd', 'bhe', 'bhf', 'bhg', 'bhh', 'bhi', 'bhj', 'bhk', 'bhl', 'bhm', 'bhn', 'bho', 'bhp', 'bhq', 'bhr', 'bhs', 'bht', 'bhu', 'bhv', 'bhw', 'bhx', 'bhy', 'bhz', 'bia', 'bib', 'bic', 'bid', 'bie', 'bif', 'big', 'bij', 'bik', 'bil', 'bim', 'bin', 'bio', 'bip', 'biq', 'bir', 'bit', 'biu', 'biv', 'biw', 'bix', 'biy', 'biz', 'bja', 'bjb', 'bjc', 'bjd', 'bje', 'bjf', 'bjg', 'bjh', 'bji', 'bjj', 'bjk', 'bjl', 'bjm', 'bjn', 'bjo', 'bjp', 'bjq', 'bjr', 'bjs', 'bjt', 'bju', 'bjv', 'bjw', 'bjx', 'bjy', 'bjz', 'bka', 'bkb', 'bkc', 'bkd', 'bkf', 'bkg', 'bkh', 'bki', 'bkj', 'bkk', 'bkl', 'bkm', 'bkn', 'bko', 'bkp', 'bkq', 'bkr', 'bks', 'bkt', 'bku', 'bkv', 'bkw', 'bkx', 'bky', 'bkz', 'bla', 'blb', 'blc', 'bld', 'ble', 'blf', 'blg', 'blh', 'bli', 'blj', 'blk', 'bll', 'blm', 'bln', 'blo', 'blp', 'blq', 'blr', 'bls', 'blt', 'blv', 'blw', 'blx', 'bly', 'blz', 'bma', 'bmb', 'bmc', 'bmd', 'bme', 'bmf', 'bmg', 'bmh', 'bmi', 'bmj', 'bmk', 'bml', 'bmm', 'bmn', 'bmo', 'bmp', 'bmq', 'bmr', 'bms', 'bmt', 'bmu', 'bmv', 'bmw', 'bmx', 'bmy', 'bmz', 'bna', 'bnb', 'bnc', 'bnd', 'bne', 'bnf', 'bng', 'bni', 'bnj', 'bnk', 'bnl', 'bnm', 'bnn', 'bno', 'bnp', 'bnq', 'bnr', 'bns', 'bnt', 'bnu', 'bnv', 'bnw', 'bnx', 'bny', 'bnz', 'boa', 'bob', 'boe', 'bof', 'bog', 'boh', 'boi', 'boj', 'bok', 'bol', 'bom', 'bon', 'boo', 'bop', 'boq', 'bor', 'bot', 'bou', 'bov', 'bow', 'box', 'boy', 'boz', 'bpa', 'bpb', 'bpd', 'bpg', 'bph', 'bpi', 'bpj', 'bpk', 'bpl', 'bpm', 'bpn', 'bpo', 'bpp', 'bpq', 'bpr', 'bps', 'bpt', 'bpu', 'bpv', 'bpw', 'bpx', 'bpy', 'bpz', 'bqa', 'bqb', 'bqc', 'bqd', 'bqf', 'bqg', 'bqh', 'bqi', 'bqj', 'bqk', 'bql', 'bqm', 'bqn', 'bqo', 'bqp', 'bqq', 'bqr', 'bqs', 'bqt', 'bqu', 'bqv', 'bqw', 'bqx', 'bqy', 'bqz', 'bra', 'brb', 'brc', 'brd', 'brf', 'brg', 'brh', 'bri', 'brj', 'brk', 'brl', 'brm', 'brn', 'bro', 'brp', 'brq', 'brr', 'brs', 'brt', 'bru', 'brv', 'brw', 'brx', 'bry', 'brz', 'bsa', 'bsb', 'bsc', 'bse', 'bsf', 'bsg', 'bsh', 'bsi', 'bsj', 'bsk', 'bsl', 'bsm', 'bsn', 'bso', 'bsp', 'bsq', 'bsr', 'bss', 'bst', 'bsu', 'bsv', 'bsw', 'bsx', 'bsy', 'bta', 'btb', 'btc', 'btd', 'bte', 'btf', 'btg', 'bth', 'bti', 'btj', 'btk', 'btl', 'btm', 'btn', 'bto', 'btp', 'btq', 'btr', 'bts', 'btt', 'btu', 'btv', 'btw', 'btx', 'bty', 'btz', 'bua', 'bub', 'buc', 'bud', 'bue', 'buf', 'bug', 'buh', 'bui', 'buj', 'buk', 'bum', 'bun', 'buo', 'bup', 'buq', 'bus', 'but', 'buu', 'buv', 'buw', 'bux', 'buy', 'buz', 'bva', 'bvb', 'bvc', 'bvd', 'bve', 'bvf', 'bvg', 'bvh', 'bvi', 'bvj', 'bvk', 'bvl', 'bvm', 'bvn', 'bvo', 'bvp', 'bvq', 'bvr', 'bvt', 'bvu', 'bvv', 'bvw', 'bvx', 'bvy', 'bvz', 'bwa', 'bwb', 'bwc', 'bwd', 'bwe', 'bwf', 'bwg', 'bwh', 'bwi', 'bwj', 'bwk', 'bwl', 'bwm', 'bwn', 'bwo', 'bwp', 'bwq', 'bwr', 'bws', 'bwt', 'bwu', 'bww', 'bwx', 'bwy', 'bwz', 'bxa', 'bxb', 'bxc', 'bxd', 'bxe', 'bxf', 'bxg', 'bxh', 'bxi', 'bxj', 'bxk', 'bxl', 'bxm', 'bxn', 'bxo', 'bxp', 'bxq', 'bxr', 'bxs', 'bxu', 'bxv', 'bxw', 'bxx', 'bxz', 'bya', 'byb', 'byc', 'byd', 'bye', 'byf', 'byg', 'byh', 'byi', 'byj', 'byk', 'byl', 'bym', 'byn', 'byo', 'byp', 'byq', 'byr', 'bys', 'byt', 'byv', 'byw', 'byx', 'byy', 'byz', 'bza', 'bzb', 'bzc', 'bzd', 'bze', 'bzf', 'bzg', 'bzh', 'bzi', 'bzj', 'bzk', 'bzl', 'bzm', 'bzn', 'bzo', 'bzp', 'bzq', 'bzr', 'bzs', 'bzt', 'bzu', 'bzv', 'bzw', 'bzx', 'bzy', 'bzz', 'caa', 'cab', 'cac', 'cad', 'cae', 'caf', 'cag', 'cah', 'cai', 'caj', 'cak', 'cal', 'cam', 'can', 'cao', 'cap', 'caq', 'car', 'cas', 'cau', 'cav', 'caw', 'cax', 'cay', 'caz', 'cba', 'cbb', 'cbc', 'cbd', 'cbe', 'cbg', 'cbh', 'cbi', 'cbj', 'cbk', 'cbl', 'cbn', 'cbo', 'cbq', 'cbr', 'cbs', 'cbt', 'cbu', 'cbv', 'cbw', 'cby', 'cca', 'ccc', 'ccd', 'cce', 'ccg', 'cch', 'ccj', 'ccl', 'ccm', 'ccn', 'cco', 'ccp', 'ccq', 'ccr', 'ccs', 'cda', 'cdc', 'cdd', 'cde', 'cdf', 'cdg', 'cdh', 'cdi', 'cdj', 'cdm', 'cdn', 'cdo', 'cdr', 'cds', 'cdy', 'cdz', 'cea', 'ceb', 'ceg', 'cek', 'cel', 'cen', 'cet', 'cfa', 'cfd', 'cfg', 'cfm', 'cga', 'cgc', 'cgg', 'cgk', 'chb', 'chc', 'chd', 'chf', 'chg', 'chh', 'chj', 'chk', 'chl', 'chm', 'chn', 'cho', 'chp', 'chq', 'chr', 'cht', 'chw', 'chx', 'chy', 'chz', 'cia', 'cib', 'cic', 'cid', 'cie', 'cih', 'cik', 'cim', 'cin', 'cip', 'cir', 'ciw', 'ciy', 'cja', 'cje', 'cjh', 'cji', 'cjk', 'cjm', 'cjn', 'cjo', 'cjp', 'cjr', 'cjs', 'cjv', 'cjy', 'cka', 'ckb', 'ckh', 'ckl', 'ckn', 'cko', 'ckq', 'ckr', 'cks', 'ckt', 'cku', 'ckv', 'ckx', 'cky', 'ckz', 'cla', 'clc', 'cld', 'cle', 'clh', 'cli', 'clj', 'clk', 'cll', 'clm', 'clo', 'clt', 'clu', 'clw', 'cly', 'cma', 'cmc', 'cme', 'cmg', 'cmi', 'cmk', 'cml', 'cmm', 'cmn', 'cmo', 'cmr', 'cms', 'cmt', 'cna', 'cnb', 'cnc', 'cng', 'cnh', 'cni', 'cnk', 'cnl', 'cno', 'cnr', 'cns', 'cnt', 'cnu', 'cnw', 'cnx', 'coa', 'cob', 'coc', 'cod', 'coe', 'cof', 'cog', 'coh', 'coj', 'cok', 'col', 'com', 'con', 'coo', 'cop', 'coq', 'cot', 'cou', 'cov', 'cow', 'cox', 'coy', 'coz', 'cpa', 'cpb', 'cpc', 'cpe', 'cpf', 'cpg', 'cpi', 'cpn', 'cpo', 'cpp', 'cps', 'cpu', 'cpx', 'cpy', 'cqd', 'cqu', 'cra', 'crb', 'crc', 'crd', 'crf', 'crg', 'crh', 'cri', 'crj', 'crk', 'crl', 'crm', 'crn', 'cro', 'crp', 'crq', 'crr', 'crs', 'crt', 'crv', 'crw', 'crx', 'cry', 'crz', 'csa', 'csb', 'csc', 'csd', 'cse', 'csf', 'csg', 'csh', 'csi', 'csj', 'csk', 'csl', 'csm', 'csn', 'cso', 'csq', 'csr', 'css', 'cst', 'csu', 'csv', 'csw', 'csy', 'csz', 'cta', 'ctc', 'ctd', 'cte', 'ctg', 'cth', 'ctl', 'ctm', 'ctn', 'cto', 'ctp', 'cts', 'ctt', 'ctu', 'ctz', 'cua', 'cub', 'cuc', 'cug', 'cuh', 'cui', 'cuj', 'cuk', 'cul', 'cum', 'cuo', 'cup', 'cuq', 'cur', 'cus', 'cut', 'cuu', 'cuv', 'cuw', 'cux', 'cuy', 'cvg', 'cvn', 'cwa', 'cwb', 'cwd', 'cwe', 'cwg', 'cwt', 'cya', 'cyb', 'cyo', 'czh', 'czk', 'czn', 'czo', 'czt', 'daa', 'dac', 'dad', 'dae', 'daf', 'dag', 'dah', 'dai', 'daj', 'dak', 'dal', 'dam', 'dao', 'dap', 'daq', 'dar', 'das', 'dau', 'dav', 'daw', 'dax', 'day', 'daz', 'dba', 'dbb', 'dbd', 'dbe', 'dbf', 'dbg', 'dbi', 'dbj', 'dbl', 'dbm', 'dbn', 'dbo', 'dbp', 'dbq', 'dbr', 'dbt', 'dbu', 'dbv', 'dbw', 'dby', 'dcc', 'dcr', 'dda', 'ddd', 'dde', 'ddg', 'ddi', 'ddj', 'ddn', 'ddo', 'ddr', 'dds', 'ddw', 'dec', 'ded', 'dee', 'def', 'deg', 'deh', 'dei', 'dek', 'del', 'dem', 'den', 'dep', 'deq', 'der', 'des', 'dev', 'dez', 'dga', 'dgb', 'dgc', 'dgd', 'dge', 'dgg', 'dgh', 'dgi', 'dgk', 'dgl', 'dgn', 'dgo', 'dgr', 'dgs', 'dgt', 'dgu', 'dgw', 'dgx', 'dgz', 'dha', 'dhd', 'dhg', 'dhi', 'dhl', 'dhm', 'dhn', 'dho', 'dhr', 'dhs', 'dhu', 'dhv', 'dhw', 'dhx', 'dia', 'dib', 'dic', 'did', 'dif', 'dig', 'dih', 'dii', 'dij', 'dik', 'dil', 'dim', 'din', 'dio', 'dip', 'diq', 'dir', 'dis', 'dit', 'diu', 'diw', 'dix', 'diy', 'diz', 'dja', 'djb', 'djc', 'djd', 'dje', 'djf', 'dji', 'djj', 'djk', 'djl', 'djm', 'djn', 'djo', 'djr', 'dju', 'djw', 'dka', 'dkk', 'dkl', 'dkr', 'dks', 'dkx', 'dlg', 'dlk', 'dlm', 'dln', 'dma', 'dmb', 'dmc', 'dmd', 'dme', 'dmg', 'dmk', 'dml', 'dmm', 'dmn', 'dmo', 'dmr', 'dms', 'dmu', 'dmv', 'dmw', 'dmx', 'dmy', 'dna', 'dnd', 'dne', 'dng', 'dni', 'dnj', 'dnk', 'dnn', 'dnr', 'dnt', 'dnu', 'dnv', 'dnw', 'dny', 'doa', 'dob', 'doc', 'doe', 'dof', 'doh', 'doi', 'dok', 'dol', 'don', 'doo', 'dop', 'doq', 'dor', 'dos', 'dot', 'dov', 'dow', 'dox', 'doy', 'doz', 'dpp', 'dra', 'drb', 'drc', 'drd', 'dre', 'drg', 'drh', 'dri', 'drl', 'drn', 'dro', 'drq', 'drr', 'drs', 'drt', 'dru', 'drw', 'dry', 'dsb', 'dse', 'dsh', 'dsi', 'dsl', 'dsn', 'dso', 'dsq', 'dta', 'dtb', 'dtd', 'dth', 'dti', 'dtk', 'dtm', 'dtn', 'dto', 'dtp', 'dtr', 'dts', 'dtt', 'dtu', 'dty', 'dua', 'dub', 'duc', 'dud', 'due', 'duf', 'dug', 'duh', 'dui', 'duj', 'duk', 'dul', 'dum', 'dun', 'duo', 'dup', 'duq', 'dur', 'dus', 'duu', 'duv', 'duw', 'dux', 'duy', 'duz', 'dva', 'dwa', 'dwl', 'dwr', 'dws', 'dwu', 'dww', 'dwy', 'dya', 'dyb', 'dyd', 'dyg', 'dyi', 'dym', 'dyn', 'dyo', 'dyu', 'dyy', 'dza', 'dzd', 'dze', 'dzg', 'dzl', 'dzn', 'eaa', 'ebg', 'ebk', 'ebo', 'ebr', 'ebu', 'ecr', 'ecs', 'ecy', 'eee', 'efa', 'efe', 'efi', 'ega', 'egl', 'ego', 'egx', 'egy', 'ehu', 'eip', 'eit', 'eiv', 'eja', 'eka', 'ekc', 'eke', 'ekg', 'eki', 'ekk', 'ekl', 'ekm', 'eko', 'ekp', 'ekr', 'eky', 'ele', 'elh', 'eli', 'elk', 'elm', 'elo', 'elp', 'elu', 'elx', 'ema', 'emb', 'eme', 'emg', 'emi', 'emk', 'emm', 'emn', 'emo', 'emp', 'ems', 'emu', 'emw', 'emx', 'emy', 'ena', 'enb', 'enc', 'end', 'enf', 'enh', 'enl', 'enm', 'enn', 'eno', 'enq', 'enr', 'enu', 'env', 'enw', 'enx', 'eot', 'epi', 'era', 'erg', 'erh', 'eri', 'erk', 'ero', 'err', 'ers', 'ert', 'erw', 'ese', 'esg', 'esh', 'esi', 'esk', 'esl', 'esm', 'esn', 'eso', 'esq', 'ess', 'esu', 'esx', 'esy', 'etb', 'etc', 'eth', 'etn', 'eto', 'etr', 'ets', 'ett', 'etu', 'etx', 'etz', 'euq', 'eve', 'evh', 'evn', 'ewo', 'ext', 'eya', 'eyo', 'eza', 'eze', 'faa', 'fab', 'fad', 'faf', 'fag', 'fah', 'fai', 'faj', 'fak', 'fal', 'fam', 'fan', 'fap', 'far', 'fat', 'fau', 'fax', 'fay', 'faz', 'fbl', 'fcs', 'fer', 'ffi', 'ffm', 'fgr', 'fia', 'fie', 'fil', 'fip', 'fir', 'fit', 'fiu', 'fiw', 'fkk', 'fkv', 'fla', 'flh', 'fli', 'fll', 'fln', 'flr', 'fly', 'fmp', 'fmu', 'fnb', 'fng', 'fni', 'fod', 'foi', 'fom', 'fon', 'for', 'fos', 'fox', 'fpe', 'fqs', 'frc', 'frd', 'frk', 'frm', 'fro', 'frp', 'frq', 'frr', 'frs', 'frt', 'fse', 'fsl', 'fss', 'fub', 'fuc', 'fud', 'fue', 'fuf', 'fuh', 'fui', 'fuj', 'fum', 'fun', 'fuq', 'fur', 'fut', 'fuu', 'fuv', 'fuy', 'fvr', 'fwa', 'fwe', 'gaa', 'gab', 'gac', 'gad', 'gae', 'gaf', 'gag', 'gah', 'gai', 'gaj', 'gak', 'gal', 'gam', 'gan', 'gao', 'gap', 'gaq', 'gar', 'gas', 'gat', 'gau', 'gav', 'gaw', 'gax', 'gay', 'gaz', 'gba', 'gbb', 'gbc', 'gbd', 'gbe', 'gbf', 'gbg', 'gbh', 'gbi', 'gbj', 'gbk', 'gbl', 'gbm', 'gbn', 'gbo', 'gbp', 'gbq', 'gbr', 'gbs', 'gbu', 'gbv', 'gbw', 'gbx', 'gby', 'gbz', 'gcc', 'gcd', 'gce', 'gcf', 'gcl', 'gcn', 'gcr', 'gct', 'gda', 'gdb', 'gdc', 'gdd', 'gde', 'gdf', 'gdg', 'gdh', 'gdi', 'gdj', 'gdk', 'gdl', 'gdm', 'gdn', 'gdo', 'gdq', 'gdr', 'gds', 'gdt', 'gdu', 'gdx', 'gea', 'geb', 'gec', 'ged', 'geg', 'geh', 'gei', 'gej', 'gek', 'gel', 'gem', 'geq', 'ges', 'gev', 'gew', 'gex', 'gey', 'gez', 'gfk', 'gft', 'gfx', 'gga', 'ggb', 'ggd', 'gge', 'ggg', 'ggk', 'ggl', 'ggn', 'ggo', 'ggr', 'ggt', 'ggu', 'ggw', 'gha', 'ghc', 'ghe', 'ghh', 'ghk', 'ghl', 'ghn', 'gho', 'ghr', 'ghs', 'ght', 'gia', 'gib', 'gic', 'gid', 'gie', 'gig', 'gih', 'gil', 'gim', 'gin', 'gio', 'gip', 'giq', 'gir', 'gis', 'git', 'giu', 'giw', 'gix', 'giy', 'giz', 'gji', 'gjk', 'gjm', 'gjn', 'gjr', 'gju', 'gka', 'gkd', 'gke', 'gkn', 'gko', 'gkp', 'gku', 'glc', 'gld', 'glh', 'gli', 'glj', 'glk', 'gll', 'glo', 'glr', 'glu', 'glw', 'gly', 'gma', 'gmb', 'gmd', 'gme', 'gmg', 'gmh', 'gml', 'gmm', 'gmn', 'gmq', 'gmu', 'gmv', 'gmw', 'gmx', 'gmy', 'gmz', 'gna', 'gnb', 'gnc', 'gnd', 'gne', 'gng', 'gnh', 'gni', 'gnj', 'gnk', 'gnl', 'gnm', 'gnn', 'gno', 'gnq', 'gnr', 'gnt', 'gnu', 'gnw', 'gnz', 'goa', 'gob', 'goc', 'god', 'goe', 'gof', 'gog', 'goh', 'goi', 'goj', 'gok', 'gol', 'gom', 'gon', 'goo', 'gop', 'goq', 'gor', 'gos', 'got', 'gou', 'gow', 'gox', 'goy', 'goz', 'gpa', 'gpe', 'gpn', 'gqa', 'gqi', 'gqn', 'gqr', 'gqu', 'gra', 'grb', 'grc', 'grd', 'grg', 'grh', 'gri', 'grj', 'grk', 'grm', 'gro', 'grq', 'grr', 'grs', 'grt', 'gru', 'grv', 'grw', 'grx', 'gry', 'grz', 'gse', 'gsg', 'gsl', 'gsm', 'gsn', 'gso', 'gsp', 'gss', 'gsw', 'gta', 'gti', 'gtu', 'gua', 'gub', 'guc', 'gud', 'gue', 'guf', 'gug', 'guh', 'gui', 'guk', 'gul', 'gum', 'gun', 'guo', 'gup', 'guq', 'gur', 'gus', 'gut', 'guu', 'guv', 'guw', 'gux', 'guz', 'gva', 'gvc', 'gve', 'gvf', 'gvj', 'gvl', 'gvm', 'gvn', 'gvo', 'gvp', 'gvr', 'gvs', 'gvy', 'gwa', 'gwb', 'gwc', 'gwd', 'gwe', 'gwf', 'gwg', 'gwi', 'gwj', 'gwm', 'gwn', 'gwr', 'gwt', 'gwu', 'gww', 'gwx', 'gxx', 'gya', 'gyb', 'gyd', 'gye', 'gyf', 'gyg', 'gyi', 'gyl', 'gym', 'gyn', 'gyo', 'gyr', 'gyy', 'gza', 'gzi', 'gzn', 'haa', 'hab', 'hac', 'had', 'hae', 'haf', 'hag', 'hah', 'hai', 'haj', 'hak', 'hal', 'ham', 'han', 'hao', 'hap', 'haq', 'har', 'has', 'hav', 'haw', 'hax', 'hay', 'haz', 'hba', 'hbb', 'hbn', 'hbo', 'hbu', 'hca', 'hch', 'hdn', 'hds', 'hdy', 'hea', 'hed', 'heg', 'heh', 'hei', 'hem', 'hgm', 'hgw', 'hhi', 'hhr', 'hhy', 'hia', 'hib', 'hid', 'hif', 'hig', 'hih', 'hii', 'hij', 'hik', 'hil', 'him', 'hio', 'hir', 'hit', 'hiw', 'hix', 'hji', 'hka', 'hke', 'hkk', 'hkn', 'hks', 'hla', 'hlb', 'hld', 'hle', 'hlt', 'hlu', 'hma', 'hmb', 'hmc', 'hmd', 'hme', 'hmf', 'hmg', 'hmh', 'hmi', 'hmj', 'hmk', 'hml', 'hmm', 'hmn', 'hmp', 'hmq', 'hmr', 'hms', 'hmt', 'hmu', 'hmv', 'hmw', 'hmx', 'hmy', 'hmz', 'hna', 'hnd', 'hne', 'hnh', 'hni', 'hnj', 'hnn', 'hno', 'hns', 'hnu', 'hoa', 'hob', 'hoc', 'hod', 'hoe', 'hoh', 'hoi', 'hoj', 'hok', 'hol', 'hom', 'hoo', 'hop', 'hor', 'hos', 'hot', 'hov', 'how', 'hoy', 'hoz', 'hpo', 'hps', 'hra', 'hrc', 'hre', 'hrk', 'hrm', 'hro', 'hrp', 'hrr', 'hrt', 'hru', 'hrw', 'hrx', 'hrz', 'hsb', 'hsh', 'hsl', 'hsn', 'hss', 'hti', 'hto', 'hts', 'htu', 'htx', 'hub', 'huc', 'hud', 'hue', 'huf', 'hug', 'huh', 'hui', 'huj', 'huk', 'hul', 'hum', 'huo', 'hup', 'huq', 'hur', 'hus', 'hut', 'huu', 'huv', 'huw', 'hux', 'huy', 'huz', 'hvc', 'hve', 'hvk', 'hvn', 'hvv', 'hwa', 'hwc', 'hwo', 'hya', 'hyw', 'hyx', 'iai', 'ian', 'iap', 'iar', 'iba', 'ibb', 'ibd', 'ibe', 'ibg', 'ibh', 'ibi', 'ibl', 'ibm', 'ibn', 'ibr', 'ibu', 'iby', 'ica', 'ich', 'icl', 'icr', 'ida', 'idb', 'idc', 'idd', 'ide', 'idi', 'idr', 'ids', 'idt', 'idu', 'ifa', 'ifb', 'ife', 'iff', 'ifk', 'ifm', 'ifu', 'ify', 'igb', 'ige', 'igg', 'igl', 'igm', 'ign', 'igo', 'igs', 'igw', 'ihb', 'ihi', 'ihp', 'ihw', 'iin', 'iir', 'ijc', 'ije', 'ijj', 'ijn', 'ijo', 'ijs', 'ike', 'iki', 'ikk', 'ikl', 'iko', 'ikp', 'ikr', 'iks', 'ikt', 'ikv', 'ikw', 'ikx', 'ikz', 'ila', 'ilb', 'ilg', 'ili', 'ilk', 'ill', 'ilm', 'ilo', 'ilp', 'ils', 'ilu', 'ilv', 'ilw', 'ima', 'ime', 'imi', 'iml', 'imn', 'imo', 'imr', 'ims', 'imy', 'inb', 'inc', 'ine', 'ing', 'inh', 'inj', 'inl', 'inm', 'inn', 'ino', 'inp', 'ins', 'int', 'inz', 'ior', 'iou', 'iow', 'ipi', 'ipo', 'iqu', 'iqw', 'ira', 'ire', 'irh', 'iri', 'irk', 'irn', 'iro', 'irr', 'iru', 'irx', 'iry', 'isa', 'isc', 'isd', 'ise', 'isg', 'ish', 'isi', 'isk', 'ism', 'isn', 'iso', 'isr', 'ist', 'isu', 'itb', 'itc', 'itd', 'ite', 'iti', 'itk', 'itl', 'itm', 'ito', 'itr', 'its', 'itt', 'itv', 'itw', 'itx', 'ity', 'itz', 'ium', 'ivb', 'ivv', 'iwk', 'iwm', 'iwo', 'iws', 'ixc', 'ixl', 'iya', 'iyo', 'iyx', 'izh', 'izi', 'izr', 'izz', 'jaa', 'jab', 'jac', 'jad', 'jae', 'jaf', 'jah', 'jaj', 'jak', 'jal', 'jam', 'jan', 'jao', 'jaq', 'jar', 'jas', 'jat', 'jau', 'jax', 'jay', 'jaz', 'jbe', 'jbi', 'jbj', 'jbk', 'jbn', 'jbo', 'jbr', 'jbt', 'jbu', 'jbw', 'jcs', 'jct', 'jda', 'jdg', 'jdt', 'jeb', 'jee', 'jeg', 'jeh', 'jei', 'jek', 'jel', 'jen', 'jer', 'jet', 'jeu', 'jgb', 'jge', 'jgk', 'jgo', 'jhi', 'jhs', 'jia', 'jib', 'jic', 'jid', 'jie', 'jig', 'jih', 'jii', 'jil', 'jim', 'jio', 'jiq', 'jit', 'jiu', 'jiv', 'jiy', 'jje', 'jjr', 'jka', 'jkm', 'jko', 'jkp', 'jkr', 'jku', 'jle', 'jls', 'jma', 'jmb', 'jmc', 'jmd', 'jmi', 'jml', 'jmn', 'jmr', 'jms', 'jmw', 'jmx', 'jna', 'jnd', 'jng', 'jni', 'jnj', 'jnl', 'jns', 'job', 'jod', 'jog', 'jor', 'jos', 'jow', 'jpa', 'jpr', 'jpx', 'jqr', 'jra', 'jrb', 'jrr', 'jrt', 'jru', 'jsl', 'jua', 'jub', 'juc', 'jud', 'juh', 'jui', 'juk', 'jul', 'jum', 'jun', 'juo', 'jup', 'jur', 'jus', 'jut', 'juu', 'juw', 'juy', 'jvd', 'jvn', 'jwi', 'jya', 'jye', 'jyy', 'kaa', 'kab', 'kac', 'kad', 'kae', 'kaf', 'kag', 'kah', 'kai', 'kaj', 'kak', 'kam', 'kao', 'kap', 'kaq', 'kar', 'kav', 'kaw', 'kax', 'kay', 'kba', 'kbb', 'kbc', 'kbd', 'kbe', 'kbf', 'kbg', 'kbh', 'kbi', 'kbj', 'kbk', 'kbl', 'kbm', 'kbn', 'kbo', 'kbp', 'kbq', 'kbr', 'kbs', 'kbt', 'kbu', 'kbv', 'kbw', 'kbx', 'kby', 'kbz', 'kca', 'kcb', 'kcc', 'kcd', 'kce', 'kcf', 'kcg', 'kch', 'kci', 'kcj', 'kck', 'kcl', 'kcm', 'kcn', 'kco', 'kcp', 'kcq', 'kcr', 'kcs', 'kct', 'kcu', 'kcv', 'kcw', 'kcx', 'kcy', 'kcz', 'kda', 'kdc', 'kdd', 'kde', 'kdf', 'kdg', 'kdh', 'kdi', 'kdj', 'kdk', 'kdl', 'kdm', 'kdn', 'kdo', 'kdp', 'kdq', 'kdr', 'kdt', 'kdu', 'kdv', 'kdw', 'kdx', 'kdy', 'kdz', 'kea', 'keb', 'kec', 'ked', 'kee', 'kef', 'keg', 'keh', 'kei', 'kej', 'kek', 'kel', 'kem', 'ken', 'keo', 'kep', 'keq', 'ker', 'kes', 'ket', 'keu', 'kev', 'kew', 'kex', 'key', 'kez', 'kfa', 'kfb', 'kfc', 'kfd', 'kfe', 'kff', 'kfg', 'kfh', 'kfi', 'kfj', 'kfk', 'kfl', 'kfm', 'kfn', 'kfo', 'kfp', 'kfq', 'kfr', 'kfs', 'kft', 'kfu', 'kfv', 'kfw', 'kfx', 'kfy', 'kfz', 'kga', 'kgb', 'kgc', 'kgd', 'kge', 'kgf', 'kgg', 'kgh', 'kgi', 'kgj', 'kgk', 'kgl', 'kgm', 'kgn', 'kgo', 'kgp', 'kgq', 'kgr', 'kgs', 'kgt', 'kgu', 'kgv', 'kgw', 'kgx', 'kgy', 'kha', 'khb', 'khc', 'khd', 'khe', 'khf', 'khg', 'khh', 'khi', 'khj', 'khk', 'khl', 'khn', 'kho', 'khp', 'khq', 'khr', 'khs', 'kht', 'khu', 'khv', 'khw', 'khx', 'khy', 'khz', 'kia', 'kib', 'kic', 'kid', 'kie', 'kif', 'kig', 'kih', 'kii', 'kij', 'kil', 'kim', 'kio', 'kip', 'kiq', 'kis', 'kit', 'kiu', 'kiv', 'kiw', 'kix', 'kiy', 'kiz', 'kja', 'kjb', 'kjc', 'kjd', 'kje', 'kjf', 'kjg', 'kjh', 'kji', 'kjj', 'kjk', 'kjl', 'kjm', 'kjn', 'kjo', 'kjp', 'kjq', 'kjr', 'kjs', 'kjt', 'kju', 'kjv', 'kjx', 'kjy', 'kjz', 'kka', 'kkb', 'kkc', 'kkd', 'kke', 'kkf', 'kkg', 'kkh', 'kki', 'kkj', 'kkk', 'kkl', 'kkm', 'kkn', 'kko', 'kkp', 'kkq', 'kkr', 'kks', 'kkt', 'kku', 'kkv', 'kkw', 'kkx', 'kky', 'kkz', 'kla', 'klb', 'klc', 'kld', 'kle', 'klf', 'klg', 'klh', 'kli', 'klj', 'klk', 'kll', 'klm', 'kln', 'klo', 'klp', 'klq', 'klr', 'kls', 'klt', 'klu', 'klv', 'klw', 'klx', 'kly', 'klz', 'kma', 'kmb', 'kmc', 'kmd', 'kme', 'kmf', 'kmg', 'kmh', 'kmi', 'kmj', 'kmk', 'kml', 'kmm', 'kmn', 'kmo', 'kmp', 'kmq', 'kmr', 'kms', 'kmt', 'kmu', 'kmv', 'kmw', 'kmx', 'kmy', 'kmz', 'kna', 'knb', 'knc', 'knd', 'kne', 'knf', 'kng', 'kni', 'knj', 'knk', 'knl', 'knm', 'knn', 'kno', 'knp', 'knq', 'knr', 'kns', 'knt', 'knu', 'knv', 'knw', 'knx', 'kny', 'knz', 'koa', 'koc', 'kod', 'koe', 'kof', 'kog', 'koh', 'koi', 'koj', 'kok', 'kol', 'koo', 'kop', 'koq', 'kos', 'kot', 'kou', 'kov', 'kow', 'kox', 'koy', 'koz', 'kpa', 'kpb', 'kpc', 'kpd', 'kpe', 'kpf', 'kpg', 'kph', 'kpi', 'kpj', 'kpk', 'kpl', 'kpm', 'kpn', 'kpo', 'kpp', 'kpq', 'kpr', 'kps', 'kpt', 'kpu', 'kpv', 'kpw', 'kpx', 'kpy', 'kpz', 'kqa', 'kqb', 'kqc', 'kqd', 'kqe', 'kqf', 'kqg', 'kqh', 'kqi', 'kqj', 'kqk', 'kql', 'kqm', 'kqn', 'kqo', 'kqp', 'kqq', 'kqr', 'kqs', 'kqt', 'kqu', 'kqv', 'kqw', 'kqx', 'kqy', 'kqz', 'kra', 'krb', 'krc', 'krd', 'kre', 'krf', 'krh', 'kri', 'krj', 'krk', 'krl', 'krm', 'krn', 'kro', 'krp', 'krr', 'krs', 'krt', 'kru', 'krv', 'krw', 'krx', 'kry', 'krz', 'ksa', 'ksb', 'ksc', 'ksd', 'kse', 'ksf', 'ksg', 'ksh', 'ksi', 'ksj', 'ksk', 'ksl', 'ksm', 'ksn', 'kso', 'ksp', 'ksq', 'ksr', 'kss', 'kst', 'ksu', 'ksv', 'ksw', 'ksx', 'ksy', 'ksz', 'kta', 'ktb', 'ktc', 'ktd', 'kte', 'ktf', 'ktg', 'kth', 'kti', 'ktj', 'ktk', 'ktl', 'ktm', 'ktn', 'kto', 'ktp', 'ktq', 'ktr', 'kts', 'ktt', 'ktu', 'ktv', 'ktw', 'ktx', 'kty', 'ktz', 'kub', 'kuc', 'kud', 'kue', 'kuf', 'kug', 'kuh', 'kui', 'kuj', 'kuk', 'kul', 'kum', 'kun', 'kuo', 'kup', 'kuq', 'kus', 'kut', 'kuu', 'kuv', 'kuw', 'kux', 'kuy', 'kuz', 'kva', 'kvb', 'kvc', 'kvd', 'kve', 'kvf', 'kvg', 'kvh', 'kvi', 'kvj', 'kvk', 'kvl', 'kvm', 'kvn', 'kvo', 'kvp', 'kvq', 'kvr', 'kvs', 'kvt', 'kvu', 'kvv', 'kvw', 'kvx', 'kvy', 'kvz', 'kwa', 'kwb', 'kwc', 'kwd', 'kwe', 'kwf', 'kwg', 'kwh', 'kwi', 'kwj', 'kwk', 'kwl', 'kwm', 'kwn', 'kwo', 'kwp', 'kwq', 'kwr', 'kws', 'kwt', 'kwu', 'kwv', 'kww', 'kwx', 'kwy', 'kwz', 'kxa', 'kxb', 'kxc', 'kxd', 'kxe', 'kxf', 'kxh', 'kxi', 'kxj', 'kxk', 'kxl', 'kxm', 'kxn', 'kxo', 'kxp', 'kxq', 'kxr', 'kxs', 'kxt', 'kxu', 'kxv', 'kxw', 'kxx', 'kxy', 'kxz', 'kya', 'kyb', 'kyc', 'kyd', 'kye', 'kyf', 'kyg', 'kyh', 'kyi', 'kyj', 'kyk', 'kyl', 'kym', 'kyn', 'kyo', 'kyp', 'kyq', 'kyr', 'kys', 'kyt', 'kyu', 'kyv', 'kyw', 'kyx', 'kyy', 'kyz', 'kza', 'kzb', 'kzc', 'kzd', 'kze', 'kzf', 'kzg', 'kzh', 'kzi', 'kzj', 'kzk', 'kzl', 'kzm', 'kzn', 'kzo', 'kzp', 'kzq', 'kzr', 'kzs', 'kzt', 'kzu', 'kzv', 'kzw', 'kzx', 'kzy', 'kzz', 'laa', 'lab', 'lac', 'lad', 'lae', 'laf', 'lag', 'lah', 'lai', 'laj', 'lak', 'lal', 'lam', 'lan', 'lap', 'laq', 'lar', 'las', 'lau', 'law', 'lax', 'lay', 'laz', 'lba', 'lbb', 'lbc', 'lbe', 'lbf', 'lbg', 'lbi', 'lbj', 'lbk', 'lbl', 'lbm', 'lbn', 'lbo', 'lbq', 'lbr', 'lbs', 'lbt', 'lbu', 'lbv', 'lbw', 'lbx', 'lby', 'lbz', 'lcc', 'lcd', 'lce', 'lcf', 'lch', 'lcl', 'lcm', 'lcp', 'lcq', 'lcs', 'lda', 'ldb', 'ldd', 'ldg', 'ldh', 'ldi', 'ldj', 'ldk', 'ldl', 'ldm', 'ldn', 'ldo', 'ldp', 'ldq', 'lea', 'leb', 'lec', 'led', 'lee', 'lef', 'leg', 'leh', 'lei', 'lej', 'lek', 'lel', 'lem', 'len', 'leo', 'lep', 'leq', 'ler', 'les', 'let', 'leu', 'lev', 'lew', 'lex', 'ley', 'lez', 'lfa', 'lfn', 'lga', 'lgb', 'lgg', 'lgh', 'lgi', 'lgk', 'lgl', 'lgm', 'lgn', 'lgq', 'lgr', 'lgt', 'lgu', 'lgz', 'lha', 'lhh', 'lhi', 'lhl', 'lhm', 'lhn', 'lhp', 'lhs', 'lht', 'lhu', 'lia', 'lib', 'lic', 'lid', 'lie', 'lif', 'lig', 'lih', 'lii', 'lij', 'lik', 'lil', 'lio', 'lip', 'liq', 'lir', 'lis', 'liu', 'liv', 'liw', 'lix', 'liy', 'liz', 'lja', 'lje', 'lji', 'ljl', 'ljp', 'ljw', 'ljx', 'lka', 'lkb', 'lkc', 'lkd', 'lke', 'lkh', 'lki', 'lkj', 'lkl', 'lkm', 'lkn', 'lko', 'lkr', 'lks', 'lkt', 'lku', 'lky', 'lla', 'llb', 'llc', 'lld', 'lle', 'llf', 'llg', 'llh', 'lli', 'llj', 'llk', 'lll', 'llm', 'lln', 'llo', 'llp', 'llq', 'lls', 'llu', 'llx', 'lma', 'lmb', 'lmc', 'lmd', 'lme', 'lmf', 'lmg', 'lmh', 'lmi', 'lmj', 'lmk', 'lml', 'lmm', 'lmn', 'lmo', 'lmp', 'lmq', 'lmr', 'lmu', 'lmv', 'lmw', 'lmx', 'lmy', 'lmz', 'lna', 'lnb', 'lnd', 'lng', 'lnh', 'lni', 'lnj', 'lnl', 'lnm', 'lnn', 'lno', 'lns', 'lnu', 'lnw', 'lnz', 'loa', 'lob', 'loc', 'loe', 'lof', 'log', 'loh', 'loi', 'loj', 'lok', 'lol', 'lom', 'lon', 'loo', 'lop', 'loq', 'lor', 'los', 'lot', 'lou', 'lov', 'low', 'lox', 'loy', 'loz', 'lpa', 'lpe', 'lpn', 'lpo', 'lpx', 'lra', 'lrc', 'lre', 'lrg', 'lri', 'lrk', 'lrl', 'lrm', 'lrn', 'lro', 'lrr', 'lrt', 'lrv', 'lrz', 'lsa', 'lsd', 'lse', 'lsg', 'lsh', 'lsi', 'lsl', 'lsm', 'lso', 'lsp', 'lsr', 'lss', 'lst', 'lsy', 'ltc', 'ltg', 'lth', 'lti', 'ltn', 'lto', 'lts', 'ltu', 'lua', 'luc', 'lud', 'lue', 'luf', 'lui', 'luj', 'luk', 'lul', 'lum', 'lun', 'luo', 'lup', 'luq', 'lur', 'lus', 'lut', 'luu', 'luv', 'luw', 'luy', 'luz', 'lva', 'lvk', 'lvs', 'lvu', 'lwa', 'lwe', 'lwg', 'lwh', 'lwl', 'lwm', 'lwo', 'lws', 'lwt', 'lwu', 'lww', 'lya', 'lyg', 'lyn', 'lzh', 'lzl', 'lzn', 'lzz', 'maa', 'mab', 'mad', 'mae', 'maf', 'mag', 'mai', 'maj', 'mak', 'mam', 'man', 'map', 'maq', 'mas', 'mat', 'mau', 'mav', 'maw', 'max', 'maz', 'mba', 'mbb', 'mbc', 'mbd', 'mbe', 'mbf', 'mbh', 'mbi', 'mbj', 'mbk', 'mbl', 'mbm', 'mbn', 'mbo', 'mbp', 'mbq', 'mbr', 'mbs', 'mbt', 'mbu', 'mbv', 'mbw', 'mbx', 'mby', 'mbz', 'mca', 'mcb', 'mcc', 'mcd', 'mce', 'mcf', 'mcg', 'mch', 'mci', 'mcj', 'mck', 'mcl', 'mcm', 'mcn', 'mco', 'mcp', 'mcq', 'mcr', 'mcs', 'mct', 'mcu', 'mcv', 'mcw', 'mcx', 'mcy', 'mcz', 'mda', 'mdb', 'mdc', 'mdd', 'mde', 'mdf', 'mdg', 'mdh', 'mdi', 'mdj', 'mdk', 'mdl', 'mdm', 'mdn', 'mdp', 'mdq', 'mdr', 'mds', 'mdt', 'mdu', 'mdv', 'mdw', 'mdx', 'mdy', 'mdz', 'mea', 'meb', 'mec', 'med', 'mee', 'mef', 'meg', 'meh', 'mei', 'mej', 'mek', 'mel', 'mem', 'men', 'meo', 'mep', 'meq', 'mer', 'mes', 'met', 'meu', 'mev', 'mew', 'mey', 'mez', 'mfa', 'mfb', 'mfc', 'mfd', 'mfe', 'mff', 'mfg', 'mfh', 'mfi', 'mfj', 'mfk', 'mfl', 'mfm', 'mfn', 'mfo', 'mfp', 'mfq', 'mfr', 'mfs', 'mft', 'mfu', 'mfv', 'mfw', 'mfx', 'mfy', 'mfz', 'mga', 'mgb', 'mgc', 'mgd', 'mge', 'mgf', 'mgg', 'mgh', 'mgi', 'mgj', 'mgk', 'mgl', 'mgm', 'mgn', 'mgo', 'mgp', 'mgq', 'mgr', 'mgs', 'mgt', 'mgu', 'mgv', 'mgw', 'mgx', 'mgy', 'mgz', 'mha', 'mhb', 'mhc', 'mhd', 'mhe', 'mhf', 'mhg', 'mhh', 'mhi', 'mhj', 'mhk', 'mhl', 'mhm', 'mhn', 'mho', 'mhp', 'mhq', 'mhr', 'mhs', 'mht', 'mhu', 'mhw', 'mhx', 'mhy', 'mhz', 'mia', 'mib', 'mic', 'mid', 'mie', 'mif', 'mig', 'mih', 'mii', 'mij', 'mik', 'mil', 'mim', 'min', 'mio', 'mip', 'miq', 'mir', 'mis', 'mit', 'miu', 'miw', 'mix', 'miy', 'miz', 'mja', 'mjb', 'mjc', 'mjd', 'mje', 'mjg', 'mjh', 'mji', 'mjj', 'mjk', 'mjl', 'mjm', 'mjn', 'mjo', 'mjp', 'mjq', 'mjr', 'mjs', 'mjt', 'mju', 'mjv', 'mjw', 'mjx', 'mjy', 'mjz', 'mka', 'mkb', 'mkc', 'mke', 'mkf', 'mkg', 'mkh', 'mki', 'mkj', 'mkk', 'mkl', 'mkm', 'mkn', 'mko', 'mkp', 'mkq', 'mkr', 'mks', 'mkt', 'mku', 'mkv', 'mkw', 'mkx', 'mky', 'mkz', 'mla', 'mlb', 'mlc', 'mld', 'mle', 'mlf', 'mlh', 'mli', 'mlj', 'mlk', 'mll', 'mlm', 'mln', 'mlo', 'mlp', 'mlq', 'mlr', 'mls', 'mlu', 'mlv', 'mlw', 'mlx', 'mlz', 'mma', 'mmb', 'mmc', 'mmd', 'mme', 'mmf', 'mmg', 'mmh', 'mmi', 'mmj', 'mmk', 'mml', 'mmm', 'mmn', 'mmo', 'mmp', 'mmq', 'mmr', 'mmt', 'mmu', 'mmv', 'mmw', 'mmx', 'mmy', 'mmz', 'mna', 'mnb', 'mnc', 'mnd', 'mne', 'mnf', 'mng', 'mnh', 'mni', 'mnj', 'mnk', 'mnl', 'mnm', 'mnn', 'mno', 'mnp', 'mnq', 'mnr', 'mns', 'mnt', 'mnu', 'mnv', 'mnw', 'mnx', 'mny', 'mnz', 'moa', 'moc', 'mod', 'moe', 'mof', 'mog', 'moh', 'moi', 'moj', 'mok', 'mom', 'moo', 'mop', 'moq', 'mor', 'mos', 'mot', 'mou', 'mov', 'mow', 'mox', 'moy', 'moz', 'mpa', 'mpb', 'mpc', 'mpd', 'mpe', 'mpg', 'mph', 'mpi', 'mpj', 'mpk', 'mpl', 'mpm', 'mpn', 'mpo', 'mpp', 'mpq', 'mpr', 'mps', 'mpt', 'mpu', 'mpv', 'mpw', 'mpx', 'mpy', 'mpz', 'mqa', 'mqb', 'mqc', 'mqe', 'mqf', 'mqg', 'mqh', 'mqi', 'mqj', 'mqk', 'mql', 'mqm', 'mqn', 'mqo', 'mqp', 'mqq', 'mqr', 'mqs', 'mqt', 'mqu', 'mqv', 'mqw', 'mqx', 'mqy', 'mqz', 'mra', 'mrb', 'mrc', 'mrd', 'mre', 'mrf', 'mrg', 'mrh', 'mrj', 'mrk', 'mrl', 'mrm', 'mrn', 'mro', 'mrp', 'mrq', 'mrr', 'mrs', 'mrt', 'mru', 'mrv', 'mrw', 'mrx', 'mry', 'mrz', 'msb', 'msc', 'msd', 'mse', 'msf', 'msg', 'msh', 'msi', 'msj', 'msk', 'msl', 'msm', 'msn', 'mso', 'msp', 'msq', 'msr', 'mss', 'mst', 'msu', 'msv', 'msw', 'msx', 'msy', 'msz', 'mta', 'mtb', 'mtc', 'mtd', 'mte', 'mtf', 'mtg', 'mth', 'mti', 'mtj', 'mtk', 'mtl', 'mtm', 'mtn', 'mto', 'mtp', 'mtq', 'mtr', 'mts', 'mtt', 'mtu', 'mtv', 'mtw', 'mtx', 'mty', 'mua', 'mub', 'muc', 'mud', 'mue', 'mug', 'muh', 'mui', 'muj', 'muk', 'mul', 'mum', 'mun', 'muo', 'mup', 'muq', 'mur', 'mus', 'mut', 'muu', 'muv', 'mux', 'muy', 'muz', 'mva', 'mvb', 'mvd', 'mve', 'mvf', 'mvg', 'mvh', 'mvi', 'mvk', 'mvl', 'mvm', 'mvn', 'mvo', 'mvp', 'mvq', 'mvr', 'mvs', 'mvt', 'mvu', 'mvv', 'mvw', 'mvx', 'mvy', 'mvz', 'mwa', 'mwb', 'mwc', 'mwd', 'mwe', 'mwf', 'mwg', 'mwh', 'mwi', 'mwj', 'mwk', 'mwl', 'mwm', 'mwn', 'mwo', 'mwp', 'mwq', 'mwr', 'mws', 'mwt', 'mwu', 'mwv', 'mww', 'mwx', 'mwy', 'mwz', 'mxa', 'mxb', 'mxc', 'mxd', 'mxe', 'mxf', 'mxg', 'mxh', 'mxi', 'mxj', 'mxk', 'mxl', 'mxm', 'mxn', 'mxo', 'mxp', 'mxq', 'mxr', 'mxs', 'mxt', 'mxu', 'mxv', 'mxw', 'mxx', 'mxy', 'mxz', 'myb', 'myc', 'myd', 'mye', 'myf', 'myg', 'myh', 'myi', 'myj', 'myk', 'myl', 'mym', 'myn', 'myo', 'myp', 'myq', 'myr', 'mys', 'myt', 'myu', 'myv', 'myw', 'myx', 'myy', 'myz', 'mza', 'mzb', 'mzc', 'mzd', 'mze', 'mzg', 'mzh', 'mzi', 'mzj', 'mzk', 'mzl', 'mzm', 'mzn', 'mzo', 'mzp', 'mzq', 'mzr', 'mzs', 'mzt', 'mzu', 'mzv', 'mzw', 'mzx', 'mzy', 'mzz', 'naa', 'nab', 'nac', 'nad', 'nae', 'naf', 'nag', 'nah', 'nai', 'naj', 'nak', 'nal', 'nam', 'nan', 'nao', 'nap', 'naq', 'nar', 'nas', 'nat', 'naw', 'nax', 'nay', 'naz', 'nba', 'nbb', 'nbc', 'nbd', 'nbe', 'nbf', 'nbg', 'nbh', 'nbi', 'nbj', 'nbk', 'nbm', 'nbn', 'nbo', 'nbp', 'nbq', 'nbr', 'nbs', 'nbt', 'nbu', 'nbv', 'nbw', 'nbx', 'nby', 'nca', 'ncb', 'ncc', 'ncd', 'nce', 'ncf', 'ncg', 'nch', 'nci', 'ncj', 'nck', 'ncl', 'ncm', 'ncn', 'nco', 'ncp', 'ncq', 'ncr', 'ncs', 'nct', 'ncu', 'ncx', 'ncz', 'nda', 'ndb', 'ndc', 'ndd', 'ndf', 'ndg', 'ndh', 'ndi', 'ndj', 'ndk', 'ndl', 'ndm', 'ndn', 'ndp', 'ndq', 'ndr', 'nds', 'ndt', 'ndu', 'ndv', 'ndw', 'ndx', 'ndy', 'ndz', 'nea', 'neb', 'nec', 'ned', 'nee', 'nef', 'neg', 'neh', 'nei', 'nej', 'nek', 'nem', 'nen', 'neo', 'neq', 'ner', 'nes', 'net', 'neu', 'nev', 'new', 'nex', 'ney', 'nez', 'nfa', 'nfd', 'nfl', 'nfr', 'nfu', 'nga', 'ngb', 'ngc', 'ngd', 'nge', 'ngf', 'ngg', 'ngh', 'ngi', 'ngj', 'ngk', 'ngl', 'ngm', 'ngn', 'ngo', 'ngp', 'ngq', 'ngr', 'ngs', 'ngt', 'ngu', 'ngv', 'ngw', 'ngx', 'ngy', 'ngz', 'nha', 'nhb', 'nhc', 'nhd', 'nhe', 'nhf', 'nhg', 'nhh', 'nhi', 'nhk', 'nhm', 'nhn', 'nho', 'nhp', 'nhq', 'nhr', 'nht', 'nhu', 'nhv', 'nhw', 'nhx', 'nhy', 'nhz', 'nia', 'nib', 'nic', 'nid', 'nie', 'nif', 'nig', 'nih', 'nii', 'nij', 'nik', 'nil', 'nim', 'nin', 'nio', 'niq', 'nir', 'nis', 'nit', 'niu', 'niv', 'niw', 'nix', 'niy', 'niz', 'nja', 'njb', 'njd', 'njh', 'nji', 'njj', 'njl', 'njm', 'njn', 'njo', 'njr', 'njs', 'njt', 'nju', 'njx', 'njy', 'njz', 'nka', 'nkb', 'nkc', 'nkd', 'nke', 'nkf', 'nkg', 'nkh', 'nki', 'nkj', 'nkk', 'nkm', 'nkn', 'nko', 'nkp', 'nkq', 'nkr', 'nks', 'nkt', 'nku', 'nkv', 'nkw', 'nkx', 'nkz', 'nla', 'nlc', 'nle', 'nlg', 'nli', 'nlj', 'nlk', 'nll', 'nlm', 'nln', 'nlo', 'nlq', 'nlr', 'nlu', 'nlv', 'nlw', 'nlx', 'nly', 'nlz', 'nma', 'nmb', 'nmc', 'nmd', 'nme', 'nmf', 'nmg', 'nmh', 'nmi', 'nmj', 'nmk', 'nml', 'nmm', 'nmn', 'nmo', 'nmp', 'nmq', 'nmr', 'nms', 'nmt', 'nmu', 'nmv', 'nmw', 'nmx', 'nmy', 'nmz', 'nna', 'nnb', 'nnc', 'nnd', 'nne', 'nnf', 'nng', 'nnh', 'nni', 'nnj', 'nnk', 'nnl', 'nnm', 'nnn', 'nnp', 'nnq', 'nnr', 'nns', 'nnt', 'nnu', 'nnv', 'nnw', 'nnx', 'nny', 'nnz', 'noa', 'noc', 'nod', 'noe', 'nof', 'nog', 'noh', 'noi', 'noj', 'nok', 'nol', 'nom', 'non', 'noo', 'nop', 'noq', 'nos', 'not', 'nou', 'nov', 'now', 'noy', 'noz', 'npa', 'npb', 'npg', 'nph', 'npi', 'npl', 'npn', 'npo', 'nps', 'npu', 'npx', 'npy', 'nqg', 'nqk', 'nql', 'nqm', 'nqn', 'nqo', 'nqq', 'nqy', 'nra', 'nrb', 'nrc', 'nre', 'nrf', 'nrg', 'nri', 'nrk', 'nrl', 'nrm', 'nrn', 'nrp', 'nrr', 'nrt', 'nru', 'nrx', 'nrz', 'nsa', 'nsc', 'nsd', 'nse', 'nsf', 'nsg', 'nsh', 'nsi', 'nsk', 'nsl', 'nsm', 'nsn', 'nso', 'nsp', 'nsq', 'nsr', 'nss', 'nst', 'nsu', 'nsv', 'nsw', 'nsx', 'nsy', 'nsz', 'ntd', 'nte', 'ntg', 'nti', 'ntj', 'ntk', 'ntm', 'nto', 'ntp', 'ntr', 'nts', 'ntu', 'ntw', 'ntx', 'nty', 'ntz', 'nua', 'nub', 'nuc', 'nud', 'nue', 'nuf', 'nug', 'nuh', 'nui', 'nuj', 'nuk', 'nul', 'num', 'nun', 'nuo', 'nup', 'nuq', 'nur', 'nus', 'nut', 'nuu', 'nuv', 'nuw', 'nux', 'nuy', 'nuz', 'nvh', 'nvm', 'nvo', 'nwa', 'nwb', 'nwc', 'nwe', 'nwg', 'nwi', 'nwm', 'nwo', 'nwr', 'nwx', 'nwy', 'nxa', 'nxd', 'nxe', 'nxg', 'nxi', 'nxk', 'nxl', 'nxm', 'nxn', 'nxo', 'nxq', 'nxr', 'nxu', 'nxx', 'nyb', 'nyc', 'nyd', 'nye', 'nyf', 'nyg', 'nyh', 'nyi', 'nyj', 'nyk', 'nyl', 'nym', 'nyn', 'nyo', 'nyp', 'nyq', 'nyr', 'nys', 'nyt', 'nyu', 'nyv', 'nyw', 'nyx', 'nyy', 'nza', 'nzb', 'nzd', 'nzi', 'nzk', 'nzm', 'nzs', 'nzu', 'nzy', 'nzz', 'oaa', 'oac', 'oar', 'oav', 'obi', 'obk', 'obl', 'obm', 'obo', 'obr', 'obt', 'obu', 'oca', 'och', 'oco', 'ocu', 'oda', 'odk', 'odt', 'odu', 'ofo', 'ofs', 'ofu', 'ogb', 'ogc', 'oge', 'ogg', 'ogo', 'ogu', 'oht', 'ohu', 'oia', 'oin', 'ojb', 'ojc', 'ojg', 'ojp', 'ojs', 'ojv', 'ojw', 'oka', 'okb', 'okd', 'oke', 'okg', 'okh', 'oki', 'okj', 'okk', 'okl', 'okm', 'okn', 'oko', 'okr', 'oks', 'oku', 'okv', 'okx', 'ola', 'old', 'ole', 'olk', 'olm', 'olo', 'olr', 'olt', 'olu', 'oma', 'omb', 'omc', 'ome', 'omg', 'omi', 'omk', 'oml', 'omn', 'omo', 'omp', 'omq', 'omr', 'omt', 'omu', 'omv', 'omw', 'omx', 'ona', 'onb', 'one', 'ong', 'oni', 'onj', 'onk', 'onn', 'ono', 'onp', 'onr', 'ons', 'ont', 'onu', 'onw', 'onx', 'ood', 'oog', 'oon', 'oor', 'oos', 'opa', 'opk', 'opm', 'opo', 'opt', 'opy', 'ora', 'orc', 'ore', 'org', 'orh', 'orn', 'oro', 'orr', 'ors', 'ort', 'oru', 'orv', 'orw', 'orx', 'ory', 'orz', 'osa', 'osc', 'osi', 'oso', 'osp', 'ost', 'osu', 'osx', 'ota', 'otb', 'otd', 'ote', 'oti', 'otk', 'otl', 'otm', 'otn', 'oto', 'otq', 'otr', 'ots', 'ott', 'otu', 'otw', 'otx', 'oty', 'otz', 'oua', 'oub', 'oue', 'oui', 'oum', 'oun', 'ovd', 'owi', 'owl', 'oyb', 'oyd', 'oym', 'oyy', 'ozm', 'paa', 'pab', 'pac', 'pad', 'pae', 'paf', 'pag', 'pah', 'pai', 'pak', 'pal', 'pam', 'pao', 'pap', 'paq', 'par', 'pas', 'pat', 'pau', 'pav', 'paw', 'pax', 'pay', 'paz', 'pbb', 'pbc', 'pbe', 'pbf', 'pbg', 'pbh', 'pbi', 'pbl', 'pbm', 'pbn', 'pbo', 'pbp', 'pbr', 'pbs', 'pbt', 'pbu', 'pbv', 'pby', 'pbz', 'pca', 'pcb', 'pcc', 'pcd', 'pce', 'pcf', 'pcg', 'pch', 'pci', 'pcj', 'pck', 'pcl', 'pcm', 'pcn', 'pcp', 'pcr', 'pcw', 'pda', 'pdc', 'pdi', 'pdn', 'pdo', 'pdt', 'pdu', 'pea', 'peb', 'ped', 'pee', 'pef', 'peg', 'peh', 'pei', 'pej', 'pek', 'pel', 'pem', 'peo', 'pep', 'peq', 'pes', 'pev', 'pex', 'pey', 'pez', 'pfa', 'pfe', 'pfl', 'pga', 'pgd', 'pgg', 'pgi', 'pgk', 'pgl', 'pgn', 'pgs', 'pgu', 'pgy', 'pgz', 'pha', 'phd', 'phg', 'phh', 'phi', 'phk', 'phl', 'phm', 'phn', 'pho', 'phq', 'phr', 'pht', 'phu', 'phv', 'phw', 'pia', 'pib', 'pic', 'pid', 'pie', 'pif', 'pig', 'pih', 'pii', 'pij', 'pil', 'pim', 'pin', 'pio', 'pip', 'pir', 'pis', 'pit', 'piu', 'piv', 'piw', 'pix', 'piy', 'piz', 'pjt', 'pka', 'pkb', 'pkc', 'pkg', 'pkh', 'pkn', 'pko', 'pkp', 'pkr', 'pks', 'pkt', 'pku', 'pla', 'plb', 'plc', 'pld', 'ple', 'plf', 'plg', 'plh', 'plj', 'plk', 'pll', 'pln', 'plo', 'plp', 'plq', 'plr', 'pls', 'plt', 'plu', 'plv', 'plw', 'ply', 'plz', 'pma', 'pmb', 'pmc', 'pmd', 'pme', 'pmf', 'pmh', 'pmi', 'pmj', 'pmk', 'pml', 'pmm', 'pmn', 'pmo', 'pmq', 'pmr', 'pms', 'pmt', 'pmu', 'pmw', 'pmx', 'pmy', 'pmz', 'pna', 'pnb', 'pnc', 'pne', 'png', 'pnh', 'pni', 'pnj', 'pnk', 'pnl', 'pnm', 'pnn', 'pno', 'pnp', 'pnq', 'pnr', 'pns', 'pnt', 'pnu', 'pnv', 'pnw', 'pnx', 'pny', 'pnz', 'poc', 'pod', 'poe', 'pof', 'pog', 'poh', 'poi', 'pok', 'pom', 'pon', 'poo', 'pop', 'poq', 'pos', 'pot', 'pov', 'pow', 'pox', 'poy', 'poz', 'ppa', 'ppe', 'ppi', 'ppk', 'ppl', 'ppm', 'ppn', 'ppo', 'ppp', 'ppq', 'ppr', 'pps', 'ppt', 'ppu', 'pqa', 'pqe', 'pqm', 'pqw', 'pra', 'prb', 'prc', 'prd', 'pre', 'prf', 'prg', 'prh', 'pri', 'prk', 'prl', 'prm', 'prn', 'pro', 'prp', 'prq', 'prr', 'prs', 'prt', 'pru', 'prw', 'prx', 'pry', 'prz', 'psa', 'psc', 'psd', 'pse', 'psg', 'psh', 'psi', 'psl', 'psm', 'psn', 'pso', 'psp', 'psq', 'psr', 'pss', 'pst', 'psu', 'psw', 'psy', 'pta', 'pth', 'pti', 'ptn', 'pto', 'ptp', 'ptq', 'ptr', 'ptt', 'ptu', 'ptv', 'ptw', 'pty', 'pua', 'pub', 'puc', 'pud', 'pue', 'puf', 'pug', 'pui', 'puj', 'puk', 'pum', 'puo', 'pup', 'puq', 'pur', 'put', 'puu', 'puw', 'pux', 'puy', 'puz', 'pwa', 'pwb', 'pwg', 'pwi', 'pwm', 'pwn', 'pwo', 'pwr', 'pww', 'pxm', 'pye', 'pym', 'pyn', 'pys', 'pyu', 'pyx', 'pyy', 'pzn', 'qaa..qtz', 'qua', 'qub', 'quc', 'qud', 'quf', 'qug', 'quh', 'qui', 'quk', 'qul', 'qum', 'qun', 'qup', 'quq', 'qur', 'qus', 'quv', 'quw', 'qux', 'quy', 'quz', 'qva', 'qvc', 'qve', 'qvh', 'qvi', 'qvj', 'qvl', 'qvm', 'qvn', 'qvo', 'qvp', 'qvs', 'qvw', 'qvy', 'qvz', 'qwa', 'qwc', 'qwe', 'qwh', 'qwm', 'qws', 'qwt', 'qxa', 'qxc', 'qxh', 'qxl', 'qxn', 'qxo', 'qxp', 'qxq', 'qxr', 'qxs', 'qxt', 'qxu', 'qxw', 'qya', 'qyp', 'raa', 'rab', 'rac', 'rad', 'raf', 'rag', 'rah', 'rai', 'raj', 'rak', 'ral', 'ram', 'ran', 'rao', 'rap', 'raq', 'rar', 'ras', 'rat', 'rau', 'rav', 'raw', 'rax', 'ray', 'raz', 'rbb', 'rbk', 'rbl', 'rbp', 'rcf', 'rdb', 'rea', 'reb', 'ree', 'reg', 'rei', 'rej', 'rel', 'rem', 'ren', 'rer', 'res', 'ret', 'rey', 'rga', 'rge', 'rgk', 'rgn', 'rgr', 'rgs', 'rgu', 'rhg', 'rhp', 'ria', 'rie', 'rif', 'ril', 'rim', 'rin', 'rir', 'rit', 'riu', 'rjg', 'rji', 'rjs', 'rka', 'rkb', 'rkh', 'rki', 'rkm', 'rkt', 'rkw', 'rma', 'rmb', 'rmc', 'rmd', 'rme', 'rmf', 'rmg', 'rmh', 'rmi', 'rmk', 'rml', 'rmm', 'rmn', 'rmo', 'rmp', 'rmq', 'rmr', 'rms', 'rmt', 'rmu', 'rmv', 'rmw', 'rmx', 'rmy', 'rmz', 'rna', 'rnd', 'rng', 'rnl', 'rnn', 'rnp', 'rnr', 'rnw', 'roa', 'rob', 'roc', 'rod', 'roe', 'rof', 'rog', 'rol', 'rom', 'roo', 'rop', 'ror', 'rou', 'row', 'rpn', 'rpt', 'rri', 'rro', 'rrt', 'rsb', 'rsi', 'rsl', 'rsm', 'rtc', 'rth', 'rtm', 'rts', 'rtw', 'rub', 'ruc', 'rue', 'ruf', 'rug', 'ruh', 'rui', 'ruk', 'ruo', 'rup', 'ruq', 'rut', 'ruu', 'ruy', 'ruz', 'rwa', 'rwk', 'rwm', 'rwo', 'rwr', 'rxd', 'rxw', 'ryn', 'rys', 'ryu', 'rzh', 'saa', 'sab', 'sac', 'sad', 'sae', 'saf', 'sah', 'sai', 'saj', 'sak', 'sal', 'sam', 'sao', 'sap', 'saq', 'sar', 'sas', 'sat', 'sau', 'sav', 'saw', 'sax', 'say', 'saz', 'sba', 'sbb', 'sbc', 'sbd', 'sbe', 'sbf', 'sbg', 'sbh', 'sbi', 'sbj', 'sbk', 'sbl', 'sbm', 'sbn', 'sbo', 'sbp', 'sbq', 'sbr', 'sbs', 'sbt', 'sbu', 'sbv', 'sbw', 'sbx', 'sby', 'sbz', 'sca', 'scb', 'sce', 'scf', 'scg', 'sch', 'sci', 'sck', 'scl', 'scn', 'sco', 'scp', 'scq', 'scs', 'sct', 'scu', 'scv', 'scw', 'scx', 'sda', 'sdb', 'sdc', 'sde', 'sdf', 'sdg', 'sdh', 'sdj', 'sdk', 'sdl', 'sdm', 'sdn', 'sdo', 'sdp', 'sdr', 'sds', 'sdt', 'sdu', 'sdv', 'sdx', 'sdz', 'sea', 'seb', 'sec', 'sed', 'see', 'sef', 'seg', 'seh', 'sei', 'sej', 'sek', 'sel', 'sem', 'sen', 'seo', 'sep', 'seq', 'ser', 'ses', 'set', 'seu', 'sev', 'sew', 'sey', 'sez', 'sfb', 'sfe', 'sfm', 'sfs', 'sfw', 'sga', 'sgb', 'sgc', 'sgd', 'sge', 'sgg', 'sgh', 'sgi', 'sgj', 'sgk', 'sgl', 'sgm', 'sgn', 'sgo', 'sgp', 'sgr', 'sgs', 'sgt', 'sgu', 'sgw', 'sgx', 'sgy', 'sgz', 'sha', 'shb', 'shc', 'shd', 'she', 'shg', 'shh', 'shi', 'shj', 'shk', 'shl', 'shm', 'shn', 'sho', 'shp', 'shq', 'shr', 'shs', 'sht', 'shu', 'shv', 'shw', 'shx', 'shy', 'shz', 'sia', 'sib', 'sid', 'sie', 'sif', 'sig', 'sih', 'sii', 'sij', 'sik', 'sil', 'sim', 'sio', 'sip', 'siq', 'sir', 'sis', 'sit', 'siu', 'siv', 'siw', 'six', 'siy', 'siz', 'sja', 'sjb', 'sjd', 'sje', 'sjg', 'sjk', 'sjl', 'sjm', 'sjn', 'sjo', 'sjp', 'sjr', 'sjs', 'sjt', 'sju', 'sjw', 'ska', 'skb', 'skc', 'skd', 'ske', 'skf', 'skg', 'skh', 'ski', 'skj', 'skk', 'skm', 'skn', 'sko', 'skp', 'skq', 'skr', 'sks', 'skt', 'sku', 'skv', 'skw', 'skx', 'sky', 'skz', 'sla', 'slc', 'sld', 'sle', 'slf', 'slg', 'slh', 'sli', 'slj', 'sll', 'slm', 'sln', 'slp', 'slq', 'slr', 'sls', 'slt', 'slu', 'slw', 'slx', 'sly', 'slz', 'sma', 'smb', 'smc', 'smd', 'smf', 'smg', 'smh', 'smi', 'smj', 'smk', 'sml', 'smm', 'smn', 'smp', 'smq', 'smr', 'sms', 'smt', 'smu', 'smv', 'smw', 'smx', 'smy', 'smz', 'snb', 'snc', 'sne', 'snf', 'sng', 'snh', 'sni', 'snj', 'snk', 'snl', 'snm', 'snn', 'sno', 'snp', 'snq', 'snr', 'sns', 'snu', 'snv', 'snw', 'snx', 'sny', 'snz', 'soa', 'sob', 'soc', 'sod', 'soe', 'sog', 'soh', 'soi', 'soj', 'sok', 'sol', 'son', 'soo', 'sop', 'soq', 'sor', 'sos', 'sou', 'sov', 'sow', 'sox', 'soy', 'soz', 'spb', 'spc', 'spd', 'spe', 'spg', 'spi', 'spk', 'spl', 'spm', 'spn', 'spo', 'spp', 'spq', 'spr', 'sps', 'spt', 'spu', 'spv', 'spx', 'spy', 'sqa', 'sqh', 'sqj', 'sqk', 'sqm', 'sqn', 'sqo', 'sqq', 'sqr', 'sqs', 'sqt', 'squ', 'sra', 'srb', 'src', 'sre', 'srf', 'srg', 'srh', 'sri', 'srk', 'srl', 'srm', 'srn', 'sro', 'srq', 'srr', 'srs', 'srt', 'sru', 'srv', 'srw', 'srx', 'sry', 'srz', 'ssa', 'ssb', 'ssc', 'ssd', 'sse', 'ssf', 'ssg', 'ssh', 'ssi', 'ssj', 'ssk', 'ssl', 'ssm', 'ssn', 'sso', 'ssp', 'ssq', 'ssr', 'sss', 'sst', 'ssu', 'ssv', 'ssx', 'ssy', 'ssz', 'sta', 'stb', 'std', 'ste', 'stf', 'stg', 'sth', 'sti', 'stj', 'stk', 'stl', 'stm', 'stn', 'sto', 'stp', 'stq', 'str', 'sts', 'stt', 'stu', 'stv', 'stw', 'sty', 'sua', 'sub', 'suc', 'sue', 'sug', 'sui', 'suj', 'suk', 'sul', 'sum', 'suq', 'sur', 'sus', 'sut', 'suv', 'suw', 'sux', 'suy', 'suz', 'sva', 'svb', 'svc', 'sve', 'svk', 'svm', 'svr', 'svs', 'svx', 'swb', 'swc', 'swf', 'swg', 'swh', 'swi', 'swj', 'swk', 'swl', 'swm', 'swn', 'swo', 'swp', 'swq', 'swr', 'sws', 'swt', 'swu', 'swv', 'sww', 'swx', 'swy', 'sxb', 'sxc', 'sxe', 'sxg', 'sxk', 'sxl', 'sxm', 'sxn', 'sxo', 'sxr', 'sxs', 'sxu', 'sxw', 'sya', 'syb', 'syc', 'syd', 'syi', 'syk', 'syl', 'sym', 'syn', 'syo', 'syr', 'sys', 'syw', 'syx', 'syy', 'sza', 'szb', 'szc', 'szd', 'sze', 'szg', 'szl', 'szn', 'szp', 'szs', 'szv', 'szw', 'taa', 'tab', 'tac', 'tad', 'tae', 'taf', 'tag', 'tai', 'taj', 'tak', 'tal', 'tan', 'tao', 'tap', 'taq', 'tar', 'tas', 'tau', 'tav', 'taw', 'tax', 'tay', 'taz', 'tba', 'tbb', 'tbc', 'tbd', 'tbe', 'tbf', 'tbg', 'tbh', 'tbi', 'tbj', 'tbk', 'tbl', 'tbm', 'tbn', 'tbo', 'tbp', 'tbq', 'tbr', 'tbs', 'tbt', 'tbu', 'tbv', 'tbw', 'tbx', 'tby', 'tbz', 'tca', 'tcb', 'tcc', 'tcd', 'tce', 'tcf', 'tcg', 'tch', 'tci', 'tck', 'tcl', 'tcm', 'tcn', 'tco', 'tcp', 'tcq', 'tcs', 'tct', 'tcu', 'tcw', 'tcx', 'tcy', 'tcz', 'tda', 'tdb', 'tdc', 'tdd', 'tde', 'tdf', 'tdg', 'tdh', 'tdi', 'tdj', 'tdk', 'tdl', 'tdm', 'tdn', 'tdo', 'tdq', 'tdr', 'tds', 'tdt', 'tdu', 'tdv', 'tdx', 'tdy', 'tea', 'teb', 'tec', 'ted', 'tee', 'tef', 'teg', 'teh', 'tei', 'tek', 'tem', 'ten', 'teo', 'tep', 'teq', 'ter', 'tes', 'tet', 'teu', 'tev', 'tew', 'tex', 'tey', 'tez', 'tfi', 'tfn', 'tfo', 'tfr', 'tft', 'tga', 'tgb', 'tgc', 'tgd', 'tge', 'tgf', 'tgg', 'tgh', 'tgi', 'tgj', 'tgn', 'tgo', 'tgp', 'tgq', 'tgr', 'tgs', 'tgt', 'tgu', 'tgv', 'tgw', 'tgx', 'tgy', 'tgz', 'thc', 'thd', 'the', 'thf', 'thh', 'thi', 'thk', 'thl', 'thm', 'thn', 'thp', 'thq', 'thr', 'ths', 'tht', 'thu', 'thv', 'thw', 'thx', 'thy', 'thz', 'tia', 'tic', 'tid', 'tie', 'tif', 'tig', 'tih', 'tii', 'tij', 'tik', 'til', 'tim', 'tin', 'tio', 'tip', 'tiq', 'tis', 'tit', 'tiu', 'tiv', 'tiw', 'tix', 'tiy', 'tiz', 'tja', 'tjg', 'tji', 'tjl', 'tjm', 'tjn', 'tjo', 'tjs', 'tju', 'tjw', 'tka', 'tkb', 'tkd', 'tke', 'tkf', 'tkg', 'tkk', 'tkl', 'tkm', 'tkn', 'tkp', 'tkq', 'tkr', 'tks', 'tkt', 'tku', 'tkv', 'tkw', 'tkx', 'tkz', 'tla', 'tlb', 'tlc', 'tld', 'tlf', 'tlg', 'tlh', 'tli', 'tlj', 'tlk', 'tll', 'tlm', 'tln', 'tlo', 'tlp', 'tlq', 'tlr', 'tls', 'tlt', 'tlu', 'tlv', 'tlw', 'tlx', 'tly', 'tma', 'tmb', 'tmc', 'tmd', 'tme', 'tmf', 'tmg', 'tmh', 'tmi', 'tmj', 'tmk', 'tml', 'tmm', 'tmn', 'tmo', 'tmp', 'tmq', 'tmr', 'tms', 'tmt', 'tmu', 'tmv', 'tmw', 'tmy', 'tmz', 'tna', 'tnb', 'tnc', 'tnd', 'tne', 'tnf', 'tng', 'tnh', 'tni', 'tnk', 'tnl', 'tnm', 'tnn', 'tno', 'tnp', 'tnq', 'tnr', 'tns', 'tnt', 'tnu', 'tnv', 'tnw', 'tnx', 'tny', 'tnz', 'tob', 'toc', 'tod', 'toe', 'tof', 'tog', 'toh', 'toi', 'toj', 'tol', 'tom', 'too', 'top', 'toq', 'tor', 'tos', 'tou', 'tov', 'tow', 'tox', 'toy', 'toz', 'tpa', 'tpc', 'tpe', 'tpf', 'tpg', 'tpi', 'tpj', 'tpk', 'tpl', 'tpm', 'tpn', 'tpo', 'tpp', 'tpq', 'tpr', 'tpt', 'tpu', 'tpv', 'tpw', 'tpx', 'tpy', 'tpz', 'tqb', 'tql', 'tqm', 'tqn', 'tqo', 'tqp', 'tqq', 'tqr', 'tqt', 'tqu', 'tqw', 'tra', 'trb', 'trc', 'trd', 'tre', 'trf', 'trg', 'trh', 'tri', 'trj', 'trk', 'trl', 'trm', 'trn', 'tro', 'trp', 'trq', 'trr', 'trs', 'trt', 'tru', 'trv', 'trw', 'trx', 'try', 'trz', 'tsa', 'tsb', 'tsc', 'tsd', 'tse', 'tsf', 'tsg', 'tsh', 'tsi', 'tsj', 'tsk', 'tsl', 'tsm', 'tsp', 'tsq', 'tsr', 'tss', 'tst', 'tsu', 'tsv', 'tsw', 'tsx', 'tsy', 'tsz', 'tta', 'ttb', 'ttc', 'ttd', 'tte', 'ttf', 'ttg', 'tth', 'tti', 'ttj', 'ttk', 'ttl', 'ttm', 'ttn', 'tto', 'ttp', 'ttq', 'ttr', 'tts', 'ttt', 'ttu', 'ttv', 'ttw', 'tty', 'ttz', 'tua', 'tub', 'tuc', 'tud', 'tue', 'tuf', 'tug', 'tuh', 'tui', 'tuj', 'tul', 'tum', 'tun', 'tuo', 'tup', 'tuq', 'tus', 'tut', 'tuu', 'tuv', 'tuw', 'tux', 'tuy', 'tuz', 'tva', 'tvd', 'tve', 'tvk', 'tvl', 'tvm', 'tvn', 'tvo', 'tvs', 'tvt', 'tvu', 'tvw', 'tvy', 'twa', 'twb', 'twc', 'twd', 'twe', 'twf', 'twg', 'twh', 'twl', 'twm', 'twn', 'two', 'twp', 'twq', 'twr', 'twt', 'twu', 'tww', 'twx', 'twy', 'txa', 'txb', 'txc', 'txe', 'txg', 'txh', 'txi', 'txj', 'txm', 'txn', 'txo', 'txq', 'txr', 'txs', 'txt', 'txu', 'txx', 'txy', 'tya', 'tye', 'tyh', 'tyi', 'tyj', 'tyl', 'tyn', 'typ', 'tyr', 'tys', 'tyt', 'tyu', 'tyv', 'tyx', 'tyz', 'tza', 'tzh', 'tzj', 'tzl', 'tzm', 'tzn', 'tzo', 'tzx', 'uam', 'uan', 'uar', 'uba', 'ubi', 'ubl', 'ubr', 'ubu', 'uby', 'uda', 'ude', 'udg', 'udi', 'udj', 'udl', 'udm', 'udu', 'ues', 'ufi', 'uga', 'ugb', 'uge', 'ugn', 'ugo', 'ugy', 'uha', 'uhn', 'uis', 'uiv', 'uji', 'uka', 'ukg', 'ukh', 'ukk', 'ukl', 'ukp', 'ukq', 'uks', 'uku', 'ukw', 'uky', 'ula', 'ulb', 'ulc', 'ule', 'ulf', 'uli', 'ulk', 'ull', 'ulm', 'uln', 'ulu', 'ulw', 'uma', 'umb', 'umc', 'umd', 'umg', 'umi', 'umm', 'umn', 'umo', 'ump', 'umr', 'ums', 'umu', 'una', 'und', 'une', 'ung', 'unk', 'unm', 'unn', 'unp', 'unr', 'unu', 'unx', 'unz', 'uok', 'upi', 'upv', 'ura', 'urb', 'urc', 'ure', 'urf', 'urg', 'urh', 'uri', 'urj', 'urk', 'url', 'urm', 'urn', 'uro', 'urp', 'urr', 'urt', 'uru', 'urv', 'urw', 'urx', 'ury', 'urz', 'usa', 'ush', 'usi', 'usk', 'usp', 'usu', 'uta', 'ute', 'utp', 'utr', 'utu', 'uum', 'uun', 'uur', 'uuu', 'uve', 'uvh', 'uvl', 'uwa', 'uya', 'uzn', 'uzs', 'vaa', 'vae', 'vaf', 'vag', 'vah', 'vai', 'vaj', 'val', 'vam', 'van', 'vao', 'vap', 'var', 'vas', 'vau', 'vav', 'vay', 'vbb', 'vbk', 'vec', 'ved', 'vel', 'vem', 'veo', 'vep', 'ver', 'vgr', 'vgt', 'vic', 'vid', 'vif', 'vig', 'vil', 'vin', 'vis', 'vit', 'viv', 'vka', 'vki', 'vkj', 'vkk', 'vkl', 'vkm', 'vko', 'vkp', 'vkt', 'vku', 'vlp', 'vls', 'vma', 'vmb', 'vmc', 'vmd', 'vme', 'vmf', 'vmg', 'vmh', 'vmi', 'vmj', 'vmk', 'vml', 'vmm', 'vmp', 'vmq', 'vmr', 'vms', 'vmu', 'vmv', 'vmw', 'vmx', 'vmy', 'vmz', 'vnk', 'vnm', 'vnp', 'vor', 'vot', 'vra', 'vro', 'vrs', 'vrt', 'vsi', 'vsl', 'vsv', 'vto', 'vum', 'vun', 'vut', 'vwa', 'waa', 'wab', 'wac', 'wad', 'wae', 'waf', 'wag', 'wah', 'wai', 'waj', 'wak', 'wal', 'wam', 'wan', 'wao', 'wap', 'waq', 'war', 'was', 'wat', 'wau', 'wav', 'waw', 'wax', 'way', 'waz', 'wba', 'wbb', 'wbe', 'wbf', 'wbh', 'wbi', 'wbj', 'wbk', 'wbl', 'wbm', 'wbp', 'wbq', 'wbr', 'wbs', 'wbt', 'wbv', 'wbw', 'wca', 'wci', 'wdd', 'wdg', 'wdj', 'wdk', 'wdu', 'wdy', 'wea', 'wec', 'wed', 'weg', 'weh', 'wei', 'wem', 'wen', 'weo', 'wep', 'wer', 'wes', 'wet', 'weu', 'wew', 'wfg', 'wga', 'wgb', 'wgg', 'wgi', 'wgo', 'wgu', 'wgw', 'wgy', 'wha', 'whg', 'whk', 'whu', 'wib', 'wic', 'wie', 'wif', 'wig', 'wih', 'wii', 'wij', 'wik', 'wil', 'wim', 'win', 'wir', 'wit', 'wiu', 'wiv', 'wiw', 'wiy', 'wja', 'wji', 'wka', 'wkb', 'wkd', 'wkl', 'wku', 'wkw', 'wky', 'wla', 'wlc', 'wle', 'wlg', 'wli', 'wlk', 'wll', 'wlm', 'wlo', 'wlr', 'wls', 'wlu', 'wlv', 'wlw', 'wlx', 'wly', 'wma', 'wmb', 'wmc', 'wmd', 'wme', 'wmh', 'wmi', 'wmm', 'wmn', 'wmo', 'wms', 'wmt', 'wmw', 'wmx', 'wnb', 'wnc', 'wnd', 'wne', 'wng', 'wni', 'wnk', 'wnm', 'wnn', 'wno', 'wnp', 'wnu', 'wnw', 'wny', 'woa', 'wob', 'woc', 'wod', 'woe', 'wof', 'wog', 'woi', 'wok', 'wom', 'won', 'woo', 'wor', 'wos', 'wow', 'woy', 'wpc', 'wra', 'wrb', 'wrd', 'wrg', 'wrh', 'wri', 'wrk', 'wrl', 'wrm', 'wrn', 'wro', 'wrp', 'wrr', 'wrs', 'wru', 'wrv', 'wrw', 'wrx', 'wry', 'wrz', 'wsa', 'wsg', 'wsi', 'wsk', 'wsr', 'wss', 'wsu', 'wsv', 'wtf', 'wth', 'wti', 'wtk', 'wtm', 'wtw', 'wua', 'wub', 'wud', 'wuh', 'wul', 'wum', 'wun', 'wur', 'wut', 'wuu', 'wuv', 'wux', 'wuy', 'wwa', 'wwb', 'wwo', 'wwr', 'www', 'wxa', 'wxw', 'wya', 'wyb', 'wyi', 'wym', 'wyr', 'wyy', 'xaa', 'xab', 'xac', 'xad', 'xae', 'xag', 'xai', 'xaj', 'xak', 'xal', 'xam', 'xan', 'xao', 'xap', 'xaq', 'xar', 'xas', 'xat', 'xau', 'xav', 'xaw', 'xay', 'xba', 'xbb', 'xbc', 'xbd', 'xbe', 'xbg', 'xbi', 'xbj', 'xbm', 'xbn', 'xbo', 'xbp', 'xbr', 'xbw', 'xbx', 'xby', 'xcb', 'xcc', 'xce', 'xcg', 'xch', 'xcl', 'xcm', 'xcn', 'xco', 'xcr', 'xct', 'xcu', 'xcv', 'xcw', 'xcy', 'xda', 'xdc', 'xdk', 'xdm', 'xdo', 'xdy', 'xeb', 'xed', 'xeg', 'xel', 'xem', 'xep', 'xer', 'xes', 'xet', 'xeu', 'xfa', 'xga', 'xgb', 'xgd', 'xgf', 'xgg', 'xgi', 'xgl', 'xgm', 'xgn', 'xgr', 'xgu', 'xgw', 'xha', 'xhc', 'xhd', 'xhe', 'xhr', 'xht', 'xhu', 'xhv', 'xia', 'xib', 'xii', 'xil', 'xin', 'xip', 'xir', 'xis', 'xiv', 'xiy', 'xjb', 'xjt', 'xka', 'xkb', 'xkc', 'xkd', 'xke', 'xkf', 'xkg', 'xkh', 'xki', 'xkj', 'xkk', 'xkl', 'xkn', 'xko', 'xkp', 'xkq', 'xkr', 'xks', 'xkt', 'xku', 'xkv', 'xkw', 'xkx', 'xky', 'xkz', 'xla', 'xlb', 'xlc', 'xld', 'xle', 'xlg', 'xli', 'xln', 'xlo', 'xlp', 'xls', 'xlu', 'xly', 'xma', 'xmb', 'xmc', 'xmd', 'xme', 'xmf', 'xmg', 'xmh', 'xmj', 'xmk', 'xml', 'xmm', 'xmn', 'xmo', 'xmp', 'xmq', 'xmr', 'xms', 'xmt', 'xmu', 'xmv', 'xmw', 'xmx', 'xmy', 'xmz', 'xna', 'xnb', 'xnd', 'xng', 'xnh', 'xni', 'xnk', 'xnn', 'xno', 'xnr', 'xns', 'xnt', 'xnu', 'xny', 'xnz', 'xoc', 'xod', 'xog', 'xoi', 'xok', 'xom', 'xon', 'xoo', 'xop', 'xor', 'xow', 'xpa', 'xpc', 'xpe', 'xpg', 'xpi', 'xpj', 'xpk', 'xpm', 'xpn', 'xpo', 'xpp', 'xpq', 'xpr', 'xps', 'xpt', 'xpu', 'xpy', 'xqa', 'xqt', 'xra', 'xrb', 'xrd', 'xre', 'xrg', 'xri', 'xrm', 'xrn', 'xrq', 'xrr', 'xrt', 'xru', 'xrw', 'xsa', 'xsb', 'xsc', 'xsd', 'xse', 'xsh', 'xsi', 'xsj', 'xsl', 'xsm', 'xsn', 'xso', 'xsp', 'xsq', 'xsr', 'xss', 'xsu', 'xsv', 'xsy', 'xta', 'xtb', 'xtc', 'xtd', 'xte', 'xtg', 'xth', 'xti', 'xtj', 'xtl', 'xtm', 'xtn', 'xto', 'xtp', 'xtq', 'xtr', 'xts', 'xtt', 'xtu', 'xtv', 'xtw', 'xty', 'xtz', 'xua', 'xub', 'xud', 'xug', 'xuj', 'xul', 'xum', 'xun', 'xuo', 'xup', 'xur', 'xut', 'xuu', 'xve', 'xvi', 'xvn', 'xvo', 'xvs', 'xwa', 'xwc', 'xwd', 'xwe', 'xwg', 'xwj', 'xwk', 'xwl', 'xwo', 'xwr', 'xwt', 'xww', 'xxb', 'xxk', 'xxm', 'xxr', 'xxt', 'xya', 'xyb', 'xyj', 'xyk', 'xyl', 'xyt', 'xyy', 'xzh', 'xzm', 'xzp', 'yaa', 'yab', 'yac', 'yad', 'yae', 'yaf', 'yag', 'yah', 'yai', 'yaj', 'yak', 'yal', 'yam', 'yan', 'yao', 'yap', 'yaq', 'yar', 'yas', 'yat', 'yau', 'yav', 'yaw', 'yax', 'yay', 'yaz', 'yba', 'ybb', 'ybd', 'ybe', 'ybh', 'ybi', 'ybj', 'ybk', 'ybl', 'ybm', 'ybn', 'ybo', 'ybx', 'yby', 'ych', 'ycl', 'ycn', 'ycp', 'yda', 'ydd', 'yde', 'ydg', 'ydk', 'yds', 'yea', 'yec', 'yee', 'yei', 'yej', 'yel', 'yen', 'yer', 'yes', 'yet', 'yeu', 'yev', 'yey', 'yga', 'ygi', 'ygl', 'ygm', 'ygp', 'ygr', 'ygs', 'ygu', 'ygw', 'yha', 'yhd', 'yhl', 'yhs', 'yia', 'yif', 'yig', 'yih', 'yii', 'yij', 'yik', 'yil', 'yim', 'yin', 'yip', 'yiq', 'yir', 'yis', 'yit', 'yiu', 'yiv', 'yix', 'yiy', 'yiz', 'yka', 'ykg', 'yki', 'ykk', 'ykl', 'ykm', 'ykn', 'yko', 'ykr', 'ykt', 'yku', 'yky', 'yla', 'ylb', 'yle', 'ylg', 'yli', 'yll', 'ylm', 'yln', 'ylo', 'ylr', 'ylu', 'yly', 'yma', 'ymb', 'ymc', 'ymd', 'yme', 'ymg', 'ymh', 'ymi', 'ymk', 'yml', 'ymm', 'ymn', 'ymo', 'ymp', 'ymq', 'ymr', 'yms', 'ymt', 'ymx', 'ymz', 'yna', 'ynd', 'yne', 'yng', 'ynh', 'ynk', 'ynl', 'ynn', 'yno', 'ynq', 'yns', 'ynu', 'yob', 'yog', 'yoi', 'yok', 'yol', 'yom', 'yon', 'yos', 'yot', 'yox', 'yoy', 'ypa', 'ypb', 'ypg', 'yph', 'ypk', 'ypm', 'ypn', 'ypo', 'ypp', 'ypz', 'yra', 'yrb', 'yre', 'yri', 'yrk', 'yrl', 'yrm', 'yrn', 'yro', 'yrs', 'yrw', 'yry', 'ysc', 'ysd', 'ysg', 'ysl', 'ysn', 'yso', 'ysp', 'ysr', 'yss', 'ysy', 'yta', 'ytl', 'ytp', 'ytw', 'yty', 'yua', 'yub', 'yuc', 'yud', 'yue', 'yuf', 'yug', 'yui', 'yuj', 'yuk', 'yul', 'yum', 'yun', 'yup', 'yuq', 'yur', 'yut', 'yuu', 'yuw', 'yux', 'yuy', 'yuz', 'yva', 'yvt', 'ywa', 'ywg', 'ywl', 'ywn', 'ywq', 'ywr', 'ywt', 'ywu', 'yww', 'yxa', 'yxg', 'yxl', 'yxm', 'yxu', 'yxy', 'yyr', 'yyu', 'yyz', 'yzg', 'yzk', 'zaa', 'zab', 'zac', 'zad', 'zae', 'zaf', 'zag', 'zah', 'zai', 'zaj', 'zak', 'zal', 'zam', 'zao', 'zap', 'zaq', 'zar', 'zas', 'zat', 'zau', 'zav', 'zaw', 'zax', 'zay', 'zaz', 'zbc', 'zbe', 'zbl', 'zbt', 'zbw', 'zca', 'zch', 'zdj', 'zea', 'zeg', 'zeh', 'zen', 'zga', 'zgb', 'zgh', 'zgm', 'zgn', 'zgr', 'zhb', 'zhd', 'zhi', 'zhn', 'zhw', 'zhx', 'zia', 'zib', 'zik', 'zil', 'zim', 'zin', 'zir', 'ziw', 'ziz', 'zka', 'zkb', 'zkd', 'zkg', 'zkh', 'zkk', 'zkn', 'zko', 'zkp', 'zkr', 'zkt', 'zku', 'zkv', 'zkz', 'zle', 'zlj', 'zlm', 'zln', 'zlq', 'zls', 'zlw', 'zma', 'zmb', 'zmc', 'zmd', 'zme', 'zmf', 'zmg', 'zmh', 'zmi', 'zmj', 'zmk', 'zml', 'zmm', 'zmn', 'zmo', 'zmp', 'zmq', 'zmr', 'zms', 'zmt', 'zmu', 'zmv', 'zmw', 'zmx', 'zmy', 'zmz', 'zna', 'znd', 'zne', 'zng', 'znk', 'zns', 'zoc', 'zoh', 'zom', 'zoo', 'zoq', 'zor', 'zos', 'zpa', 'zpb', 'zpc', 'zpd', 'zpe', 'zpf', 'zpg', 'zph', 'zpi', 'zpj', 'zpk', 'zpl', 'zpm', 'zpn', 'zpo', 'zpp', 'zpq', 'zpr', 'zps', 'zpt', 'zpu', 'zpv', 'zpw', 'zpx', 'zpy', 'zpz', 'zqe', 'zra', 'zrg', 'zrn', 'zro', 'zrp', 'zrs', 'zsa', 'zsk', 'zsl', 'zsm', 'zsr', 'zsu', 'zte', 'ztg', 'ztl', 'ztm', 'ztn', 'ztp', 'ztq', 'zts', 'ztt', 'ztu', 'ztx', 'zty', 'zua', 'zuh', 'zum', 'zun', 'zuy', 'zwa', 'zxx', 'zyb', 'zyg', 'zyj', 'zyn', 'zyp', 'zza', 'zzj' ];
      axe.utils.validLangs = function() {
        'use strict';
        return langs;
      };
      return commons;
    }()
  });
})(typeof window === 'object' ? window : this);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var svgXHR = function svgXHR(options) {
  var url = false;
  var baseUrl = undefined;

  options && options.filename ? url = options.filename : null;

  if (!url) return false;
  var _ajax = new XMLHttpRequest();
  var _fullPath;

  if (typeof XDomainRequest !== 'undefined') {
    _ajax = new XDomainRequest();
  }

  if (typeof baseUrl === 'undefined') {
    if (typeof window.baseUrl !== 'undefined') {
      baseUrl = window.baseUrl;
    } else {
      baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/';
    }
  }

  _fullPath = (baseUrl + '/' + url).replace(/([^:]\/)\/+/g, '$1');
  _ajax.open('GET', _fullPath, true);
  _ajax.onprogress = function () {};
  _ajax.onload = function () {
    if (!_ajax.responseText || _ajax.responseText.substr(0, 4) !== '<svg') {
      throw Error('Invalid SVG Response');
    }

    if (_ajax.status < 200 || _ajax.status >= 300) {
      return;
    }
  };
  _ajax.send();
};

module.exports = svgXHR;

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map
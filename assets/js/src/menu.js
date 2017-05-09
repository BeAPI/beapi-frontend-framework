/**
 * Superfish for submenu most of the time in header
 */

// Dependencies
var $ = require('jquery');
var superfish = require('../vendor/superfish');


$('.sf-menu').superfish();

/**
 * Menu Mobile
 */
// Mobile to tablet portrait Only JS
if (matchMedia('(max-width: 1023px)').matches) {
	//console.log("under 1023px");
	// Mega Menu Mobile
	// Open main-menu
	$(".button__menu-open").on("click", function(e){
		e.preventDefault();
		$(".menu__mobile").addClass("opened");
		$("html, body").addClass("menu-mobile--active");
	});
	// Close menu
	$(".button__menu-close").on("click", function(e){
		e.preventDefault();
		$(".menu__mobile").removeClass("opened");
		$("html, body").removeClass("menu-mobile--active");
	});

}

//Tablet Landscape to Desktop only JS
if (matchMedia('(min-width: 1024px) and (orientation:landscape)').matches) {
	//console.log("over 1024px");
	//restore mobile menu in desktop
	$(".menu__mobile").removeClass("opened");
	$("html, body").removeClass("menu-mobile--active");
}


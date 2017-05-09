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
var menuBody = $("html, body"),
	menuOpen = $(".button__menu-open"),
	menuClose = $(".button__menu-close");

menuOpen.on("click", function(){
	menuBody.addClass("menu-mobile--active");
});

// Close menu
menuClose.on("click", function(){
	menuBody.removeClass("menu-mobile--active");
});

if (menuBody.hasClass("menu-mobile--active")) {
	$("#main").on("click", function(){
		menuBody.removeClass("menu-mobile--active");
	});
}

var	resizeBreakpoint = window.matchMedia('(min-width: 1024px)');

resizeBreakpoint.addListener(menuResizing);

function menuResizing(mediaQuery) {
	if (mediaQuery.matches) {
		//enter desktop
		menuBody.removeClass("menu-mobile--active");
	}
}
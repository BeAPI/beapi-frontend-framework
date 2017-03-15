/**
 * Superfish for submenu most of the time in header
 */
jQuery('.sf-menu').superfish();

/**
 * Menu Mobile
 */
var menuBody = jQuery("html, body"),
	menuOpen = jQuery(".button__menu-open"),
	menuClose = jQuery(".button__menu-close");

menuOpen.on("click", function(){
	menuBody.addClass("menu-mobile--active");
});

// Close menu
menuClose.on("click", function(){
	menuBody.removeClass("menu-mobile--active");
});

if (menuBody.hasClass("menu-mobile--active")) {
	jQuery("#main").on("click", function(){
		menuBody.removeClass("menu-mobile--active");
	});
}

var	resizeBreakpoint = window.matchMedia('(min-width: 1024px)');

resizeBreakpoint.addListener(carouselResizing);

function carouselResizing(mediaQuery) {
	if (mediaQuery.matches) {
		//enter desktop
		menuBody.removeClass("menu-mobile--active");
	} else {
		
	}
}
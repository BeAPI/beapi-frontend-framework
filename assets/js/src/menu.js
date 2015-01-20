/**
 * Superfish for submenu most of the time in header
 */
jQuery('.sf-menu').superfish();

/**
 * Menu Mobile
 */

// Relocate menu sample
//var topbar = document.getElementsByClassName("my_menu");
//relocate(768, topbar, document.getElementById("my_menu_destination"), true);

// Mobile Only JS
minwidth(768, false, function() {
	console.log("under 768px");
	//megaMenuMobile
	function menuMobile() {
		// Mega Menu Mobile
		// Open main-menu
		jQuery(".button__menu-open").on("click", function(e){
			e.preventDefault();
			jQuery(".menu__mobile").addClass("opened");
			jQuery("html, body").addClass("menu-mobile--active");
		});
		// Close menu
		jQuery(".button__menu-close").on("click", function(e){
			e.preventDefault();
			jQuery(".menu__mobile").removeClass("opened");
			jQuery("html, body").removeClass("menu-mobile--active");
		});
	}
	//Run menuMobile
	menuMobile();
}, true );

//Desktop only JS
minwidth(768, function() {
	//restore mobile menu in desktop
	jQuery(".menu__mobile").removeClass("opened");
	jQuery("html, body").removeClass("menu-mobile--active");
});


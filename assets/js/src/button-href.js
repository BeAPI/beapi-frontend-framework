// Detect CTRL pressed
var cntrlIsPressed = false;
jQuery(document).keydown(function(event){
    if(event.which==="17") {
    	cntrlIsPressed = true;
    }
});
jQuery(document).keyup(function(){
    cntrlIsPressed = false;
});

// Handle data-href on button components
jQuery('body').on('click', '[data-href]', function (e) {
	var href = jQuery(this).data('href');
	var isBlank = jQuery(this).data('blank');
	if (isBlank || e.which === 2 || cntrlIsPressed) {
		window.open(href, '_blank');
	} else {
		window.location.href = href;
	}
});
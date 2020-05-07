<?php

/**
 * Load all services
 */
add_action( 'after_setup_theme', function () {
	// Boot the service, at after_setup_theme.
	\BEA\Theme\Framework\Framework::get_container()->boot_services();
} );

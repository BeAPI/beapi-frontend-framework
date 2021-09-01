<?php

/**
 * Load all services
 */
add_action(
	'after_setup_theme',
	function () {
		// Boot the service, at after_setup_theme.
		\BEA\Theme\Framework\Framework::get_container()->boot_services();
	}
);
require_once __DIR__ . '/inc/Helpers/Svg.php';
require_once __DIR__ . '/inc/Helpers/Helper.php';

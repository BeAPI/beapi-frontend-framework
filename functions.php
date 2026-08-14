<?php

/**
 * Bootstrap the theme Composer autoloader when classes are not already available.
 *
 * Root projects (Bedrock, composer-scaffold-theme) usually register this namespace
 * via their own autoload. Standalone setups (wp-env, theme-only) rely on vendor/.
 *
 * @since 5.4.0
 */
if ( ! class_exists( 'BEA\\Theme\\Framework\\Framework', false ) ) {
	$autoloader = __DIR__ . '/vendor/autoload.php';

	if ( file_exists( $autoloader ) ) {
		require_once $autoloader;
	}
}

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
require_once __DIR__ . '/inc/Helpers/Formatting/Datetime.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Escape.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Image.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Link.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Share.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Term.php';
require_once __DIR__ . '/inc/Helpers/Formatting/Text.php';
require_once __DIR__ . '/inc/Helpers/Pattern_Content.php';
require_once __DIR__ . '/inc/Helpers/Custom_Menu_Walker.php';

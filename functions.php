<?php
/**
 * Autoload all the things \o/
 */
require_once 'autoload.php';

/**
 * Load all services
 */
add_action( 'after_setup_theme', function () {
	// Boot the service, at after_setup_theme.
	\BEA\Theme\Framework\Framework::get_container()->boot_services();
} );

/**
 * Handle wp_body_open new function from WP 5.2
 * @see https://make.wordpress.org/themes/2019/03/29/addition-of-new-wp_body_open-hook/
 * @see https://make.wordpress.org/core/2019/04/24/miscellaneous-developer-updates-in-5-2/
 */
if ( ! function_exists( 'wp_body_open' ) ) {
	function wp_body_open() {
		do_action( 'wp_body_open' );
	}
}

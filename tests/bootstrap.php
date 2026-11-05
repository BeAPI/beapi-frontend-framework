<?php
/**
 * PHPUnit bootstrap file.
 *
 * Runs the theme tests against a real WordPress installation (wp-env), with the theme active
 * and ACF loaded as required by the theme.
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

if ( ! $_tests_dir || ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find the WordPress tests library, run the tests inside wp-env: npm run test:php" . PHP_EOL;
	exit( 1 );
}

if ( ! defined( 'WP_TESTS_CONFIG_FILE_PATH' ) ) {
	define( 'WP_TESTS_CONFIG_FILE_PATH', __DIR__ . '/wp-tests-config.php' );
}

require_once $_tests_dir . '/includes/functions.php';

// The theme stops the front-end without ACF, load it like in production.
tests_add_filter(
	'muplugins_loaded',
	static function (): void {
		require WP_PLUGIN_DIR . '/advanced-custom-fields/acf.php';
	}
);

require $_tests_dir . '/includes/bootstrap.php';

<?php
/**
 * WordPress integration test configuration for local wp-env.
 *
 * The tests bootstrap recreates its tables: never point it at a shared or production database.
 */

$database_defaults = [
	'DB_NAME'     => 'wordpress',
	'DB_USER'     => 'root',
	'DB_PASSWORD' => 'password',
	'DB_HOST'     => 'mysql',
];

foreach ( $database_defaults as $constant => $default ) {
	$value = getenv( 'WORDPRESS_' . $constant );
	define( $constant, false !== $value && '' !== $value ? $value : $default );
}

define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

// Different from the browser site prefix (wp_) of the same environment.
$table_prefix = getenv( 'WP_TESTS_TABLE_PREFIX' ) ?: 'wptests_'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Be API Frontend Framework tests' );
define( 'WP_PHP_BINARY', 'php' );
define( 'WP_DEFAULT_THEME', 'beapi-frontend-framework' );
define( 'ABSPATH', '/var/www/html/' );

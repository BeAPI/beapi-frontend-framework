<?php
/**
 * Autoload all the things \o/
 */
require_once 'autoload.php';

$theme = new \BEA\Theme\Framework\Theme();

// Services
$theme->register_service( \BEA\Theme\Framework\Assets::class );
$theme->register_service( \BEA\Theme\Framework\Assets_CSS_Async::class );
$theme->register_service( \BEA\Theme\Framework\Assets_JS_Async::class );
$theme->register_service( \BEA\Theme\Framework\SVG::class );
$theme->register_service( \BEA\Theme\Framework\Favicons::class );
$theme->register_service( \BEA\Theme\Framework\Acf::class );
$theme->register_service( \BEA\Theme\Framework\Sidebar::class );
$theme->register_service( \BEA\Theme\Framework\Menu::class );

// Services as Tools
$theme->register_service( \BEA\Theme\Framework\Tools\Body_Class::class );
$theme->register_service( \BEA\Theme\Framework\Tools\Template_Parts::class );

// Register the service, at after_setup_theme
$theme->register();

/**
 * Add a filter for getting the theme class.
 */
add_filter( 'Bea\Theme\Framework\Theme', function() use ($theme) {
	return $theme;
} );

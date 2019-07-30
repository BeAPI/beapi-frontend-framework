<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Assets_CSS_Async
 *
 * @package BEA\Theme\Framework
 */
class Assets_Fonts_Async implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'assets-fonts-async';
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		if ( current_theme_supports( 'async-fonts' ) && ! is_admin() ) {
			add_action( 'wp_footer', [ $this, 'load_font' ], 0 );
		}
	}

	/**
	 * Add loadJS function and load font async js
	 * @author Nicolas JUEN
	 */
	public function load_font() {
		get_template_part( 'inc/async/loadfont' );
	}
}
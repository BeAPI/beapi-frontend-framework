<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class SVG
 *
 * @package BEA\Theme\Framework
 */
class SVG implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		add_action( 'wp_footer', [ $this, 'footer_icons' ] );
		add_action( 'embed_footer', [ $this, 'footer_icons' ] );
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'svg';
	}

	public function footer_icons() {
		if ( ! file_exists( \get_theme_file_path( '/dist/assets/icons/icons.svg' ) ) ) {
			if ( defined('WP_DEBUG') && WP_DEBUG == true ) {
				echo '<!-- No SVG File found -->';
			}

			return;
		}

		require_once( \get_theme_file_path( '/dist/assets/icons/icons.svg' ) );
	}
}

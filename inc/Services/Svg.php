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
		if ( ! file_exists( \get_theme_file_path( '/dist/assets/img/icons/icons.svg' ) ) ) {
			if ( defined('WP_DEBUG') && WP_DEBUG == true ) {
				echo '<!-- No SVG File found -->';
			}

			return;
		}

		require_once( \get_theme_file_path( '/dist/assets/img/icons/icons.svg' ) );
	}

	/**
	 * @param       $icon_class
	 * @param array $additionnal_classes
	 *
	 * @return string
	 */
	public function get_the_icon( $icon_class, $additionnal_classes = array() ) {
		$classes[] = 'icon';
		$classes[] = sprintf( 'icon-%s', $icon_class );
		$classes   = array_merge( $classes, $additionnal_classes );
		$classes   = array_map('sanitize_html_class', $classes );

		return sprintf( '<svg class="%s" aria-hidden="true" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-%s"></use></svg>', implode( ' ', $classes ), $icon_class );
	}

	/**
	 * @param       $icon_class
	 * @param array $additionnal_classes
	 */
	public function the_icon( $icon_class, $additionnal_classes = array() ) {
		echo $this->get_the_icon( $icon_class, $additionnal_classes );
	}
}

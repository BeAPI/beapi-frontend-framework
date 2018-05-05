<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Assets_CSS_Async
 *
 * @package BEA\Theme\Framework
 */
class Assets_CSS_Async implements Service {

	/**
	 * CSS handlers for the themes.
	 * @var array : the theme styles to async load
	 */
	private $css_handlers = [ 'theme-style' => true ];

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		if ( current_theme_supports( 'async-css' ) && ! is_admin() ) {
			add_filter( 'style_loader_tag', [ $this, 'style_loader_tag' ], 20, 4 );
			add_action( 'wp_head', [ $this, 'load_css' ], 0 );
			add_action( 'wp_footer', [ $this, 'load_js' ], 0 );
		}
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'assets-css-async';
	}

	/**
	 * @param $handler
	 */
	public function add_handler( $handler ) {
		$this->css_handlers[ $handler ] = true;
	}

	/**
	 * Replace default generated WP Link Tag
	 *
	 * @param string $html The link tag for the enqueued style.
	 * @param string $handle The style's registered handle.
	 * @param string $href The stylesheet's source URL.
	 * @param string $media The stylesheet's media attribute.
	 *
	 * @return string
	 * @author Alexandre Sadowski
	 */
	public function style_loader_tag( $html, $handle, $href, $media ) {
		if ( ! isset( $this->css_handlers[ $handle ] ) ) {
			return $html;
		}

		return sprintf( '<link rel="preload" href="%s" as="style" onload="this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="%s"></noscript>', esc_url( $href ), esc_url( $href ) );
	}

	/**
	 * Add loadCSS function and overlay style
	 * @author Alexandre Sadowski
	 */
	public function load_css() {
		get_template_part( 'inc/async/loadcss' );
	}

	/**
	 * Add loadJS function and load font async js
	 * @author Alexandre Sadowski
	 */
	public function load_js() {
		get_template_part( 'inc/async/loadjs' );
	}
}
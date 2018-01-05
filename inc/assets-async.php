<?php

namespace BEA\Theme\Framework;


class Assets_Async implements Service {

	private $handler = 'theme-style';

	public function register() {
		if ( ! current_theme_supports( 'async-css' ) || is_admin() ) {
			return;
		}

		add_filter( 'style_loader_tag', array( $this, 'style_loader_tag' ), 20, 4 );
		add_action( 'wp_head', array( $this, 'load_css' ), 0 );
		add_action( 'wp_footer', array( $this, 'load_js' ), 0 );
	}

	public function get_service_name() {
		return 'assets-async';
	}

	public function set_handler( $handler ) {
		$this->handler = (string) $handler;
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
		if ( $this->handler !== $handle ) {
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
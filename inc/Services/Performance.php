<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Performance
 *
 * @package BEA\Theme\Framework
 */
class Performance implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		/**
		 * Add hooks for the scripts and styles to hook on
		 */
		add_action( 'wp', [ $this, 'register_assets' ] );
		add_action( 'wp_head', [ $this, 'preload_fonts' ], 1 );
		add_filter( 'get_custom_logo_image_attributes', [ $this, 'deprioritize_custom_logo' ], 20 );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'performance';
	}

	/**
	 * Register all the Theme assets
	 */
	public function register_assets(): void {
		if ( is_admin() ) {
			return;
		}
		// Passive touchstart
		wp_add_inline_script( 'jquery', $this->passive_touchstart() );
	}

	/**
	 * Preload the woff2 fonts used by the above-the-fold content.
	 *
	 * Opt-in: the list is empty by default. Only preload fonts that are actually
	 * rendered on first paint, otherwise they compete with the LCP resource.
	 *
	 * @usage add_filter( 'bea_theme_framework_preload_fonts', fn() => [ 'dist/fonts/my-font.woff2' ] );
	 *
	 * @return void
	 */
	public function preload_fonts(): void {
		if ( is_admin() ) {
			return;
		}

		/**
		 * Filter the font files to preload, relative to the theme root.
		 *
		 * @param string[] $fonts Font paths relative to the theme root. Default empty.
		 */
		$fonts = apply_filters( 'bea_theme_framework_preload_fonts', [] );
		if ( ! is_array( $fonts ) ) {
			return;
		}

		foreach ( $fonts as $relative_path ) {
			if ( ! is_string( $relative_path ) || '' === $relative_path ) {
				continue;
			}

			$relative_path = ltrim( $relative_path, '/' );
			$path          = get_theme_file_path( $relative_path );
			if ( ! is_readable( $path ) ) {
				continue;
			}

			printf(
				'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
				esc_url( get_theme_file_uri( $relative_path ) )
			);
		}
	}

	/**
	 * Prevent the site logo from competing with the real LCP candidate.
	 *
	 * @param array $custom_logo_attr Image attributes for the custom logo.
	 *
	 * @return array
	 */
	public function deprioritize_custom_logo( $custom_logo_attr ): array {
		if ( ! is_array( $custom_logo_attr ) ) {
			return [];
		}

		$custom_logo_attr['fetchpriority'] = 'low';

		return $custom_logo_attr;
	}

	/**
	 * Add passsive touchstart for performance
	 * @return string
	 */
	public function passive_touchstart(): string {
		return 'jQuery.event.special.touchstart={setup:function(e,t,s){this.addEventListener("touchstart",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.touchmove={setup:function(e,t,s){this.addEventListener("touchmove",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.wheel={setup:function(e,t,s){this.addEventListener("wheel",s,{passive:!0})}},jQuery.event.special.mousewheel={setup:function(e,t,s){this.addEventListener("mousewheel",s,{passive:!0})}};';
	}
}

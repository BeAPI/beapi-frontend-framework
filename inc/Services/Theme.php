<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Theme implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		$this->after_setup_theme();
		add_filter( 'ari_responsive_image_default_img_path', [ $this, 'set_ari_responsive_image_default_img_path' ] );
		add_filter( 'ari_responsive_image_default_img_name', [ $this, 'set_ari_responsive_image_default_img_name' ] );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'theme';
	}

	/**
	 * After setup theme
	 */
	public function after_setup_theme(): void {
		/**
		 * Init the supports.
		 */
		$this->add_theme_supports();
		$this->remove_theme_supports();

		/**
		 * Load translations.
		 */
		$this->i18n();
	}

	/**
	 * Set theme supports
	 */
	private function add_theme_supports(): void {
		// Add the theme support basic elements
		add_theme_support( 'align-wide' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', [ 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'script', 'style' ] );
		add_theme_support( 'title-tag' );
		add_theme_support( 'async-js' );
		add_theme_support( 'yoast-seo-breadcrumbs' );
	}

	/**
	 * Remove theme supports
	 */
	private function remove_theme_supports(): void {
		// remove the theme support basic elements
		remove_theme_support( 'core-block-patterns' );
	}

	/**
	 * i18n
	 */
	private function i18n(): void {
		// Load theme texdomain
		load_theme_textdomain( 'framework-textdomain', \get_theme_file_path( '/languages' ) );
	}

	/**
	 * Set default path for ARI for minified files
	 *
	 * @param string $attr
	 *
	 * @return string
	 *
	 */
	public function set_ari_responsive_image_default_img_path( string $attr ): string {
		/**
		 * @psalm-suppress PossiblyInvalidMethodCall
		 * @psalm-suppress UndefinedInterfaceMethod
		 */
		if ( ! Framework::get_container()->get_service( 'assets' )->is_minified() ) {
			return $attr;
		}

		return '/dist/';
	}

	/**
	 * Set ari default image name for minified files
	 *
	 * @param string $default_img
	 *
	 * @return string
	 *
	 */
	public function set_ari_responsive_image_default_img_name( string $default_img ): string {
		/**
		 * @psalm-suppress PossiblyInvalidMethodCall
		 * @psalm-suppress UndefinedInterfaceMethod
		 */
		if ( ! Framework::get_container()->get_service( 'assets' )->is_minified() ) {
			return $default_img;
		}

		return $this->get_min_image( $default_img );
	}

	/**
	 * Get minified default_image
	 *
	 * @param string $original_image
	 *
	 * @return string
	 *
	 */
	protected function get_min_image( string $original_image ): string {

		if ( empty( $original_image ) ) {
			return $original_image;
		}

		if ( ! file_exists( \get_theme_file_path( '/dist/assets.json' ) ) ) {
			return $original_image;
		}

		$json   = file_get_contents( \get_theme_file_path( '/dist/assets.json' ) ); //phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$assets = json_decode( $json, true );

		if ( empty( $assets ) || JSON_ERROR_NONE !== json_last_error() ) {
			return $original_image;
		}

		return $assets[ 'assets/' . $original_image ] ?: $original_image;
	}
}

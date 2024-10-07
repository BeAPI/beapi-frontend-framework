<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Theme implements Service {

	/**
	 * @var Service|bool
	 */
	protected $asset;

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		$this->asset = $container->get_service( 'assets' );
		$this->after_setup_theme();
		/**
		 * @psalm-suppress PossiblyInvalidMethodCall
		 * @psalm-suppress UndefinedInterfaceMethod
		 */
		if ( $this->asset->is_minified() ) {
			add_filter( 'ari_responsive_image_default_img_path', [ $this, 'set_ari_responsive_image_default_img_path' ] );
			add_filter( 'ari_responsive_image_default_img_name', [ $this, 'set_ari_responsive_image_default_img_name' ] );
		}
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
	 * @return string
	 */
	public function set_ari_responsive_image_default_img_path(): string {
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
		return $this->get_min_default_image( $default_img );
	}

	/**
	 * Get minified default_image
	 *
	 * @param string $original_image
	 *
	 * @return string
	 *
	 * @author Léonard Phoumpakka
	 */
	public function get_min_default_image( string $original_image ): string {
		return $this->asset->get_min_file( 'assets/' . $original_image );
	}
}

<?php

namespace BEA\Theme\Framework\Services;

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
		$this->add_images_sizes();

		/**
		 * Load images sizes in Gutenberg.
		 */
		add_filter( 'image_size_names_choose', [ $this, 'image_size_names_choose' ] );

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
		load_theme_textdomain( 'beapi-frontend-framework', \get_theme_file_path( '/languages' ) );
	}

	/**
	 * Add images sizes for Gutenberg
	 */
	private function add_images_sizes(): void {
		add_image_size( 'landscape', 600, 400, true );
		add_image_size( 'landscape-2x', 1200, 800, true );
	}

	/**
	 * Display custom image sizes in Gutenberg
	 * If you use the WP-THUMB plugin, force to Generate this images (bypass the bea-wp-thumb mu-plugin to restart the generation)
	 *
	 * @param array $sizes
	 *
	 * @return array
	 */
	public function image_size_names_choose( array $sizes ): array {
		return array_merge(
			$sizes,
			[
				'landscape' => __( 'Landscape - 600 x 400', 'beapi-frontend-framework' ),
			]
		);
	}
}

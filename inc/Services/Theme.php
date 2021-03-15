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
	 * i18n
	 */
	private function i18n(): void {
		// Load theme texdomain
		load_theme_textdomain( 'framework-textdomain', \get_theme_file_path( '/languages' ) );
	}
}

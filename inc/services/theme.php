<?php

namespace BEA\Theme\Framework\Services;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;


class Theme implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		$this->after_setup_theme();
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'theme';
	}

	/**
	 * After setup theme
	 */
	public function after_setup_theme() {
		/**
		 * Init the supports.
		 */
		$this->add_theme_supports();

		/**
		 * Load translations.
		 */
		$this->i18n();

		/**
		 * Load editor style css.
		 */
		$this->editor_style();
	}

	/**
	 * Set theme supports
	 */
	private function add_theme_supports() {
		// Add the theme support basic elements
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', [ 'comment-list', 'comment-form', 'search-form' ] );
		add_theme_support( 'title-tag' );
		add_theme_support( 'async-css' );
		add_theme_support( 'async-js' );
		add_theme_support( 'yoast-seo-breadcrumbs' );
	}

	/**
	 * i18n
	 */
	private function i18n() {
		// Load theme texdomain
		load_theme_textdomain( 'framework-textdomain', \get_theme_file_path( '/languages' ) );
	}

	/**
	 * editor style
	 */
	private function editor_style() {
		add_editor_style('dist/assets/editor-style.css');
	}
}

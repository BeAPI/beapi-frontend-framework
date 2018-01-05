<?php

namespace BEA\Theme\Framework;

use BEA\Theme\Framework\Tools\Assets as Assets_Tools;

class Assets implements Service{
	public function register() {

		/**
		 * Add hooks for the scripts and styles to hook on
		 */
		add_action( 'wp', [ $this, 'register_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_print_styles', [ $this, 'enqueue_styles' ] );
		add_filter( 'stylesheet_uri', [ $this, 'stylesheet_uri' ] );
	}

	public function get_service_name() {
		return 'assets';
	}

	/**
	 * Register all the Theme assets
	 */
	public function register_assets() {
		if ( is_admin() ) {
			return;
		}

		/**
		 * Assets handler
		 */
		$assets = new Assets_Tools();

		// Js theme
		// Theme js dependencies
		$scripts_dependencies = array( 'jquery' );

		// Domready scripts
		$assets->register_script( 'modernizr', 'assets/js/vendor_async/modernizr.custom.min.js', null, "2.6.2", false );
		$assets->register_script( 'scripts', 'assets/js/scripts.min.js', $scripts_dependencies, '1', true );

		//Css
		$theme = wp_get_theme();
		wp_register_style( 'theme-style', get_stylesheet_uri(), array(), $theme->Version );
	}

	/**
	 * Enqueue the scripts
	 *
	 *
	 */
	public function enqueue_scripts() {
		/**
		 * Assets handler
		 */
		$assets = new Assets_Tools();

		// JS
		$assets->enqueue_script( 'scripts' );
		$assets->enqueue_script( 'scripts' );
	}

	/**
	 * Enqueue the styles
	 *
	 *
	 */
	public function enqueue_styles() {
		/**
		 * Assets handler
		 */
		$assets = new Assets_Tools();

		// CSS
		$assets->enqueue_style( 'theme-style' );
	}

	/**
	 * The stylesheet uri based on the dev or not constant
	 *
	 * @param $stylesheet_uri
	 *
	 * @return string
	 * @author Nicolas Juen
	 */
	public function stylesheet_uri( $stylesheet_uri ) {
		if ( file_exists( \get_theme_file_path( '/assets/css/style.min.css' ) ) ) {
			return \get_theme_file_uri( '/assets/css/style.min.css' );
		}

		return $stylesheet_uri;
	}
}

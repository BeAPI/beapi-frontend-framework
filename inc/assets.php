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
		$theme = wp_get_theme();
		/**
		 * Assets handler
		 */
		$assets = new Assets_Tools();

		// Js theme
		// Theme js dependencies
		$scripts_dependencies = array( 'jquery' );

		$assets->register_script( 'matchmedia-polyfill', 'assets/js/vendor_ie/matchmedia-polyfill.js', [], '1', false );
		wp_script_add_data( 'matchmedia-polyfill', 'conditional', 'lte IE 9' );

		$assets->register_script( 'matchMedia-addListener', 'assets/js/vendor_ie/matchMedia.addListener.js', [], '1', false );
		wp_script_add_data( 'matchmedia-addListener', 'conditional', 'lte IE 9' );

		$assets->register_script( 'placeholders', 'assets/js/vendor_ie/placeholders.min.js', [], '1', false );
		wp_script_add_data( 'placeholders', 'conditional', 'lte IE 9' );

		$assets->register_script( 'html5shiv', 'assets/js/vendor_ie/html5shiv.min.js', [], '1', false );
		wp_script_add_data( 'html5shiv', 'conditional', 'lt IE 9' );

		$assets->register_script( 'selectivizr', 'assets/js/vendor_ie/selectivizr.js', [], '1', false );
		wp_script_add_data( 'selectivizr', 'conditional', 'lte IE 8' );

		$assets->register_script( 'modernizr', 'assets/js/vendor_async/modernizr.custom.min.js', [], '1', false );

		// Async and footer
		$file = ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false ) ? $this->get_min_file( 'js' ) : 'app.js';
		$assets->register_script( 'scripts', 'dist/assets/' . $file, $scripts_dependencies, $theme->get( 'Version' ), true );

		// CSS
		wp_register_style( 'theme-style', get_stylesheet_uri(), [], $theme->get( 'Version' ) );
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
		$assets->enqueue_script( 'matchmedia-polyfill' );
		$assets->enqueue_script( 'matchmedia-addListener' );
		$assets->enqueue_script( 'placeholders' );
		$assets->enqueue_script( 'html5shiv' );
		$assets->enqueue_script( 'selectivizr' );
		$assets->enqueue_script( 'modernizr' );
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
		if ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false ) {
			$file = $this->get_min_file( 'css' );
			if ( ! empty( $file ) && file_exists( \get_theme_file_path( '/dist/assets/' . $file ) ) ) {
				return \get_theme_file_uri( '/dist/assets/' . $file );
			}
		}

		if ( file_exists( \get_theme_file_path( '/dist/assets/app.css' ) ) ) {
			return \get_theme_file_uri( '/dist/assets/app.css' );
		}

		return $stylesheet_uri;
	}

	/**
	 * Return JS/CSS .min file based on assets.json
	 *
	 * @param $type
	 *
	 * @return bool|null
	 */
	public function get_min_file( $type ) {
		if ( empty( $type ) ) {
			return false;
		}

		if ( ! file_exists( \get_theme_file_path( '/dist/assets/assets.json' ) ) ) {
			return false;
		}

		$json   = file_get_contents( \get_theme_file_path( '/dist/assets/assets.json' ) );
		$assets = json_decode( $json, true );

		if ( empty( $assets ) ) {
			return false;
		}

		switch ( $type ) {
			case 'css':
				$file = $assets['app.css'];
				break;
			case 'js':
				$file = $assets['app.js'];
				break;
			default:
				$file = null;
				break;
		}

		if ( empty( $file ) ) {
			return false;
		}

		return $file;
	}
}

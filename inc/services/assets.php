<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Assets as Assets_Tools;

/**
 * Class Assets
 *
 * @package BEA\Theme\Framework
 */
class Assets implements Service{

	/**
	 * @var \BEA\Theme\Framework\Tools\Assets
	 */
	private $assets_tools;

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {
		$this->assets_tools = new Assets_Tools();
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		/**
		 * Add hooks for the scripts and styles to hook on
		 */
		add_action( 'wp', [ $this, 'register_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_print_styles', [ $this, 'enqueue_styles' ] );
		add_filter( 'stylesheet_uri', [ $this, 'stylesheet_uri' ] );
	}

	/**
	 * @return string
	 */
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

		// Js theme
		// Theme js dependencies
		$scripts_dependencies = [ 'jquery' ];

		$this->assets_tools->register_script( 'matchMedia-polyfill', 'dist/assets/js/vendor_ie/matchMedia-polyfill.js', [], '1', false );
		wp_script_add_data( 'matchMedia-polyfill', 'conditional', 'lte IE 9' );

		$this->assets_tools->register_script( 'matchMedia-addListener', 'dist/assets/js/vendor_ie/matchMedia.addListener.js', [], '1', false );
		wp_script_add_data( 'matchMedia-addListener', 'conditional', 'lte IE 9' );

		$this->assets_tools->register_script( 'placeholders', 'dist/assets/js/vendor_ie/placeholders.min.js', [], '1', false );
		wp_script_add_data( 'placeholders', 'conditional', 'lte IE 9' );

		// Async and footer
		$file = ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false ) ? $this->get_min_file( 'js' ) : 'app.js';
		$this->assets_tools->register_script( 'scripts', 'dist/assets/' . $file, $scripts_dependencies, $theme->get( 'Version' ), true );

		// CSS
		wp_register_style( 'theme-style', get_stylesheet_uri(), [], $theme->get( 'Version' ) );
	}

	/**
	 * Enqueue the scripts
	 */
	public function enqueue_scripts() {
		// JS
		$this->assets_tools->enqueue_script( 'matchMedia-polyfill' );
		$this->assets_tools->enqueue_script( 'matchMedia-addListener' );
		$this->assets_tools->enqueue_script( 'placeholders' );
		$this->assets_tools->enqueue_script( 'scripts' );
	}

	/**
	 * Enqueue the styles
	 */
	public function enqueue_styles() {

		// CSS
		$this->assets_tools->enqueue_style( 'theme-style' );
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
			case 'editor-style':
				$file = $assets['editor-style.css'];
				break;
			case 'js':
				$file = $assets['app.js'];
				break;
			default:
				$file = null;
				break;
		}

		// Custom type
		if ( ! empty( $assets[ $type ] ) ) {
			$file = $assets[ $type ];
		}

		if ( empty( $file ) ) {
			return false;
		}

		return $file;
	}
}

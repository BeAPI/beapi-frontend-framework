<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Assets as Assets_Tools;
use function json_last_error;
use const JSON_ERROR_NONE;

/**
 * Class Assets
 *
 * @package BEA\Theme\Framework
 */
class Assets implements Service {

	/**
	 * @var \BEA\Theme\Framework\Tools\Assets
	 */
	private $assets_tools;

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
		$this->assets_tools = new Assets_Tools();
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		/**
		 * Add hooks for the scripts and styles to hook on
		 */
		add_action( 'wp', [ $this, 'register_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_print_styles', [ $this, 'enqueue_styles' ] );
		add_filter( 'stylesheet_uri', [ $this, 'stylesheet_uri' ] );
		add_filter( 'wp_login_page_theme_css', [ $this, 'login_stylesheet_uri' ] );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'assets';
	}

	/**
	 * Register all the Theme assets
	 */
	public function register_assets(): void {
		if ( is_admin() ) {
			return;
		}
		$theme = wp_get_theme();

		// Js theme
		// Theme js dependencies
		$scripts_dependencies = [ 'jquery', 'global-polyfill' ];

		// Polyfill
		\wp_register_script( 'global-polyfill', 'https://cdn.polyfill.io/v3/polyfill.min.js?features=es5,es6,fetch,Array.prototype.includes,CustomEvent,Element.prototype.closest,NodeList.prototype.forEach', null, null, true ); //phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion

		// Passive touchstart
		wp_add_inline_script( 'jquery', $this->passive_touchstart() );

		// Async and footer
		$file = $this->is_minified() ? $this->get_min_file( 'js' ) : 'app.js';

		// Do not add version if minified
		$version = $this->is_minified() ? null : $theme->get( 'Version' );
		$this->assets_tools->register_script( 'scripts', 'dist/' . $file, $scripts_dependencies, $version, true );

		// CSS
		wp_register_style( 'theme-style', get_stylesheet_uri(), [], $version );
	}

	/**
	 * Enqueue the scripts
	 */
	public function enqueue_scripts(): void {
		// JS
		$this->assets_tools->enqueue_script( 'scripts' );
	}

	/**
	 * Enqueue the styles
	 */
	public function enqueue_styles(): void {
		// CSS
		$this->assets_tools->enqueue_style( 'theme-style' );
	}

	/**
	 * The stylesheet uri based on the dev or not constant
	 *
	 * @param string $stylesheet_uri
	 *
	 * @return string
	 * @author Nicolas Juen
	 */
	public function stylesheet_uri( string $stylesheet_uri ): string {
		if ( $this->is_minified() ) {
			$file = $this->get_min_file( 'css' );
			if ( ! empty( $file ) && file_exists( \get_theme_file_path( '/dist/' . $file ) ) ) {
				return \get_theme_file_uri( '/dist/' . $file );
			}
		}

		if ( file_exists( \get_theme_file_path( '/dist/app.css' ) ) ) {
			return \get_theme_file_uri( '/dist/app.css' );
		}

		return $stylesheet_uri;
	}

	/**
	 * Return JS/CSS .min file based on assets.json
	 *
	 * @param string $type
	 *
	 * @return string
	 */
	public function get_min_file( string $type ): string {
		if ( empty( $type ) ) {
			return '';
		}

		if ( ! file_exists( \get_theme_file_path( '/dist/assets.json' ) ) ) {
			return '';
		}

		$json   = file_get_contents( \get_theme_file_path( '/dist/assets.json' ) ); //phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$assets = json_decode( $json, true );

		if ( empty( $assets ) || JSON_ERROR_NONE !== json_last_error() ) {
			return '';
		}

		switch ( $type ) {
			case 'css':
				$file = $assets['app.css'];
				break;
			case 'editor.css':
				$file = $assets['editor.css'];
				break;
			case 'login':
				$file = $assets['login.css'];
				break;
			case 'editor.js':
				$file = $assets['editor.js'];
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
			return '';
		}

		return $file;
	}

	/**
	 * Check if we are on minified environment.
	 *
	 * @return bool
	 * @author Nicolas JUEN
	 */
	private function is_minified(): bool {
		return ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false );
	}

	/**
	 * Change login CSS URL
	 * @return string
	 */
	public function login_stylesheet_uri(): string {
		return $this->is_minified() ? 'dist/' . $this->get_min_file( 'login' ) : 'dist/login.css';
	}

	/**
	 * Add passsive touchstart for performance
	 * @return string
	 */
	public function passive_touchstart(): string {
		return 'if ("ontouchstart" in document.documentElement) {document.addEventListener("touchstart", onTouchStart, {passive: true});}';
	}

}

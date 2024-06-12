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
	 * @var Assets_Tools
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
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
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

		// Do not add a versioning query param in assets URLs if minified
		$version = $this->is_minified() ? null : $theme->get( 'Version' );

		// Js
		$file       = $this->is_minified() ? $this->get_min_file( 'js' ) : 'app.js';
		$asset_data = $this->get_asset_data( $file );
		$this->assets_tools->register_script(
			'scripts',
			'dist/' . $file,
			array_merge( [ 'jquery' ], $asset_data['dependencies'] ), // ensure jQuery dependency is set even if not declared explicitly in the JS
			$asset_data['version'],
			true
		);

		wp_add_inline_script(
			'scripts',
			'const THEME_DATA = ' . wp_json_encode(
				[
					'themeUri' => get_template_directory_uri(),
				]
			),
		);

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
	 * Retrieve data for a compiled asset file.
	 *
	 * Asset data are produced by the webpack dependencies extraction plugin. They contain for each asset the list of
	 * dependencies use by the asset and a hash representing the current version of the asset.
	 *
	 * @param string $file The asset name including its extension, eg: app.js, app-min.js
	 *
	 * @return array{dependencies: string[], version:string} The asset data if available or an array with the default keys.
	 */
	public function get_asset_data( string $file ): array {
		static $cache_data;

		$empty_asset_data = [
			'dependencies' => [],
			'version'      => '',
		];

		$file = trim( $file );
		if ( empty( $file ) ) {
			return $empty_asset_data;
		}

		if ( isset( $cache_data[ $file ] ) ) {
			return $cache_data[ $file ];
		}

		$filename = strtok( $file, '.' );
		$file     = sprintf( '/dist/%s.asset.php', $filename );
		if ( ! file_exists( \get_theme_file_path( $file ) ) ) {
			$cache_data[ $file ] = $empty_asset_data;
			return $cache_data[ $file ];
		}

		$cache_data[ $file ] = require \get_theme_file_path( $file );

		return $cache_data[ $file ];
	}

	/**
	 * Check if we are on minified environment.
	 *
	 * @return bool
	 * @author Nicolas JUEN
	 */
	public function is_minified(): bool {
		return ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false );
	}

	/**
	 * Change login CSS URL
	 * @return string
	 */
	public function login_stylesheet_uri(): string {
		return $this->is_minified() ? 'dist/' . $this->get_min_file( 'login' ) : 'dist/login.css';
	}
}

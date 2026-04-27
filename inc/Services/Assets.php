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

		// JavaScript
		$file       = $this->get_min_file( 'js' );
		$asset_data = $this->get_asset_data( $file );
		$this->assets_tools->register_script(
			'scripts',
			'dist/' . $file,
			array_merge( [ 'jquery' ], $asset_data['dependencies'] ), // ensure jQuery dependency is set even if not declared explicitly in the JS
			$asset_data['version'],
			[ 'strategy' => 'defer' ]
		);

		wp_add_inline_script(
			'scripts',
			'const THEME_DATA = ' . wp_json_encode(
				[
					'themeUri' => get_template_directory_uri(),
				]
			),
		);

		// Styles
		wp_register_style( 'theme-style', get_stylesheet_uri(), [], $theme->get( 'Version' ) );
	}

	/**
	 * Enqueue the scripts
	 */
	public function enqueue_scripts(): void {
		// JavaScript
		$this->assets_tools->enqueue_script( 'scripts' );
	}

	/**
	 * Enqueue the styles
	 */
	public function enqueue_styles(): void {
		// Styles
		$this->assets_tools->enqueue_style( 'theme-style' );
	}

	/**
	 * Point the theme stylesheet to the built CSS in `dist/` when `assets.json` is present.
	 *
	 * @param string $stylesheet_uri Default theme stylesheet URI.
	 *
	 * @return string
	 * @author Nicolas Juen
	 */
	public function stylesheet_uri( string $stylesheet_uri ): string {
		$file = $this->get_min_file( 'css' );

		if ( ! empty( $file ) && file_exists( \get_theme_file_path( '/dist/' . $file ) ) ) {
			return \get_theme_file_uri( '/dist/' . $file );
		}

		if ( file_exists( \get_theme_file_path( '/dist/app.css' ) ) ) {
			return \get_theme_file_uri( '/dist/app.css' );
		}

		return $stylesheet_uri;
	}

	/**
	 * Return the compiled asset filename for a type from `assets.json`.
	 *
	 * @param string $type Asset type key (e.g. `js`, `css`, `editor.js`).
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
	 * @param string $file The asset name including its extension, e.g. `app.js`.
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

		$cache_key = $file;

		if ( isset( $cache_data[ $cache_key ] ) ) {
			return $cache_data[ $cache_key ];
		}

		$filename  = strtok( $file, '.' );
		$asset_php = sprintf( '/dist/%s.asset.php', $filename );
		if ( ! file_exists( \get_theme_file_path( $asset_php ) ) ) {
			$cache_data[ $cache_key ] = $empty_asset_data;
			return $cache_data[ $cache_key ];
		}

		$cache_data[ $cache_key ] = require \get_theme_file_path( $asset_php );

		return $cache_data[ $cache_key ];
	}

	/**
	 * Point the login page stylesheet to the built CSS in `dist/` when available.
	 *
	 * @param string $stylesheet_path Default path relative to the theme root (from `wp_login_page_theme_css`).
	 *
	 * @return string Path relative to the theme root.
	 */
	public function login_stylesheet_uri( string $stylesheet_path = '' ): string {
		$file = $this->get_min_file( 'login' );

		if ( ! empty( $file ) && file_exists( \get_theme_file_path( '/dist/' . $file ) ) ) {
			return 'dist/' . $file;
		}

		if ( file_exists( \get_theme_file_path( '/dist/login.css' ) ) ) {
			return 'dist/login.css';
		}

		return $stylesheet_path;
	}
}

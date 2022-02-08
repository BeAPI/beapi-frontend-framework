<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Acf
 *
 * @package BEA\Theme\Framework
 */
class Acf implements Service {

	/**
	 * @var array
	 */
	private $files = [];

	/**
	 * @var string
	 */
	private $path = 'assets/acf/php/';

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		add_action( 'template_redirect', [ $this, 'warning' ], 0 );
		add_action( 'init', [ $this, 'init' ], 0 );
		add_action( 'init', [ $this, 'init_acf' ] );
	}

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'acf';
	}

	/**
	 * Show warning message if ACF plugin not activate
	 */
	public function warning(): void {
		if ( function_exists( 'get_field' ) ) {
			return;
		}

		\wp_die( sprintf( __( 'This theme can\'t work without ACF plugin. <a href="%s">Please login to admin</a>, and activate it !', 'framework-textdomain' ), esc_url( wp_login_url() ) ) ); // phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment, WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * @param array $files
	 */
	public function register_files( array $files ): void {
		foreach ( $files as $file ) {
			if ( empty( $file ) ) {
				continue;
			}
			$this->register_file( $file );
		}
	}

	/**
	 * @param string $filename
	 */
	private function register_file( string $filename ): void {
		$this->files[ $filename ] = $filename;
	}

	/**
	 * @param string $path
	 */
	public function set_path( string $path ): void {
		$this->path = (string) $path;
	}

	/**
	 * Load fields and add pages
	 */
	public function init(): void {
		/**
		 * Register ACF Files and Pages/Subpages
		 */

		/**
		 * Example
		 *
		 *    $this->acf_add_options_page( [
		 *        'page_title'  => __( 'Theme Options', 'framework-textdomain' ),
		 *        'menu_slug'   => 'theme-options',
		 *        'parent_slug' => 'themes.php',
		 *    ] );
		 *
		 *    $this->register_files( [
		 *        'options-theme',
		 *    ] );
		 */
	}

	/**
	 * Add Option Page
	 *
	 * @return bool
	 *
	 * @param array $parameters
	 *
	 */
	public function acf_add_options_page( array $parameters ) {
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			return false;
		}

		if ( ! isset( $parameters['menu_slug'] ) ) {
			throw new \InvalidArgumentException( 'You must specify menu slug for ACF options page.' );
		}

		return acf_add_options_page( $parameters );
	}

	/**
	 * Load ACF files previously registered
	 */
	public function init_acf(): void {
		$files = $this->get_files();

		if ( empty( $files ) || ! is_dir( get_theme_file_path( $this->path ) ) ) {
			return;
		}

		foreach ( $files as $file ) {
			if ( ! is_file( get_theme_file_path( $this->path . $file . '.php' ) ) ) {
				continue;
			}
			require_once get_theme_file_path( $this->path . $file . '.php' );
		}
	}

	/**
	 * @return array
	 */
	public function get_files(): array {
		return $this->files;
	}

	/**
	 * Add options Subpage
	 *
	 * @return bool
	 *
	 * @param $parameters
	 *
	 */
	public function acf_add_options_sub_page( array $parameters ) {
		if ( ! function_exists( 'acf_add_options_sub_page' ) ) {
			return false;
		}

		if ( ! isset( $parameters['menu_slug'] ) ) {
			throw new \InvalidArgumentException( 'You must specify menu slug for ACF options page.' );
		}

		return acf_add_options_sub_page( $parameters );
	}
}

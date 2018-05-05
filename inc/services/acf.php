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
	private $path = 'src/acf/php/';

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		add_action( 'template_redirect', [ $this, 'warning' ], 0 );
		add_action( 'init', [ $this, 'init' ], 0 );
		add_action( 'init', [ $this, 'init_acf' ] );
	}

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'acf';
	}

	/**
	 * Show warning message if ACF plugin not activate
	 */
	public function warning() {
		if ( function_exists( 'get_field' ) ) {
			return;
		}

		wp_die( sprintf( __( 'This theme can\'t work without ACF plugin. <a href="%s">Please login to admin</a>, and activate it !', 'framework-textdomain' ), wp_login_url() ) );
	}

	/**
	 * @param $files
	 */
	public function register_files( $files ) {
		foreach ( $files as $file ) {
			if ( empty( $file ) ) {
				continue;
			}
			$this->register_file( $file );
		}
	}

	/**
	 * @param $filename
	 */
	private function register_file( $filename ) {
		$this->files[ $filename ] = $filename;
	}

	/**
	 * @param $path
	 */
	public function set_path( $path ) {
		$this->path = (string) $path;
	}

	/**
	 * Load fields and add pages
	 */
	public function init() {
		/**
		 * Register ACF Files and Pages/Subpages
		 */

		/**
		 * Example
		 *
		 *    $this->acf_add_options_page( [
		 *        'page_title'  => __( 'Theme Options', 'framework-textdomain' ),
		 *        'parent_slug' => 'themes.php',
		 *    ] );
		 *
		 *    $this->register_files( [
		 *        'options-theme',
		 *    ] );
		 */
	}

	/**
	 * @param $parameters
	 *
	 * @return bool
	 */
	public function acf_add_options_page( $parameters ) {
		/**
		 * Add Option Page
		 */
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			return false;
		}

		return acf_add_options_page( $parameters );

	}

	/**
	 * Load ACF files previously registered
	 */
	public function init_acf() {
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
	public function get_files() {
		return $this->files;
	}

	/**
	 * @param $parameters
	 *
	 * @return bool
	 */
	public function acf_add_options_sub_page( $parameters ) {
		/**
		 * Add Option Subpage
		 */
		if ( ! function_exists( 'acf_add_options_sub_page' ) ) {
			return false;
		}

		return acf_add_options_sub_page( $parameters );
	}
}
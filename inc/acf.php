<?php

namespace BEA\Theme\Framework;


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
	 * @inheritdoc
	 */
	public function register() {
		add_action( 'template_redirect', [ $this, 'warning' ], 0 );
		add_action( 'init', [ $this, 'init' ], 0 );
	}

	/**
	 * @inheritdoc
	 */
	public function get_service_name() {
		return 'acf';
	}

	function warning() {
		if ( function_exists( 'get_field' ) ) {
			return;
		}

		wp_die( sprintf( 'This theme can\'t work without ACF plugin. <a href="%s">Please login to admin</a>, and activate it !', wp_login_url() ) );
	}

	function register_file( $filename ) {
		$this->files[ $filename ] = $filename;
	}

	public function get_files() {
		return $this->files;
	}

	public function set_path( $path ) {
		$this->path = (string) $path;
	}

	public function init() {
		$files = $this->get_files();

		if ( empty( $files ) || ! is_dir( \get_theme_file_path( $this->path ) ) ) {
			return;
		}

		foreach ( $files as $file ) {
			if ( ! is_file( get_theme_file_path( $this->path . $file . '.php' ) ) ) {
				continue;
			}

			require_once $this->path . $file . '.php';
		}

	}

	public function acf_add_options_sub_page( $parameters ) {
		/**
		 * Add Option Mage
		 */
		if ( ! function_exists( 'acf_add_options_sub_page' ) ) {
			return false;
		}

		return acf_add_options_sub_page( $parameters );

	}

}
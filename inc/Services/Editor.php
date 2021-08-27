<?php


namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Editor implements Service {
	/**
	 * @var \BEA\Theme\Framework\Tools\Assets $assets_tools
	 */
	private $assets_tools;

	/**
	 * @var Assets;
	 */
	private $assets;

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
		$this->assets_tools = new \BEA\Theme\Framework\Tools\Assets();
		$this->assets       = Framework::get_container()->get_service( 'assets' );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'editor';
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		$this->after_theme_setup();
		/**
		 * Load editor style css for admin and frontend
		 */
		$this->style();

		/**
		 * Load editor JS for ADMIN
		 */
		add_action( 'enqueue_block_editor_assets', [ $this, 'admin_editor_script' ] );
	}

	/**
	 * Register :
	 *  - theme_supports
	 *  - color palettes
	 *  - font sizes
	 *  - etc.
	 *
	 */
	private function after_theme_setup(): void {}

	/**
	 * editor style
	 */
	private function style(): void {
		/**
		 * Default file
		 **/
		$file = 'editor.css';

		/**
		 * @var Assets $assets
		 **/
		$assets = Framework::get_container()->get_service( 'assets' );

		if ( ( ! defined( 'SCRIPT_DEBUG' ) || false === SCRIPT_DEBUG ) && false !== $assets ) {
			$file = $assets->get_min_file( 'editor.css' );
		}

		/**
		 * Do not enqueue a inexistant file on admin
		 */
		if ( ! is_file( get_theme_file_path( 'dist/' . $file ) ) ) {
			return;
		}

		add_editor_style( 'dist/' . $file );
	}

	/**
	 * Editor script
	 */
	public function admin_editor_script(): void {
		/**
		 * @var Assets $assets
		 **/
		$assets = Framework::get_container()->get_service( 'assets' );

		$theme    = wp_get_theme();
		$file     = ( ! defined( 'SCRIPT_DEBUG' ) || SCRIPT_DEBUG === false ) ? $assets->get_min_file( 'editor.js' ) : 'editor.js';
		$filepath = 'dist/' . $file;

		if ( ! file_exists( get_theme_file_path( $filepath ) ) ) {
			return;
		}

		$this->assets_tools->register_script(
			'theme-admin-editor-script',
			$filepath,
			[
				'wp-blocks',
				'wp-dom',
			],
			$theme->get( 'Version' ),
			true
		);
		$this->assets_tools->enqueue_script( 'theme-admin-editor-script' );
	}
}

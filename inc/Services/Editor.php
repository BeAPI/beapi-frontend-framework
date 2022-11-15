<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Assets as Assets_Tools;

class Editor implements Service {
	/**
	 * @var Assets_Tools $assets_tools
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
		$this->assets_tools = new Assets_Tools();
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
		 * Register custom block style
		 */
		$this->register_custom_block_styles();

		/**
		 * Load editor JS for ADMIN
		 */
		add_action( 'enqueue_block_editor_assets', [ $this, 'admin_editor_script' ] );
		/**
		 * White list of gutenberg blocks
		 */
		add_filter( 'allowed_block_types_all', [ $this, 'gutenberg_blocks_allowed' ], 10, 2 );
	}

	/**
	 * Register :
	 *  - theme_supports
	 *  - color palettes
	 *  - font sizes
	 *  - etc.
	 *
	 */
	private function after_theme_setup(): void {

		//color palettes
		add_theme_support(
			'editor-color-palette',
			[
				[
					'name'  => __( 'Dark', 'beapi-frontend-framework' ),
					'slug'  => 'dark',
					'color' => '#000000',
				],
				[
					'name'  => __( 'Light', 'beapi-frontend-framework' ),
					'slug'  => 'light',
					'color' => '#ffffff',
				],
				[
					'name'  => __( 'Primary', 'beapi-frontend-framework' ),
					'slug'  => 'primary',
					'color' => '#ffff00',
				],
				[
					'name'  => __( 'Secondary', 'beapi-frontend-framework' ),
					'slug'  => 'secondary',
					'color' => '#00ffff',
				],
			]
		);
		// font sizes
		add_theme_support(
			'editor-font-sizes',
			[
				[
					'name'      => __( 'Title 6', 'beapi-frontend-framework' ),
					'shortName' => 'h6',
					'size'      => 14,
					'slug'      => 'h6',
				],
				[
					'name'      => __( 'Title 5', 'beapi-frontend-framework' ),
					'shortName' => 'h5',
					'size'      => 16,
					'slug'      => 'h5',
				],
				[
					'name'      => __( 'Title 4', 'beapi-frontend-framework' ),
					'shortName' => 'h4',
					'size'      => 18,
					'slug'      => 'h4',
				],
				[
					'name'      => __( 'Title 3', 'beapi-frontend-framework' ),
					'shortName' => 'h3',
					'size'      => 24,
					'slug'      => 'h3',
				],
				[
					'name'      => __( 'Title 2', 'beapi-frontend-framework' ),
					'shortName' => 'h2',
					'size'      => 40,
					'slug'      => 'h2',
				],
				[
					'name'      => __( 'Title 1', 'beapi-frontend-framework' ),
					'shortName' => 'h1',
					'size'      => 58,
					'slug'      => 'h1',
				],
			]
		);
	}

	/**
	 * editor style
	 */
	private function style(): void {
		$file = $this->assets->is_minified() ? $this->assets->get_min_file( 'editor.css' ) : 'editor.css';

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
		$file     = $this->assets->is_minified() ? $this->assets->get_min_file( 'editor.js' ) : 'editor.js';
		$filepath = 'dist/' . $file;

		if ( ! file_exists( get_theme_file_path( $filepath ) ) ) {
			return;
		}

		$asset_data = $this->assets->get_asset_data( $file );
		$this->assets_tools->register_script(
			'theme-admin-editor-script',
			$filepath,
			$asset_data['dependencies'],
			$asset_data['version'],
			true
		);
		$this->assets_tools->enqueue_script( 'theme-admin-editor-script' );
	}

	/**
	 * Register custom block styles
	 */

	private function register_custom_block_styles() {
		// Columns
		register_block_style(
			'core/columns',
			[
				'name'  => 'stroke',
				'label' => __( 'Stroke', 'beapi-frontend-framework' ),
			]
		);

		// Buttons
		//      register_block_style(
		//          'core/button',
		//          [
		//              'name'  => 'reverse',
		//              'label' => __( 'Reverse', 'beapi-frontend-framework' ),
		//          ]
		//      );
	}

	/**
	 * Allow some core Gutenberg blocks
	 *
	 * @param bool|array $allowed_blocks
	 * @param \WP_Block_Editor_Context $block_editor_context
	 *
	 * @return array
	 */
	public function gutenberg_blocks_allowed( $allowed_blocks, \WP_Block_Editor_Context $block_editor_context ): array {

		$allowed = [
			//base
			'core/heading',
			'core/paragraph',
			'core/image',
			'core/list',
			'core/quote',
			'core/pullquote',
			'core/table',
			'core/buttons',
			'core/button',
			'core/group',
			'core/columns',
			'core/column',
			'core/media-text',
			'core/spacer',
			'core/separator',
			'core/cover',
			'core/gallery',
			'core/video',
			'core/file',
			'core/embed',
			// custom
			'beapi/manual-block',
			'beapi/dynamic-block',
		];

		return ( is_array( $allowed_blocks ) ) ? array_merge( $allowed, $allowed_blocks ) : $allowed;

	}

}

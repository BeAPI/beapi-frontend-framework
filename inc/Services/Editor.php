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
					'name'  => __( 'Black', 'beapi-frontend-framework' ),
					'slug'  => 'black',
					'color' => '#000'
				],
				[
					'name'  => __( 'White', 'beapi-frontend-framework' ),
					'slug'  => 'white',
					'color' => '#fff'
				],
				[
					'name'  => __( 'Yellow 500', 'beapi-frontend-framework' ),
					'slug'  => 'yellow-500',
					'color' => '#ffe600'
				],
				[
					'name'  => __( 'Grey 100', 'beapi-frontend-framework' ),
					'slug'  => 'grey-100',
					'color' => '#eee'
				],
				[
					'name'  => __( 'Grey 200', 'beapi-frontend-framework' ),
					'slug'  => 'grey-200',
					'color' => '#ccc'
				],
				[
					'name'  => __( 'Grey 300', 'beapi-frontend-framework' ),
					'slug'  => 'grey-300',
					'color' => '#aaa'
				],
				[
					'name'  => __( 'Grey 400', 'beapi-frontend-framework' ),
					'slug'  => 'grey-400',
					'color' => '#999'
				],
				[
					'name'  => __( 'Grey 500', 'beapi-frontend-framework' ),
					'slug'  => 'grey-500',
					'color' => '#888'
				],
				[
					'name'  => __( 'Grey 600', 'beapi-frontend-framework' ),
					'slug'  => 'grey-600',
					'color' => '#777'
				],
				[
					'name'  => __( 'Grey 700', 'beapi-frontend-framework' ),
					'slug'  => 'grey-700',
					'color' => '#555'
				],
				[
					'name'  => __( 'Grey 800', 'beapi-frontend-framework' ),
					'slug'  => 'grey-800',
					'color' => '#333'
				],
				[
					'name'  => __( 'Grey 900', 'beapi-frontend-framework' ),
					'slug'  => 'grey-900',
					'color' => '#111'
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
			[ 'in_footer' => true ]
		);

		$this->assets_tools->add_inline_script(
			'theme-admin-editor-script',
			'const BFFEditorSettings = ' . wp_json_encode(
				apply_filters(
					'bff_editor_custom_settings',
					[
						'disableAllBlocksStyles'  => [
							'core/separator',
							'core/quote',
							'core/pullquote',
							'core/table',
							'core/image',
						],
						'disabledBlocksStyles'    => [
							// 'core/button' => [ 'outline' ]
						],
						'allowedBlocksVariations' => [
							'core/embed' => [ 'youtube', 'vimeo', 'dailymotion' ],
						],
					]
				)
			),
			'before'
		);

		$this->assets_tools->enqueue_script( 'theme-admin-editor-script' );
	}

	/**
	 * Register custom block styles
	 */

	private function register_custom_block_styles() {
		// Buttons
		//      register_block_style(
		//          'core/button',
		//          [
		//              'name'  => 'reverse',
		//              'label' => __( 'Reverse', 'beapi-frontend-framework' ),
		//          ]
		//      );

		// Paragraph

		register_block_style(
			'core/paragraph',
			[
				'name'  => 'small',
				'label' => __( 'Small', 'beapi-frontend-framework' ),
			]
		);

		register_block_style(
			'core/paragraph',
			[
				'name'  => 'large',
				'label' => __( 'Large', 'beapi-frontend-framework' ),
			]
		);

		register_block_style(
			'core/paragraph',
			[
				'name'  => 'huge',
				'label' => __( 'Huge', 'beapi-frontend-framework' ),
			]
		);

		for ( $i = 1; $i <= 6; $i++ ) {
			$style = [
				'name'  => 'h' . $i,
				'label' => sprintf( __( 'Style H%s', 'beapi-frontend-framework' ), $i ),
			];

			// heading
			register_block_style(
				'core/heading',
				$style
			);

			// paragraph
			register_block_style(
				'core/paragraph',
				$style
			);
		}
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
			'core/block',
			'core/heading',
			'core/paragraph',
			'core/image',
			'core/list',
			'core/list-item',
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

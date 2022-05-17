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
		// add_filter( 'allowed_block_types', [ $this, 'gutenberg_blocks_allowed' ], 10, 2 );
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
					'name'  => 'dark',
					'slug'  => 'dark',
					'color' => '#000000',
				],
				[
					'name'  => 'light',
					'slug'  => 'light',
					'color' => '#ffffff',
				],
				[
					'name'  => 'primary',
					'slug'  => 'primary',
					'color' => '#ffff00',
				],
				[
					'name'  => 'secondary',
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
					'name'      => 'Title 6',
					'shortName' => 'h6',
					'size'      => 14,
					'slug'      => 'h6',
				],
				[
					'name'      => 'Title 5',
					'shortName' => 'h5',
					'size'      => 16,
					'slug'      => 'h5',
				],
				[
					'name'      => 'Title 4',
					'shortName' => 'h4',
					'size'      => 18,
					'slug'      => 'h4',
				],
				[
					'name'      => 'Title 3',
					'shortName' => 'h3',
					'size'      => 24,
					'slug'      => 'h3',
				],
				[
					'name'      => 'Title 2',
					'shortName' => 'h2',
					'size'      => 40,
					'slug'      => 'h2',
				],
				[
					'name'      => 'Title 1',
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

	/**
	 * Register custom block styles
	 */

	private function register_custom_block_styles() {
		//button
		register_block_style(
			'core/button',
			[
				'name'  => 'reverse',
				'label' => 'Reverse',
			]
		);
		register_block_style(
			'core/button',
			[
				'name'  => 'outline-reverse',
				'label' => 'Outline reverse',
			]
		);
	}

	/**
	 * Allow some core Gutenberg blocks
	 *
	 * @param bool|array $allowed_blocks
	 * @param \Wp_post $post
	 *
	 * @return array
	 */
	public function gutenberg_blocks_allowed( $allowed_blocks, \Wp_post $post ): array {

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

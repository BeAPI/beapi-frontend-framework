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
		/**
		 * Load editor style css for admin and frontend
		 */
		$this->style();

		/**
		 * Register custom block style
		 */
		$this->register_custom_block_styles();

		/**
		 * Load editor JS
		 *
		 * WP 6.3+ isolates the editor canvas in an iframe (`iframe[name="editor-canvas"]`).
		 * This affects all blocks, but ACF Blocks V3 (`blockVersion: 3`) rely on it: their PHP
		 * render templates (and ARI lazyload markup) are injected into that iframe on each preview
		 * refresh — not into the admin shell where `enqueue_block_editor_assets` loads scripts.
		 *
		 * - `enqueue_block_editor_assets`  → admin shell only (outside the iframe).
		 * - `enqueue_block_assets`         → iframe + front end (guarded with is_admin() below).
		 *
		 * lazySizes must therefore load via `enqueue_block_assets` to unveil `.lazyload` images
		 * in ACF V3 block previews. Other blocks (e.g. ServerSideRender) may still work without
		 * this, but ACF V3 previews will stay invisible until a DOM mutation triggers lazySizes.
		 */
		add_action( 'enqueue_block_assets', [ $this, 'admin_editor_script' ] );
		/**
		 * Black list of Gutenberg blocks
		 */
		add_filter( 'allowed_block_types_all', [ $this, 'gutenberg_blocks_allowed' ], 10, 2 );
	}

	/**
	 * editor style
	 *
	 * Editor styles are only consumed in admin/editor context: skip the
	 * manifest lookup and filesystem check on front-end requests.
	 */
	private function style(): void {
		if ( ! is_admin() ) {
			return;
		}

		$file = $this->assets->get_min_file( 'editor.css' ) ?: 'editor.css';

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
		// enqueue_block_assets also runs on the front end; skip outside wp-admin.
		if ( ! is_admin() ) {
			return;
		}

		$file     = $this->assets->get_min_file( 'editor.js' ) ?: 'editor.js';
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
				/* translators: %s: heading number */
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
	 * Disallow some Gutenberg blocks (blacklist).
	 *
	 * @param bool|array               $allowed_blocks        The allowed blocks.
	 * @param \WP_Block_Editor_Context $block_editor_context The block editor context.
	 *
	 * @return array The allowed blocks.
	 */
	public function gutenberg_blocks_allowed( $allowed_blocks, \WP_Block_Editor_Context $block_editor_context ): array {
		// If boolean, get explicit list of allowed blocks.
		if ( is_bool( $allowed_blocks ) ) {
			$allowed_blocks = $allowed_blocks ? array_keys( \WP_Block_Type_Registry::get_instance()->get_all_registered() ) : [];
		}

		// List of disallowed blocks.
		$disallowed_blocks = [
			'core/html',
			'core/freeform',
			'core/code',
			'core/preformatted',
			'core/verse',
			'core/footnotes',
			'core/more',
			'core/loginout',
			'core/embed',
		];

		// Remove disallowed blocks from allowed blocks.
		foreach ( $disallowed_blocks as $block ) {
			if ( in_array( $block, $allowed_blocks, true ) ) {
				unset( $allowed_blocks[ array_search( $block, $allowed_blocks, true ) ] );
			}
		}

		return array_values( $allowed_blocks );
	}
}

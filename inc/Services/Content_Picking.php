<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Content picking blocks (beapi/dynamic-block and beapi/manual-block).
 *
 * Holds the whole configuration of both blocks: post types and display modes offered
 * in the editor, wrapper classes, and rendering with the theme template
 * `components/gutenberg/content-picking-block.php`. Edit get_post_types() and
 * get_display_modes() to add the project post types.
 *
 * @package BEA\Theme\Framework
 */
class Content_Picking implements Service {

	/**
	 * Blocks handled by this service, with their `supports` key.
	 */
	private const BLOCKS = [
		'beapi/dynamic-block' => 'dynamicBlock',
		'beapi/manual-block'  => 'manualBlock',
	];

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'content-picking';
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		add_filter( 'block_type_metadata', [ $this, 'set_block_metadata' ] );

		foreach ( [ 'dynamic_block', 'manual_block' ] as $block ) {
			add_filter( 'beapi/' . $block . '/classnames', [ $this, 'set_block_classnames' ], 10, 3 );
			add_filter( 'beapi/' . $block . '/template_slug', [ $this, 'set_block_template_slug' ] );
		}
	}

	/**
	 * Set the post types and display modes of the content picking blocks.
	 *
	 * @param array $metadata Block metadata read from block.json.
	 *
	 * @return array
	 */
	public function set_block_metadata( array $metadata ): array {
		$block_name = $metadata['name'] ?? '';

		if ( ! isset( self::BLOCKS[ $block_name ] ) ) {
			return $metadata;
		}

		$supports_key = self::BLOCKS[ $block_name ];
		$supports     = $metadata['supports'] ?? [];
		$block_config = $supports[ $supports_key ] ?? [];

		$block_config['postTypes']   = $this->get_post_types();
		$block_config['displayMode'] = $this->get_display_modes();

		// Only the dynamic block filters its query by terms.
		if ( 'dynamicBlock' === $supports_key ) {
			$block_config['taxonomies'] = true;
		}

		$supports[ $supports_key ] = $block_config;
		$metadata['supports']      = $supports;

		return $metadata;
	}

	/**
	 * Add the theme classes to the block wrapper.
	 *
	 * The align attribute is added in JS (src/js/editor.js) without the `align` support,
	 * so WordPress does not output the matching class: add it here.
	 *
	 * @param array $classnames Block wrapper classes.
	 * @param array $args       Block query arguments.
	 * @param array $attributes Block attributes.
	 *
	 * @return array
	 */
	public function set_block_classnames( array $classnames, array $args, array $attributes ): array {
		$classnames[] = 'block';
		$classnames[] = 'block--content-picking';

		$align = (string) ( $attributes['align'] ?? 'wide' );
		if ( in_array( $align, [ 'wide', 'full' ], true ) ) {
			$classnames[] = 'align' . $align;
		}

		return $classnames;
	}

	/**
	 * Render both blocks with the theme template, loaded via `get_template_part()`.
	 *
	 * @return string
	 */
	public function set_block_template_slug(): string {
		return 'components/gutenberg/content-picking-block';
	}

	/**
	 * Post types offered by the content picking blocks.
	 *
	 * Each post type needs a `components/parts/content-picking-block/{post_type}.php` template
	 * (and `{post_type}-{display_mode}.php` for the other display modes), and must be allowed
	 * in at least one display mode of get_display_modes().
	 *
	 * @return string[]
	 */
	public function get_post_types(): array {
		return [ 'post' ];
	}

	/**
	 * Display modes offered by the content picking blocks, with the post types allowed for each.
	 *
	 * `name` is the display mode slug, used to load `{post_type}-{name}.php`.
	 *
	 * @return array[]
	 */
	public function get_display_modes(): array {
		return [
			[
				'name'      => 'grid',
				'label'     => __( 'Grid', 'beapi-frontend-framework' ),
				'postTypes' => [ 'post' ],
			],
			[
				'name'      => 'list',
				'label'     => __( 'List', 'beapi-frontend-framework' ),
				'postTypes' => [ 'post' ],
			],
			[
				'name'      => 'megamenu',
				'label'     => __( 'Mega menu', 'beapi-frontend-framework' ),
				'postTypes' => [ 'post' ],
			],
		];
	}
}

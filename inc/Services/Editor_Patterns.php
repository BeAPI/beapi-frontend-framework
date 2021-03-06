<?php


namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Editor_Patterns implements Service {
	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'editor-patterns';
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		\add_action( 'init', [ $this, 'register_categories' ], 10 );
		\add_action( 'init', [ $this, 'register_patterns' ], 11 );
	}

	/**
	 * Register the patterns categories
	 *
	 */
	public function register_categories(): void {
		/**
		 * Example :
		 * register_block_pattern_category(
			'cover',
			[
				'label' => _x( 'Cover', 'Block pattern category', 'beapi-frontend-framework' ),
			],
		);
		 */
	}

	/**
	 * Register the patterns
	 *
	 */
	public function register_patterns(): void {
		/**
		 * Example :
		register_block_pattern(
			'project/pattern',
			[
				'title'      => __( 'Group list', 'beapi-frontend-framework' ),
				'categories' => [ 'cover' ],
				'content'    => $this->get_pattern_content( 'src/stories/patterns/block-patterns/GroupListing/GroupListing.html' ),
			]
		);
		 */
	}

	/**
	 * Get pattern content from designated folder
	 *
	 * @param string $pattern_file : .html file to get content from.
	 *
	 * @return false|string
	 * @author Nicolas JUEN
	 */
	protected function get_pattern_content( string $pattern_file ) {
		$file = locate_template( $pattern_file, false, false );
		if ( ! \is_readable( $file ) ) {
			return '';
		}

		return file_get_contents( $file ); // phpcs:ignore
	}
}

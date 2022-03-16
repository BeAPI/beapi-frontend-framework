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
		$patterns = [
			'example' => [
				'category' => 'common-patterns',
				'title'    => __( 'Example', 'beapi-frontend-framework' ),
				'keyword'  => 'example',
			],
		];

		foreach ( $patterns as $slug => $data ) {
			register_block_pattern(
				'project/' . $slug,
				[
					'title'      => $data['title'],
					'categories' => [
						$data['category'],
					],
					'keywords'   => [
						$data['keyword'],
					],
					'content'    => $this->get_pattern_content( 'assets/patterns/' . $slug . '.php' ),
				]
			);
		}
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
		ob_start();
		load_template( $file, false );
		return ob_get_clean();
	}
}

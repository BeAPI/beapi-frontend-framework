<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Registers theme icon collections for the WordPress Icon block (7.1+).
 */
class Icon implements Service {

	private const COLLECTION_SPRITE = 'beapi-sprite';

	private const COLLECTION_SOCIAL = 'beapi-social';

	/**
	 * @param Service_Container $container Service container.
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container Service container.
	 */
	public function boot( Service_Container $container ): void {
		add_action( 'init', [ $this, 'register_icon_collections' ] );
		add_action( 'init', [ $this, 'unregister_core_icon_collection' ], 20 );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'icon';
	}

	/**
	 * Registers icon collections and icons from built SVG files.
	 *
	 * @return void
	 */
	public function register_icon_collections(): void {
		if ( ! function_exists( 'wp_register_icon_collection' ) || ! function_exists( 'wp_register_icon' ) ) {
			return;
		}

		$collections = apply_filters(
			'bff_icon_collections',
			[
				self::COLLECTION_SPRITE => [
					'source_subdir' => 'sprite',
					'label'         => __( 'General', 'beapi-frontend-framework' ),
					'description'   => __( 'Theme UI icons.', 'beapi-frontend-framework' ),
				],
				self::COLLECTION_SOCIAL => [
					'source_subdir' => 'social',
					'label'         => __( 'Social', 'beapi-frontend-framework' ),
					'description'   => __( 'Social network icons.', 'beapi-frontend-framework' ),
				],
			]
		);

		foreach ( $collections as $collection_slug => $collection_args ) {
			$this->register_collection( (string) $collection_slug, $collection_args );
		}
	}

	/**
	 * Unregisters the default WordPress core icon collection from the Icon block library.
	 *
	 * Runs on init at priority 20 so core icons are registered first (priority 10).
	 *
	 * @return void
	 */
	public function unregister_core_icon_collection(): void {
		if ( ! function_exists( 'wp_unregister_icon_collection' ) ) {
			return;
		}

		if ( ! apply_filters( 'bff_unregister_core_icon_collection', true ) ) {
			return;
		}

		wp_unregister_icon_collection( 'core' );
	}

	/**
	 * @param string               $collection_slug Collection slug passed to wp_register_icon_collection().
	 * @param array<string, mixed> $collection_args Collection configuration.
	 *
	 * @return void
	 */
	private function register_collection( string $collection_slug, array $collection_args ): void {
		if ( ! function_exists( 'wp_register_icon_collection' ) ) {
			return;
		}

		$source_subdir = isset( $collection_args['source_subdir'] ) ? (string) $collection_args['source_subdir'] : '';

		if ( '' === $source_subdir ) {
			return;
		}

		wp_register_icon_collection(
			$collection_slug,
			[
				'label'       => $collection_args['label'] ?? $collection_slug,
				'description' => $collection_args['description'] ?? '',
			]
		);

		$icons_directory = $this->resolve_icons_directory( $source_subdir );

		if ( null === $icons_directory ) {
			return;
		}

		$svg_files = glob( $icons_directory . '/*.svg' );

		if ( false === $svg_files ) {
			return;
		}

		foreach ( $svg_files as $svg_file ) {
			$this->register_icon_file( $collection_slug, $svg_file );
		}
	}

	/**
	 * Resolves the directory containing standalone SVG files for a collection.
	 *
	 * @param string $source_subdir Subdirectory name (e.g. sprite, social).
	 *
	 * @return string|null Absolute path or null when not found.
	 */
	private function resolve_icons_directory( string $source_subdir ): ?string {
		$source_subdir = preg_replace( '/[^a-z0-9-]/', '', strtolower( $source_subdir ) );

		if ( '' === $source_subdir ) {
			return null;
		}

		$candidates = [
			get_theme_file_path( 'dist/images/' . $source_subdir ),
			get_theme_file_path( 'src/img/icons/' . $source_subdir ),
		];

		foreach ( $candidates as $candidate ) {
			if ( ! is_dir( $candidate ) ) {
				continue;
			}

			$real_path = realpath( $candidate );

			if ( false !== $real_path ) {
				return $real_path;
			}
		}

		return null;
	}

	/**
	 * @param string $collection_slug Collection slug.
	 * @param string $svg_file        Absolute path to an SVG file.
	 *
	 * @return void
	 */
	private function register_icon_file( string $collection_slug, string $svg_file ): void {
		if ( ! function_exists( 'wp_register_icon' ) ) {
			return;
		}

		$real_file = realpath( $svg_file );

		if ( false === $real_file || ! is_readable( $real_file ) ) {
			return;
		}

		$icon_slug = pathinfo( $real_file, PATHINFO_FILENAME );
		$icon_slug = preg_replace( '/[^a-z0-9-]/', '', strtolower( (string) $icon_slug ) );

		if ( '' === $icon_slug ) {
			return;
		}

		$icon_name = $collection_slug . '/' . $icon_slug;
		$label     = apply_filters(
			'bff_icon_label',
			$this->format_icon_label( $icon_slug ),
			$icon_slug,
			$collection_slug
		);

		$properties = apply_filters(
			'bff_icon_properties',
			[
				'label'     => $label,
				'file_path' => $real_file,
			],
			$icon_name,
			$collection_slug
		);

		if ( empty( $properties['file_path'] ) && empty( $properties['content'] ) ) {
			return;
		}

		wp_register_icon( $icon_name, $properties );
	}

	/**
	 * @param string $icon_slug Icon filename without extension.
	 *
	 * @return string
	 */
	private function format_icon_label( string $icon_slug ): string {
		$label = str_replace( [ '-', '_' ], ' ', $icon_slug );

		return ucwords( $label );
	}
}

<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Svg
 *
 * @package BEA\Theme\Framework
 */
class Svg implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
		add_filter( 'wp_kses_allowed_html', [ $this, 'allow_svg_tag' ] );
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'svg';
	}

	/**
	 * @param string $icon_name
	 * @param array  $additionnal_classes
	 *
	 * @return string
	 */
	public function get_the_icon( string $icon_name, array $additionnal_classes = [] ): string {
		if ( empty( $icon_name ) ) {
			return '';
		}

		$icon_path = sprintf( '/dist/%s', $this->get_icon_from_manifest( sprintf( 'images/icons/%s.svg', $icon_name ) ) );

		if ( ! file_exists( \get_theme_file_path( $icon_path ) ) ) {
			return '';
		}

		$classes = implode( ' ', array_map( 'sanitize_html_class', array_merge( [ 'icon-' . $icon_name ], $additionnal_classes ) ) );

		$html = file_get_contents( \get_theme_file_path( $icon_path ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		return preg_replace( '/\$class_names/i', $classes, $html );
	}

	/**
	 * @param string $icon_name
	 * @param array  $additionnal_classes
	 *
	 */
	public function the_icon( string $icon_name, array $additionnal_classes = [] ): void {
		echo $this->get_the_icon( $icon_name, $additionnal_classes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Allow svg tag
	 *
	 * @param $tags
	 *
	 * @return mixed
	 * @author Egidio CORICA
	 */
	public function allow_svg_tag( $tags ) {
		$tags['svg'] = [
			'xmlns'       => [],
			'fill'        => [],
			'viewbox'     => [],
			'role'        => [],
			'aria-hidden' => [],
			'focusable'   => [],
			'class'       => [],
			'style'       => [],
		];

		$tags['path'] = [
			'd'    => [],
			'fill' => [],
		];

		$tags['use'] = [
			'href'        => [],
			'xmlns:xlink' => [],
			'xlink:href'  => [],
		];

		return $tags;
	}

		/**
	 * Get the compiled SVG path from JSON manifest
	 *
	 * @param $icon_path
	 *
	 * @return string
	 *
	 * @author Milan RICOUL
	 */
	public function get_icon_from_manifest( string $icon_path ): string {
		$json   = file_get_contents( \get_theme_file_path( '/dist/assets.json' ) ); //phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$assets = json_decode( $json, true );

		if ( empty( $assets ) || JSON_ERROR_NONE !== json_last_error() ) {
			return '';
		}

		$file = $assets[ $icon_path ];

		if ( empty( $file ) ) {
			return '';
		}

		return $file;
	}
}

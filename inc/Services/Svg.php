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
	 *
	 * @return string
	 */
	public function get_the_icon( string $icon_name ): string {
		if ( empty( $icon_name ) ) {
			return '';
		}

		$icon_path = sprintf( '/dist/%s', $this->get_icon_from_manifest( sprintf( 'assets/%s.svg', $icon_name ) ) );

		if ( ! file_exists( \get_theme_file_path( $icon_path ) ) ) {
			return '';
		}

		return file_get_contents( \get_theme_file_path( $icon_path ) );
	}

	/**
	 * @param string $icon_name
	 *
	 */
	public function the_icon( string $icon_name ): void {
		echo $this->get_the_icon( $icon_name ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
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

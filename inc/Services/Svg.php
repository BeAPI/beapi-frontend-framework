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
	 * @param string $icon_class
	 * @param array  $additionnal_classes
	 *
	 * @return string
	 */
	public function get_the_icon( string $icon_class, array $additionnal_classes = [] ): string {
		if ( empty( $icon_class ) ) {
			return '';
		}

		// acf-svg-icon already return sprite-name.svg#icon-name, ex: social.svg#icon-facebook
		// format the string to obtain sprite-name/icon-name
		$icon_class = str_replace( '.svg#icon-', '/', $icon_class );

		$sprite_name = 'sprite';

		$slash_pos = strpos( $icon_class, '/' );
		if ( false !== $slash_pos ) {
			$sprite_name = strtok( $icon_class, '/' );
			$icon_class  = substr( $icon_class, $slash_pos + 1 );
		}

		$icon_slug   = strpos( $icon_class, 'icon-' ) === 0 ? $icon_class : sprintf( 'icon-%s', $icon_class );
		$classes     = [ 'icon', $icon_slug ];
		$classes     = array_merge( $classes, $additionnal_classes );
		$classes     = array_map( 'sanitize_html_class', $classes );
		$icon_url = \get_theme_file_uri( sprintf( '/dist/icons/%s.svg', $sprite_name ) );
		$hash_sprite = $this->get_sprite_hash( $sprite_name );

		return sprintf( '<svg class="%s" aria-hidden="true" focusable="false"><use href="%s#%s"></use></svg>', implode( ' ', $classes ), add_query_arg( [ 'v' => $hash_sprite ], $icon_url ), $icon_slug );
	}

	/**
	 * @param string $icon_class
	 * @param array $additionnal_classes
	 */
	public function the_icon( string $icon_class, array $additionnal_classes = [] ): void {
		echo $this->get_the_icon( $icon_class, $additionnal_classes ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
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
	 * Get the hash of the sprite
	 *
	 * @param string $sprite_name
	 *
	 * @return string | null
	 */
	public function get_sprite_hash( string $sprite_name ): ?string {
		static $sprite_hashes = null;

		if ( null === $sprite_hashes ) {
			$sprite_hash_file = \get_theme_file_path( '/dist/sprite-hashes.json' );

			if ( ! is_readable( $sprite_hash_file ) ) {
				$sprite_hashes = [];

				return null;
			}

			$sprite_hash = file_get_contents( $sprite_hash_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

			try {
				$sprite_hash = json_decode( $sprite_hash, true, 512, JSON_THROW_ON_ERROR );
			} catch ( \JsonException $e ) {
				$sprite_hashes = [];

				return null;
			}

			$sprite_hashes = $sprite_hash;
		}

		return $sprite_hash[ sprintf( 'icons/%s.svg', $sprite_name ) ] ?? null;
	}
}

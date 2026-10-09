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
	 * @param string $icon_class          Icon identifier (e.g. menu, social/facebook, social.svg#icon-facebook).
	 * @param array  $additionnal_classes Extra CSS classes.
	 * @param bool   $is_sprite           When true, output a sprite reference; when false, inline the SVG file from dist/images.
	 *
	 * @return string
	 */
	public function get_the_icon( string $icon_class, array $additionnal_classes = [], bool $is_sprite = true ): string {
		if ( empty( $icon_class ) ) {
			return '';
		}

		$parts   = $this->parse_icon_identifier( $icon_class );
		$classes = array_map(
			'sanitize_html_class',
			array_merge( [ 'icon', $parts['icon_slug'] ], $additionnal_classes )
		);

		if ( ! $is_sprite ) {
			return $this->get_inline_icon_markup( $parts['sprite_name'], $parts['file_base'], $classes );
		}

		$icon_url    = \get_theme_file_uri( sprintf( '/dist/icons/%s.svg', $parts['sprite_name'] ) );
		$hash_sprite = $this->get_sprite_hash( $parts['sprite_name'] );

		return sprintf(
			'<svg class="%s" aria-hidden="true" focusable="false"><use href="%s#%s"></use></svg>',
			implode( ' ', $classes ),
			add_query_arg( [ 'v' => $hash_sprite ], $icon_url ),
			$parts['icon_slug']
		);
	}

	/**
	 * @param string $icon_class          Icon identifier.
	 * @param array  $additionnal_classes Extra CSS classes.
	 * @param bool   $is_sprite           When true, output a sprite reference; when false, inline the SVG file.
	 */
	public function the_icon( string $icon_class, array $additionnal_classes = [], bool $is_sprite = true ): void {
		echo $this->get_the_icon( $icon_class, $additionnal_classes, $is_sprite ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Normalizes an icon identifier into sprite folder, symbol id and file basename.
	 *
	 * @param string $icon_class Raw icon identifier.
	 *
	 * @return array{sprite_name: string, icon_slug: string, file_base: string}
	 */
	private function parse_icon_identifier( string $icon_class ): array {
		// acf-svg-icon already return sprite-name.svg#icon-name, ex: social.svg#icon-facebook
		// format the string to obtain sprite-name/icon-name
		$icon_class = str_replace( '.svg#icon-', '/', $icon_class );

		$sprite_name = 'sprite';

		$slash_pos = strpos( $icon_class, '/' );
		if ( false !== $slash_pos ) {
			$sprite_name = strtok( $icon_class, '/' );
			$icon_class  = substr( $icon_class, $slash_pos + 1 );
		}

		$sprite_name = preg_replace( '/[^a-z0-9-]/', '', strtolower( (string) $sprite_name ) );
		if ( '' === $sprite_name ) {
			$sprite_name = 'sprite';
		}

		$icon_slug = str_starts_with( $icon_class, 'icon-' ) ? $icon_class : sprintf( 'icon-%s', $icon_class );
		$file_base = preg_replace( '/^icon-/', '', $icon_slug );
		$file_base = preg_replace( '/[^a-z0-9-]/', '', strtolower( (string) $file_base ) );

		return [
			'sprite_name' => $sprite_name,
			'icon_slug'   => $icon_slug,
			'file_base'   => $file_base,
		];
	}

	/**
	 * Loads an optimized SVG from dist/images and merges wrapper classes onto the root element.
	 *
	 * @param string $sprite_name Icon subdirectory (e.g. sprite, social).
	 * @param string $file_base   SVG filename without extension.
	 * @param array  $classes     CSS classes for the root SVG element.
	 *
	 * @return string
	 */
	private function get_inline_icon_markup( string $sprite_name, string $file_base, array $classes ): string {
		if ( '' === $file_base ) {
			return '';
		}

		$relative_path = sprintf( 'dist/images/%s/%s.svg', $sprite_name, $file_base );
		$file_path     = \get_theme_file_path( $relative_path );

		if ( ! is_readable( $file_path ) ) {
			return '';
		}

		$real_file = realpath( $file_path );
		$real_base = realpath( \get_theme_file_path( 'dist/images' ) );

		if ( false === $real_file || false === $real_base || ! str_starts_with( $real_file, $real_base ) ) {
			return '';
		}

		$svg_markup = file_get_contents( $real_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		if ( false === $svg_markup || '' === $svg_markup ) {
			return '';
		}

		return $this->inject_svg_classes( $svg_markup, $classes );
	}

	/**
	 * Merges classes and a11y attributes on the first root SVG element.
	 *
	 * @param string $svg_markup SVG file contents.
	 * @param array  $classes    CSS classes to apply.
	 *
	 * @return string
	 */
	private function inject_svg_classes( string $svg_markup, array $classes ): string {
		$class_attr = implode( ' ', array_filter( $classes ) );

		$updated = preg_replace_callback(
			'/<svg\b([^>]*)>/i',
			static function ( array $matches ) use ( $class_attr ): string {
				$attrs = $matches[1];

				if ( '' !== $class_attr ) {
					if ( preg_match( '/\bclass=(["\'])([^"\']*)\1/i', $attrs, $class_match ) ) {
						$new_class = trim( $class_match[2] . ' ' . $class_attr );
						$attrs     = preg_replace(
							'/\bclass=(["\'])([^"\']*)\1/i',
							'class="' . esc_attr( $new_class ) . '"',
							$attrs,
							1
						);
					} else {
						$attrs .= sprintf( ' class="%s"', esc_attr( $class_attr ) );
					}
				}

				if ( ! preg_match( '/\baria-hidden=/i', $attrs ) ) {
					$attrs .= ' aria-hidden="true"';
				}

				if ( ! preg_match( '/\bfocusable=/i', $attrs ) ) {
					$attrs .= ' focusable="false"';
				}

				return '<svg' . $attrs . '>';
			},
			$svg_markup,
			1
		);

		return is_string( $updated ) ? $updated : $svg_markup;
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
			'width'       => [],
			'height'      => [],
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
			$sprite_hash_file = get_theme_file_path( '/dist/sprite-hashes.asset.php' );

			if ( ! is_readable( $sprite_hash_file ) ) {
				$sprite_hashes = [];

				return null;
			}

			$sprite_hash = require $sprite_hash_file;

			if ( ! is_array( $sprite_hash ) ) {
				$sprite_hashes = [];

				return null;
			}

			$sprite_hashes = $sprite_hash;
		}

		return $sprite_hashes[ sprintf( 'icons/%s.svg', $sprite_name ) ] ?? null;
	}
}

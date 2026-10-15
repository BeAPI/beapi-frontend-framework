<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Image;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\get_the_image( 1, [  'data-location' => 'image-size' ] );
 *
 * @param int $image_id Attachment post ID
 *
 * @param array $attributes {
 *    Attributes for the image markup.
 *
 * @type string $src Image attachment URL.
 * @type string $data-location Location of image.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default `attachment-$size_class size-$size_class`,
 *                                 where `$size_class` is the image size being requested.
 * @type string $alt Image description for the alt attribute.
 * @type string $srcset The 'srcset' attribute value.
 * @type string $sizes The 'sizes' attribute value.
 * @type string $fetchpriority The 'fetchpriority' attribute value (e.g. 'high', 'low').
 * @type string $decoding The 'decoding' attribute value (e.g. 'sync', 'async').
 * @type string|false $loading The 'loading' attribute value. Passing a value of false
 *                                 will result in the attribute being omitted for the image.
 *                                 Defaults to 'lazy', depending on wp_lazy_loading_enabled().
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the image markup.
 *
 * @type string $size Optional. The 'sizes' attribute value.
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type boolean $default Optional. If WP image does not exists, display a default image.
 * @type boolean $is_lcp Optional. When true, applies LCP-friendly attributes
 *                                 (loading omitted, fetchpriority=high, decoding=sync)
 *                                 unless decoding is already set in $attributes.
 *
 * }
 *
 * @return string Return the markup of the image
 */
function get_the_image( int $image_id, array $attributes, array $settings = [] ): string {
	// When the caller passes 'alt' => '', it was overridden by filters/wp_get_attachment_image with the attachment alt from BO.
	// We remember the intent here and force empty alt in the final markup below so decorative images get alt="" as intended.
	$force_empty_alt = array_key_exists( 'alt', $attributes ) && '' === $attributes['alt'];

	$attributes = wp_parse_args(
		$attributes,
		[
			'data-location' => '',
			'class'         => '',
		]
	);

	$attributes = apply_filters( 'bea_theme_framework_the_image_attributes', $attributes, $image_id, $settings );

	$settings = wp_parse_args(
		$settings,
		[
			'size'    => 'thumbnail',
			'before'  => '',
			'after'   => '',
			'default' => false,
			'is_lcp'  => false,
		]
	);

	$settings = apply_filters( 'bea_theme_framework_the_image_settings', $settings, $image_id, $attributes );

	if ( ! empty( $settings['is_lcp'] ) ) {
		// Always win over caller/WP defaults: the LCP image must not be lazy-loaded.
		$attributes['loading']       = false;
		$attributes['fetchpriority'] = 'high';
		$attributes['decoding']      = $attributes['decoding'] ?? 'sync';
	}

	// Never combine fetchpriority=high with loading=lazy (undefined browser behavior).
	if ( isset( $attributes['fetchpriority'] ) && 'high' === $attributes['fetchpriority'] ) {
		$attributes['loading'] = false;
	}

	if ( 0 === $image_id && ! $settings['default'] ) {
		return '';
	}

	$image_markup = \wp_get_attachment_image(
		$image_id,
		$settings['size'],
		false,
		$attributes
	);

	if ( empty( $image_markup ) ) {
		return '';
	}

	$image_markup = apply_filters( 'bea_theme_framework_the_image_markup', $image_markup, $image_id, $attributes, $settings );

	// Force alt="" in markup when empty alt was requested (see $force_empty_alt above).
	if ( $force_empty_alt ) {
		$image_markup = preg_replace( '/\salt="[^"]*"/', ' alt=""', $image_markup );
	}

	return $settings['before'] . $image_markup . $settings['after'];
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\the_image( 1, [  'data-location' => 'image-size' ], ['before'  => '');
 *
 * @param int $image_id Attachment post ID
 *
 * @param array $attributes {
 *    Attributes for the image markup.
 *
 * @type string $src Image attachment URL.
 * @type string $data-location Location of image.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default `attachment-$size_class size-$size_class`,
 *                                 where `$size_class` is the image size being requested.
 * @type string $alt Image description for the alt attribute.
 * @type string $srcset The 'srcset' attribute value.
 * @type string $sizes The 'sizes' attribute value.
 * @type string $fetchpriority The 'fetchpriority' attribute value (e.g. 'high', 'low').
 * @type string $decoding The 'decoding' attribute value (e.g. 'sync', 'async').
 * @type string|false $loading The 'loading' attribute value. Passing a value of false
 *                                 will result in the attribute being omitted for the image.
 *                                 Defaults to 'lazy', depending on wp_lazy_loading_enabled().
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the image markup.
 *
 * @type string $size Optional. The 'sizes' attribute value.
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type boolean $is_lcp Optional. When true, applies LCP-friendly attributes.
 *
 * }
 *
 * @return void Echo of the image markup
 */
function the_image( int $image_id, array $attributes, array $settings = [] ): void {
	echo get_the_image( $image_id, $attributes, $settings );
}

/**
 * Read intrinsic dimensions from a static file under the active theme directory.
 *
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\get_theme_static_image_dimensions( 'dist/images/logo.svg' );
 *
 * @param string $relative_theme_path Path relative to the theme root (e.g. dist/images/logo.svg).
 *
 * @return array{width:int,height:int}|null Null when the file is missing or dimensions cannot be read.
 */
function get_theme_static_image_dimensions( string $relative_theme_path ): ?array {
	$relative_theme_path = ltrim( $relative_theme_path, '/' );
	$file_path           = get_theme_file_path( $relative_theme_path );

	if ( ! is_string( $file_path ) || '' === $file_path || ! is_readable( $file_path ) ) {
		return null;
	}

	if ( str_ends_with( strtolower( $file_path ), '.svg' ) ) {
		$contents = file_get_contents( $file_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local theme SVG asset.

		if ( ! is_string( $contents ) || '' === $contents ) {
			return null;
		}

		if ( preg_match( '/\bwidth="(\d+(?:\.\d+)?)"/', $contents, $width_match )
			&& preg_match( '/\bheight="(\d+(?:\.\d+)?)"/', $contents, $height_match ) ) {
			return [
				'width'  => (int) round( (float) $width_match[1] ),
				'height' => (int) round( (float) $height_match[1] ),
			];
		}

		if ( preg_match( '/\bviewBox="[\d.\s-]+?\s+([\d.]+)\s+([\d.]+)"/', $contents, $view_box_match ) ) {
			return [
				'width'  => max( 1, (int) round( (float) $view_box_match[1] ) ),
				'height' => max( 1, (int) round( (float) $view_box_match[2] ) ),
			];
		}

		return null;
	}

	$size = wp_getimagesize( $file_path );
	if ( ! is_array( $size ) || empty( $size[0] ) || empty( $size[1] ) ) {
		return null;
	}

	return [
		'width'  => (int) $size[0],
		'height' => (int) $size[1],
	];
}

/**
 * Build an img tag for a static theme asset, with width and height when known (prevents CLS).
 *
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\get_theme_static_image_markup( 'dist/images/logo.svg', [ 'alt' => 'Logo' ] );
 *
 * @param string $relative_theme_path Path relative to the theme root.
 * @param array  $attributes          Img attributes. src and alt are set when omitted.
 *                                    An empty alt is output as alt="" (decorative image);
 *                                    false or null omits the attribute.
 *
 * @return string Return the markup of the image
 */
function get_theme_static_image_markup( string $relative_theme_path, array $attributes = [] ): string {
	$relative_theme_path = ltrim( $relative_theme_path, '/' );

	$attributes = wp_parse_args(
		$attributes,
		[
			'src' => get_theme_file_uri( $relative_theme_path ),
			'alt' => '',
		]
	);

	$dimensions = get_theme_static_image_dimensions( $relative_theme_path );
	if ( null !== $dimensions ) {
		if ( ! isset( $attributes['width'] ) ) {
			$attributes['width'] = (string) $dimensions['width'];
		}
		if ( ! isset( $attributes['height'] ) ) {
			$attributes['height'] = (string) $dimensions['height'];
		}
	}

	if ( isset( $attributes['fetchpriority'] ) && 'high' === $attributes['fetchpriority'] ) {
		$attributes['loading'] = false;
	}

	$processor = new \WP_HTML_Tag_Processor( '<img>' );
	if ( ! $processor->next_tag( 'img' ) ) {
		return '';
	}

	foreach ( $attributes as $name => $value ) {
		$name = (string) $name;

		if ( false === $value || null === $value ) {
			$processor->remove_attribute( $name );
			continue;
		}

		// Empty alt marks a decorative image; omitting the attribute is not equivalent for AT.
		if ( '' === $value && 'alt' !== $name ) {
			$processor->remove_attribute( $name );
			continue;
		}

		$processor->set_attribute( $name, (string) $value );
	}

	return $processor->get_updated_html();
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\the_theme_static_image( 'dist/images/logo.svg', [ 'alt' => 'Logo' ] );
 *
 * @param string $relative_theme_path Path relative to the theme root.
 * @param array  $attributes          Img attributes, see get_theme_static_image_markup().
 *
 * @return void Echo of the image markup
 */
function the_theme_static_image( string $relative_theme_path, array $attributes = [] ): void {
	echo get_theme_static_image_markup( $relative_theme_path, $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Attributes are escaped by WP_HTML_Tag_Processor.
}

<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Link;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link( ['field' => ..., 'class' => ...], [ 'before' => '<p>%s', 'after' => '</p>' ] );
 *
 * @param array $attributes {
 *    Attributes for the acf link markup.
 *
 * @type array $field ACF link field. Example ['url' => 'https://....', 'title' => 'My title', 'target' => '_blank' ]
 * @type string $target Target for the link.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the acf link markup.
 *
 * @type string $content Optional. The content of the link
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ]
 * @type string $new_window Optional. Add <span class="sr-only> for a11y
 * }
 *
 * @return string Return the markup of the link
 */
function get_acf_link( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['field']['url'] ) || empty( $attributes['field']['title'] ) ) {
		return '';
	}

	$content = $attributes['field']['title'];

	$attributes = wp_parse_args(
		$attributes,
		[
			'href'   => $attributes['field']['url'],
			'target' => $attributes['field']['target'],
		]
	);

	// Unset unused field params
	unset( $attributes['field'] );

	$attributes = apply_filters( 'bea_theme_framework_acf_link_attribute', $attributes, $settings );

	$settings = wp_parse_args(
		$settings,
		[
			'content' => $content,
		]
	);

	$settings = apply_filters( 'bea_theme_framework_acf_link_settings', $settings, $attributes );

	return get_the_link( $attributes, $settings );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\the_custom_link( ['url' => ..., 'title' => ...], [ 'wrapper' => '<p></p>' ] );
 *
 * @param array $attributes {
 *    Attributes for the acf link markup.
 *
 * @type array $field ACF link field. Example ['url' => 'https://....', 'title' => 'My title', 'target' => '_blank' ]
 * @type string $target Target for the link.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the acf link markup.
 *
 * @type string $content Optional. The content of the link
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ]
 * @type string $new_window Optional. Add <span class="sr-only> for a11y
 * }
 *
 * @return void Echo of the link markup
 */
function the_acf_link( array $attributes, array $settings = [] ): void {
	echo get_acf_link( $attributes, $settings ); //phpcs:ignore
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\get_link( ['href' => ..., 'title' => ...], [ 'wrapper' => '<p>%s</p>' ] );
 *
 * @param array $attributes {
 *    Attributes for the acf link markup.
 *
 * @type string $href URL link.
 * @type string $title title link.
 * @type string $target Target for the link.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the link markup.
 *
 * @type string $content Optional. The content of the link
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ]
 * @type string $new_window Optional. Add <span class="sr-only> for a11y
 *
 * }
 *
 * @return string Return the markup of the link
 */
function get_the_link( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['href'] ) ) {
		return '';
	}

	$attributes = wp_parse_args(
		$attributes,
		[
			'title'  => '',
			'target' => '',
		]
	);

	// For security reason if target _blank add rel noopener
	if ( '_blank' === $attributes['target'] ) {
		$attributes['rel']      = 'noopener';
		$settings['new_window'] = ! empty( $settings['new_window'] ) ? $settings['new_window'] : '<span class="sr-only">' . esc_html__(
			'New window',
			'beapi-frontend-framework'
		) . '</span>';
	}

	$attributes = apply_filters( 'bea_theme_framework_link_attributes', $attributes, $settings );

	$settings = wp_parse_args(
		$settings,
		[
			'before'     => '',
			'content'    => $attributes['title'],
			'new_window' => '',
			'after'      => '',
			'escape'     => [
				'href' => 'esc_url',
			],
		]
	);

	$settings = apply_filters( 'bea_theme_framework_link_settings', $settings, $attributes );

	/**************************************** START MARKUP LINK ****************************************/

	$attributes_escaped = [];
	foreach ( $attributes as $name => $value ) {
		// Handle single attributes like checked or data-seo-target, if null no attribute value
		if ( null === $value ) {
			$attributes_escaped[] = $name;
		} else {
			// Use user escape function, or default
			$value                = escape_attribute_value( $value, $settings['escape'][ $name ] ?? '' );
			$attributes_escaped[] = sprintf( '%s="%s"', $name, $value );
		}
	}

	// Implode all attributes for display purposes
	$attributes_escaped = implode( ' ', $attributes_escaped );
	// Escape content for display purposes
	$label = $settings['content'] ? escape_content_value( $settings['content'], $settings['escape']['content'] ?? '' ) : '';

	$link_markup = sprintf( '<a %s>%s%s</a>', $attributes_escaped, $settings['new_window'], $label );

	/**************************************** END MARKUP LINK ****************************************/

	$link_markup = apply_filters( 'bea_theme_framework_link_markup', $link_markup, $attributes, $settings );

	return $settings['before'] . $link_markup . $settings['after'];
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\the_link( ['href' => ..., 'title' => ...], [ 'wrapper' => '<p></p>' ] );
 *
 * @param array $attributes {
 *    Attributes for the link markup.
 *
 * @type string $href URL link.
 * @type string $title title link.
 * @type string $target Target for the link.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the acf link markup.
 *
 * @type string $content Optional. The content of the link
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ]
 * @type string $new_window Optional. Add <span class="sr-only> for a11y
 * }
 *
 *
 * @return void Echo of the link markup
 */
function the_link( array $attributes, array $settings = [] ): void {
	echo get_the_link( $attributes, $settings );
}
/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link_classes( ['url' => ...], [ 'menu-item'] );
 *
 * @param array|null $field{
 * @type string $url
 * @type string $title
 * @type string $target
 * }
 *
 * @param array $classes {
 *
 * @type string $current
 * @type string $external
 * }
 *
 * @return string Echo of the link classes
 */
function get_acf_link_classes( $field, array $classes ): string {

	if ( empty( $field['url'] ) ) {
		return implode( ' ', $classes );
	}

	if ( trailingslashit( $field['url'] ) === trailingslashit( home_url( add_query_arg( null, null ) ) ) ) {
		$classes = wp_parse_args(
			$classes,
			[
				'current' => 'current-menu-item',
			]
		);
	}

	$components = wp_parse_url( $field['url'] );
	$base       = wp_parse_url( home_url( '/' ) );

	if ( ! empty( $components['host'] ) && ! empty( $base['host'] ) && strcasecmp( $components['host'], $base['host'] ) ) {
		$classes = wp_parse_args(
			$classes,
			[
				'external' => 'external-menu-item',
			]
		);
	}

	return implode( ' ', $classes );

}

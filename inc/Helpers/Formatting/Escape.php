<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Escape;

/**
 * Method for escaping attributes
 *
 * @param string $value Value to be escaped
 * @param callable|string $escape We can pass an anonymous function or method in native escape form as a string (example: 'esc_url'). By default the method escapes the attributes
 *
 * @return mixed Return value escape
 */
function escape_attribute_value( string $value, $escape = 'esc_attr' ) {
	if ( ! is_callable( $escape ) ) {
		return esc_attr( $value );
	}

	return $escape( $value );
}

/**
 * Method for escaping html or content
 *
 * @param string $value Value to be escaped
 * @param callable|string $escape We can pass an anonymous function or method in native escape form as a string (example: 'wp_kses'). By default the method escapes the html
 *
 * @return mixed Return value escape
 */
function escape_content_value( string $value, $escape = 'esc_html' ) {
	if ( ! is_callable( $escape ) ) {
		return esc_html( $value );
	}

	return $escape( $value );
}

<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Escape;

/**
 * Method for escaping attributes
 *
 * @param string $value Value to be escaped
 * @param string $escape We can pass an anonymous function or method in native escape form as a string (example: 'esc_url'). By default the method escapes the attributes
 *
 * @return mixed Return value escape
 */
function escape_attribute_value( string $value, string $escape ) {
	if ( ! function_exists( $escape ) ) {
		return $value;
	}

	return $escape( $value );
}

/**
 * Method for escaping html or content
 *
 * @param string $value Value to be escaped
 * @param string $escape We can pass an anonymous function or method in native escape form as a string (example: 'wp_kses'). By default the method escapes the html
 *
 * @return mixed Return value escape
 */
function escape_content_value( string $value, string $escape ) {
	if ( ! function_exists( $escape ) ) {
		return $value;
	}

	return $escape( $value );
}

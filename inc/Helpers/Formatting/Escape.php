<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Escape;

/**
 * @param string $value
 * @param string $escape
 *
 * @return mixed
 */
function escape_attribute_value( string $value, string $escape ) {
	if ( ! function_exists( $escape ) ) {
		return $value;
	}

	return $escape( $value );
}

/**
 * @param string $value
 * @param string $escape
 *
 * @return mixed
 */
function escape_content_value( string $value, string $escape ) {
	if ( ! function_exists( $escape ) ) {
		return $value;
	}

	return $escape( $value );
}
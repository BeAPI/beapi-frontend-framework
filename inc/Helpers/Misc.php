<?php

namespace BEA\Theme\Framework\Helpers\Misc;

/**
 * Get file infos
 *
 * @param int $file_id
 *
 * @return array $file_infos
 */
function get_file_infos( int $file_id ): array {
	$file_href  = wp_get_attachment_url( $file_id );
	$file_infos = [
		'href'      => '',
		'file_name' => '',
		'path'      => '',
		'size'      => '',
		'ext'       => '',
		'caption'   => '',
	];

	if ( empty( $file_href ) ) {
		return $file_infos;
	}

	$file_path = get_attached_file( $file_id );

	if ( empty( $file_path ) ) {
		return $file_infos;
	}

	$file_ext = get_mime_type( $file_id );

	if ( empty( $file_ext ) ) {
		return $file_infos;
	}

	$file_size = (string) size_format( wp_filesize( $file_path ) );
	$file_name = (string) ( get_the_title( $file_id ) ?? '' );

	return [
		'file_name'          => $file_name,
		'details'            => get_file_detail( $file_name, $file_ext, $file_size ),
		'details_accessible' => get_file_detail( $file_name, $file_ext, get_accessible_file_size_label( $file_size ) ),
		'href'               => $file_href,
		'caption'            => wp_get_attachment_caption( $file_id ),
	];
}

/**
 * Get file details
 *
 * @param string $file_name
 * @param string $file_ext
 * @param string $file_size
 *
 * @return string $file_detail
 */
function get_file_detail( string $file_name, string $file_ext, string $file_size ): string {
	$details  = [];

	if ( ! empty( $file_name ) ) {
		$details[] = $file_name;
	}

	if ( ! empty( $file_ext ) ) {
		$details[] = strtoupper( $file_ext );
	}

	if ( ! empty( $file_size ) ) {
		$details[] = $file_size;
	}

	return implode( ' – ', $details );
}

/**
 * Get mime type
 *
 * @param int $file_id
 *
 * @return string
 */
function get_mime_type( int $file_id ) {
	$mime_type = (string) get_post_mime_type( $file_id );

	if ( empty( $mime_type ) ) {
		return '';
	}

	$mime_type = explode( '/', $mime_type );

	return end( $mime_type );
}

/**
 * Get accessible file size label
 *
 * @param string $file_size
 *
 * @return string
 */
function get_accessible_file_size_label( string $file_size ): string {
	// Extract value and unit from file size (e.g., "7ko" → "7" + "ko").
	preg_match( '/^([\d.,]+)\s*([a-zA-Z]+)$/', $file_size, $matches );
	$value     = $matches[1] ?? '';
	$int_value = (int) $value; // Cast to int for _n() pluralization.
	$unit      = strtolower( $matches[2] ?? '' );

	switch ( $unit ) {
		case 'b':
		case 'o':
			$unit_label = _n( 'byte', 'bytes', $int_value, 'beapi-frontend-framework' );
			break;
		case 'kb':
		case 'ko':
			$unit_label = _n( 'kilobyte', 'kilobytes', $int_value, 'beapi-frontend-framework' );
			break;
		case 'mb':
		case 'mo':
			$unit_label = _n( 'megabyte', 'megabytes', $int_value, 'beapi-frontend-framework' );
			break;
		case 'gb':
		case 'go':
			$unit_label = _n( 'gigabyte', 'gigabytes', $int_value, 'beapi-frontend-framework' );
			break;
		case 'tb':
		case 'to':
			$unit_label = _n( 'terabyte', 'terabytes', $int_value, 'beapi-frontend-framework' );
			break;
		default:
			return $file_size;
	}

	return $value . ' ' . $unit_label;
}

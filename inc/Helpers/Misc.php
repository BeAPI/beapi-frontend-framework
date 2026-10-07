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
		'file_name'          => '',
		'details'            => '',
		'details_accessible' => '',
		'href'               => '',
		'caption'            => '',
		'icon'               => get_file_icon( '' ),
	];

	if ( empty( $file_href ) ) {
		return $file_infos;
	}

	$file_path = get_attached_file( $file_id );

	if ( empty( $file_path ) ) {
		return $file_infos;
	}

	$file_ext = pathinfo( $file_path, PATHINFO_EXTENSION );

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
		'caption'            => (string) wp_get_attachment_caption( $file_id ),
		'icon'               => get_file_icon( $file_ext ),
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
	$details = [];

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
 * Get accessible file size label
 *
 * @param string $file_size
 *
 * @return string
 */
function get_accessible_file_size_label( string $file_size ): string {
	// Extract value and unit (e.g. "7ko" or "1\u{00A0}000 KB" from i18n thousands separators).
	// UTF-8 mode: allow NBSP/NNBSP inside the value; a non-possessive +? so the last \s* is the gap before the unit, not the thousands separator.
	if ( 1 !== preg_match( '/^([\d\.,\p{Zs}]+?)\s*+([a-zA-Z]+)$/u', $file_size, $matches ) ) {
		return $file_size;
	}

	$value = $matches[1] ?? '';
	$unit  = strtolower( $matches[2] ?? '' );
	// Strip group separators (ASCII space, NBSP, NNBSP) for _n() plural; (int) leaves decimals as floor (e.g. 1.5 -> 1).
	$int_value = (int) str_replace( [ ' ', "\u{00A0}", "\u{202F}" ], '', $value );

	/* translators: file size units (byte, kilobyte, megabyte, etc.) */
	$unit_label = match ( $unit ) {
		'b', 'o'   => _n( 'byte', 'bytes', $int_value, 'beapi-frontend-framework' ),
		'kb', 'ko' => _n( 'kilobyte', 'kilobytes', $int_value, 'beapi-frontend-framework' ),
		'mb', 'mo' => _n( 'megabyte', 'megabytes', $int_value, 'beapi-frontend-framework' ),
		'gb', 'go' => _n( 'gigabyte', 'gigabytes', $int_value, 'beapi-frontend-framework' ),
		'tb', 'to' => _n( 'terabyte', 'terabytes', $int_value, 'beapi-frontend-framework' ),
		default    => null,
	};

	if ( null === $unit_label ) {
		return $file_size;
	}

	return $value . ' ' . $unit_label;
}

/**
 * @param string $file_ext
 *
 * @return string
 */
function get_file_icon( string $file_ext ): string {
	$file_icon = 'file';

	if ( in_array( strtolower( $file_ext ), [ 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp', 'ico' ], true ) ) {
		$file_icon = 'file-image';
	}

	return $file_icon;
}

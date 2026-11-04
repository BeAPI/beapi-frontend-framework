<?php

namespace BEA\Theme\Framework\Helpers\Misc;

/**
 * Get file infos
 *
 * @param int $file_id Attachment ID.
 *
 * @return array{
 *     file_name: string,
 *     details: string,
 *     details_accessible: string,
 *     href: string,
 *     caption: string,
 *     icon: string
 * }
 */
function get_file_infos( int $file_id ): array {
	$cache_group = 'beapi_file_infos';
	$cached      = wp_cache_get( $file_id, $cache_group );

	if ( false !== $cached && is_array( $cached ) ) {
		return $cached;
	}

	$file_infos = [
		'file_name'          => '',
		'details'            => '',
		'details_accessible' => '',
		'href'               => '',
		'caption'            => '',
		'icon'               => get_file_icon( '' ),
	];

	$file_href = wp_get_attachment_url( $file_id );

	if ( empty( $file_href ) ) {
		wp_cache_set( $file_id, $file_infos, $cache_group );

		return $file_infos;
	}

	$file_path = get_attached_file( $file_id );

	if ( empty( $file_path ) ) {
		wp_cache_set( $file_id, $file_infos, $cache_group );

		return $file_infos;
	}

	$file_ext = pathinfo( $file_path, PATHINFO_EXTENSION );

	if ( empty( $file_ext ) ) {
		wp_cache_set( $file_id, $file_infos, $cache_group );

		return $file_infos;
	}

	$file_bytes           = get_attachment_filesize( $file_id, $file_path );
	$file_size            = $file_bytes > 0 ? (string) size_format( $file_bytes ) : '';
	$accessible_file_size = $file_bytes > 0 ? get_accessible_file_size_label( $file_bytes ) : '';
	$file_name            = (string) ( get_the_title( $file_id ) ?? '' );

	$file_infos = [
		'file_name'          => $file_name,
		'details'            => get_file_detail( $file_name, $file_ext, $file_size ),
		'details_accessible' => get_file_detail( $file_name, $file_ext, $accessible_file_size ),
		'href'               => $file_href,
		'caption'            => (string) wp_get_attachment_caption( $file_id ),
		'icon'               => get_file_icon( $file_ext ),
	];

	wp_cache_set( $file_id, $file_infos, $cache_group );

	return $file_infos;
}

/**
 * Resolve attachment filesize in bytes from metadata, with wp_filesize() fallback and meta backfill.
 *
 * @param int    $file_id   Attachment ID.
 * @param string $file_path Absolute path to the attached file.
 *
 * @return int Filesize in bytes, or 0 when unavailable.
 */
function get_attachment_filesize( int $file_id, string $file_path ): int {
	$metadata = wp_get_attachment_metadata( $file_id );

	if ( is_array( $metadata ) && ! empty( $metadata['filesize'] ) ) {
		return (int) $metadata['filesize'];
	}

	$filesize = wp_filesize( $file_path );

	if ( $filesize <= 0 ) {
		return 0;
	}

	if ( ! is_array( $metadata ) ) {
		$metadata = [];
	}

	$metadata['filesize'] = $filesize;
	wp_update_attachment_metadata( $file_id, $metadata );

	return $filesize;
}

/**
 * Get file details
 *
 * @param string $file_name File display name.
 * @param string $file_ext  File extension.
 * @param string $file_size Formatted file size label.
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
 * Get accessible file size label from raw bytes (screen-reader friendly, pluralized units).
 *
 * Mirrors size_format() unit thresholds without parsing its localized output.
 *
 * @param int $bytes File size in bytes.
 *
 * @return string
 */
function get_accessible_file_size_label( int $bytes ): string {
	if ( $bytes <= 0 ) {
		return '';
	}

	$quant = [
		'tb' => TB_IN_BYTES,
		'gb' => GB_IN_BYTES,
		'mb' => MB_IN_BYTES,
		'kb' => KB_IN_BYTES,
		'b'  => 1,
	];

	$unit = 'b';
	$mag  = 1;

	foreach ( $quant as $unit_key => $unit_mag ) {
		if ( (float) $bytes >= $unit_mag ) {
			$unit = $unit_key;
			$mag  = $unit_mag;
			break;
		}
	}

	$value     = $bytes / $mag;
	$int_value = (int) round( $value );
	$formatted = number_format_i18n( $value, 0 );

	/* translators: file size units (byte, kilobyte, megabyte, etc.) */
	$unit_label = match ( $unit ) {
		'b'     => _n( 'byte', 'bytes', $int_value, 'beapi-frontend-framework' ),
		'kb'    => _n( 'kilobyte', 'kilobytes', $int_value, 'beapi-frontend-framework' ),
		'mb'    => _n( 'megabyte', 'megabytes', $int_value, 'beapi-frontend-framework' ),
		'gb'    => _n( 'gigabyte', 'gigabytes', $int_value, 'beapi-frontend-framework' ),
		'tb'    => _n( 'terabyte', 'terabytes', $int_value, 'beapi-frontend-framework' ),
		default => null,
	};

	if ( null === $unit_label ) {
		return '';
	}

	return $formatted . ' ' . $unit_label;
}

/**
 * @param string $file_ext File extension.
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

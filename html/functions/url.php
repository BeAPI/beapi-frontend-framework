<?php
/**
 * Get full URL from current script dir execution
 * 
 * @param array $s
 * @param boolean $only_dir_url
 * @return string
 */
function get_full_url( $s, $only_dir_url = false ) {
	$ssl = (!empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on') ? true : false;
	$sp = strtolower( $s['SERVER_PROTOCOL'] );
	$protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . (($ssl) ? 's' : '');
	$port = $s['SERVER_PORT'];
	$port = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
	$host = isset( $s['HTTP_X_FORWARDED_HOST'] ) ? $s['HTTP_X_FORWARDED_HOST'] : isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : $s['SERVER_NAME'];

	if ( $only_dir_url == true ) {
		$s['REQUEST_URI'] = dirname( $s['REQUEST_URI'] ) . '/';
	}
	return $protocol . '://' . $host . $port . $s['REQUEST_URI'];
}

/**
 * Clone of realpath function for URL... (allow use /../ and delete)
 * 
 * @param string $address
 * @return string
 */
function canonicalize( $address ) {
	$address = explode( '/', $address );
	$keys = array_keys( $address, '..' );

	foreach ( $keys AS $keypos => $key ) {
		array_splice( $address, $key - ($keypos * 2 + 1), 2 );
	}

	$address = implode( '/', $address );
	$address = str_replace( './', '', $address );

	return $address;
}

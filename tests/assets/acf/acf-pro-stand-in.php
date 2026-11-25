<?php
/**
 * Minimal stand-ins for the ACF PRO options page functions, loaded only when ACF PRO is not active.
 *
 * They return the received parameters, as the real functions return the page settings.
 */

if ( ! function_exists( 'acf_add_options_page' ) ) {
	function acf_add_options_page( $page = '' ) {
		return $page;
	}
}

if ( ! function_exists( 'acf_add_options_sub_page' ) ) {
	function acf_add_options_sub_page( $page = '' ) {
		return $page;
	}
}

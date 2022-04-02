<?php

namespace BEA\Theme\Framework\Helpers\Pattern_Content;

/**
 * @usage BEA\Theme\Framework\Helpers\Pattern_Content\maybe_term( 'slug','taxonomy' );
 *
 * @param string $slug
 * @param string $taxonomy
 *
 * @return string
 */
function maybe_term( string $slug, string $taxonomy ): string {
	$term = get_term_by( 'slug', $slug, $taxonomy );
	if ( ! $term instanceof \WP_Term ) {
		return '[]';
	}
	$data = [ 'id' => absint( $term->term_id ), 'taxonomy' =>  esc_attr( $taxonomy )  ];
	return wp_json_encode( $data );
}

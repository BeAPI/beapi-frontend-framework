<?php

namespace Unaf\Master\Theme\Helpers\Pattern_Content;

/**
 * @usage Unaf\Master\Theme\Helpers\Pattern_Content\maybe_term( 'slug','taxonomy' );
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

	return sprintf(
		'[{"id":%d,"taxonomy":"%s"}]',
		absint( $term->term_id ),
		esc_attr( $taxonomy )
	);
}

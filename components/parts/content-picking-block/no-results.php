<?php
/**
 * Content picking block without posts.
 *
 * The front end displays nothing. The editor shows a message so that the block stays visible.
 *
 * @var array $args {
 *     @type bool $is_preview Whether the block is rendered in the editor.
 * }
 */

if ( empty( $args['is_preview'] ) ) {
	return;
}
?>
<p class="block--content-picking__no-results"><?php esc_html_e( 'No results found.', 'beapi-frontend-framework' ); ?></p>

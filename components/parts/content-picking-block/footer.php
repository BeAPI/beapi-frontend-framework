<?php
/**
 * Content picking block footer, displayed after the posts: the block link.
 *
 * @var array $args {
 *     @type array  $block_link {
 *         @type string $url        Link URL. Nothing is displayed when empty.
 *         @type string $label      Link label. Default 'See more'.
 *         @type string $linkTarget Link target.
 *     }
 *     @type string $link_class Link class. Default 'btn-block'.
 * }
 */

use function BEA\Theme\Framework\Helpers\Formatting\Link\the_link;

$block_link = (array) ( $args['block_link'] ?? [] );
$link_url   = (string) ( $block_link['url'] ?? '' );
$link_class = (string) ( $args['link_class'] ?? 'btn-block' );

if ( '' === $link_url ) {
	return;
}

$link_label = ! empty( $block_link['label'] ) ? (string) $block_link['label'] : __( 'See more', 'beapi-frontend-framework' );

?>
<div class="block--content-picking__footer">
	<?php
	the_link(
		[
			'href'   => $link_url,
			'target' => (string) ( $block_link['linkTarget'] ?? '' ),
			'class'  => sprintf( 'block--content-picking__link %s', $link_class ),
		],
		[
			'content' => $link_label,
			'escape'  => [
				'content' => 'esc_html',
			],
		]
	);
	?>
</div>

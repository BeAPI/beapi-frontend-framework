<?php
/**
 * Content picking block: posts in a mega menu.
 *
 * No block title nor link: the mega menu provides its own. Card titles are not real headings
 * (see the `is_megamenu` argument of components/loops/crd-post.php).
 *
 * @var array $args {
 *     @type \WP_Query $block_query     Posts to display.
 *     @type array     $card_attributes Arguments passed to the card template.
 *     @type bool      $is_preview      Whether the block is rendered in the editor.
 * }
 */

$block_query     = $args['block_query'] ?? null;
$card_attributes = (array) ( $args['card_attributes'] ?? [] );
$is_preview      = (bool) ( $args['is_preview'] ?? false );

if ( ! $block_query instanceof \WP_Query ) {
	return;
}

if ( ! $block_query->have_posts() ) {
	get_template_part( 'components/parts/content-picking-block/no-results', null, [ 'is_preview' => $is_preview ] );
	return;
}

$card_attributes['is_megamenu'] = true;
?>
<div class="block--content-picking__inner" data-list>
	<ul class="block--content-picking__items">
		<?php
		while ( $block_query->have_posts() ) :
			$block_query->the_post();
			?>
			<li class="block--content-picking__item">
				<?php get_template_part( 'components/loops/crd-post', null, $card_attributes ); ?>
			</li>
			<?php
		endwhile;
		wp_reset_postdata();
		?>
	</ul>
</div>

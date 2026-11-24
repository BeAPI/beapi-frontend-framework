<?php
/**
 * Content picking block: posts in a grid (default display mode).
 *
 * @var array $args {
 *     @type \WP_Query $block_query     Posts to display.
 *     @type array     $card_attributes Arguments passed to the card template.
 *     @type string    $per_line        Number of columns on large screens.
 *     @type bool      $is_preview      Whether the block is rendered in the editor.
 * }
 */

$block_query     = $args['block_query'] ?? null;
$card_attributes = (array) ( $args['card_attributes'] ?? [] );
$per_line        = (string) ( $args['per_line'] ?? '3' );
$is_preview      = (bool) ( $args['is_preview'] ?? false );

if ( ! $block_query instanceof \WP_Query ) {
	return;
}

if ( ! $block_query->have_posts() ) {
	get_template_part( 'components/parts/content-picking-block/no-results', null, [ 'is_preview' => $is_preview ] );
	return;
}
?>
<div class="block--content-picking__inner" data-grid="<?php echo esc_attr( $per_line ); ?>" style="--grid-columns: <?php echo esc_attr( $per_line ); ?>">
	<?php get_template_part( 'components/parts/content-picking-block/header', null, $args ); ?>

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

	<?php get_template_part( 'components/parts/content-picking-block/footer', null, $args ); ?>
</div>

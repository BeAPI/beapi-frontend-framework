<?php
/**
 * Content picking block header.
 *
 * @var array $args {
 *     @type string $block_title   Block title. Nothing is displayed when empty.
 *     @type string $heading_level Block title heading level, from 2 to 6.
 *     @type string $heading_class Heading style class. Default 'is-style-h2'.
 * }
 */

$block_title   = (string) ( $args['block_title'] ?? '' );
$heading_level = (string) ( $args['heading_level'] ?? '2' );
$heading_class = (string) ( $args['heading_class'] ?? 'is-style-h2' );

if ( '' === $block_title ) {
	return;
}
?>
<div class="block--content-picking__header">
	<?php
	printf(
		'<h%1$s class="wp-block-heading %2$s">%3$s</h%1$s>',
		esc_attr( $heading_level ),
		esc_attr( $heading_class ),
		esc_html( $block_title )
	);
	?>
</div>

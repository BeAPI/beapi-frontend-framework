<?php
/**
 * Content picking blocks template (beapi/dynamic-block and beapi/manual-block).
 *
 * Loads `components/parts/content-picking-block/{post_type}-{display_mode}.php`,
 * or `{post_type}.php` when the display mode has no dedicated template.
 *
 * @var array $args {
 *     @type array     $block_attributes         Block attributes.
 *     @type string    $block_wrapper_attributes Block wrapper attributes.
 *     @type \WP_Query $block_query              Posts to display.
 *     @type bool      $is_preview               Whether the block is rendered in the editor.
 * }
 */

$block_attributes         = (array) ( $args['block_attributes'] ?? [] );
$block_wrapper_attributes = (string) ( $args['block_wrapper_attributes'] ?? '' );
$block_query              = $args['block_query'] ?? null;
$is_preview               = (bool) ( $args['is_preview'] ?? ( defined( 'REST_REQUEST' ) && REST_REQUEST ) );

$block_type      = str_contains( $block_wrapper_attributes, 'wp-block-beapi-dynamic-block' ) ? 'dynamic' : 'manual';
$block_post_type = sanitize_key( (string) ( $block_attributes['postType'] ?? 'post' ) );
$display_mode    = sanitize_key( (string) ( $block_attributes['displayMode'] ?? '' ) );
$block_title     = (string) ( $block_attributes['blockTitle'] ?? '' );
$per_line        = max( 1, min( 6, (int) ( $block_attributes['perLine'] ?? 3 ) ) );

/**
 * The block title uses the heading level chosen in the editor. Cards come one level below it,
 * so that blocks can be nested in the page outline. Without a title, cards take the chosen level.
 */
$heading_level      = max( 2, min( 6, (int) ( $block_attributes['headingLevel'] ?? 2 ) ) );
$card_heading_level = '' !== $block_title ? min( 6, $heading_level + 1 ) : $heading_level;
?>
<div <?php echo wp_kses_data( $block_wrapper_attributes ); ?> data-type="<?php echo esc_attr( $block_type ); ?>" data-layout="<?php echo esc_attr( $display_mode ); ?>" data-post-type="<?php echo esc_attr( $block_post_type ); ?>">
	<?php
	get_template_part(
		'components/parts/content-picking-block/' . $block_post_type,
		'' !== $display_mode ? $display_mode : null,
		[
			'block_query'     => $block_query,
			'block_title'     => $block_title,
			'block_link'      => (array) ( $block_attributes['blockLink'] ?? [] ),
			'heading_level'   => (string) $heading_level,
			'per_line'        => (string) $per_line,
			'is_preview'      => $is_preview,
			'card_attributes' => [
				'heading_level' => (string) $card_heading_level,
				'block_type'    => $block_type,
			],
		]
	);
	?>
</div>

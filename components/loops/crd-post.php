<?php
/**
 * Post card, used in the loop of the current post.
 *
 * The whole card is clickable through the title link (data-seo-container / data-seo-target),
 * so the image is decorative.
 *
 * The title link has an aria-label. It replaces the "New window" text that the_link() adds
 * to target="_blank" links: handle it here before opening posts in a new window.
 *
 * @usage Inside the loop, after the_post():
 *     get_template_part( 'components/loops/crd-post', null, [ 'heading_level' => '3' ] );
 *
 * @var array $args {
 *     @type string $heading_level Title heading level, from 2 to 6. Default '3'.
 *     @type string $class         Additional card classes.
 *     @type bool   $is_megamenu   Whether the card is displayed in a mega menu. Its title is then a
 *                                 paragraph with role="heading" instead of an Hn tag, to keep the menu
 *                                 out of the HTML outline. Assistive technologies still announce it
 *                                 as a heading. Default false.
 * }
 */

use function BEA\Theme\Framework\Helpers\Formatting\Datetime\the_datetime;
use function BEA\Theme\Framework\Helpers\Formatting\Image\the_image;
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_link;

$heading_level = (string) ( $args['heading_level'] ?? '3' );
$extra_class   = (string) ( $args['class'] ?? '' );
$is_megamenu   = (bool) ( $args['is_megamenu'] ?? false );

$post_title = get_the_title();

$link_args = [
	'href'            => (string) get_permalink(),
	'class'           => 'crd__link',
	'data-seo-target' => null,
	/* translators: %s: post title */
	'aria-label'      => sprintf( __( 'See the post: %s', 'beapi-frontend-framework' ), wp_strip_all_tags( $post_title ) ),
];
?>
<div class="crd crd--post <?php echo esc_attr( $extra_class ); ?>" data-seo-container>
	<div class="crd__image-wrapper">
		<?php
		the_image(
			(int) get_post_thumbnail_id(),
			[
				'data-location' => 'card-post',
				'class'         => 'crd__image',
				'alt'           => '',
			],
			[
				'default' => true,
			]
		);
		?>
	</div>

	<div class="crd__content">
		<?php
		if ( $is_megamenu ) {
			the_link(
				$link_args,
				[
					'content' => $post_title,
					'before'  => sprintf( '<p role="heading" aria-level="%s" class="crd__title">', esc_attr( $heading_level ) ),
					'after'   => '</p>',
				]
			);
		} else {
			the_link(
				$link_args,
				[
					'content' => $post_title,
					'before'  => sprintf( '<h%s class="crd__title">', esc_attr( $heading_level ) ),
					'after'   => sprintf( '</h%s>', esc_attr( $heading_level ) ),
				]
			);
		}

		the_datetime(
			(string) get_the_date(),
			[
				'datetime' => (string) get_the_date( 'Y-m-d' ),
				'class'    => 'crd__date',
			]
		);
		?>
	</div>
</div>

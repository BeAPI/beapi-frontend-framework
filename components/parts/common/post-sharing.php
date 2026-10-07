<?php
/**
 * Post sharing actions (copy link / native share).
 *
 * @var array $args {
 *     @type string $url   Post permalink.
 *     @type string $title Post title.
 * }
 */

use function BEA\Theme\Framework\Helpers\Svg\the_icon;

$url        = (string) ( $args['url'] ?? '' );
$post_title = (string) ( $args['title'] ?? '' );

if ( '' === $url ) {
	return;
}
?>

<div
	class="post-sharing"
	data-url="<?php echo esc_url( $url ); ?>"
	data-title="<?php echo esc_attr( $post_title ); ?>"
	data-copied-label="<?php echo esc_attr__( 'Link copied!', 'beapi-frontend-framework' ); ?>"
	data-error-copy="<?php echo esc_attr__( 'Unable to copy the link', 'beapi-frontend-framework' ); ?>"
	data-error-share="<?php echo esc_attr__( 'Unable to share', 'beapi-frontend-framework' ); ?>"
>
	<div class="post-sharing__actions">
		<button type="button" class="post-sharing__button post-sharing__button--copy" data-action="copy">
			<?php the_icon( 'link', [ 'post-sharing__icon', 'post-sharing__icon--copy' ] ); ?>
			<?php the_icon( 'check-circle', [ 'post-sharing__icon', 'post-sharing__icon--check' ] ); ?>
			<span class="post-sharing__label"><?php echo esc_html__( 'Copy link', 'beapi-frontend-framework' ); ?></span>
		</button>
		<button type="button" class="post-sharing__button post-sharing__button--share" data-action="share">
			<?php the_icon( 'share', [ 'post-sharing__icon', 'post-sharing__icon--share' ] ); ?>
			<span class="post-sharing__label"><?php echo esc_html__( 'Share', 'beapi-frontend-framework' ); ?></span>
		</button>
	</div>
	<p class="post-sharing__status sr-only" role="status" aria-live="polite"></p>
</div>

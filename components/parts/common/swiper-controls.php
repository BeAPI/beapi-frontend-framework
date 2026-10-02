<?php

/**
 * Swiper Controls
 * Swiper add/replace automatically the aria-label, the role, the icon on the buttons
 *
 * @var array $args
 */

?>

<div class="swiper__controls">
	<div class="swiper__buttons">
		<div class="swiper-button-prev swiper__button" role="button" aria-label="<?php esc_attr_e( 'Previous slide', 'beapi-frontend-framework' ); ?>"></div>
		<div class="swiper-button-next swiper__button" role="button" aria-label="<?php esc_attr_e( 'Next slide', 'beapi-frontend-framework' ); ?>"></div>
	</div>
</div>

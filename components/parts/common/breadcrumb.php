<?php
if ( ! function_exists( 'yoast_breadcrumb' ) ) {
	return;
}
?>

<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Breadcrumb', 'beapi-frontend-framework' ); ?>">
	<div class="container">
		<?php yoast_breadcrumb( '<div class="breadcrumb__inner">', '</div>' ); ?>
	</div>
</nav>

		</main>

		<?php
		if ( function_exists( 'get_block_template' ) && get_block_template( get_stylesheet() . '//footer', 'wp_template_part' ) ) {
			block_template_part( 'footer' );
		} else {
			get_template_part( 'components/parts/common/footer' );
		}
		wp_footer();
		?>
	</body>
</html>

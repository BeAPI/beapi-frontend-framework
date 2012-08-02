<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content
 * after. Calls sidebar-footer.php for bottom widgets.
 *

 * @subpackage BeAPI_Base_Theme
 *
 */
?>
		</div><!-- #main -->
		
		<div id="footer" role="contentinfo">
			<div id="colophon">
				<?php
				/* A sidebar in the footer? Yep. You can can customize
				 * your footer with four columns of widgets.
				 */
				get_sidebar( 'footer' );
				?>
				
				<div id="site-info">
					<a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
						<?php bloginfo( 'name' ); ?>
					</a>
				</div><!-- #site-info -->
				
				<div id="site-generator">
					<?php do_action( 'beapi_base_theme_credits' ); ?>
					<a href="<?php echo esc_url( __( 'http://wordpress.org/', 'beapi-base-theme' ) ); ?>" title="<?php esc_attr_e( 'Semantic Personal Publishing Platform', 'beapi-base-theme' ); ?>" rel="generator"><?php printf( __( 'Proudly powered by %s.', 'beapi-base-theme' ), 'WordPress' ); ?></a>
				</div><!-- #site-generator -->
			</div><!-- #colophon -->
		</div><!-- #footer -->
	
	</div><!-- #wrapper -->

	<?php
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */
	
	wp_footer();
	?>
	<!-- <?php printf(__('%d queries. %s seconds.', 'beapi-base-theme'), get_num_queries(), timer_stop(0, 3)); ?> -->
</body>
</html>
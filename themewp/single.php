<?php
/**
 * The Template for displaying all single posts.
 *

 * @subpackage BeAPI_Base_Theme
 *
 */

get_header(); ?>

<div id="container">
	<div id="content" role="main">
		<?php
		/* Run the loop to output the post.
		 * If you want to overload this in a child theme then include a file
		 * called loop-single.php and that will be used instead.
		 */
		get_template_part( 'loop', 'single' );
		?>
	</div><!-- #content -->
</div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php
/**
 * The template for displaying Tag Archive pages.
 *
 * @subpackage BeAPI_Base_Theme
 *
 */

get_header(); ?>

<div id="container">
	<div id="content" role="main">
		<h1 class="page-title"><?php
			printf( __( 'Tag Archives: %s', 'beapi-base-theme' ), '<span>' . single_tag_title( '', false ) . '</span>' );
		?></h1>

		<?php
		/* Run the loop for the tag archive to output the posts
		 * If you want to overload this in a child theme then include a file
		 * called loop-tag.php and that will be used instead.
		 */
		 get_template_part( 'loop', 'tag' );
		?>
	</div><!-- #content -->
</div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
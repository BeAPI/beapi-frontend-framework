<?php get_header(); ?>
<div class="container">
	<div class="wysiwyg">
		<?php while ( have_posts() ) {
			the_post();
			the_content();
		} ?>
	</div>
</div>
<?php get_footer(); ?>

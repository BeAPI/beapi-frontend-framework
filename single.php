<?php get_header();
the_post();
?>
	<header class="container">
		<h1><?php the_title(); ?></h1>
	</header>
	<div class="blocks-container">
		<?php the_content(); ?>;
	</div>
<?php
get_footer();

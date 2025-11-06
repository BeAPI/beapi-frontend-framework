<?php
get_header();

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		?>
		<header class="container">
			<h1><?php the_title(); ?></h1>
		</header>
		<div class="blocks-container is-layout-constrained has-global-padding">
			<?php the_content(); ?>
		</div>
		<?php
	endwhile;
endif;

get_footer();

<!-- Entry summary sample for loop -->
<article class="entry__summary" itemscope itemtype="http://schema.org/Article">
	<a class="alignleft" href="#">
		<!-- Local dev only -->
		<!-- <img src="http://placehold.it/150x150" width="150" height="150" alt="#"> -->
		<!-- end Local dev only -->
		<?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'entry__img', 'alt' => '#' ) ); ?>
		
	</a>
	<h2 class="entry__title" itemprop="headline">
		<a href="#">There is a post + a 20 words lorem ipsum excerpt</a>
	</h2>
	<div class="entry__date">
		Publié le <time datetime="2015-06-30" itemprop="datePublished">06/30/2015</time>
	</div>
	<div class="entry__excerpt">
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac fringilla nunc. In hac habitasse platea dictumst. Pellentesque habitant morbi.</p>
	</div>
	<div class="entry__more">
		<a href="#" class="entry__more-button">Readmore</a>
	</div>
</article>
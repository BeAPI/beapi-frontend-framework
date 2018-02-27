<!-- Entry summary sample for loop -->
<article class="entry__item">
	<div class="entry__media">
		<?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'entry__img', 'alt' => '#' ) ); ?>
	</div>
	<div class="entry__summary">
		<h2 class="entry__title">
			<a href="#">There is a post + a 20 words lorem ipsum excerpt</a>
		</h2>
		<div class="entry__date">
			Publié le <time datetime="2015-06-30">06/30/2015</time>
		</div>
		<div class="entry__excerpt">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac fringilla nunc. In hac habitasse platea dictumst. Pellentesque habitant morbi.</p>
		</div>
		<div class="entry__more">
			<button data-href="#" class="entry__more-button">Readmore</button>
		</div>
	</div>
</article>

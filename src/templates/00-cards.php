<?php $class = 'home'; ?>
<?php include 'header.php'; ?>
	<article class="article">
		<div class="container">
            <h1>Cards</h1>

            <h2>Vertical</h2>

            <div class="card" style="max-width: 300px;">
                <div class="card__thumbnail">
                    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'card__img', 'alt' => '#' ) ); ?>
                </div>
                <div class="card__content">
                    <h2 class="card__title">Super title</h2>
                    <p class="card__excerpt">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.</p>
                </div>
            </div>
            <div class="card card--reverse" style="max-width: 300px;">
                <div class="card__thumbnail">
                    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'card__img', 'alt' => '#' ) ); ?>
                </div>
                <div class="card__content">
                    <h2 class="card__title">Super title</h2>
                    <p class="card__excerpt">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.</p>
                </div>
            </div>

            <h2>Horizontal</h2>
            <div class="card card--row">
                <div class="card__thumbnail">
                    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'card__img', 'alt' => '#' ) ); ?>
                </div>
                <div class="card__content">
                    <h2 class="card__title">Super title</h2>
                    <p class="card__excerpt">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.</p>
                </div>
            </div>
            <div class="card card--row-reverse">
                <div class="card__thumbnail">
                    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'card__img', 'alt' => '#' ) ); ?>
                </div>
                <div class="card__content">
                    <h2 class="card__title">Super title</h2>
                    <p class="card__excerpt">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.</p>
                </div>
            </div>
		</div>
	</article>

<?php include 'footer.php'; ?>
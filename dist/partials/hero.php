<div class="hero">
    <div class="container">
        <h1><?php echo $heroTitle; ?></h1>
        <?php if (isset($heroExcerpt)){ ?>
            <p><?php echo $heroExcerpt; ?></p>
        <?php } ?>
    </div>
    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'hero-img', 'class' => 'hero__img', 'alt' => '#' ) ); ?>
</div>
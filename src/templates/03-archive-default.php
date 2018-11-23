<?php $bodyClass = 'archive'; ?>
<?php include 'partials/header.php'; ?>
    <div class="hero lazyload" data-bgset="assets/img/bg-sample/bg_img-mobile-01.jpg [(max-width: 1023px)] | assets/img/bg-sample/bg_img-desktop-01.jpg">
		<div class="container">
            <h1>Two basic styles of archive list</h1>
            <p>You can add WP-pagenavi or FacetWP plugin markup for pagination, from composerjs</p>
		</div>
    </div>
    <div class="container">
        <h2>Archive list</h2>
        <div class="archive__list">
            <?php for ($i=1; $i < 6; $i++) { ?>
                <div class="archive__item">
                    <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row card--center', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
                    <hr>
                </div>
            <?php } ?>
        </div>
    </div>
<?php include 'partials/footer.php'; ?>
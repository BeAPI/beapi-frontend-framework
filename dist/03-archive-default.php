<?php $class = 'archive'; ?>
<?php include 'header.php'; ?>
    <header class="page__header lazyload" data-bgset="../assets/img/bg-sample/bg_img-mobile-01.jpg [(max-width: 1023px)] | ../assets/img/bg-sample/bg_img-desktop-01.jpg">
		<div class="container">
            <h1 class="page__title">Two basic styles of archive list</h1>
            <p>You can add WP-pagenavi or FacetWP plugin markup for pagination, from composerjs</p>
		</div>
    </header>

    <div class="page__content">
        <div class="container">
            <h2 class="entry__title">An example of entry list</h2>
            <div class="entry__loop">
                <?php include 'blocks/entry__summary-01.php' ?>
                <?php include 'blocks/entry__summary-01.php' ?>
                <?php include 'blocks/entry__summary-01.php' ?>
            </div>
            <h2 class="entry__title">An example of entry "card" list</h2>
            <div class="entry__loop">
                <?php include 'blocks/entry__seo-01.php' ?>
                <?php include 'blocks/entry__seo-01.php' ?>
                <?php include 'blocks/entry__seo-01.php' ?>
            </div>
        </div>
    </div>
<?php include 'footer.php'; ?>
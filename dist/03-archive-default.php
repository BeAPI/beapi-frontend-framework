<?php $class = 'archive'; ?>
<?php include 'header.php'; ?>
    <header class="entry__header">
        <h1 class="entry__title">Two basic styles of archive list</h1>
        <p>You can add WP-pagenavi or FacetWP plugin markup for pagination, from composerjs</p>
    </header>
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
<?php include 'footer.php'; ?>
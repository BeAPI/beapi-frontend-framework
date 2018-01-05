<?php $class = 'home'; ?>
<?php include 'header.php'; ?>

	<section id="content" class="content">
		<h2 class="entry__title">An entry "card" list</h2>
		<div class="entry__loop">
			<?php include 'blocks/entry__seo-01.php' ?>
			<?php include 'blocks/entry__seo-01.php' ?>
			<?php include 'blocks/entry__seo-01.php' ?>
		</div>
		<h2 class="entry__title">An entry list</h2>
		<div class="entry__loop">
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
			<?php include 'blocks/entry__summary-01.php' ?>
		</div>
		<?php include 'blocks/wp-pagenavi.php' ?>
	</section>

	<aside class="sidebar" id="sidebar">
		<div class="widget-area">
			<?php include 'blocks/checkbox.php'; ?>
			<?php include 'blocks/radio.php'; ?>
		</div>
	</aside>

<?php include 'footer.php'; ?>
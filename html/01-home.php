<?php $class = 'home'; ?>
<?php include 'header.php'; ?>

	<section id="content" class="content">
		<?php include 'blocks/elementor.php' ?>
		<?php include 'blocks/wpform.php' ?>
		<?php include 'blocks/facetwp.php' ?>
	</section>

	<aside class="sidebar" id="sidebar">
		<div class="widget-area">
			<?php include 'blocks/widgets/widget-search.php'; ?>
			<?php include 'blocks/widgets/widget-text.php'; ?>
			<?php include 'blocks/widgets/widget-categories.php'; ?>
			<?php include 'blocks/widgets/widget-archive.php'; ?>
			<?php include 'blocks/widgets/widget-pages.php'; ?>
			<?php include 'blocks/checkbox.php'; ?>
			<?php include 'blocks/radio.php'; ?>
		</div>
	</aside>

<?php include 'footer.php'; ?>
<?php $class = 'home'; ?>
<?php include 'header.php'; ?>
		
	<section id="content" class="content">
		<h2 class="page__title">A post list</h2>
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
			<?php include 'blocks/entry__summary-01.php' ?>
		</div>
		<?php include 'blocks/wp-pagenavi.php' ?>
	</section>
	
	<aside class="sidebar" id="sidebar">
		<div class="widget-area">
			<?php include 'blocks/widgets/widget-search.php'; ?>
			<?php include 'blocks/widgets/widget-text.php'; ?>
			<?php include 'blocks/widgets/widget-categories.php'; ?>
			<?php include 'blocks/widgets/widget-archive.php'; ?>
			<?php include 'blocks/widgets/widget-pages.php'; ?>
		</div>
	</aside>

			
<?php include 'footer.php'; ?>
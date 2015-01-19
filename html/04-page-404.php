<?php $class = 'single'; ?>
<?php include 'header.php'; ?>
	<section class="content" id="content">
		<?php include 'blocks/breadcrumb.php'; ?>
		<h1 class="entry__title">Erreur 404</h1>
		<article class="entry">
			<section class="entry__content">
				<p>Désolé mais la page que vous recherchez n'existe plus.</p>
				<p>Vous pouvez effectuer une recherche :</p>
				
				<?php include 'searchform.php'; ?>

			</section>
		</article>
	</section>
	<aside class="sidebar" id="sidebar">
		<div class="widget-area">
			<?php include 'blocks/widgets/widget-search.php'; ?>
			<?php include 'blocks/widgets/widget-text.php'; ?>
			<?php include 'blocks/widgets/widget-categories.php'; ?>
			<?php include 'blocks/widgets/widget-archive.php'; ?>
			<?php include 'blocks/widgets/widget-pages.php'; ?>
			<?php include 'blocks/widgets/widget-gravityform.php'; ?>
		</div>
	</aside>
<?php include 'footer.php'; ?>
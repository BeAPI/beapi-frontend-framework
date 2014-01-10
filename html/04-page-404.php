<?php $class = 'single'; ?>
<?php include 'header.php'; ?>
			<section id="content">
				<?php include 'blocks/breadcrumb.php'; ?>
				<h1 class="page-title">Erreur 404</h1>
				<article class="entry">
					<section class="entry-content">
						<p>Désolé mais la page que vous recherchez n'existe plus.</p>
						<p>Vous pouvez effectuer une recherche :</p>
						<div class="searchform">
							<form method="get" action="#">
								<label for="s" class="assistive-text">Recherche</label>
								<input type="text" class="field" name="s" id="s" placeholder="Recherche">
								<input type="submit" class="submit" name="submit" id="searchsubmit" value="Recherche">
							</form>
						</div>
					</section>
				</article>
			</section>
			<aside id="sidebar">
				<div class="widget-area">
					<?php include '../blocks/widgets/widget-search.php'; ?>
					<?php include '../blocks/widgets/widget-text.php'; ?>
					<?php include '../blocks/widgets/widget-categories.php'; ?>
					<?php include '../blocks/widgets/widget-archive.php'; ?>
					<?php include '../blocks/widgets/widget-pages.php'; ?>
				</div>
			</aside>
<?php include 'footer.php'; ?>
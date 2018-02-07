<?php $class = 'error-404'; ?>
<?php include 'header.php'; ?>
	<article class="entry">
		<h1 class="entry__title">Erreur 404</h1>
		<section class="entry__content">
			<p>Désolé mais la page que vous recherchez n'existe plus.</p>
			<img src="https://media.giphy.com/media/Au6NyXXfPEspO/giphy.gif" alt="" style="max-width: 400px;">
			<p>Vous pouvez effectuer une recherche :</p>
			<?php include 'searchform.php'; ?>
		</section>
	</article>

<?php include 'footer.php'; ?>
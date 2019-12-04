<?php $bodyClass = 'home'; ?>
<?php include 'partials/header.php'; ?>
	<article class="article">
		<div class="container">
			<?php includeWithVariables('partials/hero.php', array('heroTitle' => 'Welcome to the BFF')); ?>
			<div class="wysiwyg">
				<p>This a starter theme so it's empty. <br> Minimum pages are listed in the menu above. It's a base that you have to custom on your need.</p>
				<p>You can use <a href="https://github.com/BeAPI/beapi-frontend-framework/#composer-js">Composer JS</a> in order to add <a href="https://github.com/BeAPI/bff-components" target="_blank" title="See components">well known components</a> (html, css or js) like comments, widgets, plugins etc.</p>
				<h2>🦄 Happy Coding ! 🦄</h2>
			</div>
		</div>
	</article>

<?php include 'partials/footer.php'; ?>
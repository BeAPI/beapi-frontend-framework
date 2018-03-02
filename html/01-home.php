<?php $class = 'home'; ?>
<?php include 'header.php'; ?>
	<div class="hero lazyload" data-bgset="../assets/img/bg-sample/bg_img-mobile-01.jpg [(max-width: 1023px)] | ../assets/img/bg-sample/bg_img-desktop-01.jpg">
		<div class="container">
			<article class="entry">
				<header class="entry__header">
					<h1 class="entry__title">Welcome to the BFF</h1>
				</header>
				<section class="entry__content">
					<p>This a starter theme so it's empty. <br> Minimum pages are listed in the menu above. It's a base that you have to custom on your need.</p>
					<p>You can use <a href="https://github.com/BeAPI/beapi-frontend-framework/#composer-js">Composer JS</a> in order to add <a href="https://github.com/BeAPI/bff-components" target="_blank" title="See components">well known components</a> (html, css or js) like comments, widgets, plugins etc.</p>
					<h2>🦄 Happy Coding ! 🦄</h2>
					<h3>BFF buttons</h3>
					<!-- Button href demo -->
					<button type="button" class="button button--round" data-href="https://beapi.fr/">
						Button w/o blank
					</button>

					<button type="button" class="button button--outline" data-href="https://beapi.fr/" data-target="_blank">
						Button w/ blank
					</button>

					<button type="button" class="button button--revert" data-href="../assets/pdf/sample.pdf" data-target="download" data-filename="sample.pdf">
						Button download
					</button>
				</section>
			</article>
		</div>
	</div>

<?php include 'footer.php'; ?>
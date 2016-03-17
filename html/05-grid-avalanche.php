<?php $class = ''; ?>
<?php include 'header.php'; ?>
	
	<section class="content" id="content">
		
		<?php include 'blocks/breadcrumb.php'; ?>

		
		
		<article class="entry" itemscope itemtype="http://schema.org/Article">
			<header class="entry__header">
				<h1 class="page__title" itemprop="headline">Titre de la page</h1>
				<div class="entry__date">
					Publié le <time datetime="2015-06-30" itemprop="datePublished">06/30/2015</time>
				</div>
			</header>
			<br />
			<h3>Grids avalanche</h3>
			<h4>Regular Grid</h4>
			<article class="grid-sandbox">
		        <div class="grid">
		          <div class="1/2 grid__cell">
		            <div class="box">.1/2</div>
		          </div>
		          <div class="1/2 grid__cell">
		            <div class="box">.1/2</div>
		          </div>
		          <div class="1/3 grid__cell">
		            <div class="box">.1/3</div>
		          </div>
		          <div class="2/3 grid__cell">
		            <div class="box">.2/3</div>
		          </div>
		          <div class="1/4 grid__cell">
		            <div class="box">.1/4</div>
		          </div>
		          <div class="1/2 grid__cell">
		            <div class="box">.1/2</div>
		          </div>
		          <div class="1/4 grid__cell">
		            <div class="box">.1/4</div>
		          </div>
		        </div>
		     </article>
		     <h4>Center Grid  Horizontal</h4>
		     <article class="grid-sandbox">
		        <div class="grid grid--center">
		          <div class="1/3 grid__cell">
		            <div class="box">.1/3</div>
		          </div>
		          <div class="1/3 grid__cell">
		            <div class="box">.1/3</div>
		          </div>
		        </div>
		      </article>
			<h4>Center Grid Cell</h4>
			<article class="grid-sandbox">
				<div class="grid">
					<div class="1/3 grid__cell">
						<div class="box">.1/3</div>
					</div>
					<div class="1/3 grid__cell">
						<div class="box">.1/3</div>
					</div>
					<div class="1/3 grid__cell">
						<div class="box">.1/3</div>
					</div>

					<div class="1/2 grid__cell grid__cell--center">
						<div class="box">.1/2<br><small>This cell is within the same container as the others but is centered by itself</small></div>
					</div>
					<div class="grid grid--center">
						<div class="1/4 grid__cell">
							<div class="box">.1/4</div>
						</div>
						<div class="1/4 grid__cell">
							<div class="box">.1/4</div>
						</div>
						<div class="1/4 grid__cell">
							<div class="box">.1/4</div>
						</div>
					</div>
					<div class="grid grid--center">
						<div class="2/6 grid__cell">
							<div class="box">.2/6</div>
						</div>
						<div class="1/6 grid__cell">
							<div class="box">.1/6</div>
						</div>
						<div class="2/6 grid__cell">
							<div class="box">.2/6</div>
						</div>
					</div>
				</div>
			</article>
			<h4>No Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--flush">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
			<h4>Tiny Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--tiny">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
			<h4>Small Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--small">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
			<h4>Large Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--large">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
			<h4>Vertical Align Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--middle">
					<div class="1/3 grid__cell">
						<div class="box">.1/3</div>
					</div>
					<div class="1/3 grid__cell">
						<div class="box box--tall">.1/3</div>
					</div>
					<div class="1/3 grid__cell">
						<div class="box">.1/3</div>
					</div>
				</div>
			</article>
			<h4>Make Responsive: 1 col in mobile, 2 in tablet, 3 in desktop</h4>
			<div class="grid-sandbox">
				<div class="grid">
					<div class="1/2--handheld-and-up 1/3--lap-and-up grid__cell">
						<div class="box">.1/3</div>
					</div>
					<div class="1/2--handheld-and-up 1/3--lap-and-up grid__cell">
						<div class="box">.1/3</div>
					</div>
					<div class="1/2--handheld-and-up 1/3--lap-and-up grid__cell">
						<div class="box">.1/3</div>
					</div>
				</div>
			</div>
			<h4>Personnal Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--gutter-custom">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
			<h4>Responsive Gutters</h4>
			<article class="grid-sandbox">
				<div class="grid grid--flush  grid--small--handheld-and-up grid--huge--lap-and-up">
					<div class="1/4 grid__cell">
						<div class="box">.1/4</div>
					</div>
					<div class="3/4 grid__cell">
						<div class="box">.3/4</div>
					</div>
				</div>
			</article>
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
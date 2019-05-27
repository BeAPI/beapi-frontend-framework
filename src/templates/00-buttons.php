<?php include 'partials/header.php'; ?>
	<article class="article">
		<div class="container">
			<p>
				<h2>Buttons</h2>
				<hr>

				<a href="#" class="button">I'm a link</a>
				<button type="button" class="button">I'm a button</button>
				<input type="button" class="button" value="I'm a button input">
				<input type="submit" class="button" value="I'm a submit input">
			</p>
			<p>
				<h2>Sizing</h2>
				<hr>

				<h3>Buttons</h3>
				<p>
					<button type="button" class="button button--xs">Tiny Button</button>
					<button type="button" class="button button--sm">Small Button</button>
					<button type="button" class="button button">Medium Button</button>
					<button type="button" class="button button--lg">Large Button</button>
				</p>
				<p>
					<button type="button" class="button button--expand">Expanded Button</button>
				</p>
				<p>
					<button type="button" class="button button--expand button--xs">Expanded tiny Button</button>
				</p>

				<h3>Links</h3>
				<p>
					<a href="#" class="button button--xs">Tiny Button</a>
					<a href="#" class="button button--sm">Small Button</a>
					<a href="#" class="button button">Medium Button</a>
					<a href="#" class="button button--lg">Large Button</a>
				</p>
				<p>
					<a href="#" class="button button--expand">Expanded Button</a>
				</p>
				<p>
					<a href="#" class="button button--expand button--xs">Expanded tiny Button</a>
				</p>
			</p>
			<p>
				<h2>Colors</h2>
				<hr>

				<p>
					<h3>Buttons + Icons</h3>
					<button type="button" class="button">Default Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--primary">Primary Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--error">Error Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--warning">Warning Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--success">Success Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--info">Info Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="button button--transparent">Transparent Button <svg class="button__icon icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
				</p>

				<p>
					<h3>Buttons</h3>
					<button type="button" class="button">Default Button</button>
					<button type="button" class="button button--primary">Primary Button</button>
					<button type="button" class="button button--error">Error Button</button>
					<button type="button" class="button button--warning">Warning Button</button>
					<button type="button" class="button button--success">Success Button</button>
					<button type="button" class="button button--info">Info Button</button>
					<button type="button" class="button button--transparent">Transparent Button</button>
				</p>

				<p>
					<h3>Links</h3>
					<a href="#" class="button">Default Link</a>
					<a href="#" class="button button--primary">Primary Link</a>
					<a href="#" class="button button--error">Error Link</a>
					<a href="#" class="button button--warning">Warning Link</a>
					<a href="#" class="button button--success">Success Link</a>
					<a href="#" class="button button--info">Info Link</a>
					<a href="#" class="button button--transparent">Transparent Link</a>
				</p>
			</p>
			<p>
				<h2>Outline style</h2>
				<hr>

				<p>
					<h3>Buttons</h3>
					<button type="button" class="button button--outline">Outline Button</button>
					<button type="button" class="button button--outline button--primary">Outline Primary Button</button>
					<button type="button" class="button button--outline button--error">Outline Error Button</button>
					<button type="button" class="button button--outline button--warning">Outline Warning Button</button>
					<button type="button" class="button button--outline button--success">Outline Success Button</button>
					<button type="button" class="button button--outline button--info">Outline Info Button</button>
					<button type="button" class="button button--outline button--transparent">Outline Transparent Button</button>
				</p>
				<p>
					<h3>Links</h3>
					<a href="#" class="button button--outline">Outline Link</a>
					<a href="#" class="button button--outline button--primary">Outline Primary Link</a>
					<a href="#" class="button button--outline button--error">Outline Error Link</a>
					<a href="#" class="button button--outline button--warning">Outline Warning Link</a>
					<a href="#" class="button button--outline button--success">Outline Success Link</a>
					<a href="#" class="button button--outline button--info">Outline Info Link</a>
					<a href="#" class="button button--outline button--transparent">Outline Transparent Link</a>
				</p>
			</p>
			<p>
				<h2>Disabled style</h2>
				<hr>
				<button type="button" class="button" disabled>Disabled Button</button>
				<button type="button" class="button button--error" disabled>Disabled Error Button</button>
				<button type="button" class="button button--warning" disabled>Disabled Warning Button</button>
				<button type="button" class="button button--success" disabled>Disabled Success Button</button>
				<button type="button" class="button button--info" disabled>Disabled Info Button</button>
			</p>
			<p>
				<h2>Border Radius style</h2>
				<hr>

				<p>
					<h3>Buttons</h3>
					<p>
						<button type="button" class="button button--round">Rounded Button</button>
						<button type="button" class="button button--round button--primary">Rounded Primary Button</button>
						<button type="button" class="button button--round button--error">Rounded Error Button</button>
						<button type="button" class="button button--round button--warning">Rounded Warning Button</button>
						<button type="button" class="button button--round button--success">Rounded Success Button</button>
						<button type="button" class="button button--round button--info">Rounded Info Button</button>
					</p>
					<p>
						<button type="button" class="button button--circle">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--circle button--primary">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--circle button--error">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--circle button--warning">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--circle button--success">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--circle button--info">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
					</p>
				</p>

				<h3>Links</h3>

				<p>
					<a href="#" class="button button--round">Rounded Button</a>
					<a href="#" class="button button--round button--primary">Rounded Primary Button</a>
					<a href="#" class="button button--round button--error">Rounded Error Button</a>
					<a href="#" class="button button--round button--warning">Rounded Warning Button</a>
					<a href="#" class="button button--round button--success">Rounded Success Button</a>
					<a href="#" class="button button--round button--info">Rounded Info Button</a>
				</p>
				<p>
					<a href="#" class="button button--circle">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--circle button--primary">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--circle button--error">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--circle button--warning">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--circle button--success">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--circle button--info">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
				</p>
			</p>
			<p>
				<h2>Text style</h2>
				<hr>
				<button type="button" class="button button--text">Text Style Button</button>
			</p>
			<p>
				<h2>Buttons icons</h2>
				<hr>
				<a class="button button--icon" href="https://beapi.fr">
					<span class="visuallyhidden">Be API</span>
					<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
					</svg>
				</a>
			</p>
		</div>
	</article>

<?php include 'partials/footer.php'; ?>
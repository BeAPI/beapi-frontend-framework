<?php $bodyClass = 'buttons'; ?>
<?php require 'sections/header.php'; ?>
	<article class="article">
		<div class="container">
			<p>
				<h2>Buttons</h2>
				<hr>

				<a href="#" class="btn">I'm a link</a>
				<button type="button" class="btn">I'm a button</button>
				<input type="button" class="btn" value="I'm a button input">
				<input type="submit" class="btn" value="I'm a submit input">
			</p>
			<p>
				<h2>Sizing</h2>
				<hr>

				<h3>Buttons</h3>
				<p>
					<button type="button" class="btn btn--xs">Tiny Button</button>
					<button type="button" class="btn btn--sm">Small Button</button>
					<button type="button" class="btn btn--md">Medium Button</button>
					<button type="button" class="btn btn--lg">Large Button</button>
				</p>
				<p>
					<button type="button" class="btn btn--expand">Expanded Button</button>
				</p>
				<p>
					<button type="button" class="btn btn--expand btn--xs">Expanded tiny Button</button>
				</p>

				<h3>Links</h3>
				<p>
					<a href="#" class="btn btn--xs">Tiny Button</a>
					<a href="#" class="btn btn--sm">Small Button</a>
					<a href="#" class="btn btn--md">Medium Button</a>
					<a href="#" class="btn btn--lg">Large Button</a>
				</p>
				<p>
					<a href="#" class="btn btn--expand">Expanded Button</a>
				</p>
				<p>
					<a href="#" class="btn btn--expand btn--xs">Expanded tiny Button</a>
				</p>
			</p>
			<p>
				<h2>Colors</h2>
				<hr>

				<p>
					<h3>Buttons + Icons</h3>
					<button type="button" class="btn">Default Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--primary">Primary Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--error">Error Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--warning">Warning Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--success">Success Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--info">Info Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
					<button type="button" class="btn btn--transparent">Transparent Button <svg class="btn__icon icon icon-close" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg></button>
				</p>

				<p>
					<h3>Buttons</h3>
					<button type="button" class="btn">Default Button</button>
					<button type="button" class="btn btn--primary">Primary Button</button>
					<button type="button" class="btn btn--error">Error Button</button>
					<button type="button" class="btn btn--warning">Warning Button</button>
					<button type="button" class="btn btn--success">Success Button</button>
					<button type="button" class="btn btn--info">Info Button</button>
					<button type="button" class="btn btn--transparent">Transparent Button</button>
				</p>

				<p>
					<h3>Links</h3>
					<a href="#" class="btn">Default Link</a>
					<a href="#" class="btn btn--primary">Primary Link</a>
					<a href="#" class="btn btn--error">Error Link</a>
					<a href="#" class="btn btn--warning">Warning Link</a>
					<a href="#" class="btn btn--success">Success Link</a>
					<a href="#" class="btn btn--info">Info Link</a>
					<a href="#" class="btn btn--transparent">Transparent Link</a>
				</p>
			</p>
			<p>
				<h2>Outline style</h2>
				<hr>

				<p>
					<h3>Buttons</h3>
					<button type="button" class="btn btn--outline">Outline Button</button>
					<button type="button" class="btn btn--outline btn--primary">Outline Primary Button</button>
					<button type="button" class="btn btn--outline btn--error">Outline Error Button</button>
					<button type="button" class="btn btn--outline btn--warning">Outline Warning Button</button>
					<button type="button" class="btn btn--outline btn--success">Outline Success Button</button>
					<button type="button" class="btn btn--outline btn--info">Outline Info Button</button>
					<button type="button" class="btn btn--outline btn--transparent">Outline Transparent Button</button>
				</p>
				<p>
					<h3>Links</h3>
					<a href="#" class="btn btn--outline">Outline Link</a>
					<a href="#" class="btn btn--outline btn--primary">Outline Primary Link</a>
					<a href="#" class="btn btn--outline btn--error">Outline Error Link</a>
					<a href="#" class="btn btn--outline btn--warning">Outline Warning Link</a>
					<a href="#" class="btn btn--outline btn--success">Outline Success Link</a>
					<a href="#" class="btn btn--outline btn--info">Outline Info Link</a>
					<a href="#" class="btn btn--outline btn--transparent">Outline Transparent Link</a>
				</p>
			</p>
			<p>
				<h2>Disabled style</h2>
				<hr>
				<button type="button" class="btn" disabled>Disabled Button</button>
				<button type="button" class="btn btn--error" disabled>Disabled Error Button</button>
				<button type="button" class="btn btn--warning" disabled>Disabled Warning Button</button>
				<button type="button" class="btn btn--success" disabled>Disabled Success Button</button>
				<button type="button" class="btn btn--info" disabled>Disabled Info Button</button>
			</p>
			<p>
				<h2>Border Radius style</h2>
				<hr>

				<p>
					<h3>Buttons</h3>
					<p>
						<button type="button" class="btn btn--round">Rounded Button</button>
						<button type="button" class="btn btn--round btn--primary">Rounded Primary Button</button>
						<button type="button" class="btn btn--round btn--error">Rounded Error Button</button>
						<button type="button" class="btn btn--round btn--warning">Rounded Warning Button</button>
						<button type="button" class="btn btn--round btn--success">Rounded Success Button</button>
						<button type="button" class="btn btn--round btn--info">Rounded Info Button</button>
					</p>
					<p>
						<button type="button" class="btn btn--circle">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="btn btn--circle btn--primary">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="btn btn--circle btn--error">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="btn btn--circle btn--warning">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="btn btn--circle btn--success">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="btn btn--circle btn--info">
							<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
					</p>
				</p>

				<h3>Links</h3>

				<p>
					<a href="#" class="btn btn--round">Rounded Button</a>
					<a href="#" class="btn btn--round btn--primary">Rounded Primary Button</a>
					<a href="#" class="btn btn--round btn--error">Rounded Error Button</a>
					<a href="#" class="btn btn--round btn--warning">Rounded Warning Button</a>
					<a href="#" class="btn btn--round btn--success">Rounded Success Button</a>
					<a href="#" class="btn btn--round btn--info">Rounded Info Button</a>
				</p>
				<p>
					<a href="#" class="btn btn--circle">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="btn btn--circle btn--primary">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="btn btn--circle btn--error">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="btn btn--circle btn--warning">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="btn btn--circle btn--success">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="btn btn--circle btn--info">
						<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
				</p>
			</p>
			<p>
				<h2>Text style</h2>
				<hr>
				<button type="button" class="btn btn--text">Text Style Button</button>
			</p>
			<p>
				<h2>Buttons icons</h2>
				<hr>
				<a class="btn btn--icon" href="https://beapi.fr">
					<span class="visuallyhidden">Be API</span>
					<svg class="icon icon-logo-beapi" aria-hidden="true" focusable="false">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
					</svg>
				</a>
			</p>
		</div>
	</article>

<?php require 'sections/footer.php'; ?>

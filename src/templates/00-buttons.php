<?php $class = 'home'; ?>
<?php include 'header.php'; ?>
	<article class="article">
		<div class="container">
			<div style="margin-bottom: 20px;">
				<h2>Buttons</h2>
				<hr>

				<a href="#" class="button">I'm a link</a>
				<button type="button" class="button">I'm a button</button>
				<input type="button" class="button" value="I'm a button input">
				<input type="submit" class="button" value="I'm a submit input">
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Sizing</h2>
				<hr>

				<h3>Buttons</h3>
				<div style="margin-bottom: 20px;">
					<button type="button" class="button button--xs">Tiny Button</button>
					<button type="button" class="button button--sm">Small Button</button>
					<button type="button" class="button button">Medium Button</button>
					<button type="button" class="button button--lg">Large Button</button>
				</div>
				<div style="margin-bottom: 20px;">
					<button type="button" class="button button--expand">Expanded Button</button>
				</div>
				<div style="margin-bottom: 20px;">
					<button type="button" class="button button--expand button--xs">Expanded tiny Button</button>
				</div>

				<h3>Links</h3>
				<div style="margin-bottom: 20px;">
					<a href="#" class="button button--xs">Tiny Button</a>
					<a href="#" class="button button--sm">Small Button</a>
					<a href="#" class="button button">Medium Button</a>
					<a href="#" class="button button--lg">Large Button</a>
				</div>
				<div style="margin-bottom: 20px;">
					<a href="#" class="button button--expand">Expanded Button</a>
				</div>
				<div style="margin-bottom: 20px;">
					<a href="#" class="button button--expand button--xs">Expanded tiny Button</a>
				</div>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Colors</h2>
				<hr>

				<div style="margin-bottom: 20px;">
					<h3>Buttons</h3>
					<button type="button" class="button">Default Button</button>
					<button type="button" class="button button--primary">Primary Button</button>
					<button type="button" class="button button--error">Error Button</button>
					<button type="button" class="button button--warning">Warning Button</button>
					<button type="button" class="button button--success">Success Button</button>
					<button type="button" class="button button--info">Info Button</button>
				</div>

				<div style="margin-bottom: 20px;">
					<h3>Links</h3>
					<a href="#" class="button">Default Button</a>
					<a href="#" class="button button--primary">Primary Button</a>
					<a href="#" class="button button--error">Error Button</a>
					<a href="#" class="button button--warning">Warning Button</a>
					<a href="#" class="button button--success">Success Button</a>
					<a href="#" class="button button--info">Info Button</a>
				</div>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Outline style</h2>
				<hr>

				<div style="margin-bottom: 20px;">
					<h3>Buttons</h3>
					<button type="button" class="button button--outline">Outline Button</button>
					<button type="button" class="button button--outline button--primary">Outline Primary Button</button>
					<button type="button" class="button button--outline button--error">Outline Error Button</button>
					<button type="button" class="button button--outline button--warning">Outline Warning Button</button>
					<button type="button" class="button button--outline button--success">Outline Success Button</button>
					<button type="button" class="button button--outline button--info">Outline Info Button</button>
				</div>
				<div style="margin-bottom: 20px;">
					<h3>Links</h3>
					<a href="#" class="button button--outline">Outline Button</a>
					<a href="#" class="button button--outline button--primary">Outline Primary Button</a>
					<a href="#" class="button button--outline button--error">Outline Error Button</a>
					<a href="#" class="button button--outline button--warning">Outline Warning Button</a>
					<a href="#" class="button button--outline button--success">Outline Success Button</a>
					<a href="#" class="button button--outline button--info">Outline Info Button</a>
				</div>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Disabled style</h2>
				<hr>
				<button type="button" class="button" disabled>Disabled Button</button>
				<button type="button" class="button button--error" disabled>Disabled Error Button</button>
				<button type="button" class="button button--warning" disabled>Disabled Warning Button</button>
				<button type="button" class="button button--success" disabled>Disabled Success Button</button>
				<button type="button" class="button button--info" disabled>Disabled Info Button</button>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Border Radius style</h2>
				<hr>

				<div style="margin-bottom: 20px;">
					<h3>Buttons</h3>
					<div style="margin-bottom: 20px;">
						<button type="button" class="button button--round">Rounded Button</button>
						<button type="button" class="button button--round button--primary">Rounded Primary Button</button>
						<button type="button" class="button button--round button--error">Rounded Error Button</button>
						<button type="button" class="button button--round button--warning">Rounded Warning Button</button>
						<button type="button" class="button button--round button--success">Rounded Success Button</button>
						<button type="button" class="button button--round button--info">Rounded Info Button</button>
					</div>
					<div style="margin-bottom: 20px;">
						<button type="button" class="button button--icon button--circle">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--icon button--circle button--primary">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--icon button--circle button--error">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--icon button--circle button--warning">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--icon button--circle button--success">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
						<button type="button" class="button button--icon button--circle button--info">
							<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
						</button>
					</div>
				</div>

				<h3>Links</h3>

				<div style="margin-bottom: 20px;">
					<a href="#" class="button button--round">Rounded Button</a>
					<a href="#" class="button button--round button--primary">Rounded Primary Button</a>
					<a href="#" class="button button--round button--error">Rounded Error Button</a>
					<a href="#" class="button button--round button--warning">Rounded Warning Button</a>
					<a href="#" class="button button--round button--success">Rounded Success Button</a>
					<a href="#" class="button button--round button--info">Rounded Info Button</a>
				</div>
				<div style="margin-bottom: 20px;">
					<a href="#" class="button button--icon button--circle">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--icon button--circle button--primary">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--icon button--circle button--error">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--icon button--circle button--warning">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--icon button--circle button--success">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
					<a href="#" class="button button--icon button--circle button--info">
						<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
						</svg>
					</a>
				</div>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Text style</h2>
				<hr>
				<button type="button" class="button button--text">Text Style Button</button>
			</div>
			<div style="margin-bottom: 20px;">
				<h2>Buttons icons</h2>
				<hr>
				<a class="button button--icon" href="https://beapi.fr">
					<span class="visuallyhidden">Be API</span>
					<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
					</svg>
				</a>
			</div>
		</div>
	</article>

<?php include 'footer.php'; ?>
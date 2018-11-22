<?php $class = 'home'; ?>
<?php include 'header.php'; ?>
	<article class="article">
		<div class="container">
			<h2>Buttons</h2>
			<a href="#" class="button">A tag</a>
			<button type="button" class="button">Button tag</button>

			<h2>Sizing</h2>
			<button type="button" class="button button--xs">Tiny Button</button>
			<button type="button" class="button button--sm">Small Button</button>
			<button type="button" class="button button">Medium Button</button>
			<button type="button" class="button button--lg">Large Button</button>
			<button type="button" class="button button--expand">Expanded Button</button>
			<button type="button" class="button button--expand button--xs">Expanded tiny Button</button>

			<h2>Colors</h2>
			<button type="button" class="button button--error">Error Button</button>
			<button type="button" class="button button--warning">Warning Button</button>
			<button type="button" class="button button--success">Success Button</button>
			<button type="button" class="button button--info">Info Button</button>

			<h2>Outline style</h2>
			<button type="button" class="button button--outline">Outline Button</button>
			<button type="button" class="button button--outline button--error">Outline Error Button</button>
			<button type="button" class="button button--outline button--warning">Outline Warning Button</button>
			<button type="button" class="button button--outline button--success">Outline Success Button</button>
			<button type="button" class="button button--outline button--info">Outline Info Button</button>

			<h2>Disabled style</h2>
			<button type="button" class="button" disabled>Disabled Button</button>
			<button type="button" class="button button--error" disabled>Disabled Error Button</button>
			<button type="button" class="button button--warning" disabled>Disabled Warning Button</button>
			<button type="button" class="button button--success" disabled>Disabled Success Button</button>
			<button type="button" class="button button--info" disabled>Disabled Info Button</button>

			<h2>Border Radius style</h2>
			<button type="button" class="button button--round">Text Style Button</button>
			<button type="button" class="button button--round button--error">Text Style Button</button>
			<button type="button" class="button button--round button--warning">Text Style Button</button>
			<button type="button" class="button button--round button--success">Text Style Button</button>
			<button type="button" class="button button--round button--info">Text Style Button</button>
			<br />
			<button type="button" class="button button--icon button--circle">
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

			<h2>Text style</h2>
			<button type="button" class="button button--text">Text Style Button</button>

			<h2>Buttons icons</h2>
			<a class="button button--icon" href="https://beapi.fr">
				<span class="visuallyhidden">Be API</span>
				<svg class="icon icon-logo-beapi" aria-hidden="true" role="img">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
				</svg>
			</a>
		</div>
	</article>

<?php include 'footer.php'; ?>
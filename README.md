# Be API FrontEnd Framework

[![Be API Github Banner](.github/banner-github.png)](https://beapi.fr)

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

## What is BFF ?

**Be API Frontend Framework** *(or BFF)*  is a WordPress theme boilerplate designed to assist you in launching your own WordPress theme using modern tools.

## Requirements

### Composer

You need composer to autoload all your classes from the inc folder.

Use the `beapi/composer-scaffold-theme` package that adds it automatically to `composer.json`, or declare the PSR-4 mapping yourself. BFF maps the `inc/` directory like this:

```json
"autoload": {
    "psr-4": {
        "BEA\\Theme\\Framework\\": "inc/"
    }
}
```

### Autoload

Autoloading is PSR-4 and handled by Composer. Theme PHP lives under `inc/` (blocks, services, **Formatting helpers**, etc.).

### Node.js

You need [the latest stable version of Node.js](https://nodejs.org/).

## Formatting helpers

Helpers are namespaced functions under `BEA\Theme\Framework\Helpers\Formatting\`. Import them with `use function` (recommended) or call them with a fully qualified name.

### Image (`Helpers\Formatting\Image`)

Outputs attachment images with `wp_get_attachment_image()`, optional wrapper markup, and filters for attributes, settings, and final HTML.

**Featured image in a card** (custom size and class, `data-location` for ARI plugin):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Image\the_image;

// Without ARI default image (hidden if no image)
the_image(
	(int) get_post_thumbnail_id(),
	[
		'class'         => 'card__image',
		'data-location' => 'archive-card',
	],
	[
		'before' => '<figure class="card__media">',
		'after'  => '</figure>',
	]
);

// With ARI default image
the_image(
	(int) get_post_thumbnail_id(),
	[
		'class'         => 'card__image',
		'data-location' => 'archive-card',
	],
	[
		'default' => true,
		'before'  => '<figure class="card__media">',
		'after'   => '</figure>',
	]
);

// Without ARI plugin
the_image(
	(int) get_post_thumbnail_id(),
	[
		'class' => 'card__image',
	],
	[
		'size'   => 'thumbnail',
		'before' => '<figure class="card__media">',
		'after'  => '</figure>',
	]
);
```

If `(int) get_post_thumbnail_id()` is `0` and `'default' => false`, the helper outputs nothing. With `'default' => true` and no image, behavior depends on your default-image setup and filters.

**Decorative image** (empty `alt` is preserved as `alt=""` for accessibility):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Image\the_image;

the_image(
	$attachment_id,
	[
		'class' => 'hero__bg',
		'alt'   => '',
	],
	[ 
		'size' => 'full'
	]
);
```

**Illustrative generated HTML** (`alt=""` is forced when you pass `'alt' => ''`):

```html
<img
	src="https://example.test/wp-content/uploads/..."
	alt=""
	class="hero__bg attachment-full size-full"
	width="1920"
	height="1080"
	decoding="async"
	loading="lazy"
	srcset="..."
	sizes="..."
/>
```

**Echo variant:** `get_the_image()` — same arguments as `the_image()`, prints markup.

**Filters:** `bea_theme_framework_the_image_attributes`, `bea_theme_framework_the_image_settings`, `bea_theme_framework_the_image_markup`.

---

### Link (`Helpers\Formatting\Link`)

Builds escaped `<a>` or `<button>` links with optional screen-reader text for `target="_blank"` (`noopener` is added automatically).

**Plain link from arbitrary URL and label:**

```php
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_the_link;

echo get_the_link(
	[
		'href'  => home_url( '/contact/' ),
		'class' => 'btn btn--primary',
	],
	[
		'content' => __( 'Contact us', 'your-textdomain' ),
		'before'  => '<p class="cta">',
		'after'   => '</p>',
	]
);
```

**Illustrative generated HTML:**

```html
<p class="cta">
	<a href="https://example.test/contact/" class="btn btn--primary">Contact us</a>
</p>
```

(`target="_blank"` would add `rel="noopener"` and a `<span class="sr-only">New window</span>` inside the link — see theme strings in `Link` helper.)

**ACF Link field** (requires `field` with `url` and `title`; maps to `get_the_link` internally):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_acf_link;

$link = get_field( 'cta_link', $post_id ); // ACF link array or empty.

the_acf_link(
	[
		'field' => $link,
		'class' => 'article__cta',
	],
	[
		'before' => '<div class="article__footer">',
		'after'  => '</div>',
	]
);
```

**Illustrative generated HTML** (when the ACF field has `url` and `title`; optional `target` from the field):

```html
<div class="article__footer">
	<a href="https://example.test/page/" class="article__cta">CTA title from ACF</a>
</div>
```

If `target` is `_blank`, the anchor includes `rel="noopener"` and the screen-reader “New window” span.

**Simple link**:

```php
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_link;

the_link(
	[
		'href'       => '#',
		'class'      => 'your-class',
		'target'     => '_blank',
		'aria-label' => 'Your custom attribute',
	],
	[
		'content' => __( 'Your title', 'your-textdomain' ),
	]
);
```

**Illustrative generated HTML:**

```html
<a
	href="#"
	class="your-class"
	target="_blank"
	rel="noopener"
	aria-label="Your custom attribute"
>
	Your title
	<span class="sr-only">New window</span>
</a>
```

**Social / SEO “button” mode** (renders a `<button>` with `role="link"` and `data-href` instead of crawled `<a href>` — use for share-style actions when you rely on JS):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_link;

the_link(
	[
		'href'       => $share_url,
		'class'      => 'share__action',
		'target'     => '_blank',
		'aria-label' => 'Yout custom attribute',
	],
	[
		'content' => __( 'Share', 'your-textdomain' ),
		'mode'    => 'button',
	]
);
```

**Illustrative generated HTML** (button mode — no `href` on the element; share URL is on `data-href`):

```html
<button
	type="button"
	role="link"
	class="share__action"
	data-seo-click="true"
	data-href="https://share.example/..."
	data-rel="noopener"
	data-target="_blank"
>
	Share
	<span class="sr-only">New window</span>
</button>
```

**CSS classes for navigation** (current page + external host detection):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link_classes;

$classes = [
	'menu-item',
	'current'  => '',
	'external' => '',
];

echo get_acf_link_classes( $acf_link_field, $classes );
```

**Illustrative return value** (a single string of class names passed to `implode(' ')`; empty slots stay empty until matched):

```
menu-item current-menu-item external-menu-item
```

When the field URL matches the current page URL, `current-menu-item` replaces the `current` slot; when the host differs from the site home, `external-menu-item` replaces `external`.

**Echo variants:** `the_link()`, `the_acf_link()`.

**Filters:** `bea_theme_framework_link_attributes`, `bea_theme_framework_link_settings`, `bea_theme_framework_link_markup`, `bea_theme_framework_acf_link_attribute`, `bea_theme_framework_acf_link_settings`.

---

### Share (`Helpers\Formatting\Share`)

Builds share actions for predefined networks. Each item uses **button mode** from `Link` by default, an icon from `Helpers\Svg\get_the_icon`, and a **screen-reader label** (`sr-only`). Supported names: `facebook`, `x`, `linkedin`, `instagram`, `bluesky`, `email`.

**Post permalink row** (override list item wrappers if needed):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Share\get_share_link;

$url   = get_permalink();
$title = get_the_title();

echo '<ul class="share">';
echo get_share_link( 'facebook', $url );
echo get_share_link(
	'x',
	$url,
	[
		'text' => $title
	],
	[],
	[
		'before' => '<li class="share__item">',
		'after'  => '</li>',
	]
);
echo '</ul>';
```

**Illustrative generated HTML** (each network outputs a `<button>` in **button mode** with an SVG from `get_the_icon()` plus `<span class="sr-only">` for the network label and “New window”; default list wrappers are `<li>` / `</li>` unless you override `before` / `after` in `$settings`):

```html
<ul class="share">
	<li>
		<button
			type="button"
			role="link"
			class="share__link"
			data-seo-click="true"
			data-href="http://www.facebook.com/sharer.php?u=https%3A%2F%2Fexample.test%2Fpost%2F"
			data-rel="noopener"
			data-target="_blank"
		>
			<svg class="icon icon-facebook" aria-hidden="true" focusable="false">
				<use href="https://example.test/wp-content/themes/.../dist/icons/social.svg?v=…#icon-facebook"></use>
			</svg>
			<span class="sr-only">Share on Facebook</span>
			<span class="sr-only">New window</span>
		</button>
	</li>
	<li class="share__item">
		<button
			type="button"
			role="link"
			class="share__link"
			data-seo-click="true"
			data-href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.test%2Fpost%2F&amp;text=Post+title"
			data-rel="noopener"
			data-target="_blank"
		>
			<svg class="icon icon-x" aria-hidden="true" focusable="false">
				<use href="https://example.test/wp-content/themes/.../dist/icons/social.svg?v=…#icon-x"></use>
			</svg>
			<span class="sr-only">Share on X</span>
			<span class="sr-only">New window</span>
		</button>
	</li>
</ul>
```

**Echo variant:** `the_share_link()`.

**Filters:** `bea_theme_framework_share_attributes`, `bea_theme_framework_share_settings`.

---

### Term (`Helpers\Formatting\Term`)

**Term names only** (simple array of strings):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_name;

$names = get_terms_name( $terms ); // WP_Term[] → string[]
```

**Illustrative return value** (plain PHP array of term names):

```php
[ 'News', 'Opinion', 'Sports' ];
```

**Renderable list** (defaults to `<ul><li>…</li></ul>`; escaped term names):

```php
use function BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_list;

echo get_terms_list(
	get_the_terms( get_the_ID(), 'category' ) ?: [],
	[
		'before'      => '<div class="terms"><span class="terms__label">' . esc_html__( 'Categories:', 'your-textdomain' ) . '</span><ul class="terms__list">',
		'after'       => '</ul></div>',
		'before_item' => '<li>',
		'after_item'  => '</li>',
		'separator'   => '',
	]
);
```

**Illustrative generated HTML:**

```html
<div class="terms">
	<span class="terms__label">Categories:</span>
	<ul class="terms__list">
		<li>News</li>
		<li>Sports</li>
	</ul>
</div>
```

**Inline tags** (comma-separated spans instead of a list):

```php
echo get_terms_list(
	$terms,
	[
		'before'      => '<p class="tags">',
		'after'       => '</p>',
		'before_item' => '<span class="tag">',
		'after_item'  => '</span>',
		'separator' => ', ',
	]
);
```

**Illustrative generated HTML:**

```html
<p class="tags">
	<span class="tag">News</span>,
	<span class="tag">Sports</span>
</p>
```

**Echo variant:** `the_terms_list()`.

**Filters:** `bea_theme_framework_term_list_attributes`, `bea_theme_framework_term_list_settings`.

---

### Text (`Helpers\Formatting\Text`)

Escapes and wraps arbitrary strings (default escape: `esc_html`). Empty input returns nothing.

```php
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;

the_text(
	(string) get_field( 'subtitle', get_the_ID(), false ), // ACF raw string; use any string source in your project
	[
		'before' => '<p class="lead">',
		'after'  => '</p>',
		'escape' => 'wp_kses_post', // Your custom escape
	]
);
```

**Illustrative generated HTML** (empty string if the subtitle field is empty; otherwise escaped/wrapped):

```html
<p class="lead">
	Subtitle text after wp_kses_post
</p>
```

**Echo variant:** `get_the_text()`.

**Filters:** `bea_theme_framework_text_settings`, `bea_theme_framework_text_value`.

---

### SVG sprites (`Helpers\Svg`)

Inline SVG markup references compiled sprite sheets under `dist/icons/` via `<use href="…/sprite.svg?v=…#icon-id">`. Cache busting uses hashes from `dist/sprite-hashes.asset.php`. The Svg service registers allowed `svg` / `use` tags for `wp_kses`.

Helpers delegate to `BEA\Theme\Framework\Services\Svg`:

- **`get_the_icon( string $icon_class, $additionnal_classes = [] )`** — returns HTML.
- **`the_icon( string $icon_class, $additionnal_classes = [] )`** — echoes the same markup.

Icons are decorative in markup (`aria-hidden="true"`, `focusable="false"`). If the graphic is the only cue, add adjacent visible text or `.sr-only` copy.

**Identifiers**

- **`icon-name`** — loads `dist/icons/sprite.svg`, fragment **`#icon-{name}`** (the `icon-` prefix is added when missing).
- **`sprite-name/icon-name`** — loads **`dist/icons/{sprite-name}.svg`** (e.g. `social/facebook` → `social.svg` + `#icon-facebook`).
- **ACF-style** values such as **`social.svg#icon-facebook`** are normalized to the slash form internally.

**Examples**

```php
use function BEA\Theme\Framework\Helpers\Svg\get_the_icon;
use function BEA\Theme\Framework\Helpers\Svg\the_icon;

// Return markup for concatenation or filters
$markup = get_the_icon( 'chevron-down' );

// Echo directly in a template
the_icon( 'social/facebook', [ 'share__glyph', 'u-hidden-mobile' ] );
```

**Illustrative generated HTML**

Default sprite (`chevron-down`):

```html
<svg class="icon icon-chevron-down" aria-hidden="true" focusable="false">
	<use
		href="https://example.test/wp-content/themes/your-theme/dist/icons/sprite.svg?v=a1b2c3#icon-chevron-down"
	></use>
</svg>
```

Named sprite with extra classes (`social/facebook` + `share__glyph`):

```html
<svg class="icon icon-facebook share__glyph u-hidden-mobile" aria-hidden="true" focusable="false">
	<use
		href="https://example.test/wp-content/themes/your-theme/dist/icons/social.svg?v=d4e5f6#icon-facebook"
	></use>
</svg>
```

If the Svg service is unavailable, both helpers output an empty string.

## Installation

Download the latest release of BFF [here](https://github.com/BeAPI/beapi-frontend-framework/releases) and extract the zip archive into your `themes` WordPress's folder.

```bash
|____wp-admin
|____wp-content
| |____plugins
| |____themes
| | |____beapi-frontend-framework
| |____uploads
|____wp-includes
```

Of course, you can rename `beapi-frontend-framework` to define your WordPress theme's name.

Next, go to your theme folder (in the following example, I didn't rename `beapi-frontend-framework`) with your favorite Term software.

```bash
cd wp-content/themes/beapi-frontend-framework
```

Then install node dependencies with Yarn.

```bash
yarn
```

Alternatively, you can use NPM.

```bash
npm install
```

## Configuration

The configurations files are in `config` directory.

### Webpack

You can find the common Webpack settings file in `webpack.common.js`. For development mode purpose, you can edit `webpack.dev.js` file and for production mode, you can edit `webpack.prod.js`.
You also have the loaders in `loaders.js` file and Webpack's plugin in `plugins.js` file.

## How to use BFF ?

After installing dependencies, you can run some commands which are explained below.

Then, run the following command from the theme :

### Watch

```bash
yarn start
```

### Build

```bash
yarn build
```

### Lint CSS

```bash
yarn lint:css
```

### Lint JS

```bash
yarn lint:js
```

### Lint CSS & JS

```bash
yarn lint
```

### Bundle report

You can launch a bundle report with the following command :

```bash
yarn bundle-report
```

## WordPress Editor (Gutenberg)

### Customize blocks

The `bff_editor_custom_settings` filter allow you to customize blocks styles and variations. For example:

```php
add_filter( 'bff_editor_custom_settings', 'customize_editor_settings', 10, 1 );
function customize_editor_settings( $settings ) {
	// Disable all block styles for Separator block
	$settings[ 'disableAllBlocksStyles' ] = [ 'core/separator' ];

	// Disable specific block style for Button block
	$settings[ 'disabledBlocksStyles' ]   = [ 'core/button' => [ 'outline' ] ];

	// Allow only YouTube variation for Embed block
	$settings[ 'allowedBlocksVariations' ] = [ 'core/embed' => [ 'youtube' ] ];

	return $settings;
}
```

**Illustrative merged settings** passed back to the editor pipeline (same keys your callback assigns; consumers use them to hide styles / restrict variations):

```php
[
	'disableAllBlocksStyles'   => [ 'core/separator' ],
	'disabledBlocksStyles'    => [ 'core/button' => [ 'outline' ] ],
	'allowedBlocksVariations' => [ 'core/embed' => [ 'youtube' ] ],
];
```

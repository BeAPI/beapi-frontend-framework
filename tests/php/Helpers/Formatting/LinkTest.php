<?php

use function BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link;
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link_classes;
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_the_link;
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_acf_link;
use function BEA\Theme\Framework\Helpers\Formatting\Link\the_link;

class LinkTest extends WP_UnitTestCase {

	public function test_get_the_link_empty(): void {
		$this->assertSame( '', get_the_link( [] ) );
		$this->assertSame( '', get_the_link( [ 'href' => '' ] ) );
	}

	public function test_get_the_link_target_blank_adds_noopener(): void {
		$this->assertSame(
			'<a title="TITLE LINK" target="_blank" href="https://localhost.dev" rel="noopener"><span class="sr-only">New window</span></a>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_blank',
					'title'  => 'TITLE LINK',
				]
			)
		);
	}

	public function test_get_the_link_custom_new_window_markup(): void {
		$this->assertSame(
			'<a target="_blank" href="https://localhost.dev" rel="noopener"><i>ext</i>Content</a>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_blank',
				],
				[
					'new_window' => '<i>ext</i>',
					'content'    => 'Content',
				]
			)
		);
	}

	public function test_get_the_link_target_self(): void {
		$this->assertSame(
			'<a target="_self" href="https://localhost.dev"></a>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_self',
				]
			)
		);
		$this->assertSame(
			'<a title="TITLE LINK" target="_self" href="https://localhost.dev"></a>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_self',
					'title'  => 'TITLE LINK',
				]
			)
		);
	}

	public function test_get_the_link_custom_attributes(): void {
		$this->assertSame(
			'<a href="https://localhost.dev" data-seo="ok"></a>',
			get_the_link(
				[
					'href'     => 'https://localhost.dev',
					'data-seo' => 'ok',
				]
			)
		);

		// Null value outputs a boolean attribute.
		$this->assertSame(
			'<a href="https://localhost.dev" empty-data></a>',
			get_the_link(
				[
					'href'       => 'https://localhost.dev',
					'empty-data' => null,
				]
			)
		);
	}

	public function test_get_the_link_before_after(): void {
		$cases = [
			'b<a href="https://localhost.dev"></a>'  => [ 'before' => 'b' ],
			'<a href="https://localhost.dev"></a>a'  => [ 'after' => 'a' ],
			'b<a href="https://localhost.dev"></a>a' => [
				'after'  => 'a',
				'before' => 'b',
			],
		];

		foreach ( $cases as $expected => $settings ) {
			$this->assertSame( $expected, get_the_link( [ 'href' => 'https://localhost.dev' ], $settings ) );
		}
	}

	public function test_get_the_link_content(): void {
		$this->assertSame(
			'<a href="https://localhost.dev">Content</a>',
			get_the_link( [ 'href' => 'https://localhost.dev' ], [ 'content' => 'Content' ] )
		);
		$this->assertSame(
			'<a title="TITLE" href="https://localhost.dev">Content</a>',
			get_the_link(
				[
					'href'  => 'https://localhost.dev',
					'title' => 'TITLE',
				],
				[ 'content' => 'Content' ]
			)
		);
	}

	public function test_get_the_link_escaping(): void {
		// Attributes use esc_attr, href uses esc_url and the content wp_kses_post.
		$this->assertSame(
			'<a title="&quot;quoted&quot;" href="https://localhost.dev/?a=1&#038;b=2" class="x&quot; onclick=&quot;alert(1)"><strong>Bold</strong>alert(1)</a>',
			get_the_link(
				[
					'href'  => 'https://localhost.dev/?a=1&b=2',
					'title' => '"quoted"',
					'class' => 'x" onclick="alert(1)',
				],
				[ 'content' => '<strong>Bold</strong><script>alert(1)</script>' ]
			)
		);

		// Unsafe protocols are dropped by esc_url.
		$this->assertSame( '<a href="">Content</a>', get_the_link( [ 'href' => 'javascript:alert(1)' ], [ 'content' => 'Content' ] ) );
	}

	public function test_get_the_link_custom_escape(): void {
		$this->assertSame(
			'<a href="https://localhost.dev" data-raw="<b>">&lt;b&gt;</a>',
			get_the_link(
				[
					'href'     => 'https://localhost.dev',
					'data-raw' => '<b>',
				],
				[
					'content' => '<b>',
					'escape'  => [
						'href'     => 'esc_url',
						'data-raw' => 'bea_unknown_escape_function',
						'content'  => 'esc_html',
					],
				]
			)
		);
	}

	public function test_get_the_link_button_mode(): void {
		$this->assertSame(
			'<button data-seo-click="true" type="button" role="link" data-href="https://localhost.dev" data-rel="noopener" data-target="_blank"><span class="sr-only">New window</span>Content</button>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_blank',
				],
				[
					'mode'    => 'button',
					'content' => 'Content',
				]
			)
		);
	}

	/**
	 * Suspected bug: in button mode the helper reads $attributes['rel'] and $attributes['target'] unconditionally,
	 * so a link without target="_blank" raises an "Undefined array key" warning. Pin the current behaviour.
	 */
	public function test_get_the_link_button_mode_without_target_blank_raises_warning(): void {
		$warnings = [];
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
		set_error_handler(
			static function ( int $errno, string $errstr ) use ( &$warnings ): bool {
				$warnings[] = $errstr;

				return true;
			},
			E_WARNING
		);

		try {
			$markup = get_the_link( [ 'href' => 'https://localhost.dev' ], [ 'mode' => 'button' ] );
		} finally {
			restore_error_handler();
		}

		$this->assertSame( [ 'Undefined array key "rel"', 'Undefined array key "target"' ], $warnings );
		$this->assertSame( '<button data-seo-click="true" type="button" role="link" data-href="https://localhost.dev" data-rel data-target></button>', $markup );
	}

	public function test_get_the_link_filters(): void {
		$received = [];

		add_filter(
			'bea_theme_framework_link_attributes',
			static function ( array $attributes, array $settings ) use ( &$received ): array {
				$received['attributes'] = [ $attributes, $settings ];
				$attributes['class']    = 'from-filter';

				return $attributes;
			},
			10,
			2
		);
		add_filter(
			'bea_theme_framework_link_settings',
			static function ( array $settings, array $attributes ) use ( &$received ): array {
				$received['settings'] = [ $settings['content'], $attributes ];
				$settings['content']  = 'Filtered';

				return $settings;
			},
			10,
			2
		);
		add_filter(
			'bea_theme_framework_link_markup',
			static function ( string $markup ) use ( &$received ): string {
				$received['markup'] = $markup;

				return '[' . $markup . ']';
			}
		);

		$this->assertSame(
			'b[<a href="https://localhost.dev" class="from-filter">Filtered</a>]',
			get_the_link(
				[ 'href' => 'https://localhost.dev' ],
				[
					'content' => 'Content',
					'before'  => 'b',
				]
			)
		);
		$this->assertSame(
			[
				[
					'title'  => '',
					'target' => '',
					'href'   => 'https://localhost.dev',
				],
				[
					'content' => 'Content',
					'before'  => 'b',
				],
			],
			$received['attributes']
		);
		$this->assertSame(
			[
				'Content',
				[
					'href'  => 'https://localhost.dev',
					'class' => 'from-filter',
				],
			],
			$received['settings']
		);
		$this->assertSame( '<a href="https://localhost.dev" class="from-filter">Filtered</a>', $received['markup'] );
	}

	public function test_the_link(): void {
		ob_start();
		the_link( [ 'href' => 'https://localhost.dev' ], [ 'content' => 'Content' ] );
		$this->assertSame( '<a href="https://localhost.dev">Content</a>', ob_get_clean() );
	}

	public function test_get_acf_link_empty_url_or_title(): void {
		$this->assertSame( '', get_acf_link( [] ) );
		$this->assertSame( '', get_acf_link( [ 'field' => [ 'url' => 'ok' ] ] ) );
		$this->assertSame( '', get_acf_link( [ 'field' => [ 'title' => 'ok' ] ] ) );
	}

	public function test_get_acf_link_with_attributes(): void {
		$this->assertSame(
			'<a target="_blank" href="https://localhost.dev" rel="noopener"><span class="sr-only">New window</span>Title</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '_blank',
					],
				]
			)
		);

		$this->assertSame(
			'<a href="https://localhost.dev">Title</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '',
					],
				]
			)
		);

		$this->assertSame(
			'<a href="https://localhost.dev">CONTENT</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '',
					],
				],
				[ 'content' => 'CONTENT' ]
			)
		);

		// Extra attributes are kept, explicit href wins over the field url.
		$this->assertSame(
			'<a href="https://localhost.dev/explicit" class="btn">Title</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '',
					],
					'href'  => 'https://localhost.dev/explicit',
					'class' => 'btn',
				]
			)
		);
	}

	public function test_get_acf_link_filters(): void {
		add_filter(
			'bea_theme_framework_acf_link_attribute',
			static function ( array $attributes ): array {
				$attributes['class'] = 'from-filter';

				return $attributes;
			}
		);
		add_filter(
			'bea_theme_framework_acf_link_settings',
			static function ( array $settings ): array {
				$settings['content'] = strtoupper( $settings['content'] );

				return $settings;
			}
		);

		$this->assertSame(
			'<a href="https://localhost.dev" class="from-filter">TITLE</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '',
					],
				]
			)
		);
	}

	public function test_the_acf_link(): void {
		ob_start();
		the_acf_link(
			[
				'field' => [
					'title'  => 'Title',
					'url'    => 'https://localhost.dev',
					'target' => '',
				],
			]
		);
		$this->assertSame( '<a href="https://localhost.dev">Title</a>', ob_get_clean() );
	}

	public function test_get_acf_link_classes_without_url(): void {
		$this->assertSame( 'btn btn--primary', get_acf_link_classes( [], [ 'btn', 'btn--primary' ] ) );
		$this->assertSame( 'btn', get_acf_link_classes( [ 'url' => '' ], [ 'btn' ] ) );
	}

	public function test_get_acf_link_classes_internal(): void {
		$this->go_to( home_url( '/current/' ) );

		$this->assertSame( 'btn', get_acf_link_classes( [ 'url' => home_url( '/other' ) ], [ 'btn' ] ) );
		$this->assertSame( 'btn', get_acf_link_classes( [ 'url' => '/relative' ], [ 'btn' ] ) );
	}

	public function test_get_acf_link_classes_current(): void {
		$this->go_to( home_url( '/current/' ) );

		$this->assertSame( 'btn current-menu-item', get_acf_link_classes( [ 'url' => home_url( '/current' ) ], [ 'btn' ] ) );
		$this->assertSame( 'btn current-menu-item', get_acf_link_classes( [ 'url' => home_url( '/current/' ) ], [ 'btn' ] ) );
	}

	public function test_get_acf_link_classes_current_with_query_string(): void {
		$this->go_to( home_url( '/current/?page=2' ) );

		$this->assertSame( 'btn', get_acf_link_classes( [ 'url' => home_url( '/current/' ) ], [ 'btn' ] ) );
		$this->assertSame( 'btn current-menu-item', get_acf_link_classes( [ 'url' => home_url( '/current/?page=2' ) ], [ 'btn' ] ) );
	}

	public function test_get_acf_link_classes_external(): void {
		$this->go_to( home_url( '/current/' ) );
		$host = wp_parse_url( home_url(), PHP_URL_HOST );

		$this->assertSame( 'btn external-menu-item', get_acf_link_classes( [ 'url' => 'https://external.test/page' ], [ 'btn' ] ) );

		// Hosts are compared case-insensitively.
		$this->assertSame( 'btn', get_acf_link_classes( [ 'url' => 'https://' . strtoupper( $host ) . '/page' ], [ 'btn' ] ) );
	}
}

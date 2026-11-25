<?php

use function BEA\Theme\Framework\Helpers\Formatting\Share\get_share_link;
use function BEA\Theme\Framework\Helpers\Formatting\Share\the_share_link;
use function BEA\Theme\Framework\Helpers\Svg\get_the_icon;

class ShareTest extends WP_UnitTestCase {

	public function test_empty_or_unknown_network(): void {
		$this->assertSame( '', get_share_link( '', 'https://localhost.dev' ) );
		$this->assertSame( '', get_share_link( 'myspace', 'https://localhost.dev' ) );
	}

	public function test_facebook(): void {
		$this->assertSame(
			sprintf(
				'<li><button class="share__link" data-seo-click="true" type="button" role="link" data-href="http://www.facebook.com/sharer.php?u=https://localhost.dev" data-rel="noopener" data-target="_blank"><span class="sr-only">New window</span>%s<span class="sr-only">Share on Facebook</span></button></li>',
				get_the_icon( 'social/facebook' )
			),
			get_share_link( 'facebook', 'https://localhost.dev' )
		);
	}

	/**
	 * @dataProvider data_networks
	 */
	public function test_networks_share_url( string $network, string $expected_url, string $accessible_name ): void {
		$markup = get_share_link( $network, 'https://localhost.dev' );

		$this->assertStringContainsString( sprintf( 'data-href="%s"', $expected_url ), $markup );
		$this->assertStringContainsString( get_the_icon( 'social/' . $network ), $markup );
		$this->assertStringContainsString( sprintf( '<span class="sr-only">%s</span>', $accessible_name ), $markup );
	}

	public function data_networks(): array {
		return [
			'x'         => [ 'x', 'https://twitter.com/intent/tweet?url=https://localhost.dev', 'Share on X' ],
			'linkedin'  => [ 'linkedin', 'https://www.linkedin.com/shareArticle?url=https://localhost.dev', 'Share on Linkedin' ],
			'instagram' => [ 'instagram', 'https://www.instagram.com/?url=https://localhost.dev', 'Share on Instagram' ],
			'bluesky'   => [ 'bluesky', 'https://bsky.app/intent/compose?text=https://localhost.dev', 'Share on Bluesky' ],
			'email'     => [ 'email', 'mailto:?body=https://localhost.dev', 'Share by email' ],
		];
	}

	/**
	 * Suspected bug: add_query_arg() does not urlencode values, so a shared URL with its own query string
	 * leaks its parameters into the sharer URL (here "b" becomes a Facebook parameter). Pin the current behaviour.
	 */
	public function test_link_to_share_is_not_url_encoded(): void {
		$this->assertStringContainsString(
			'data-href="http://www.facebook.com/sharer.php?u=https://localhost.dev/?a=1&#038;b=2"',
			get_share_link( 'facebook', 'https://localhost.dev/?a=1&b=2' )
		);
	}

	public function test_custom_share_attributes_and_settings(): void {
		$markup = get_share_link(
			'x',
			'https://localhost.dev',
			[ 'text' => 'Hello' ],
			[ 'class' => 'custom' ],
			[
				'mode'    => 'link',
				'before'  => '',
				'after'   => '',
				'content' => 'Ignored content',
			]
		);

		$this->assertStringStartsWith( '<a target="_blank" href="https://twitter.com/intent/tweet?url=https://localhost.dev&#038;text=Hello" class="custom" rel="noopener">', $markup );
		$this->assertStringNotContainsString( 'Ignored content', $markup );
		$this->assertStringContainsString( '<span class="sr-only">Share on X</span>', $markup );
	}

	public function test_filters(): void {
		$received = [];

		add_filter(
			'bea_theme_framework_share_attributes',
			static function ( array $attributes, string $name, string $link ) use ( &$received ): array {
				$received['attributes'] = [ $name, $link ];
				$attributes['class']   .= ' from-filter';

				return $attributes;
			},
			10,
			3
		);
		add_filter(
			'bea_theme_framework_share_settings',
			static function ( array $settings ): array {
				$settings['before'] = '<div>';
				$settings['after']  = '</div>';

				return $settings;
			}
		);

		$markup = get_share_link( 'linkedin', 'https://localhost.dev' );

		$this->assertSame( [ 'linkedin', 'https://localhost.dev' ], $received['attributes'] );
		$this->assertStringStartsWith( '<div><button class="share__link from-filter"', $markup );
		$this->assertStringEndsWith( '</button></div>', $markup );
	}

	public function test_the_share_link(): void {
		ob_start();
		the_share_link( 'facebook', 'https://localhost.dev' );
		$this->assertSame( get_share_link( 'facebook', 'https://localhost.dev' ), ob_get_clean() );
	}
}

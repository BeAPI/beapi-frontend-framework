<?php

use function BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text;
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;

if ( ! function_exists( 'bea_tests_helpers_escape' ) ) {
	/**
	 * Custom escape callback used to check that the helpers call the given function.
	 *
	 * @param string $value
	 *
	 * @return string
	 */
	function bea_tests_helpers_escape( $value ) {
		return 'esc_' . $value;
	}
}

class TextTest extends WP_UnitTestCase {

	public function test_empty(): void {
		$this->assertSame( '', get_the_text( '' ) );

		ob_start();
		the_text( '' );
		$this->assertSame( '', ob_get_clean() );
	}

	public function test_before_after(): void {
		$cases = [
			'bval'  => [ 'before' => 'b' ],
			'vala'  => [ 'after' => 'a' ],
			'bvala' => [
				'before' => 'b',
				'after'  => 'a',
			],
		];

		foreach ( $cases as $expected => $settings ) {
			$this->assertSame( $expected, get_the_text( 'val', $settings ) );

			ob_start();
			the_text( 'val', $settings );
			$this->assertSame( $expected, ob_get_clean() );
		}
	}

	public function test_default_escape_is_esc_html(): void {
		$this->assertSame( '<p>&lt;strong&gt;R&amp;D&lt;/strong&gt;</p>', get_the_text( '<strong>R&D</strong>', [ 'before' => '<p>', 'after' => '</p>' ] ) );
	}

	public function test_custom_escape(): void {
		$this->assertSame( 'esc_val', get_the_text( 'val', [ 'escape' => 'bea_tests_helpers_escape' ] ) );
		$this->assertSame(
			'besc_val',
			get_the_text(
				'val',
				[
					'before' => 'b',
					'escape' => 'bea_tests_helpers_escape',
				]
			)
		);
		$this->assertSame(
			'esc_vala',
			get_the_text(
				'val',
				[
					'after'  => 'a',
					'escape' => 'bea_tests_helpers_escape',
				]
			)
		);
		$this->assertSame(
			'besc_vala',
			get_the_text(
				'val',
				[
					'before' => 'b',
					'after'  => 'a',
					'escape' => 'bea_tests_helpers_escape',
				]
			)
		);
		$this->assertSame( '<strong>val</strong>x', get_the_text( '<strong>val</strong><script>x</script>', [ 'escape' => 'wp_kses_post' ] ) );
	}

	public function test_wpautop_switches_default_escape_to_wp_kses_post(): void {
		$this->assertSame(
			"<p><strong>Line 1</strong>alert(1)</p>\n<p>Line 2</p>\n",
			get_the_text( "<strong>Line 1</strong><script>alert(1)</script>\n\nLine 2", [ 'wpautop' => true ] )
		);
	}

	public function test_wpautop_keeps_custom_escape(): void {
		$this->assertSame(
			"<p>&lt;strong&gt;val&lt;/strong&gt;</p>\n",
			get_the_text(
				'<strong>val</strong>',
				[
					'wpautop' => true,
					'escape'  => 'esc_attr',
				]
			)
		);
	}

	public function test_filter_settings(): void {
		$received = null;

		add_filter(
			'bea_theme_framework_text_settings',
			static function ( array $settings, string $value ) use ( &$received ): array {
				$received = [ $settings, $value ];

				return array_merge(
					$settings,
					[
						'before' => 'b',
						'after'  => 'a',
						'escape' => 'bea_tests_helpers_escape',
					]
				);
			},
			10,
			2
		);

		$this->assertSame( 'besc_vala', get_the_text( 'val', [ 'escape' => 'esc_html' ] ) );
		$this->assertSame(
			[
				[
					'before'  => '',
					'after'   => '',
					'escape'  => 'esc_html',
					'wpautop' => false,
				],
				'val',
			],
			$received
		);
	}

	public function test_filter_value(): void {
		$received = null;

		add_filter(
			'bea_theme_framework_text_value',
			static function ( string $value, array $settings ) use ( &$received ): string {
				$received = [ $value, $settings ];

				return 'filtered';
			},
			10,
			2
		);

		$this->assertSame( 'bfiltered', get_the_text( 'val', [ 'before' => 'b', 'escape' => 'bea_tests_helpers_escape' ] ) );
		$this->assertSame(
			[
				'esc_val',
				[
					'before'  => 'b',
					'after'   => '',
					'escape'  => 'bea_tests_helpers_escape',
					'wpautop' => false,
				],
			],
			$received
		);
	}
}

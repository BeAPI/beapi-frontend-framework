<?php

use function BEA\Theme\Framework\Helpers\Formatting\Datetime\get_the_datetime;
use function BEA\Theme\Framework\Helpers\Formatting\Datetime\the_datetime;

class DatetimeTest extends WP_UnitTestCase {

	public function test_empty(): void {
		$this->assertSame( '', get_the_datetime( '', [ 'datetime' => '2026-11-03' ] ) );
		$this->assertSame( '', get_the_datetime( '03.11.2026' ) );
	}

	public function test_default(): void {
		$this->assertSame(
			'<time datetime="2026-11-03"><span class="sr-only">Published on </span>03.11.2026</time>',
			get_the_datetime( '03.11.2026', [ 'datetime' => '2026-11-03' ] )
		);
	}

	public function test_settings(): void {
		$this->assertSame(
			'<p><time class="crd__date" datetime="2026-11-03"><span class="sr-only">Updated on </span>03.11.2026</time></p>',
			get_the_datetime(
				'03.11.2026',
				[
					'datetime' => '2026-11-03',
					'class'    => 'crd__date',
					'label'    => 'Updated on',
					'before'   => '<p>',
					'after'    => '</p>',
				]
			)
		);
	}

	public function test_values_are_escaped(): void {
		$this->assertSame(
			'<time class="a&quot;b" datetime="&quot;2026&quot;"><span class="sr-only">&lt;b&gt;On&lt;/b&gt; </span>&lt;i&gt;03.11.2026&lt;/i&gt;</time>',
			get_the_datetime(
				'<i>03.11.2026</i>',
				[
					'datetime' => '"2026"',
					'class'    => 'a"b',
					'label'    => '<b>On</b>',
				]
			)
		);
	}

	public function test_without_label(): void {
		$expected = '<time datetime="2026-11-03">03.11.2026</time>';

		$this->assertSame(
			$expected,
			get_the_datetime(
				'03.11.2026',
				[
					'datetime'   => '2026-11-03',
					'show_label' => false,
				]
			)
		);
		$this->assertSame(
			$expected,
			get_the_datetime(
				'03.11.2026',
				[
					'datetime' => '2026-11-03',
					'label'    => '',
				]
			)
		);
	}

	public function test_filters(): void {
		$settings = [
			'before'     => '',
			'after'      => '',
			'class'      => '',
			'label'      => 'Published on',
			'datetime'   => '2026-11-03',
			'show_label' => false,
		];
		$received = [];

		add_filter(
			'bea_theme_framework_datetime_settings',
			static function ( array $filtered_settings, string $display_date, string $datetime ) use ( &$received ): array {
				$received['settings'] = [ $filtered_settings, $display_date, $datetime ];

				return array_merge( $filtered_settings, [ 'class' => 'filtered' ] );
			},
			10,
			3
		);
		add_filter(
			'bea_theme_framework_datetime_markup',
			static function ( string $markup, array $filtered_settings, string $display_date, string $datetime ) use ( &$received ): string {
				$received['markup'] = [ $markup, $filtered_settings, $display_date, $datetime ];

				return 'filtered';
			},
			10,
			4
		);

		$this->assertSame(
			'bfiltered',
			get_the_datetime(
				'03.11.2026',
				[
					'datetime'   => '2026-11-03',
					'show_label' => false,
					'before'     => 'b',
				]
			)
		);
		$this->assertSame( [ array_merge( $settings, [ 'before' => 'b' ] ), '03.11.2026', '2026-11-03' ], $received['settings'] );
		$this->assertSame(
			[
				'<time class="filtered" datetime="2026-11-03">03.11.2026</time>',
				array_merge(
					$settings,
					[
						'before' => 'b',
						'class'  => 'filtered',
					]
				),
				'03.11.2026',
				'2026-11-03',
			],
			$received['markup']
		);
	}

	public function test_the_datetime(): void {
		ob_start();
		the_datetime(
			'03.11.2026',
			[
				'datetime'   => '2026-11-03',
				'show_label' => false,
			]
		);
		$this->assertSame( '<time datetime="2026-11-03">03.11.2026</time>', ob_get_clean() );
	}
}

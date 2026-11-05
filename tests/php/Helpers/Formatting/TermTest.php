<?php

use function BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_list;
use function BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_name;
use function BEA\Theme\Framework\Helpers\Formatting\Term\the_terms_list;

class TermTest extends WP_UnitTestCase {

	/**
	 * @var WP_Term
	 */
	private $news;

	/**
	 * @var WP_Term
	 */
	private $events;

	public function set_up(): void {
		parent::set_up();

		$this->news   = get_term( self::factory()->category->create( [ 'name' => 'News' ] ), 'category' );
		$this->events = get_term( self::factory()->category->create( [ 'name' => 'Events' ] ), 'category' );
	}

	/**
	 * A term without name cannot be inserted in database, build the object directly.
	 */
	private function get_unnamed_term(): WP_Term {
		return new WP_Term( (object) [ 'name' => '' ] );
	}

	public function test_get_terms_name(): void {
		$this->assertSame( [], get_terms_name( [] ) );
		$this->assertSame( [ 'News', 'Events' ], get_terms_name( [ $this->news, $this->events ] ) );
	}

	public function test_empty_list(): void {
		$this->assertSame( '', get_terms_list( [] ) );

		// Only empty names.
		$this->assertSame( '', get_terms_list( [ $this->get_unnamed_term() ] ) );
	}

	public function test_default_list(): void {
		$this->assertSame(
			'<ul><li>News</li><li>Events</li></ul>',
			get_terms_list( [ $this->news, $this->get_unnamed_term(), $this->events ] )
		);
	}

	public function test_list_of_post_terms(): void {
		$post_id = self::factory()->post->create();
		wp_set_post_categories( $post_id, [ $this->events->term_id ] );

		$this->assertSame( '<ul><li>Events</li></ul>', get_terms_list( get_the_category( $post_id ) ) );
	}

	public function test_names_are_escaped(): void {
		// Names are sanitized on insert, build a term with raw markup to check the output escaping.
		$term = new WP_Term( (object) [ 'name' => 'R&D <b>"x"</b>' ] );

		$this->assertSame( '<ul><li>R&amp;D &lt;b&gt;&quot;x&quot;&lt;/b&gt;</li></ul>', get_terms_list( [ $term ] ) );
	}

	public function test_custom_list(): void {
		$this->assertSame(
			'<p><span>News</span>, <span>Events</span></p>',
			get_terms_list(
				[ $this->news, $this->events ],
				[
					'before'      => '<p>',
					'after'       => '</p>',
					'before_item' => '<span>',
					'after_item'  => '</span>',
					'separator'   => ', ',
				]
			)
		);
	}

	public function test_filters(): void {
		$received = [];

		add_filter(
			'bea_theme_framework_term_list_attributes',
			static function ( array $terms, array $settings ) use ( &$received ): array {
				$received['attributes'] = [ $terms, $settings ];

				return [ 'from-filter' ];
			},
			10,
			2
		);
		add_filter(
			'bea_theme_framework_term_list_settings',
			static function ( array $settings, array $attributes ) use ( &$received ): array {
				$received['settings'] = $attributes;

				return array_merge( $settings, [ 'before' => '<ol>', 'after' => '</ol>' ] );
			},
			10,
			2
		);

		$this->assertSame( '<ol><li>News</li></ol>', get_terms_list( [ $this->news ], [ 'separator' => '|' ] ) );
		$this->assertSame( [ [ $this->news ], [ 'separator' => '|' ] ], $received['attributes'] );
		$this->assertSame( [ 'from-filter' ], $received['settings'] );
	}

	public function test_the_terms_list(): void {
		ob_start();
		the_terms_list( [ $this->news ] );
		$this->assertSame( '<ul><li>News</li></ul>', ob_get_clean() );
	}
}

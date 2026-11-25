<?php

use function BEA\Theme\Framework\Helpers\Pattern_Content\maybe_term;

class Pattern_ContentTest extends WP_UnitTestCase {

	public function test_unknown_term(): void {
		$this->assertSame( '[]', maybe_term( 'unknown', 'category' ) );
	}

	public function test_unknown_taxonomy(): void {
		$this->assertSame( '[]', maybe_term( 'news', 'bea_unknown_taxonomy' ) );
	}

	public function test_existing_term(): void {
		$term_id = self::factory()->category->create( [ 'slug' => 'news' ] );

		$this->assertSame( sprintf( '{"id":%d,"taxonomy":"category"}', $term_id ), maybe_term( 'news', 'category' ) );
	}

	public function test_existing_term_in_other_taxonomy(): void {
		self::factory()->tag->create( [ 'slug' => 'news' ] );

		$this->assertSame( '[]', maybe_term( 'news', 'category' ) );
	}
}

<?php

namespace BEA\Theme\Framework\Tests\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Services\Editor_Patterns;
use WP_Block_Pattern_Categories_Registry;
use WP_UnitTestCase;

class Editor_PatternsTest extends WP_UnitTestCase {

	/**
	 * The "common" category as registered before the test (by the booted theme), null when absent.
	 *
	 * @var array|null
	 */
	private ?array $common_backup = null;

	public function set_up(): void {
		parent::set_up();

		$this->common_backup = $this->registry()->get_registered( 'common' );

		if ( null !== $this->common_backup ) {
			unregister_block_pattern_category( 'common' );
		}
	}

	public function tear_down(): void {
		if ( $this->registry()->is_registered( 'common' ) ) {
			unregister_block_pattern_category( 'common' );
		}

		if ( null !== $this->common_backup ) {
			$properties = $this->common_backup;
			unset( $properties['name'] );
			register_block_pattern_category( 'common', $properties );
		}

		parent::tear_down();
	}

	private function registry(): WP_Block_Pattern_Categories_Registry {
		return WP_Block_Pattern_Categories_Registry::get_instance();
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'editor-patterns', ( new Editor_Patterns() )->get_service_name() );
	}

	public function test_register_does_not_register_categories(): void {
		( new Editor_Patterns() )->register( Framework::get_container() );

		$this->assertFalse( $this->registry()->is_registered( 'common' ) );
	}

	public function test_boot_adds_init_hook(): void {
		$patterns = new Editor_Patterns();
		$patterns->boot( Framework::get_container() );

		$this->assertSame( 10, has_action( 'init', [ $patterns, 'register_categories' ] ) );
	}

	public function test_register_categories(): void {
		( new Editor_Patterns() )->register_categories();

		$category = $this->registry()->get_registered( 'common' );
		$this->assertIsArray( $category );
		$this->assertSame( 'Common', $category['label'] );
	}

	public function test_register_categories_keeps_already_registered_category(): void {
		register_block_pattern_category( 'common', [ 'label' => 'Already registered' ] );

		( new Editor_Patterns() )->register_categories();

		$this->assertSame( 'Already registered', $this->registry()->get_registered( 'common' )['label'] );
	}

	public function test_common_category_is_registered_by_the_booted_theme(): void {
		$this->assertNotNull( $this->common_backup );
		$this->assertSame( 'Common', $this->common_backup['label'] );
	}
}

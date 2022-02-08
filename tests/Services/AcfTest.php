<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Svg;
use InvalidArgumentException;
use WP_Mock;
use WP_Mock\Tools\TestCase;

class AcfTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testName() {
		$acf = new Acf();
		$this->assertEquals( 'acf', $acf->get_service_name() );
	}

	public function testWarning() {
		$acf = new Acf();

		WP_Mock::userFunction( 'wp_die', [
			'times' => 1,
		] );

		WP_Mock::userFunction( 'esc_url', [
			'times' => 1,
		] );

		WP_Mock::userFunction( 'wp_login_url', [
			'times' => 1,
		] );
		$acf->warning();

		// Test we do not launch the functions on existing get_field function
		WP_Mock::userFunction( 'get_field' );
		$acf->warning();
	}

	public function testGetSetFiles() {
		$acf = new Acf();

		$acf->register_files( [ 'myfile' ] );
		$this->assertSame( [ 'myfile' => 'myfile' ], $acf->get_files() );

		$acf->register_files( [ 'myfile', '' ] );
		$this->assertSame( [ 'myfile' => 'myfile' ], $acf->get_files() );

		$acf->register_files( [ 'myfile' ] );
		$this->assertSame( [ 'myfile' => 'myfile' ], $acf->get_files() );
	}

	public function testRegisterOptionPage() {
		$acf = new Acf();

		// Function not existing
		$this->assertFalse( $acf->acf_add_options_page( [] ) );

		WP_Mock::userFunction( 'acf_add_options_page', [ 'return' => 'ok' ] );
		$this->assertSame( 'ok', $acf->acf_add_options_page( [ 'menu_slug' => 'ok' ] ) );

		// Exception is ok
		$this->expectException( InvalidArgumentException::class );
		$acf->acf_add_options_page( [] );

	}

	public function testRegisterOptionSubPage() {
		$acf = new Acf();

		// Function not existing
		$this->assertFalse( $acf->acf_add_options_sub_page( [] ) );

		WP_Mock::userFunction( 'acf_add_options_sub_page', [ 'return' => 'ok' ] );
		$this->assertSame( 'ok', $acf->acf_add_options_sub_page( [ 'menu_slug' => 'ok' ] ) );

		// Exception is ok
		$this->expectException( InvalidArgumentException::class );
		$acf->acf_add_options_sub_page( [] );
	}

	public function testPath() {
		$acf = new Acf();

		// Function not existing
		$acf->set_path( 'test/path' );
	}

	public function testInitAcf() {
		$acf = new Acf();

		// Function not existing
		$this->assertNull( $acf->init_acf() );

		WP_Mock::userFunction( 'get_theme_file_path', [
			'return_in_order' => [
				__DIR__ . '/../data/',
				__DIR__ . '/../data/myfile.php',
				__DIR__ . '/../data/myfile.php',
				__DIR__ . '/../data/myfile2.php',
				__DIR__ . '/../data/myfile3.php',
			],
			'times'           => 5,
		] );

		$acf->register_files( [ 'myfile', 'myfile2', 'myfile3' ] );
		$acf->init_acf();
	}

}

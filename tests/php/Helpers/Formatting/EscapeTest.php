<?php

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;

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

class EscapeTest extends WP_UnitTestCase {

	public function test_attribute_without_existing_escape_function_returns_raw_value(): void {
		$this->assertSame( 'ok', escape_attribute_value( 'ok', '' ) );
		$this->assertSame( '<b>"ok"</b>', escape_attribute_value( '<b>"ok"</b>', 'bea_unknown_escape_function' ) );
	}

	public function test_attribute_uses_custom_escape_function(): void {
		$this->assertSame( 'esc_ok', escape_attribute_value( 'ok', 'bea_tests_helpers_escape' ) );
	}

	public function test_attribute_uses_core_escape_functions(): void {
		$this->assertSame( '&quot;a&quot; &lt;b&gt;', escape_attribute_value( '"a" <b>', 'esc_attr' ) );
		$this->assertSame( 'https://localhost.dev/?a=1&#038;b=2', escape_attribute_value( 'https://localhost.dev/?a=1&b=2', 'esc_url' ) );
		$this->assertSame( '', escape_attribute_value( 'javascript:alert(1)', 'esc_url' ) );
	}

	public function test_content_without_existing_escape_function_returns_raw_value(): void {
		$this->assertSame( 'ok', escape_content_value( 'ok', '' ) );
		$this->assertSame( '<script>ok</script>', escape_content_value( '<script>ok</script>', 'bea_unknown_escape_function' ) );
	}

	public function test_content_uses_custom_escape_function(): void {
		$this->assertSame( 'esc_ok', escape_content_value( 'ok', 'bea_tests_helpers_escape' ) );
	}

	public function test_content_uses_core_escape_functions(): void {
		$this->assertSame( '&lt;strong&gt;ok&lt;/strong&gt;', escape_content_value( '<strong>ok</strong>', 'esc_html' ) );
		$this->assertSame( '<strong>ok</strong>alert(1)', escape_content_value( '<strong>ok</strong><script>alert(1)</script>', 'wp_kses_post' ) );
	}
}

<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Svg;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_acf_link;
use function BEA\Theme\Framework\Helpers\Formatting\Link\get_the_link;
use function BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text;
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;
use function ob_get_clean;
use function ob_start;
use function var_dump;

class LinkTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
		WP_Mock::passthruFunction( 'esc_html__' );
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testGetTheLinkEmpty() {
		$this->assertSame( '', get_the_link( [] ) );
	}

	public function testGetTheLinkTargetBlank() {

		// Auto noopener
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

		// self
		$this->assertSame(
			'<a title="" target="_self" href="https://localhost.dev"></a>',
			get_the_link(
				[
					'href'   => 'https://localhost.dev',
					'target' => '_self',
				]
			)
		);

		// self title
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

		// Custom attribute
		$this->assertSame(
			'<a title="" target="" href="https://localhost.dev" data-seo="ok"></a>',
			get_the_link(
				[
					'href'     => 'https://localhost.dev',
					'data-seo' => 'ok',
				]
			)
		);
		$this->assertSame(
			'<a title="" target="" href="https://localhost.dev" empty-data></a>',
			get_the_link(
				[
					'href'       => 'https://localhost.dev',
					'empty-data' => null,
				]
			)
		);

		// Before/after
		$this->assertSame(
			'b<a title="" target="" href="https://localhost.dev"></a>',
			get_the_link(
				[
					'href' => 'https://localhost.dev',
				],
				[
					'before' => 'b',
				]
			)
		);
		$this->assertSame(
			'<a title="" target="" href="https://localhost.dev"></a>a',
			get_the_link(
				[
					'href' => 'https://localhost.dev',
				],
				[
					'after' => 'a',
				]
			)
		);
		$this->assertSame(
			'b<a title="" target="" href="https://localhost.dev"></a>a',
			get_the_link(
				[
					'href' => 'https://localhost.dev',
				],
				[
					'after'  => 'a',
					'before' => 'b',
				]
			)
		);

		$this->assertSame(
			'<a title="" target="" href="https://localhost.dev">Content</a>',
			get_the_link(
				[
					'href' => 'https://localhost.dev',
				],
				[
					'content' => 'Content',
				]
			)
		);

		$this->assertSame(
			'<a title="TITLE" target="" href="https://localhost.dev">Content</a>',
			get_the_link(
				[
					'href'  => 'https://localhost.dev',
					'title' => 'TITLE',
				],
				[
					'content' => 'Content',
				]
			)
		);
	}

	public function testGetAcfLinkEmptyURLOrTitle() {
		$this->assertSame( '', get_acf_link( [] ) );
		$this->assertSame( '', get_acf_link( [ 'field' => [ 'url' => 'ok' ] ] ) );
		$this->assertSame( '', get_acf_link( [ 'field' => [ 'title' => 'ok' ] ] ) );
	}

	public function testGetAcfLinkWithAttributes() {
		$this->assertSame(
			'<a title="" target="_blank" href="https://localhost.dev" rel="noopener"><span class="sr-only">New window</span>Title</a>',
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
			'<a title="" target="" href="https://localhost.dev">Title</a>',
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
			'<a title="" target="" href="https://localhost.dev">CONTENT</a>',
			get_acf_link(
				[
					'field' => [
						'title'  => 'Title',
						'url'    => 'https://localhost.dev',
						'target' => '',
					],
				],
				[
					'content' => 'CONTENT',
				]
			)
		);
	}
}


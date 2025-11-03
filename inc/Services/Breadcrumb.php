<?php

/**
 * Breadcrumb a11y service
 * https://www.wpexplorer.com/accessible-yoast-seo-breadcrumbs/
 * https://developer.yoast.com/features/blocks/breadcrumbs/
 * https://gist.github.com/doubleedesign/7224a5e990b8506ddb8ec66de8348b2b
 */

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Breadcrumb implements Service {

	public function register( Service_Container $container ): void {
	}

	public function boot( Service_Container $container ): void {
		add_filter( 'wpseo_breadcrumb_output_wrapper', [ $this, 'replace_breadcrumb_wrapper' ]);
		add_filter( 'wpseo_breadcrumb_single_link_wrapper', [ $this, 'replace_breadcrumb_link_wrapper' ]);
		add_filter( 'wpseo_breadcrumb_single_link', [ $this, 'replace_breadcrumb_link' ] );
		add_filter( 'wpseo_breadcrumb_separator', [ $this, 'remove_breadcrumb_separator' ] );
	}

	/**
	 * Get service name
	 *
	 * @return string
	 */
	public function get_service_name(): string {
		return 'breadcrumb';
	}

	/**
	 * Replace the wrapper around the breadcrumbs
	 *
	 * @return string
	 */
	public function replace_breadcrumb_wrapper(): string {
		return 'ol';
	}

	/**
	 * Replace the wrappers around the links.
	 *
	 * @return string
	 */
	public function replace_breadcrumb_link_wrapper(): string {
		return 'li';
	}

	/**
	 * Replace the links and add the separator inside with aria-hidden="true".
	 *
	 * @param string $link_output The link output.
	 * @return string
	 */
	public function replace_breadcrumb_link( $link_output ): string {
		if ( ! str_contains( $link_output, 'breadcrumb_last' ) ) {
			return str_replace( '</li>', '<span class="breadcrumb__separator" aria-hidden="true">></span></li>', $link_output );
		}

		return $link_output;
	}

	/**
	 * Remove the breadcrumbs separator outside the links.
	 *
	 * @return string
	 */
	public function remove_breadcrumb_separator(): string {
		return '';
	}
}

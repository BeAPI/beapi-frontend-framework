<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Gravity_Forms implements Service {

	public function register( Service_Container $container ): void {
	}

	public function boot( Service_Container $container ): void {
		add_filter( 'gform_form_theme_slug', [ $this, 'gform_form_theme_slug' ], 10, 1 );
	}

	/**
	 * Get service name
	 *
	 * @return string
	 */
	public function get_service_name(): string {
		return 'gravity-forms';
	}

	/**
	 * Force form default theme slug.
	 *
	 * @return string
	 * @author Marie Comet
	 */
	public function gform_form_theme_slug(): string {
		return 'gravity-theme';
	}
}

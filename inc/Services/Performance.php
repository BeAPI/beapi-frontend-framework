<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Performance
 *
 * @package BEA\Theme\Framework
 */
class Performance implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		/**
		 * Add hooks for the scripts and styles to hook on
		 */
		add_action( 'wp', [ $this, 'register_assets' ] );
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'performance';
	}

	/**
	 * Register all the Theme assets
	 */
	public function register_assets(): void {
		if ( is_admin() ) {
			return;
		}
		// Passive touchstart
		wp_add_inline_script( 'jquery', $this->passive_touchstart() );
	}

	/**
	 * Add passsive touchstart for performance
	 * @return string
	 */
	public function passive_touchstart(): string {
		return 'jQuery.event.special.touchstart={setup:function(e,t,s){this.addEventListener("touchstart",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.touchmove={setup:function(e,t,s){this.addEventListener("touchmove",s,{passive:!t.includes("noPreventDefault")})}},jQuery.event.special.wheel={setup:function(e,t,s){this.addEventListener("wheel",s,{passive:!0})}},jQuery.event.special.mousewheel={setup:function(e,t,s){this.addEventListener("mousewheel",s,{passive:!0})}};';
	}
}

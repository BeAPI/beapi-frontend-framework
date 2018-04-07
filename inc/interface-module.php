<?php
namespace BEA\Theme\Framework;

/**
 * Interface Interface_Module
 *
 * @package BEA\Theme\Framework
 */
Interface Interface_Module {

	/**
	 * Register the module
	 */
	public function register( Service_Container $container );
}

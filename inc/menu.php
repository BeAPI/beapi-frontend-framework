<?php

namespace BEA\Theme\Framework;


class Menu implements Service {
	public function register() {
		add_theme_support( 'menus' );

		$this->register_menus();
	}

	public function get_service_name() {
		return 'menu';
	}

	public function register_menus() {

	}
}
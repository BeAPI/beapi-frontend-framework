<?php

namespace BEA\Theme\Framework;


class Sidebar implements Service {
	public function register() {
		$this->register_sidebars();
	}

	public function get_service_name() {
		return 'sidebar';
	}

	public function register_sidebars() {
		
	}
}
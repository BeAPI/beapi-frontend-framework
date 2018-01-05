<?php

namespace BEA\Theme\Framework\Tools;

use BEA\Theme\Framework\Service;

class Body_Class implements Service {
	/**
	 * @var array
	 * @author Maxime Culea
	 */
	private $body_class = [];
	private $delete_class = [];

	public function register() {
		add_filter( 'body_class', array( $this, 'body_class' ) );
	}

	/**
	 * Add a body class
	 *
	 * @author Maxime Culea
	 *
	 * @param $body_class array | String
	 */
	public function add( $body_class ) {
		$this->body_class[] = $body_class;
	}

	/**
	 * Stack unwanted body_classes
	 *
	 * @author Maxime Culea
	 *
	 * @param $body_class String
	 */
	public function delete( $body_class ) {
		$this->delete_class[] = $body_class;
	}

	/**
	 *
	 *
	 * @param $classes
	 *
	 * @return array
	 */
	public function body_class( $classes ) {
		if ( is_array( $this->body_class ) ) {
			foreach ( $this->body_class as $bd ) {
				$classes[] = $bd;
			}
		} else {
			$classes[] = $this->body_class;
		}

		// Filter body classes
		return array_filter( $classes, [ $this, 'delete_wanted_body_classes' ] );
	}

	/**
	 * Filter method which handle to delete wanted body_class
	 *
	 * @param $class
	 *
	 * @author Maxime CULEA
	 *
	 * @return bool
	 */
	private function delete_wanted_body_classes( $class ) {
		return ! in_array( $class, $this->delete_class, true );
	}
}
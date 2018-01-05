<?php
/**
 * Autoload all the things \o/
 */
require_once 'autoload.php';

$theme = new \BEA\Theme\Framework\Theme();

// Services
$theme->register_service( \BEA\Theme\Framework\Assets::class );
$theme->register_service( \BEA\Theme\Framework\Assets_Async::class );
$theme->register_service( \BEA\Theme\Framework\SVG::class );
$theme->register_service( \BEA\Theme\Framework\Favicons::class );
$theme->register_service( \BEA\Theme\Framework\Acf::class );

$theme->register();

$this->get_service( 'acf' )->register_file('test');
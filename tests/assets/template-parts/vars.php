<?php
/**
 * Template part fixture reading a variable shared through the Template_Parts service.
 */

$bea_template_parts = \BEA\Theme\Framework\Framework::get_container()->get_service( 'template-parts' );

echo esc_html( (string) $bea_template_parts->get_var( 'bea-tests-vars', 'title' ) );

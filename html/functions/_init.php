<?php
define( 'BEA_IMG_SAMPLE_DIR', dirname( __FILE__ ) . '/../../assets/img/sample/' );

require dirname( __FILE__ ) . '/url.php';

define( 'BEA_IMG_SAMPLE_URL', get_full_url( $_SERVER, true ) . '../assets/img/sample/' );

require dirname( __FILE__ ) . '/compat.php';
require dirname( __FILE__ ) . '/post-thumbnail.php';
require dirname( __FILE__ ) . '/../../functions/class-bea-images.php';

global $bea_image;
$bea_image = new BEA_Images();
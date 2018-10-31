<?php
require dirname( __FILE__ ) . '/url.php';

define( 'ARI_JSON_DIR', dirname( __FILE__ ) . '/../../src/conf-img/' );
define( 'ARI_MODE', 'picture_lazyload' );
define( 'ARI_CONTEXT', 'front' );
define( 'ARI_PIXEL', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' );

define( 'BEA_IMG_SAMPLE_URL', get_full_url( $_SERVER, true ) . '../src/img/sample/' );
define( 'BEA_IMG_SAMPLE_DIR', dirname( __FILE__ ) . '/../../src/img/sample/' );

require dirname( __FILE__ ) . '/compat.php';
require dirname( __FILE__ ) . '/post-thumbnail.php';

// All inc files to include.
$inc_files = array(
	'singleton',
	'modes',
	'mode-interface',
	'image-sizes',
	'image-locations',
);

foreach ( $inc_files as $file ) {
	$file_path = dirname( __FILE__ ) . '/../../../../plugins/advanced-responsive-images/classes/' . $file . '.php';
	if ( ! is_file( $file_path ) ) {
		echo "<script>console.error('YOU MUST INSTALL ADVANCED RESPONSIVE IMAGES : https://github.com/asadowski10/advanced-responsive-images');</script>";
		return false;
	}
	require $file_path;
}

// All inc files to include.
$modes = array(
	'mode',
	'lazysize',
	'lazysize-front',
	'picture',
	'picture-lazyload',
	'picture-lazyload-front',
	'srcset',
	'srcset-front',
);

foreach ( $modes as $file ) {
	require dirname( __FILE__ ) . '/../../../../plugins/advanced-responsive-images/classes/modes/' . $file . '.php';
}
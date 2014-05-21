<?php
header("Content-Type: text/css");

require dirname(__FILE__) . '/../../assets/css/vendor/lessc.inc.php';

function get_full_url( $s, $only_dir_url = false ) {
	$ssl = (!empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on') ? true : false;
	$sp = strtolower( $s['SERVER_PROTOCOL'] );
	$protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . (($ssl) ? 's' : '');
	$port = $s['SERVER_PORT'];
	$port = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
	$host = isset( $s['HTTP_X_FORWARDED_HOST'] ) ? $s['HTTP_X_FORWARDED_HOST'] : isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : $s['SERVER_NAME'];

	if ( $only_dir_url == true ) {
		$s['REQUEST_URI'] = dirname( $s['REQUEST_URI'] ) . '/';
	}
	return $protocol . '://' . $host . $port . $s['REQUEST_URI'];
}

function canonicalize( $address ) {
	$address = explode( '/', $address );
	$keys = array_keys( $address, '..' );

	foreach ( $keys AS $keypos => $key ) {
		array_splice( $address, $key - ($keypos * 2 + 1), 2 );
	}

	$address = implode( '/', $address );
	$address = str_replace( './', '', $address );
	
	return $address;
}

// List my ressources	
$ressources = array(
	'components/url-config.less',
	'components/reset.less',
	'components/text.less',
	'components/forms.less',
	'components/img.less',
	'components/mixins.less',
	'components/superfish.less',
	'grids/grid.less',
	'grids/desktop.less',
	'grids/tablet.less',
	'grids/mobile.less',
	'components/variables.less',
	'master.less',
	'components/print.less'
);

// Dynamic css
$dynamic_less = '';

// Parse & compile LESS
foreach ($ressources as $file) {
	$dynamic_less .= file_get_contents(dirname(__FILE__) . '/../../assets/css/' . $file);
}

// Dynamic build URL
$dynamic_less = str_replace( '{theme_url}', canonicalize(get_full_url( $_SERVER, true ) . '../..'), $dynamic_less );

// Build CSS
$less = new lessc();
$css_output = $less -> parse($dynamic_less);

// Fix bug with IE6-IE7-IE8
$css_output = str_replace(' / ', '/', $css_output);

echo $css_output;
exit();

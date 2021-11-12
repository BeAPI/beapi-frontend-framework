<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Share;

use function BEA\Theme\Framework\Helpers\Formatting\Link\get_the_link;


/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Share\get_share_link( 'facebook', "https://......", ['title' => 'My title', 'class' => "...", 'href' => 'http://www.facebook.com/sharer.php'  ], ['title' => 'My title', 'class' => "...", 'href' => 'http://www.facebook.com/sharer.php'  ], [ 'before' => '', 'after' => ''] );
 *
 * @param string $name The network name ( example : "facebook", "linkedin", etc....).
 * @param string $link_to_share The sharing link.
 * @param array $share_attributes {
 *   Share attribute that can be passed as a parameter in the sharing URL.
 *
 * @type string $u For the share link (Facebook)
 * @type string $url For the share link (Twitter, Linkedin, etc..)
 * @type string $text For the share text
 * @type string $body For the email body
 *
 *
 * }
 * @param array $attributes {
 *    Attributes for the acf link markup.
 *
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * @type string $href The URL for the link
 * @type string $target Optional.Target for the link (example : _blank). By default is _blank
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the acf link markup.
 *
 * @type string $before Optional. Markup to prepend to the link. Default empty.
 * @type string $after Optional. Markup to append to the link. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ].
 *                              By default is methode to display the icon
 *
 * }
 *
 * @return string Return the markup of the share link
 */
function get_share_link( string $name, string $link_to_share, array $share_attributes = [], array $attributes = [], array $settings = [] ): string {
	if ( empty( $name ) ) {
		return '';
	}

	$networks = [
		'facebook' => [
			'attributes' => [
				'title' => __( 'Share on Facebook', 'beapi-frontend-framework' ),
				'href'  => 'http://www.facebook.com/sharer.php',
				'class' => 'share__link',
			],
			'icon'       => 'facebook',
			'params'     => [
				'u' => $link_to_share,
			],
		],
		'twitter'  => [
			'attributes' => [
				'title' => __( 'Share on Twitter', 'beapi-frontend-framework' ),
				'href'  => 'https://twitter.com/intent/tweet',
				'class' => 'share__link',
			],
			'icon'       => 'twitter',
			'params'     => [
				'url' => $link_to_share,
			],
		],
		'linkedin' => [
			'attributes' => [
				'title' => __( 'Share on Linkedin', 'beapi-frontend-framework' ),
				'href'  => 'https://www.linkedin.com/shareArticle',
				'class' => 'share__link',
			],
			'icon'       => 'linkedin',
			'params'     => [
				'url' => $link_to_share,
			],
		],
		'email'    => [
			'attributes' => [
				'title' => __( 'Share on Email', 'beapi-frontend-framework' ),
				'href'  => 'mailto:',
				'class' => 'share__link',
			],
			'icon'       => 'email',
			'params'     => [
				'body' => $link_to_share,
			],
		],
	];

	// 1 . Le réseau existe ?
	$network = $networks[ $name ] ?? [];

	if ( empty( $network ) ) {
		return '';
	}

	$network['params'] = wp_parse_args(
		$network['params'] ?? [],
		$share_attributes
	);

	$network['attributes']['href']     = add_query_arg( $network['params'], $network['attributes']['href'] ?? '' );
	$network['attributes']['target']   = '_blank';
	$network['attributes']['tabindex'] = '-1';

	$attributes = wp_parse_args( $network['attributes'], $attributes );

	$attributes = apply_filters( 'bea_theme_framework_share_attributes', $attributes, $name, $link_to_share, $share_attributes, $settings );

	// Only allow icons
	unset( $settings['content'] );

	$settings = wp_parse_args(
		$settings,
		[
			'content' => $network['icon'] ?? '',
			'before'  => '<li>',
			'after'   => '</li>',
			'escape'  => [
				'content' => 'BEA\Theme\Framework\Helpers\Svg\get_the_icon',
			],
		]
	);

	$settings = apply_filters( 'bea_theme_framework_share_settings', $settings, $name, $link_to_share, $share_attributes, $attributes );

	return get_the_link(
		$attributes,
		$settings
	);
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Share\get_share_link( 'facebook', "https://......", ['title' => 'My title', 'class' => "...", 'href' => 'http://www.facebook.com/sharer.php'  ], ['title' => 'My title', 'class' => "...", 'href' => 'http://www.facebook.com/sharer.php'  ], [ 'before' => '', 'after' => ''] );
 *
 * @param string $name The network name ( example : "facebook", "linkedin", etc....).
 * @param string $link_to_share The sharing link.
 * @param array $share_attributes {
 *   Share attribute that can be passed as a parameter in the sharing URL.
 *
 * @type string $u For the share link (Facebook)
 * @type string $url For the share link (Twitter, Linkedin, etc..)
 * @type string $text For the share text
 * @type string $body For the email body
 *
 *
 * }
 * @param array $attributes {
 *    Attributes for the acf link markup.
 *
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default is empty.
 * @type string $rel The attribute indicates the relationship between the target of the link and the object making the link.
 * @type string $href The URL for the link
 * @type string $target Optional.Target for the link (example : _blank). By default is _blank
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the acf link markup.
 *
 * @type string $before Optional. Markup to prepend to the link. Default empty.
 * @type string $after Optional. Markup to append to the link. Default empty.
 * @type array $escape Optional. An array where we specify as key the value we want to escape and as value the method to use. Example for the href ['escape' => ['href' => 'esc_url'] ].
 *                              By default is methode to display the icon
 *
 * }
 *
 * @return void Echo the markup of the share link
 */
function the_share_link( string $name, string $link_to_share, array $share_attributes = [], array $attributes = [], array $settings = [] ): void {
	echo get_share_link( $name, $link_to_share, $share_attributes, $attributes, $settings );
}
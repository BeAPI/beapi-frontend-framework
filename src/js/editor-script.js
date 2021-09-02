import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

// Native Gutenberg
if (typeof wp !== 'undefined') {
  wp.domReady(() => {
    // Disable block styles

    // block image
    // wp.blocks.unregisterBlockStyle('core/image', 'rounded')
    // wp.blocks.unregisterBlockStyle('core/image', 'default')

    // block quote
    // wp.blocks.unregisterBlockStyle('core/quote', 'default')
    // wp.blocks.unregisterBlockStyle('core/quote', 'large')

    // block pullquote
    // wp.blocks.unregisterBlockStyle('core/pullquote', 'default')
    // wp.blocks.unregisterBlockStyle('core/pullquote', 'solid-color')

    // block separator
    // wp.blocks.unregisterBlockStyle('core/separator', 'default')
    // wp.blocks.unregisterBlockStyle('core/separator', 'wide')
    // wp.blocks.unregisterBlockStyle('core/separator', 'dots')

    // block table
    // wp.blocks.unregisterBlockStyle('core/table', 'regular')
    // wp.blocks.unregisterBlockStyle('core/table', 'stripes')

    // Disable core embed blocks

    var embedVariations = [
      // 'amazon-kindle',
      // 'animoto',
      // 'cloudup',
      // 'collegehumor',
      // 'crowdsignal',
      // 'dailymotion',
      // 'facebook',
      // 'flickr',
      // 'imgur',
      // 'instagram',
      // 'issuu',
      // 'kickstarter',
      // 'meetup-com',
      // 'mixcloud',
      // 'reddit',
      // 'reverbnation',
      // 'screencast',
      // 'scribd',
      // 'slideshare',
      // 'smugmug',
      // 'soundcloud',
      // 'speaker-deck',
      // 'spotify',
      // 'ted',
      // 'tiktok',
      // 'tumblr',
      // 'twitter',
      // 'videopress',
      // 'vimeo',
      // 'wordpress',
      // 'wordpress-tv',
      // 'youtube'
    ]

    for (var i = embedVariations.length - 1; i >= 0; i--) {
      wp.blocks.unregisterBlockVariation('core/embed', embedVariations[i])
    }
  })
}

// ACF Blocks
if (window.acf) {
  // Do stuff
}

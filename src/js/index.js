import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'what-input'
import './classes/ScrollDirection'
import './classes/ButtonSeoClick'
import './classes/Header'

// Animations
import './classes/Animations'
import './animations/generic/LineByLine'
import './animations/generic/Opacity'
import './animations/generic/FadeUp'
import './animations/Custom'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

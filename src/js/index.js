import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'what-input'
import './classes/ScrollDirection'
import './classes/ButtonSeoClick'
import './classes/Header'

// Animations
import './classes/animations/Animations'
import './classes/animations/generic/LineByLine'
import './classes/animations/generic/Opacity'
import './classes/animations/generic/FadeUp'
import './classes/animations/custom/CustomExample'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

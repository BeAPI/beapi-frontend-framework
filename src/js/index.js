/* eslint-disable-next-line */
__webpack_public_path__ = window.themeInfos.templateDirectoryUri + '/dist/'; // webpack right public path for dynamic import

import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'what-input'
import './classes/ScrollDirection'
import './classes/ButtonSeoClick'
import './classes/Header'
import './classes/Animation'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

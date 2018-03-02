/**
 * Main scripts file
 */
import 'picturefill'
import './polyfill/forEach'
import lazySizes from 'lazysizes'
import lazySizesBgset from 'lazysizes/plugins/bgset/ls.bgset'

import Menu from './src/menu'
import ButtonLink from './src/button-href'
import Select from './src/select'
import SeoLink from './src/seo'

const menu = new Menu()
menu.init()
menu.sfMenuInit()

ButtonLink.bind('button[data-href]')

const selects = ['.gform_wrapper select:not([multiple])']
selects.forEach(el => Select.bind(el))

SeoLink.bind('[data-seo]')

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.customMedia = {}

/**
 * LazySizesBgset configuration
 * https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/bgset#lazysizes-bgset-extension---responsive-background-images
 */
lazySizesBgset.customMedia = {}

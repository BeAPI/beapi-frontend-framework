/**
 * Import modaal.js with NPM and modaal.scss with composerjs
 * http://www.humaan.com/modaal/
 * https://github.com/humaan/Modaal
 */

import $ from 'jquery'
import 'modaal/dist/js/modaal'

/**
 * lightbox
 */
const LightboxModaal = () => {
  const self = {}
  const opts = {
    type: 'image'
  }

  /**
   * Initialize modaal galleries for entries links
   * @return {[type]} [description]
   */
  const entryInit = () => {
    // lightbox in wysiwyg WP content for images AND native WP gallery
    $('.entry__content').each(function () { // the containers for all your galleries
      let instance = 0
      let imagesInstances = $(this).find("a[href$='.png'], a[href$='.jpg'], a[href$='.gif']")

      // Organize galleries by container
      imagesInstances.parent().each(function () {
        let gallery = `js-gallery_${instance}`

        $(this).addClass(gallery)
        $(this).find("a[href$='.png'], a[href$='.jpg'], a[href$='.gif']").attr('rel', gallery).modaal(opts)

        instance++
      })
    })
  }

  /**
   * [publicMethod description]
   * @return {[type]} [description]
   */
  self.init = () => {
    entryInit()
  }

  return self
}

LightboxModaal().init()
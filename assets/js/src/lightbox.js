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
      // $(this)
      $(this).find("a[href$='.png'], a[href$='.jpg'], a[href$='.gif']").attr('rel', 'gallery').modaal(opts)
    })

    console.log('Entry init')
  }

  /**
   * [publicMethod description]
   * @return {[type]} [description]
   */
  self.init = () => {
    entryInit()

    console.log('Modaal init')
  }

  return self
}

LightboxModaal().init()
/**
 * Lightbox
 * http://dimsemenov.com/plugins/magnific-popup/documentation.html
 */

var $ = require('jquery')
require('../vendor/jquery.mfp')

// Lightbox french translation
$.extend(true, $.magnificPopup.defaults, {
  tClose: 'Fermer (Esc)',
  tLoading: 'Chargement...',
  gallery: {
    tPrev: 'Précédent',
    tNext: 'Suivant',
    tCounter: '%curr% sur %total%'
  },
  image: {
    tError: '<a href="%url%">L\'image</a> ne peut pas être chargé.' // Error message when image could not be loaded
  },
  ajax: {
    tError: '<a href="%url%">Le contenu</a> ne peut pas être chargé.' // Error message when ajax request failed
  }
})

// lightbox in wysiwyg WP content for images AND native WP gallery
$('.entry__content').each(function () { // the containers for all your galleries
  $(this).find("a[href$='.png'], a[href$='.jpg'], a[href$='.gif']").magnificPopup({
    type: 'image',
    gallery: {
      enabled: true
    }
  })
})
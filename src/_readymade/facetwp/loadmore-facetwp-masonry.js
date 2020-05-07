/*
* Snippet for Facetwp loadmore init with a masonry grid.
* README : https://bitbucket.org/snippets/beapi/9nn85/loadmore-for-_underscore-template
* @author Romain Lefort
*/

/* global wp FWP bea_facet_vars */
/* eslint no-undef: "error" */

const $ = require('jquery')
const isotope = require('isotope-layout')

$(document).ready(() => {
  if (typeof FWP !== 'object') {
    return false
  }
  // remove facetwp pager
  $('.facetwp-pager').remove()
  wp.hooks.addFilter('facetwp/template_html', (resp, params) => {
    if (FWP.is_load_more) {
      FWP.is_load_more = false
      $('.facetwp-template').append(params.html)
      return true
    }
    return resp
  })
})

$(document).on('click', '.fwp-load-more', () => {
  $('.fwp-load-more').html('Loading...')
  FWP.is_load_more = true
  FWP.paged = parseInt(FWP.settings.pager.page) + 1
  FWP.soft_refresh = true
  FWP.refresh()
})

$(document).on('facetwp-loaded', () => {
  if (FWP.settings.pager.page < FWP.settings.pager.total_pages) {
    if (!FWP.loaded && $('.fwp-load-more').length < 1) {
      $('.facetwp-template').after(`<button class="fwp-load-more">${bea_facet_vars.load_more}</button>`)
    } else {
      $('.fwp-load-more').html('Load more').show()
    }
  } else {
    $('.fwp-load-more').hide()
  }
  initMasonry()
})

$(document).on('facetwp-refresh', () => {
  if (!FWP.loaded) {
    FWP.paged = 1
  }
})

/**
 * Init Masonry grid
 */
function initMasonry () {
  let $grid = jQuery('.entry__grid--masonry.facetwp-template')
  if ($grid.data('isotope')) {
    $grid.isotope('destroy')
  }
  $grid.isotope({
    itemSelector: '.entry__card'
  })
}
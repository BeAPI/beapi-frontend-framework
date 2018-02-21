const $ = require('jquery')
window.$ = window.jQuery = $

/**
 * Superfish for submenu most of the time in header
 */

require('superfish')

if ($('.menu__list').length > 0) {
  $('.menu__list').superfish()
}

/**
 * Menu Mobile
 */
let menuBody = $('html, body')
let menuOpen = $('.button__menu-open')
let menuClose = $('.button__menu-close')

menuOpen.on('click', () => {
  menuBody.addClass('menu-mobile--active')
})

menuClose.on('click', () => {
  menuBody.removeClass('menu-mobile--active')
})

if (menuBody.hasClass('menu-mobile--active')) {
  $('#main').on('click', () => {
    menuBody.removeClass('menu-mobile--active')
  })
}

const resizeBreakpoint = window.matchMedia('(min-width: 1024px)')

resizeBreakpoint.addListener(menuResizing)

function menuResizing (mediaQuery) {
  if (mediaQuery.matches) {
    // enter desktop
    menuBody.removeClass('menu-mobile--active')
  }
}
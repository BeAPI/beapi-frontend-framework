// eslint-disable-next-line prettier/prettier
(function($) {
  // Accesible toggle menu
  $('#nav-primary').accessibleMegaMenu({
    uuidPrefix: 'amenu',
    menuClass: 'amenu__main',
    topNavItemClass: 'amenu__top',
    panelClass: 'amenu__panel',
    panelGroupClass: 'sub-menu',
    hoverClass: 'hover',
    focusClass: 'focus',
    openClass: 'open',
  })
  // Regular WordPress Menu
  $('.menu-footer-container').accessibleMegaMenu({
    uuidPrefix: 'amenu',
    menuClass: 'menu',
    topNavItemClass: 'menu__top',
    panelClass: 'menu__panel',
    panelGroupClass: 'sub-menu',
    hoverClass: 'hover',
    focusClass: 'focus',
    openClass: 'open',
  })
})(jQuery)

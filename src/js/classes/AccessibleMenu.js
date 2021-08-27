import AbstractDomElement from './AbstractDomElement'
import '../vendor/accessible-mega-menu'

class AccessibleMenu extends AbstractDomElement {
  constructor(element, options) {
    var instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.init()
  }

  init() {
    const el = this._element
    const s = this._settings

    ;(function ($) {
      // Accesible toggle menu;
      $(el).accessibleMegaMenu(s.options)
    })(jQuery)
  }
}

AccessibleMenu.defaults = {
  options: {
    uuidPrefix: 'amenu',
    menuClass: 'amenu__main',
    topNavItemClass: 'amenu__top',
    panelClass: 'amenu__panel',
    panelGroupClass: 'sub-menu',
    hoverClass: 'hover',
    focusClass: 'focus',
    openClass: 'open',
  },
}

AccessibleMenu.preset = {
  '#nav-primary': {},
}

export default AccessibleMenu

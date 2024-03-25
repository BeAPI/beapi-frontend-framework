import AbstractDomElement from './AbstractDomElement'
import each from '../utils/each'
import { Tween } from 'oneloop.js'
import isRTL from '../utils/isRTL'

class Header extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const that = this
    const el = this._element
    const toggle = el.getElementsByClassName('header__menu-toggle')[0]
    const menuList = el.getElementsByClassName('header__menu-list')[0]
    const liWithChidren = el.getElementsByClassName('menu-item-has-children')
    const menu = el.getElementsByClassName('header__menu')[0]

    this._menu = menu
    this._toggle = toggle
    this._openedSubMenu = null
    this._mouseTimers = {}
    this._menuTween = new Tween({
      autoStart: false,
      reverse: true,
      duration: 1000,
      easing: 'easeInOutExpo',
      onUpdate: function (timestamp, tick, percent) {
        const bp = 768
        let direction = window.innerWidth >= bp ? -1 : 1

        if (isRTL()) {
          direction = window.innerWidth >= bp ? 1 : -1
        }

        menu.style.transform = 'translateX(' + 100 * (percent - 1) * direction + '%)'
      },
      onComplete: function (timestamp, tick, lastValue) {
        if (lastValue === 0) {
          menu.style.display = ''
          menu.style.transform = ''
        }
      },
    })

    // avoid error for empty theme
    if (menuList) {
      each(menuList.children, function (li) {
        li.addEventListener('mouseenter', onMouseEnterFirstLevelLi.bind(that))
      })

      each(liWithChidren, function (li) {
        const subMenuToggle = li.children[1]
        li.addEventListener('mouseenter', onMouseEnterLi.bind(that))
        li.addEventListener('mouseleave', onMouseLeaveLi.bind(that))

        subMenuToggle.addEventListener('keypress', onKeyPressSubMenuToggle.bind(that))
        subMenuToggle.addEventListener('touchstart', onTouchStartSubMenuToggle.bind(that))
      })

      toggle.addEventListener('click', onClickToggle.bind(this))
      document.addEventListener('keyup', onKeyup.bind(this))
    }
  }

  openMenu() {
    this._menu.style.display = 'block'
    this._element.classList.add(this._settings.menuOpenedClass)
    this._toggle.setAttribute('aria-expanded', 'true')
    this._menuTween.start()

    return this
  }

  closeMenu() {
    this._element.classList.remove(this._settings.menuOpenedClass)
    this._toggle.setAttribute('aria-expanded', 'false')
    this._menuTween.start()

    return this
  }

  toggleMenu() {
    return this[this.isMenuOpen() ? 'closeMenu' : 'openMenu']()
  }

  isMenuOpen() {
    return this._element.classList.contains(this._settings.menuOpenedClass)
  }

  openSubMenu(liParent) {
    const toggle = liParent.children[1]
    const subMenu = liParent.children[2]
    var childHeight

    this._openedSubMenu = subMenu

    subMenu.style.display = 'block'
    subMenu.style.height = 0
    childHeight = subMenu.children[0].offsetHeight

    liParent.classList.add(this._settings.liSubMenuOpenedClass)
    toggle.setAttribute('aria-expanded', 'true')

    new Tween({
      duration: 500,
      easing: 'easeOutExpo',
      onUpdate: function (timestamp, tick, percent) {
        subMenu.style.height = childHeight * percent + 'px'
      },
      onComplete: function () {
        subMenu.style.height = 'auto'
      },
    })

    return this
  }

  closeSubMenu(liParent) {
    const toggle = liParent.children[1]
    const subMenu = liParent.children[2]
    const currentHeight = subMenu.offsetHeight

    this._openedSubMenu = null

    subMenu.style.height = currentHeight

    liParent.classList.remove(this._settings.liSubMenuOpenedClass)
    toggle.setAttribute('aria-expanded', 'false')

    new Tween({
      duration: 500,
      easing: 'easeOutExpo',
      onUpdate: function (timestamp, tick, percent) {
        subMenu.style.height = currentHeight * (1 - percent) + 'px'
      },
      onComplete: function () {
        subMenu.style.display = ''
      },
    })

    return this
  }

  toggleSubMenu(liParent) {
    return this[liParent.children[2].style.display === 'block' ? 'closeSubMenu' : 'openSubMenu'](liParent)
  }
}

// ----
// defaults
// ----
Header.defaults = {
  menuOpenedClass: 'header--menu-is-open',
  liSubMenuOpenedClass: 'has-sub-menu-open',
}
// ----
// events
// ----
function onKeyup(e) {
  const activeElement = document.activeElement

  // escape
  if (e.keyCode === 27) {
    if (this._openedSubMenu && this._openedSubMenu.contains(activeElement)) {
      this.closeSubMenu(this._openedSubMenu.parentNode)
    } else if (this.isMenuOpen()) {
      this.closeMenu()
    }
  }
  // tab
  else if (e.keyCode === 9 && !activeElement.classList.contains('header__sub-menu-toggle')) {
    if (this._openedSubMenu && !this._openedSubMenu.contains(activeElement)) {
      this.closeSubMenu(this._openedSubMenu.parentNode)
    }

    if (this.isMenuOpen() && !this._element.contains(activeElement)) {
      this.closeMenu()
    }
  }
}

function onKeyPressSubMenuToggle(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    this.toggleSubMenu(e.currentTarget.parentNode)
  }
}

function onTouchStartSubMenuToggle(e) {
  e.preventDefault()
  this.toggleSubMenu(e.currentTarget.parentNode)
}

function onMouseEnterFirstLevelLi(e) {
  const target = e.currentTarget
  let id
  let li

  for (id in this._mouseTimers) {
    li = document.getElementById(id)

    if (li !== target) {
      clearTimeout(this._mouseTimers[id])

      if (li.children[2].style.display === 'block') {
        this.closeSubMenu(li)
      }
    }
  }
}

function onMouseEnterLi(e) {
  const li = e.currentTarget
  const that = this
  const subMenu = li.children[2]

  clearTimeout(this._mouseTimers[li.id])

  if (subMenu.style.display !== 'block') {
    this._mouseTimers[li.id] = setTimeout(function () {
      that.openSubMenu(li)
    }, 250)
  }
}

function onMouseLeaveLi(e) {
  const li = e.currentTarget
  const that = this
  const subMenu = li.children[2]
  const isFirstLevel = li.parentNode.classList.contains('header__menu-list')

  clearTimeout(this._mouseTimers[li.id])

  if (subMenu.style.display === 'block') {
    this._mouseTimers[li.id] = setTimeout(
      function () {
        that.closeSubMenu(li)
      },
      isFirstLevel ? 1500 : 250
    )
  }
}

function onClickToggle() {
  this.toggleMenu()
}

// ----
// init
// ----
Header.init('#header')

// ----
// export
// ----
export default Header

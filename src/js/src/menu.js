class Menu {
  constructor() {
    // Elements to handle toggle menu
    this.menuBody = document.body
    this.menu = document.querySelector('#menu')
    this.menuOpen = document.getElementById('js-menu-open')
    this.menuClose = document.getElementById('js-menu-close')
    this.buttonContainer = document.getElementById('js-menu-trigger')
    this.activeClass = 'menu-mobile--active'
    // Resize breakpoint
    this.resizeBreakpoint = window.matchMedia('(min-width: 1024px)')
  }
  init() {
    // Events to handle toggle menu
    this.menuOpen.addEventListener('click', this.openMenu.bind(this), false)
    this.menuClose.addEventListener('click', this.closeMenu.bind(this), false)
    // Detect if clicked outside menu
    document.addEventListener('click', event => {
      const menu = this.menu.contains(event.target)
      const buttonContainer = this.buttonContainer.contains(event.target)
      if (!menu && !buttonContainer) {
        this.closeMenu()
      }
    })
    // Event breakpoint
    this.resizeBreakpoint.addListener(this.menuResizing.bind(this))
  }
  /**
   * Open menu
   * @param {event} e
   */
  openMenu(e) {
    if (!this.menuBody.classList.contains(this.activeClass)) {
      this.menuBody.classList.add(this.activeClass)
    }
  }
  /**
   * Close menu
   * @param {event} e
   */
  closeMenu(e) {
    if (this.menuBody.classList.contains(this.activeClass)) {
      this.menuBody.classList.remove(this.activeClass)
    }
  }
  /**
   * Remove menu-mobile active class if breakpoint reach desktop
   * @param {*} mediaQuery
   */
  menuResizing(mediaQuery = this.resizeBreakpoint) {
    if (mediaQuery.matches && this.menuBody.classList) {
      this.menuBody.classList.remove(this.activeClass)
    }
  }
}

export default Menu

const menu = new Menu()
menu.init()

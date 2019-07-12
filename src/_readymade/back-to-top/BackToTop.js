class BackToTop {
  constructor(offset = 100) {
    this.offset = offset
  }
  init() {
    this.buildBackToTopButton()
    this.toggleBackToTopButton()

    window.addEventListener('scroll', () => this.toggleBackToTopButton())
  }
  /**
   * Append back to top button before closed body tag
   */
  buildBackToTopButton() {
    const backToTopButton = document.createElement('button')
    backToTopButton.classList.add('back-to-top', 'back-to-top--hidden', 'button', 'button--icon')
    backToTopButton.setAttribute('id', 'js-back-to-top')
    backToTopButton.setAttribute('data-goto', '0')
    backToTopButton.innerHTML =
      '<svg class="icon icon-up" aria-hidden="true" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-up"></use></svg>'

    document.body.appendChild(backToTopButton)
  }
  /**
   * Hide & show back to top button
   */
  toggleBackToTopButton() {
    const backToTopButton = document.getElementById('js-back-to-top')

    window.pageYOffset > this.offset
      ? backToTopButton.classList.remove('back-to-top--hidden')
      : backToTopButton.classList.add('back-to-top--hidden')
  }
}

export default BackToTop

const backToTop = new BackToTop()
backToTop.init()

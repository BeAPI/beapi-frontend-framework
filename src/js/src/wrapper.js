class Wrapper {
  constructor() {
    this.target = document.querySelector('.wysiwyg')
  }
  init() {
    if (!this.target) {
      return
    }
    this.iframeWrapper()
    this.tableWrapper()
  }
  /**
   * Iframe wrapper
   */
  iframeWrapper() {
    ;[].forEach.call(this.target.querySelectorAll('iframe'), iframe => {
      const iframeSrc = iframe.src

      if (iframeSrc.indexOf('soundcloud') === -1) {
        const wrapper = document.createElement('div')

        wrapper.classList.add('iframe__wrapper')
        iframe.parentNode.insertBefore(wrapper, iframe)
        wrapper.appendChild(iframe)
      }
    })
  }
  /**
   * Table wrapper
   */
  tableWrapper() {
    ;[].forEach.call(this.target.querySelectorAll('table'), table => {
      const wrapper = document.createElement('div')

      wrapper.classList.add('table__wrapper')
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }
}

export default Wrapper

const wrapper = new Wrapper()
wrapper.init()

class Iframe {
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
  tableWrapper() {
    ;[].forEach.call(this.target.querySelectorAll('table'), table => {
      const wrapper = document.createElement('div')

      wrapper.classList.add('table__wrapper')
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }
}

export default Iframe

const iframe = new Iframe()
iframe.init()

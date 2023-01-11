import AbstractDomElement from './AbstractDomElement'
import openUrlInNewTab from '../utils/openUrlInNewTab'

// ----
// class
// ----
class ButtonSeoClick extends AbstractDomElement {
  init() {
    this._element.addEventListener('click', onClickButton)
  }
}

function onClickButton(e) {
  const target = e.currentTarget.getAttribute('data-target')
  const href = e.currentTarget.getAttribute('data-href')

  if (target === '_blank') {
    openUrlInNewTab(href)
  } else {
    window.location.href = href
  }
}

// ----
// init
// ----
ButtonSeoClick.init('button[data-seo-click]')

// ----
// export
// ----
export default ButtonSeoClick

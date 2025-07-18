import AbstractDomElement from './AbstractDomElement'
import each from '../utils/each'

// ----
// class
// ----
class TableBlock extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const el = this._element
    const table = el.querySelector('table')
    const thead = table.querySelector('thead')
    const legend = el.querySelector('figcaption')

    // Tableau de données
    if (thead) {
      const ths = thead.querySelectorAll('th')

      each(ths, function (th) {
        th.setAttribute('scope', 'col')
      })

      // Fix de la légende / titre du tableau. figcaption n'est pas supporté : https://accessibilite.numerique.gouv.fr/methode/glossaire/#tableau-de-donnees-ayant-un-titre
      if (legend) {
        const caption = document.createElement('caption')
        caption.className = legend.className
        caption.textContent = legend.textContent
        table.insertBefore(caption, table.firstChild)
        legend.remove()
      }
    }

    // Tableau de mise en forme
    if (!thead) {
      table.setAttribute('role', 'presentation')
    }
  }
}

// ----
// init
// ----
TableBlock.init('.wp-block-table')

// ----
// export
// ----
export default TableBlock

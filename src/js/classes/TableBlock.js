import AbstractDomElement from './AbstractDomElement'

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

		// Tableau de données
		if (thead) {
			const ths = thead.querySelectorAll('th')

			ths.forEach((th) => {
				th.setAttribute('scope', 'col')
			})
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

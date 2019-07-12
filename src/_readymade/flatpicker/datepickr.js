// npm install flatpickr --save
import flatpickr from 'flatpickr'
import { French } from 'flatpickr/dist/l10n/fr.js'

if (document.getElementsByClassName('hasDatepicker').length > 0) {
  class SimpleDatePicker {
    constructor(element, opts) {
      this.element = element
      this.opts = opts
    }
    init() {
      // console.log(this.element, this.opts)
      flatpickr(this.element, this.opts)
    }
  }

  const flatpickrOpt = {
    minDate: 'today',
    locale: French,
    dateFormat: 'd-m-Y',
  }
  let dates = new SimpleDatePicker('.hasDatepicker', flatpickrOpt)
  dates.init()
}

import MicroModal from 'micromodal'

if (document.getElementsByClassName('modal').length > 0) {
  MicroModal.init({
    onShow: modal => document.body.classList.add('modal-open'),
    onClose: modal => document.body.classList.remove('modal-open'),
  })
}

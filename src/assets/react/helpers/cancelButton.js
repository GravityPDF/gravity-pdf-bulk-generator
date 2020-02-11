export function cancelButton (
  {
    e,
    history,
    toggleModal,
    escapeCloseModal,
    generatePdfCancel,
    resetTagPickerState,
    resetPdfState
  }
) {
  const { pathname } = history.location

  if (pathname === '/step/1') {
    return (
      e && e.preventDefault(),
      toggleModal && toggleModal(),
      escapeCloseModal && escapeCloseModal(),
      history.push('/')
    )
  }

  if (pathname === '/step/2') {
    return (
      e && e.preventDefault(),
      toggleModal && toggleModal(),
      escapeCloseModal && escapeCloseModal(),
      generatePdfCancel(),
      history.push('/step/1')
    )
  }

  if (pathname === '/step/3') {
    return (
      e && e.preventDefault(),
      toggleModal && toggleModal(),
      escapeCloseModal && escapeCloseModal(),
      resetTagPickerState(),
      resetPdfState(),
      history.push('/')
    )
  }
}

export function cancelButton (
  {
    e,
    history,
    toggleModal,
    escapeCloseModal,
    downloadPercentage,
    generatePdfCancel,
    generatePdfToggleCancel,
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

  if (pathname === '/step/2' && downloadPercentage < 100) {
    if (confirm('Are you sure you want to cancel download?')) {
      return (
        e && e.preventDefault(),
        toggleModal && toggleModal(),
        escapeCloseModal && escapeCloseModal(),
        generatePdfCancel(),
        history.push('/step/1')
      )
    }

    e && e.preventDefault()
  }

  if (pathname === '/step/2' && downloadPercentage === 100) {
    return (
      e && e.preventDefault(),
      toggleModal && toggleModal(),
      escapeCloseModal && escapeCloseModal(),
      generatePdfToggleCancel && generatePdfToggleCancel(),
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

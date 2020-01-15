export function cancelButton (
  {
    e,
    step,
    history,
    toggleModal,
    generatePdfCancel,
    resetTagPickerState,
    resetPdfState
  }
) {
  if (step === 1) {
    return (
      e.preventDefault(),
      toggleModal(),
      history.push('/')
    )
  }

  if (step === 2) {
    return (
      e.preventDefault(),
      toggleModal(),
      generatePdfCancel(),
      history.push('/step/1')
    )
  }

  if (step === 3) {
    return (
      e.preventDefault(),
      toggleModal(),
      resetTagPickerState(),
      resetPdfState(),
      history.push('/')
    )
  }
}

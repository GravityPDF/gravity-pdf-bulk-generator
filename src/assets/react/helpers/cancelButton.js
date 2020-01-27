import React from 'react'

export const cancelButton = (e, { history, toggleModal, resetTagPickerState, resetPdfState }) => {
  return (
    e.preventDefault(),
    history.push('/'),
    toggleModal(),
    resetTagPickerState && resetTagPickerState(),
    resetPdfState && resetPdfState()
  )
}

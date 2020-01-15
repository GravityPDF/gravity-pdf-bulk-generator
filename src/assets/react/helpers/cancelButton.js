import React from 'react'

export const cancelButton = (e, { history, toggleModal }) => {
  return (
    e.preventDefault(),
    history.push('/'),
    toggleModal()
  )
}

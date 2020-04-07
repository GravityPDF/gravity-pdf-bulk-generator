/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that check current step path, then switch/toggle modal state to false.
 * This function also is the responsible for resetting the global state to default
 * after clicking the cancel button.
 *
 * @param e
 * @param history
 * @param toggleModal
 * @param escapeCloseModal
 * @param generatePdfCancel
 * @param resetTagPickerState
 * @param resetPdfState
 *
 * @since 1.0
 */
export const cancelButton = (
  {
    e,
    history,
    toggleModal,
    escapeCloseModal,
    generatePdfCancel,
    fatalError,
    resetTagPickerState,
    resetPdfState
  }
) => {

  const { pathname } = history.location

  /* Check current path */
  if (pathname === '/step/1') {
    return (
      e && e.preventDefault(),
      toggleModal && toggleModal(),
      escapeCloseModal && escapeCloseModal(),
      history.push('/')
    )
  }

  /* Check current path */
  if (pathname === '/step/2') {
    /* Prevent additional confirmation popup if fatal error occured already */
    if (fatalError) {
      return (
        e && e.preventDefault(),
        toggleModal && toggleModal(),
        generatePdfCancel(),
        escapeCloseModal && escapeCloseModal(),
        history.push('/')
      )
    }

    /* Add additional native popup confirmation */
    if (confirm('Are you sure you want to cancel download?')) {
      return (
        e && e.preventDefault(),
        toggleModal && toggleModal(),
        generatePdfCancel(),
        escapeCloseModal && escapeCloseModal(),
        history.push('/')
      )
    }

    e && e.preventDefault()
  }

  /* Check current path */
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

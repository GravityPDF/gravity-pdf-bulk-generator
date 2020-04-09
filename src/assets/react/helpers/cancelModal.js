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
 * @param toggleModal
 * @param escapeCloseModal
 * @param fatalError
 * @param history
 *
 * @since 1.0
 */
export const cancelModal = (
  {
    e,
    toggleModal,
    escapeCloseModal,
    fatalError,
    history
  }
) => {
  /* Check current path */
  if (history.location.pathname === '/step/2' && !fatalError) {
    if (confirm('Are you sure you want to cancel download?')) {
      return (
        e && e.preventDefault(),
        toggleModal && toggleModal(),
        escapeCloseModal && escapeCloseModal(),
        history.push('/')
      )
    }

    return e && e.preventDefault()
  }

  return (
    e && e.preventDefault(),
    toggleModal && toggleModal(),
    escapeCloseModal && escapeCloseModal(),
    history.push('/')
  )
}

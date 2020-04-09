import language from '../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that check current step path, then resets the entire application state
 *
 * @param e
 * @param fatalError
 * @param history
 *
 * @since 1.0
 */
export const cancelModal = (
  {
    e,
    fatalError,
    history
  }
) => {

  e && e.preventDefault()

  /* Check current path */
  if (history.location.pathname === '/step/2' && !fatalError) {
    if (!confirm(language.cancelButtonConfirmation)) {
      return
    }
  }

  history.push('/')
}

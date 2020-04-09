/* Redux Action Types */
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
import { PROCESS_CHECKBOX, GET_SELECTED_ENTRY_IDS_SUCCESS } from '../actionTypes/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "form" portion of our Redux store
 *
 * @type { selectedEntryIds: array }
 *
 * @since 1.0
 */
export const initialState = {
  selectedEntryIds: []
}

/**
 * The action for "form" reducer which updates its state
 *
 * @param state: object
 * @param action: object
 *
 * @returns { initialState: * } whether updated or not
 *
 * @since 1.0
 */
export default function (state = initialState, action) {

  switch (action.type) {

    /**
     * Process PROCESS_CHECKBOX
     *
     * @since 1.0
     */
    case PROCESS_CHECKBOX: {
      const ids = action.payload
      let entryIds = []

      ids.forEach(id => {
        if (id.type === 'checkbox' && id.checked) {
          entryIds.push(id.value)
        }
      })

      return {
        ...state,
        selectedEntryIds: entryIds
      }
    }

    /**
     * Process GET_SELECTED_ENTRY_IDS_SUCCESS
     *
     * @since 1.0
     */
    case GET_SELECTED_ENTRY_IDS_SUCCESS:
      return {
        ...state,
        selectedEntryIds: action.payload
      }

    /**
     * Process RESET_ALL_STATE
     *
     * @since 1.0
     */
    case RESET_ALL_STATE:
      return {
        ...initialState
      }
  }

  return state
}

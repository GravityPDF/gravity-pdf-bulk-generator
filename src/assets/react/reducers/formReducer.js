/* Redux Action Types */
import {
  PROCESS_CHECKBOX,
  GET_SELECTED_ENTRY_IDS_SUCCESS
} from '../actionTypes/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "form" portion of our Redux store
 *
 * @type {selectedEntryIds: array }
 *
 * @since 1.0
 */
export const initialState = {
  selectedEntryIds: []
}

/**
 * The action for "form" reducer which updates its state
 *
 * @param state
 * @param action
 *
 * @returns {initialState: *} whether updated or not
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
  }

  /**
   * None of the above action types fired so return state
   *
   * @since 1.0
   */
  return state
}

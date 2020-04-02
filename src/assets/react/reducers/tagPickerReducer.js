/* Redux Action Types */
import {
  UPDATE_DIRECTORY_STRUCTURE,
  RESET_TAGPICKER_STATE
} from '../actionTypes/tagPicker'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "tag picker" portion of our Redux store
 *
 * @type {tags: [{id: 'string', label: 'string'}], directoryStructure: string}
 *
 * @since 1.0
 */
export const initialState = {
  tags: [
    { id: '{date_created:format:Y}', label: 'Year' },
    { id: '{date_created:format:m}', label: 'Month' },
    { id: '{date_created:format:d}', label: 'Day' },
    { id: '{date_created:format:H}', label: 'Hour' },
    { id: '{date_created:format:i}', label: 'Minute' },
    { id: '{entry:payment_status}', label: 'Payment Status' },
    { id: '{entry_id}', label: 'Entry ID' },
    { id: '{created_by:user_login}', label: 'User Login' },
    { id: '{created_by:user_email}', label: 'User Email' },
    { id: '{created_by:display_name}', label: 'User Display Name' },
  ],
  directoryStructure: '/{date_created:format:Y}/{date_created:format:m}/'
}

/**
 * The action for "tag picker" reducer which updates its state
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
     * Process UPDATE_DIRECTORY_STRUCTURE
     *
     * @since 1.0
     */
    case UPDATE_DIRECTORY_STRUCTURE:
      return {
        ...state,
        directoryStructure: action.payload
      }

    /**
     * Process RESET_TAGPICKER_STATE
     *
     * @since 1.0
     */
    case RESET_TAGPICKER_STATE: {
      return {
        ...initialState
      }
    }
  }

  /**
   * None of the above action types fired so return state
   *
   * @since 1.0
   */
  return state
}

/* Redux Action Types */
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
import { UPDATE_DIRECTORY_STRUCTURE, RESET_TAGPICKER_STATE } from '../actionTypes/tagPicker'
/* Helper */
import language from '../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "tag picker" portion of our Redux store
 *
 * @type { tags: [ {id: 'string', label: 'string'} ], directoryStructure: string }
 *
 * @since 1.0
 */
export const initialState = {
  tags: [
    { id: '{date_created:format:Y}', label: language.tagYear },
    { id: '{date_created:format:m}', label: language.tagMonth },
    { id: '{date_created:format:d}', label: language.tagDay },
    { id: '{date_created:format:H}', label: language.tagHour },
    { id: '{date_created:format:i}', label: language.tagMinute },
    { id: '{entry:payment_status}', label: language.tagPaymentStatus },
    { id: '{entry_id}', label: language.tagEntryId },
    { id: '{created_by:user_login}', label: language.tagUserLogin },
    { id: '{created_by:user_email}', label: language.tagUserEmail },
    { id: '{created_by:display_name}', label: language.tagUserDisplayName },
  ],
  directoryStructure: '/{date_created:format:Y}/{date_created:format:m}/'
}

/**
 * The action for "tag picker" reducer which updates its state
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
     * Process RESET_ALL_STATE & RESET_TAGPICKER_STATE
     *
     * @since 1.0
     */
    case RESET_ALL_STATE:
    case RESET_TAGPICKER_STATE:
      return {
        ...initialState
      }
  }

  return state
}

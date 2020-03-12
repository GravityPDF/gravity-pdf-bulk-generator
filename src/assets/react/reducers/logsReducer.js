/* Redux Action Types */
import {
  TOGGLE_SUCCESS,
  TOGGLE_ERRORS,
  TOGGLE_WARNINGS
} from '../actionTypes/logs'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "logs" portion of our Redux store
 *
 * @type {success: boolean, warnings: boolean, errors: boolean}
 *
 * @since 1.0
 */
export const initialState = {
  success: false,
  errors: false,
  warnings: false
}

/**
 * The action for "logs" reducer which updates its state
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
     * Process TOGGLE_SUCCESS
     *
     * @since 1.0
     */
    case TOGGLE_SUCCESS:
      return {
        ...state,
        success: !state.success
      }

    /**
     * Process TOGGLE_ERRORS
     *
     * @since 1.0
     */
    case TOGGLE_ERRORS:
      return {
        ...state,
        errors: !state.errors
      }

    /**
     * Process TOGGLE_WARNINGS
     *
     * @since 1.0
     */
    case TOGGLE_WARNINGS:
      return {
        ...state,
        warnings: !state.warnings
      }
  }

  /**
   * None of the above action types fired so return state
   *
   * @since 1.0
   */
  return state
}

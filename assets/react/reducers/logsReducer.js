/* Redux Action Types */
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
import {
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_PDF_FAILED,
  RESET_LOGS_STATE
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
 * @type { generatePdfSuccess: array, generatePdfWarning: array, generatePdfFailed: array }
 *
 * @since 1.0
 */
export const initialState = {
  generatePdfSuccess: [],
  generatePdfWarning: [],
  generatePdfFailed: []
}

/**
 * The action for "logs" reducer which updates its state
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
     * Process GENERATE_PDF_SUCCESS
     *
     * @since 1.0
     */
    case GENERATE_PDF_SUCCESS: {
      const list = [...state.generatePdfSuccess]

      list.push(action.payload)

      return {
        ...state,
        generatePdfSuccess: list
      }
    }

    /**
     * Process GENERATE_PDF_WARNING
     *
     * @since 1.0
     */
    case GENERATE_PDF_WARNING: {
      const list = [...state.generatePdfWarning]

      list.push(action.payload)

      return {
        ...state,
        generatePdfWarning: list
      }
    }

    /**
     * Process GENERATE_PDF_FAILED
     *
     * @since 1.0
     */
    case GENERATE_PDF_FAILED: {
      const list = [...state.generatePdfFailed]

      list.push(action.payload)

      return {
        ...state,
        generatePdfFailed: list
      }
    }

    /**
     * Process RESET_ALL_STATE & RESET_LOGS_STATE
     *
     * @since 1.0
     */
    case RESET_ALL_STATE:
    case RESET_LOGS_STATE:
      return {
        ...initialState
      }
  }

  return state
}

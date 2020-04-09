/* Redux Action Types */
import { GENERATE_PDF_LIST_SUCCESS, TOGGLE_PDF_STATUS, GENERATE_SESSION_ID } from '../actionTypes/pdf'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Redux Actions - payloads of information that send data from application to store */

/**
 * Generate PDF list
 *
 * @param data
 *
 * @returns {{ payload: array, type: string }}
 *
 * @since 1.0
 */
export const generatePdfListSuccess = data => {
  return {
    type: GENERATE_PDF_LIST_SUCCESS,
    payload: data
  }
}

/**
 * Toggle PDF status state
 *
 * @param index
 *
 * @returns {{ payload: int, type: string }}
 *
 * @since 1.0
 */
export const togglePdfStatus = index => {
  return {
    type: TOGGLE_PDF_STATUS,
    payload: index
  }
}

/**
 * Generate Session ID
 *
 * @param path
 * @param concurrency
 *
 * @returns {{ path: string, concurrency: int, type: string }}
 *
 * @since 1.0
 */
export const generateSessionId = (path, concurrency) => {
  return {
    type: GENERATE_SESSION_ID,
    path,
    concurrency
  }
}

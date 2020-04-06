/* Redux Action Types */
import {
  GENERATE_PDF_LIST_SUCCESS,
  TOGGLE_MODAL,
  ESCAPE_CLOSE_MODAL,
  TOGGLE_PDF_STATUS,
  GENERATE_SESSION_ID,
  GENERATE_PDF_CANCEL,
  RESET_PDF_STATE
} from '../actionTypes/pdf'

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
 * Toggle modal state
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL
  }
}

/**
 * Switch modal state to false
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const escapeCloseModal = () => {
  return {
    type: ESCAPE_CLOSE_MODAL
  }
}

/**
 * Toggle PDF status state
 *
 * @param index
 *
 * @returns {{ payload: number, type: string }}
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
 * @param retryInterval
 * @param delayInterval
 *
 * @returns {{ path: string, concurrency: number, retryInterval: number,
 * delayInterval: number, type: string }}
 *
 * @since 1.0
 */
export const generateSessionId = (path, concurrency, retryInterval, delayInterval) => {
  return {
    type: GENERATE_SESSION_ID,
    path,
    concurrency,
    retryInterval,
    delayInterval
  }
}

/**
 * Switch generatePdfCancel state to true
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const generatePdfCancel = () => {
  return {
    type: GENERATE_PDF_CANCEL
  }
}

/**
 * Reset PDF state
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const resetPdfState = () => {
  return {
    type: RESET_PDF_STATE
  }
}

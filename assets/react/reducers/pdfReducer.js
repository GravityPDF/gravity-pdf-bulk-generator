/* Redux Action Types */
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
import {
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_LIST_SUCCESS,
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_SESSION_ID_SUCCESS,
  STORE_ABORT_CONTROLLER,
  TOGGLE_MODAL,
  TOGGLE_PDF_STATUS,
  FATAL_ERROR,
  RESET_PDF_STATE
} from '../actionTypes/pdf'
/* Helpers */
import { generateActivePdfList } from '../helpers/generateActivePdfList'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Setup the initial state of the "PDF" portion of our Redux store
 *
 * @type { sessionId: string, modal: boolean, pdfList: array,
 * generatePdfCounter: int, downloadPercentage: int, downloadZipUrl: string,
 * abortControllers: array, fatalError: boolean }
 *
 * @since 1.0
 */
export const initialState = {
  sessionId: '',
  modal: false,
  pdfList: [],
  generatePdfCounter: 0,
  downloadPercentage: 0,
  downloadZipUrl: '',
  abortControllers: [],
  fatalError: false
}

/**
 * The action for "PDF" reducer which updates its state
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
     * Process STORE_ABORT_CONTROLLER
     *
     * @since 1.0
     */
    case STORE_ABORT_CONTROLLER: {
      const list = [...state.abortControllers]

      list.push(action.payload)

      return {
        ...state,
        abortControllers: list
      }
    }

    /**
     * Process GENERATE_PDF_LIST_SUCCESS
     *
     * @since 1.0
     */
    case GENERATE_PDF_LIST_SUCCESS:
      return {
        ...state,
        pdfList: action.payload
      }

    /**
     * Process TOGGLE_MODAL
     *
     * @since 1.0
     */
    case TOGGLE_MODAL:
      return {
        ...state,
        modal: !state.modal
      }

    /**
     * Process TOGGLE_PDF_STATUS
     *
     * @since 1.0
     */
    case TOGGLE_PDF_STATUS: {
      const list = [...state.pdfList]

      /* If toggle all pdf switch is clicked */
      if (action.payload === 0) {
        if (list[0]['active'] === false && generateActivePdfList(list).length > 0) {
          for (let x = 0; x < list.length; x++) {
            list[x]['active'] = true
          }
        } else {
          for (let x = 0; x < list.length; x++) {
            list[x]['active'] = !list[x]['active']
          }
        }
      }

      /* If individual toggle pdf switch is clicked */
      if (action.payload !== 0) {
        list[action.payload]['active'] = !list[action.payload]['active']

        if (generateActivePdfList(list).length <= list.length) {
          list[0]['active'] = false
        }

        if (generateActivePdfList(list).length === list.length - 1) {
          list[0]['active'] = true
        }
      }

      return {
        ...state,
        pdfList: list
      }
    }

    /**
     * Process GENERATE_SESSION_ID_SUCCESS
     *
     * @since 1.0
     */
    case GENERATE_SESSION_ID_SUCCESS:
      return {
        ...state,
        sessionId: action.payload
      }

    /**
     * Process GENERATE_PDF_COUNTER
     *
     * @since 1.0
     */
    case GENERATE_PDF_COUNTER: {
      let generatePdfCounter = state.generatePdfCounter + 1
      const selectedEntryIds = action.payload
      const activePdfList = generateActivePdfList(state.pdfList)
      const percentage = (100 * generatePdfCounter) / (activePdfList.length * selectedEntryIds.length)

      return {
        ...state,
        generatePdfCounter: generatePdfCounter,
        downloadPercentage: Math.round(percentage)
      }
    }

    /**
     * Process GENERATE_DOWNLOAD_ZIP_URL
     *
     * @since 1.0
     */
    case GENERATE_DOWNLOAD_ZIP_URL:
      return {
        ...state,
        downloadZipUrl: action.payload
      }

    /**
     * Process FATAL_ERROR
     *
     * @since 1.0
     */
    case FATAL_ERROR:
      return {
        ...state,
        fatalError: true
      }

    /**
     * Process RESET_ALL_STATE & RESET_PDF_STATE
     *
     * @since 1.0
     */
    case RESET_ALL_STATE:
    case RESET_PDF_STATE:
      return {
        ...initialState
      }
  }

  return state
}

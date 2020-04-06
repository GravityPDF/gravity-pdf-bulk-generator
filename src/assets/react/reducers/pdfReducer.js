/* Redux Action Types */
import {
  ESCAPE_CLOSE_MODAL,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_LIST_SUCCESS,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_DOWNLOAD_ZIP_URL,
  VALIDATED_DOWNLOAD_ZIP_URL,
  GENERATE_SESSION_ID_FAILED,
  GENERATE_SESSION_ID_SUCCESS,
  RESET_PDF_STATE,
  STORE_ABORT_CONTROLLER,
  TOGGLE_MODAL,
  TOGGLE_PDF_STATUS,
  FATAL_ERROR
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
 * @type { sessionId: string, modal: boolean, pdfList: array, generatePdfSuccess: array,
 * generatePdfFailed: array, generatePdfWarning: array, generatePdfCancel: boolean,
 * generatePdfCounter: number, downloadPercentage: number, downloadZipUrl: string,
 * abortControllers: array, fatalError: object }
 *
 * @since 1.0
 */
export const initialState = {
  sessionId: '',
  modal: false,
  pdfList: [],
  generatePdfSuccess: [],
  generatePdfFailed: [],
  generatePdfWarning: [],
  generatePdfCancel: false,
  generatePdfCounter: 0,
  downloadPercentage: 0,
  downloadZipUrl: '',
  abortControllers: [],
  fatalError: {
    verifyProcess: false,
    fatalError: false
  }
}

/**
 * The action for "PDF" reducer which updates its state
 *
 * @param state
 * @param action
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
        generatePdfCancel: false,
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
     * Process ESCAPE_CLOSE_MODAL
     *
     * @since 1.0
     */
    case ESCAPE_CLOSE_MODAL:
      return {
        ...state,
        modal: false
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
     * Process GENERATE_SESSION_ID_FAILED
     *
     * @since 1.0
     */
    case GENERATE_SESSION_ID_FAILED:
      return {
        ...state,
        sessionId: action.payload
      }

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
     * Process GENERATE_PDF_CANCEL
     *
     * @since 1.0
     */
    case GENERATE_PDF_CANCEL:
      return {
        ...state,
        sessionId: '',
        pdfList: [],
        generatePdfSuccess: [],
        generatePdfFailed: [],
        generatePdfWarning: [],
        generatePdfCancel: true,
        generatePdfCounter: 0,
        downloadPercentage: 0,
        downloadZipUrl: '',
        abortControllers: [],
        fatalError: { ...state.fatalError }
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
     * Process VALIDATED_DOWNLOAD_ZIP_URL
     *
     * @since 1.0
     */
    case VALIDATED_DOWNLOAD_ZIP_URL:
      return {
        ...state,
        fatalError: {
          verifyProcess: true,
          fatalError: false
        }
      }

    /**
     * Process FATAL_ERROR
     *
     * @since 1.0
     */
    case FATAL_ERROR:
      return {
        ...state,
        fatalError: {
          verifyProcess: true,
          fatalError: true
        }
      }

    /**
     * Process RESET_PDF_STATE
     *
     * @since 1.0
     */
    case RESET_PDF_STATE:
      return {
        ...initialState
      }
  }

  /**
   * None of the above action types fired so return state
   *
   * @since 1.0
   */
  return state
}

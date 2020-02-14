import {
  GENERATE_PDF_LIST_SUCCESS,
  TOGGLE_MODAL,
  ESCAPE_CLOSE_MODAL,
  TOGGLE_PDF_STATUS,
  GENERATE_SESSION_ID_SUCCESS,
  GENERATE_SESSION_ID_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_TOGGLE_CANCEL,
  GENERATE_PDF_COUNTER,
  GENERATE_DOWNLOAD_ZIP_URL,
  RESET_PDF_STATE
} from '../actionTypes/pdf'
import { generateActivePdfList } from '../helpers/generateActivePdfList'

export const initialState = {
  sessionId: '',
  modal: false,
  pdfList: [],
  generatePdfSuccess: [],
  generatePdFailed: [],
  generatePdfCancel: false,
  generatePdfCounter: 0,
  downloadPercentage: 0,
  downloadZipUrl: ''
}

export default function (state = initialState, action) {

  switch (action.type) {

    case GENERATE_PDF_LIST_SUCCESS:
      return {
        ...state,
        pdfList: action.payload
      }

    case TOGGLE_MODAL: {
      return {
        ...state,
        modal: !state.modal
      }
    }

    case ESCAPE_CLOSE_MODAL: {
      return {
        ...state,
        modal: false
      }
    }

    case TOGGLE_PDF_STATUS: {
      const newState = { ...state, pdfList: [...state.pdfList] }

      newState.pdfList[action.payload]['active'] = !newState.pdfList[action.payload]['active']

      return newState
    }

    case GENERATE_SESSION_ID_SUCCESS:
      return {
        ...state,
        sessionId: action.payload
      }

    case GENERATE_SESSION_ID_FAILED:
      return {
        ...state,
        sessionId: action.payload
      }

    case GENERATE_PDF_SUCCESS: {
      const list = state.generatePdfSuccess
      list.push(action.payload)

      return {
        ...state,
        generatePdfSuccess: list
      }
    }

    case GENERATE_PDF_FAILED: {
      const list = []
      list.push(action.payload)

      return {
        ...state,
        generatePdFailed: list
      }
    }

    case GENERATE_PDF_CANCEL:
      return {
        ...state,
        generatePdfCancel: true
      }

    case GENERATE_PDF_TOGGLE_CANCEL:
      return {
        ...state,
        generatePdfSuccess: [],
        generatePdFailed: [],
        generatePdfCancel: false,
        generatePdfCounter: 0,
        downloadPercentage: 0
      }

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

    case GENERATE_DOWNLOAD_ZIP_URL: {
      return {
        ...state,
        downloadZipUrl: action.payload
      }
    }

    case RESET_PDF_STATE: {
      const list = []

      state.pdfList.map(item => {
        item.active = false
        list.push(item)
      })

      return {
        ...state,
        modal: false,
        pdfList: list,
        generatePdfSuccess: [],
        generatePdFailed: [],
        generatePdfCancel: false,
        generatePdfCounter: 0,
        downloadPercentage: 0,
        downloadZipUrl: ''
      }
    }
  }

  return state
}

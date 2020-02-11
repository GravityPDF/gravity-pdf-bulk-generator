import {
  GET_FORM_DATA,
  TOGGLE_MODAL,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY,
  TOGGLE_POPUP_SELECT_ALL_ENTRIES,
  GET_ALL_FORM_ENTRIES_SUCCESS,
  GET_ALL_FORM_ENTRIES_FAILED,
  ESCAPE_CLOSE_MODAL,
  TOGGLE_PDF_STATUS,
  GENERATE_ACTIVE_PDF_LIST,
  GET_SESSION_ID_SUCCESS,
  GET_SESSION_ID_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_TOGGLE_CANCEL,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_SUCCESS_INTERVAL,
  DOWNLOAD_ZIP_SUCCESS,
  DOWNLOAD_ZIP_FAILED,
  RESET_PDF_STATE
} from '../actionTypes/pdf'

export const initialState = {
  sessionId: '',
  modal: false,
  pdfList: [],
  activePdflist: [],
  formEntries: {
    formId: '',
    selectedAllIds: false,
    popupSelectAllEntries: false,
    selectedEntryIds: []
  },
  requestGeneratePdf: [],
  generatePdfSuccess: [],
  generatePdfCancel: false,
  generatePdFailed: '',
  generatePdfCounter: 0,
  downloadPercentage: 0,
  downloadZipUrl: ''
}

export default function (state = initialState, action) {

  switch (action.type) {

    case GET_FORM_DATA: {
      const formId = action.payload.form_id
      const list = []

      Object.entries(action.payload.pdfs).map(item => {
        list.push({ id: item[0], name: item[1].name, templateSelected: item[1].template, active: false })
      })

      return {
        ...state,
        pdfList: list,
        formEntries: {
          ...state.formEntries,
          formId: formId
        }
      }
    }

    case TOGGLE_MODAL: {
      return {
        ...state,
        modal: !state.modal
      }
    }

    case SINGLE_CHECKBOX_ENTRY: {
      let entries = state.formEntries.selectedEntryIds
      const entry = action.id
      const totalEntries = action.totalEntries

      if (entries.includes(entry)) {
        const list = entries.filter(item => item !== entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIds: false,
            selectedEntryIds: list
          }
        }
      } else if (entries.length === (totalEntries- 1)) {
        entries.push(entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIds: true,
            selectedEntryIds: entries
          }
        }
      } else {
        entries.push(entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIds: false,
            selectedEntryIds: entries
          }
        }
      }
    }

    case ALL_CHECKBOX_ENTRY: {
      let ids = state.formEntries.selectedEntryIds

      if (ids.length > 0 && state.formEntries.selectedAllIds) {
        ids = []

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIds: false,
            selectedEntryIds: ids
          }
        }
      } else {
        ids = action.payload

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIds: true,
            selectedEntryIds: ids
          }
        }
      }
    }

    case TOGGLE_POPUP_SELECT_ALL_ENTRIES: {
      return {
        ...state,
        formEntries: {
          ...state.formEntries,
          selectedAllIds: false,
          popupSelectAllEntries: false,
          selectedEntryIds: []
        }
      }
    }

    case GET_ALL_FORM_ENTRIES_SUCCESS:
      return {
        ...state,
        formEntries: {
          ...state.formEntries,
          popupSelectAllEntries: true,
          selectedEntryIds: action.payload
        }
      }

    case GET_ALL_FORM_ENTRIES_FAILED:
      return {
        ...state,
        formEntries: {
          ...state.formEntries,
          selectedEntryIds: [{ error: action.payload }]
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

    case GENERATE_ACTIVE_PDF_LIST:
      return {
        ...state,
        activePdflist: action.payload
      }

    case GET_SESSION_ID_SUCCESS: {
      const sessionId = action.payload
      const activePdflist = state.activePdflist
      const selectedEntryIds = state.formEntries.selectedEntryIds
      const data = { sessionId, activePdflist, selectedEntryIds }

      return {
        ...state,
        sessionId: sessionId,
        requestGeneratePdf: data
      }
    }

    case GET_SESSION_ID_FAILED:
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

    case GENERATE_PDF_CANCEL:
      return {
        ...state,
        generatePdfCancel: true
      }

    case GENERATE_PDF_TOGGLE_CANCEL:
      return {
        ...state,
        sessionId: '',
        activePdflist: [],
        requestGeneratePdf: [],
        generatePdfSuccess: [],
        generatePdfCancel: false,
        generatePdfCounter: 0,
        downloadPercentage: 0
      }

    case GENERATE_PDF_FAILED:
      return {
        ...state,
        generatePdFailed: action.payload
      }

    case GENERATE_PDF_COUNTER: {
      let generatePdfCounter = state.generatePdfCounter + 1
      let percentage =  (100 * generatePdfCounter) / (state.activePdflist.length * state.formEntries.selectedEntryIds.length)

      return {
        ...state,
        generatePdfCounter: generatePdfCounter,
        downloadPercentage: Math.round(percentage)
      }
    }

    case GENERATE_PDF_SUCCESS_INTERVAL: {
      const list = state.generatePdfSuccess
      list.splice(0, action.payload)

      return {
        ...state,
        generatePdfSuccess: list
      }
    }

    case DOWNLOAD_ZIP_SUCCESS:
      return {
        ...state,
        downloadZipUrl: action.payload
      }

    case DOWNLOAD_ZIP_FAILED:
      return {
        ...state,
        downloadZipUrl: action.payload
      }

    case RESET_PDF_STATE: {
      const list = []

      state.pdfList.map(item => {
        item.active = false
        list.push(item)
      })

      return {
        sessionId: '',
        modal: false,
        pdfList: list,
        activePdflist: [],
        formEntries: {
          ...state.formEntries
        },
        requestGeneratePdf: [],
        generatePdfSuccess: [],
        generatePdfCancel: false,
        generatePdFailed: '',
        generatePdfCounter: 0,
        downloadPercentage: 0,
        downloadZipUrl: ''
      }
    }
  }

  return state
}

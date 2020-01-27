import {
  TOGGLE_PDF_STATUS,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY,
  GENERATE_ACTIVE_PDF_LIST,
  GET_SESSION_ID,
  GET_SESSION_ID_SUCCESS,
  GET_GENERATE_PDF,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_COUNTER,
  GENERATE_DOWNLOAD_PERCENTAGE,
  GET_DOWNLOAD_ZIP,
  GET_DOWNLOAD_ZIP_SUCCESS,
  TOGGLE_POPUP_SELECT_ALL_ENTRIES,
  GET_ALL_FORM_ENTRIES,
  GET_ALL_FORM_ENTRIES_SUCCESS,
  GENERATE_PDF_ZIP, GET_FORM_DATA,
  SELECT_DOWNLOAD_PDF,
  DESELECT_DOWNLOAD_PDF,
  TOGGLE_MODAL,
  RESET_PDF_STATE
} from '../actionTypes/pdf'

export const initialState = {
  sessionID: null,
  formActions: {
    topBulkDownloadPdfSelected: false,
    bottomBulkDownloadPdfSelected: false
  },
  modal: false,
  list: [],
  activePDFlist: [],
  formEntries: {
    formID: null,
    selectedAllIDs: false,
    popupSelectAllEntries: false,
    selectedEntryIDs: []
  },
  requestDownloadList: [],
  generatePdfSuccess: [],
  generatePdfCounter: 0,
  downloadPercentage: 0,
  downloadZipUrl: null
}

export default function (state = initialState, action) {

  switch (action.type) {

    case TOGGLE_PDF_STATUS: {
      const newState = {
        ...state,
        list: [...state.list]
      }

      newState.list[action.payload]['active'] = !newState.list[action.payload]['active']

      return newState
    }

    case SELECT_DOWNLOAD_PDF: {
      if (action.payload === 'bulk-action-selector-top') {
        return {
          ...state,
          formActions: {
            ...state.formActions,
            topBulkDownloadPdfSelected: true
          }
        }
      } else {
        return {
          ...state,
          formActions: {
            ...state.formActions,
            bottomBulkDownloadPdfSelected: true
          }
        }
      }
    }

    case DESELECT_DOWNLOAD_PDF: {
      if (action.payload === 'bulk-action-selector-top') {
        return {
          ...state,
          formActions: {
            ...state.formActions,
            topBulkDownloadPdfSelected: false
          }
        }
      } else {
        return {
          ...state,
          formActions: {
            ...state.formActions,
            bottomBulkDownloadPdfSelected: false
          }
        }
      }
    }

    case TOGGLE_MODAL: {
      // if (state.formEntries.selectedEntryIDs.length > 0) {
      //   return {
      //     ...state,
      //     modal: true
      //   }
      // }
      //
      // return {
      //   ...state
      // }
      return {
        ...state,
        modal: !state.modal
      }
    }

    case GET_FORM_DATA: {
      const formId = action.payload.form_id
      const list = []

      Object.entries(action.payload.pdfs).map(item => {
        list.push({ id: item[0], name: item[1].name, templateSelected: item[1].template, active: false })
      })

      return {
        ...state,
        list,
        formEntries: {
          ...state.formEntries,
          formID: formId
        }
      }
    }

    case SINGLE_CHECKBOX_ENTRY: {
      let entries = state.formEntries.selectedEntryIDs
      const entry = action.id
      const totalEntries = action.totalEntries

      if (entries.includes(entry)) {
        const list = entries.filter(item => item !== entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: false,
            selectedEntryIDs: list
          }
        }
      } else if (entries.length === (totalEntries- 1)) {
        entries.push(entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: true,
            selectedEntryIDs: entries
          }
        }
      } else {
        entries.push(entry)

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: false,
            selectedEntryIDs: entries
          }
        }
      }
    }

    case ALL_CHECKBOX_ENTRY: {
      let ids = state.formEntries.selectedEntryIDs

      if (ids.length > 0 && state.formEntries.selectedAllIDs) {
        ids = []

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: false,
            popupSelectAllEntries: false,
            selectedEntryIDs: ids
          }
        }
      } else {
        ids = action.payload

        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: true,
            selectedEntryIDs: ids
          }
        }
      }
    }

    case GENERATE_ACTIVE_PDF_LIST:
      return {
        ...state,
        activePDFlist: action.payload
      }

    case GET_SESSION_ID:
      return {
        ...state
      }

    case GET_SESSION_ID_SUCCESS:
      return {
        ...state,
        sessionID: action.payload
      }

    case GET_GENERATE_PDF: {
      const list = []
      const { sessionID, selectedEntryIDs, activePDFlist } = action.payload

      selectedEntryIDs.map(id => {
        activePDFlist.map(item => {
          list.push({ sessionId: sessionID, entryId: id, pdfId: item })
        })
      })

      return {
        ...state,
        requestDownloadList: list
      }
    }

    case GENERATE_PDF_SUCCESS: {
      const list = state.generatePdfSuccess

      list.push(action.payload)

      return {
        ...state,
        generatePdfSuccess: list
      }
    }

    case GENERATE_PDF_COUNTER: {
      return {
        ...state,
        generatePdfCounter: state.generatePdfCounter + 1
      }
    }

    case GENERATE_DOWNLOAD_PERCENTAGE: {
      let percentage =  (100 * action.payload) / state.requestDownloadList.length

      return {
        ...state,
        downloadPercentage: Math.round(percentage)
      }
    }

    case GET_DOWNLOAD_ZIP:
      return {
        ...state
      }

    case GET_DOWNLOAD_ZIP_SUCCESS:
      return {
        ...state,
        downloadZipUrl: action.payload
      }

    case TOGGLE_POPUP_SELECT_ALL_ENTRIES: {
      if (state.formEntries.popupSelectAllEntries) {
        return {
          ...state,
          formEntries: {
            ...state.formEntries,
            selectedAllIDs: false,
            popupSelectAllEntries: !state.formEntries.popupSelectAllEntries,
            selectedEntryIDs: []
          }
        }
      }

      return {
        ...state,
        formEntries: {
          ...state.formEntries,
          popupSelectAllEntries: !state.formEntries.popupSelectAllEntries
        }
      }
    }

    case GET_ALL_FORM_ENTRIES:
      return {
        ...state,
      }

    case GET_ALL_FORM_ENTRIES_SUCCESS:
      return {
        ...state,
        formEntries: {
          ...state.formEntries,
          selectedEntryIDs: action.payload
        }
      }

    case GENERATE_PDF_ZIP:
      return {
        ...state
      }

    case RESET_PDF_STATE: {
      const list = []
      state.list.map(item => {
        item.active = false
        list.push(item)
      })

      return {
        ...state,
        sessionID: null,
        list,
        activePDFlist: [],
        requestDownloadList: [],
        generatePdfCounter: 0,
        downloadPercentage: 0,
        downloadZipUrl: null
      }
    }
  }

  return state
}

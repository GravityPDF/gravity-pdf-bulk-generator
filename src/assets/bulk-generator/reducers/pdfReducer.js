import {
  TOGGLE_PDF_STATUS,
  DOWNLOAD_PDF_SELECTED,
  HANDLE_MODAL,
  DISABLE_MODAL,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY,
  REQUEST_FORM_PDF_ID
} from '../actionTypes/pdf'

export const initialState = {
  downloadPDFSelected: false,
  modal: false,
  list: [
    { id: '123412425', label: 'Certificate of Completion', active: false },
    { id: '123412425', label: 'USA Government W4', active: false },
    { id: '123412425', label: 'User Invoice', active: false },
    { id: '123412425', label: 'Summary', active: false },
  ],
  form: {
    pdfID: null,
    selectedAllIDs: false,
    entriesID: []
  }
}

export default function (state = initialState, action) {

  switch (action.type) {

    case TOGGLE_PDF_STATUS: {
      const newState = {
        ...state,
        list: [...state.list]
      }

      newState.list[action.index]['active'] = !newState.list[action.index]['active']

      return newState
    }

    case DOWNLOAD_PDF_SELECTED:
      return {
        ...state,
        downloadPDFSelected: true
      }

    case HANDLE_MODAL: {
      if (state.form.entriesID.length > 0) {
        return {
          ...state,
          modal: true
        }
      }

      return {
        ...state
      }
    }

    case DISABLE_MODAL:
      return {
        ...state,
        modal: false
      }

    case REQUEST_FORM_PDF_ID:
      return {
        ...state,
        form: {
          ...state.form,
          pdfID: action.payload
        }
      }

    case SINGLE_CHECKBOX_ENTRY: {
      let entries = state.form.entriesID

      const entry = action.id
      const totalEntries = action.totalEntries

      if (entries.includes(entry)) {
        const list = entries.filter(item => item !== entry)

        return {
          ...state,
          form: {
            ...state.form,
            selectedAllIDs: false,
            entriesID: list
          }
        }
      } else if (entries.length === (totalEntries- 1)) {
        entries.push(entry)

        return {
          ...state,
          form: {
            ...state.form,
            selectedAllIDs: true,
            entriesID: entries
          }
        }
      } else {
        entries.push(entry)

        return {
          ...state,
          form: {
            ...state.form,
            selectedAllIDs: false,
            entriesID: entries
          }
        }
      }
    }

    case ALL_CHECKBOX_ENTRY: {
      let ids = state.form.entriesID

      if (ids.length > 0 && state.form.selectedAllIDs) {
        ids = []

        return {
          ...state,
          form: {
            ...state.form,
            selectedAllIDs: false,
            entriesID: ids
          }
        }
      } else {
        ids = action.payload

        return {
          ...state,
          form: {
            ...state.form,
            selectedAllIDs: true,
            entriesID: ids
          }
        }
      }
    }
  }

  return state
}

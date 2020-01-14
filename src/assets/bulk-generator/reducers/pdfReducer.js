import {
  TOGGLE_PDF_STATUS,
  DOWNLOAD_PDF_SELECTED,
  HANDLE_MODAL,
  DISABLE_MODAL,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY
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
  forms: {
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

    case HANDLE_MODAL:
      return {
        ...state,
        modal: true
      }

    case DISABLE_MODAL:
      return {
        ...state,
        modal: false
      }

    case SINGLE_CHECKBOX_ENTRY: {
      let entries = state.forms.entriesID

      const entry = action.id
      const totalEntries = action.totalEntries

      if (entries.includes(entry)) {
        const list = entries.filter(item => item !== entry)

        return {
          ...state,
          forms: {
            ...state.forms,
            selectedAllIDs: false,
            entriesID: list
          }
        }
      } else if (entries.length === (totalEntries- 1)) {
        entries.push(entry)

        return {
          ...state,
          forms: {
            ...state.forms,
            selectedAllIDs: true,
            entriesID: entries
          }
        }
      } else {
        entries.push(entry)

        return {
          ...state,
          forms: {
            ...state.forms,
            selectedAllIDs: false,
            entriesID: entries
          }
        }
      }
    }

    case ALL_CHECKBOX_ENTRY: {
      let ids = state.forms.entriesID

      if (ids.length > 0 && state.forms.selectedAllIDs) {
        ids = []

        return {
          ...state,
          forms: {
            ...state.forms,
            selectedAllIDs: false,
            entriesID: ids
          }
        }
      } else {
        ids = action.payload

        return {
          ...state,
          forms: {
            ...state.forms,
            selectedAllIDs: true,
            entriesID: ids
          }
        }
      }
    }
  }

  return state
}

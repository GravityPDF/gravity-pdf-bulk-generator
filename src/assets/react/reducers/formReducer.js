import {
  PROCESS_CHECKBOX,
  GET_SELECTED_ENTRY_IDS_SUCCESS,
  GET_SELECTED_ENTRY_IDS_FAILED
} from '../actionTypes/form'

export const initialState = {
  selectedEntryIds: [],
  selectedEntryIdsError: ''
}

export default function (state = initialState, action) {

  switch (action.type) {

    case PROCESS_CHECKBOX: {
      const ids = action.payload
      let entryIds = []

      ids.forEach(id => {
        if (id.type === 'checkbox' && id.checked) {
          entryIds.push(id.value)
        }
      })

      return {
        ...state,
        selectedEntryIds: entryIds
      }
    }

    case GET_SELECTED_ENTRY_IDS_SUCCESS:
      return {
        ...state,
        selectedEntryIds: action.payload
      }

    case GET_SELECTED_ENTRY_IDS_FAILED:
      return {
        ...state,
        selectedEntryIdsError: action.payload
      }
  }

  return state
}

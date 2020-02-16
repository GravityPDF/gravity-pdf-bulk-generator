import {
  PROCESS_CHECKBOX,
  GET_SELECTED_ENTRY_IDS
} from '../actionTypes/form'

export const processCheckbox = ids => {
  return {
    type: PROCESS_CHECKBOX,
    payload: ids
  }
}

export const getSelectedEntryIds = (formId, filterData) => {
  return {
    type: GET_SELECTED_ENTRY_IDS,
    formId,
    filterData
  }
}

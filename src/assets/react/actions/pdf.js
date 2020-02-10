import {
  GET_FORM_DATA,
  TOGGLE_MODAL,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY,
  TOGGLE_POPUP_SELECT_ALL_ENTRIES,
  GET_ALL_FORM_ENTRIES,
  TOGGLE_PDF_STATUS,
  GENERATE_ACTIVE_PDF_LIST,
  GET_SESSION_ID,
  GENERATE_PDF_CANCEL,
  DOWNLOAD_ZIP,
  RESET_PDF_STATE
} from '../actionTypes/pdf'

export const getFormData = data => {
  return {
    type: GET_FORM_DATA,
    payload: data
  }
}

export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL
  }
}

export const singleCheckboxEntry = (id, totalEntries) => {
  return {
    type: SINGLE_CHECKBOX_ENTRY,
    id,
    totalEntries
  }
}

export const allCheckboxEntry = ids => {
  return {
    type: ALL_CHECKBOX_ENTRY,
    payload: ids
  }
}

export const togglePopupSelectAllEntries = () => {
  return {
    type: TOGGLE_POPUP_SELECT_ALL_ENTRIES
  }
}

export const getAllFormEntries = (formId, filterData) => {
  return {
    type: GET_ALL_FORM_ENTRIES,
    formId,
    filterData
  }
}

export const togglePdfStatus = index => {
  return {
    type: TOGGLE_PDF_STATUS,
    payload: index
  }
}

export const generateActivePdfList = list => {
  return {
    type: GENERATE_ACTIVE_PDF_LIST,
    payload: list
  }
}

export const getSessionId = (path, concurrency) => {
  return {
    type: GET_SESSION_ID,
    path,
    concurrency
  }
}

export const generatePdfCancel = () => {
  return {
    type: GENERATE_PDF_CANCEL
  }
}

export const getDownloadZip = () => {
  return {
    type: DOWNLOAD_ZIP
  }
}

export const resetPdfState = () => {
  return {
    type: RESET_PDF_STATE
  }
}

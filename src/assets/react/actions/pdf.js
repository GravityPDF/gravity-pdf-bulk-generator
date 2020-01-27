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

export const togglePdfStatus = index => {
  return {
    type: TOGGLE_PDF_STATUS,
    payload: index
  }
}

export const selectDownloadPdf = id => {
  return {
    type: SELECT_DOWNLOAD_PDF,
    payload: id
  }
}

export const deSelectDownloadPdf = id => {
  return {
    type: DESELECT_DOWNLOAD_PDF,
    payload: id
  }
}

export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL
  }
}

export const getFormData = data => {
  return {
    type: GET_FORM_DATA,
    payload: data
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

export const generateActivePDFlist = list => {
  return {
    type: GENERATE_ACTIVE_PDF_LIST,
    payload: list
  }
}

export const getSessionID = data => {
  return {
    type: GET_SESSION_ID,
    payload: data
  }
}

export const getSessionIdSuccess = id => {
  return {
    type: GET_SESSION_ID_SUCCESS,
    payload: id
  }
}

export const getGeneratePdf = data => {
  return {
    type: GET_GENERATE_PDF,
    payload: data
  }
}

export const generatePdfSuccess = data => {
  return {
    type: GENERATE_PDF_SUCCESS,
    payload: data
  }
}

export const generatePdfCounter = () => {
  return {
    type: GENERATE_PDF_COUNTER
  }
}

export const generateDownloadPercentage = value => {
  return {
    type: GENERATE_DOWNLOAD_PERCENTAGE,
    payload: value
  }
}

export const getDownloadZip = sessionID => {
  return {
    type: GET_DOWNLOAD_ZIP,
    payload: sessionID
  }
}

export const getDownloadZipSuccess = url => {
  return {
    type: GET_DOWNLOAD_ZIP_SUCCESS,
    payload: url
  }
}

export const togglePopupSelectAllEntries = () => {
  return {
    type: TOGGLE_POPUP_SELECT_ALL_ENTRIES
  }
}

export const getAllFormEntries = formId => {
  return {
    type: GET_ALL_FORM_ENTRIES,
    payload: formId
  }
}

export const getAllFormEntriesSuccess = ids => {
  return {
    type: GET_ALL_FORM_ENTRIES_SUCCESS,
    payload: ids
  }
}

export const generatePdfZip = sessionId => {
  return {
    type: GENERATE_PDF_ZIP,
    payload: sessionId
  }
}

export const resetPdfState = () => {
  return {
    type: RESET_PDF_STATE
  }
}

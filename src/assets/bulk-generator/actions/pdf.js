import {
  TOGGLE_PDF_STATUS,
  DOWNLOAD_PDF_SELECTED,
  HANDLE_MODAL,
  DISABLE_MODAL,
  SINGLE_CHECKBOX_ENTRY,
  ALL_CHECKBOX_ENTRY,
  REQUEST_FORM_PDF_ID
} from '../actionTypes/pdf'

export const togglePdfStatus = index => {
  return {
    type: TOGGLE_PDF_STATUS,
    index
  }
}

export const downloadPDFSelected = () => {
  return {
    type: DOWNLOAD_PDF_SELECTED
  }
}

export const handleModal = () => {
  return {
    type: HANDLE_MODAL
  }
}

export const disableModal = () => {
  return {
    type: DISABLE_MODAL
  }
}

export const requestFormPdfId = id => {
  return {
    type: REQUEST_FORM_PDF_ID,
    payload: id
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

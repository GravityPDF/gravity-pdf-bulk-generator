import {
  GENERATE_PDF_LIST_SUCCESS,
  TOGGLE_MODAL,
  ESCAPE_CLOSE_MODAL,
  TOGGLE_PDF_STATUS,
  GENERATE_SESSION_ID,
  GENERATE_PDF_CANCEL,
  RESET_PDF_STATE
} from '../actionTypes/pdf'

export const generatePdfListSuccess = data => {
  return {
    type: GENERATE_PDF_LIST_SUCCESS,
    payload: data
  }
}

export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL
  }
}

export const escapeCloseModal = () => {
  return {
    type: ESCAPE_CLOSE_MODAL
  }
}

export const togglePdfStatus = index => {
  return {
    type: TOGGLE_PDF_STATUS,
    payload: index
  }
}

export const generateSessionId = (path, concurrency, retryInterval, delayInterval) => {
  return {
    type: GENERATE_SESSION_ID,
    path,
    concurrency,
    retryInterval,
    delayInterval
  }
}

export const generatePdfCancel = () => {
  return {
    type: GENERATE_PDF_CANCEL
  }
}

export const resetPdfState = () => {
  return {
    type: RESET_PDF_STATE
  }
}

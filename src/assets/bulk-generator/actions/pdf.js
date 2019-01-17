import {
  TOGGLE_PDF_STATUS
} from '../actionTypes/pdf'

export const togglePdfStatus = (index) => {
  return {
    type: TOGGLE_PDF_STATUS,
    index
  }
}
/* Dependencies */
import { call, cancel, cancelled, delay, fork, put, retry, select, take, takeLatest } from 'redux-saga/effects'
/* Redux Action Types */
import {
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_PDF,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_FAILED,
  GENERATE_SESSION_ID_SUCCESS,
  STORE_ABORT_CONTROLLER
} from '../actionTypes/pdf'
/* APIs */
import {
  apiRequestDownloadZipFile,
  apiRequestGeneratePdf,
  apiRequestGeneratePdfZip,
  apiRequestSessionId
} from '../api/pdf'
/* Helpers */
import { generateActivePdfList } from '../helpers/generateActivePdfList'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Selectors */
export const getStateSelectedEntryIds = state => state.form.selectedEntryIds
export const getStatePdfList = state => state.pdf.pdfList
export const getStateGeneratePdfcancel = state => state.pdf.generatePdfCancel
export const getStateAbortControllers = state => state.pdf.abortControllers
export const getStateDownloadZipUrl = state => state.pdf.downloadZipUrl

export function * generateSessionId (payload) {

  try {
    const response = yield retry(3, 3000, apiRequestSessionId, payload)

    if(!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GENERATE_SESSION_ID_SUCCESS, payload: responseBody.sessionId })

    const selectedEntryIds = yield select(getStateSelectedEntryIds)
    const pdfList = yield select(getStatePdfList)

    // Remove 'Toggle All' in the list before processing if exists
    if (pdfList[0]['id'] === '0') {
      pdfList.shift()
    }

    yield put({
      type: GENERATE_PDF,
      payload: {
        sessionId: responseBody.sessionId,
        concurrency: payload.concurrency,
        selectedEntryIds,
        pdfList
      }
    })
  } catch (error) {
    yield put({ type: GENERATE_SESSION_ID_FAILED, payload: 'Error occured. Something went wrong..' })
  }
}

export function * watchGenerateSessionId () {
  yield takeLatest(GENERATE_SESSION_ID, generateSessionId)
}

export function * requestGeneratePdf (pdf) {
  /* Cancelling a fetch request with AbortController */
  const abortController = new AbortController()
  const data = {
    pdf,
    signal: abortController.signal
  }

  yield put({ type: STORE_ABORT_CONTROLLER, payload: abortController })

  try {
    const response = yield retry(3, 3000, apiRequestGeneratePdf, data)

    if(!response.ok) {
      throw response
    }

    yield put({ type: GENERATE_PDF_SUCCESS, payload: pdf })
  } catch (error) {

    switch (error.status) {
      // WIP - still need to integrate remaining status codes from the original plan
      case 400:
        yield put({ type: GENERATE_PDF_WARNING, payload: pdf })
        break

      case 412:
        yield put({ type: GENERATE_PDF_WARNING, payload: pdf })
        break

      default:
        yield put({ type: GENERATE_PDF_FAILED, payload: pdf })
    }
  } finally {
    if (!(yield cancelled())) {
      yield put({ type: GENERATE_PDF_COUNTER, payload: yield select(getStateSelectedEntryIds) })
    }
  }
}

export function * generatePdf ({ pdfs }) {

  for (let i = 0; i < pdfs.length; i++) {
    yield fork(requestGeneratePdf, pdfs[i])
  }

  yield delay(1000)
}

export function * generateDownloadZipUrl (sessionId) {
  try {
    const response = yield retry(3, 1000, apiRequestGeneratePdfZip, sessionId)
    const responseBody = yield response.json()

    if (!response.ok || !responseBody.downloadUrl) {
      throw response
    }

    yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl })
  } catch (error) {
    // To DO
  }
}

export function * validateDownloadZipUrl() {
  try {
    const downloadZipUrl = yield select(getStateDownloadZipUrl)
    const response = yield call(apiRequestDownloadZipFile, downloadZipUrl)

    if (!response.ok) {
      throw response
    }

    //TODO
    //yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl })
  } catch(error) {
    /* todo fatal error */
  }
}

export function * watchGeneratePDF () {
  while (true) {
    const { payload } = yield take(GENERATE_PDF)
    let pdfs = []

    const {
      sessionId,
      concurrency,
      selectedEntryIds,
      pdfList
    } = payload

    const activePdfList = generateActivePdfList(pdfList)

    selectedEntryIds.map(id => {
      activePdfList.map(item => {
        pdfs.push({ sessionId, entryId: id, pdfId: item.id, pdfName: item.name })
      })
    })

    const generator = yield fork(bulkGeneratePdf, {pdfs, concurrency, sessionId})

    yield take(GENERATE_PDF_CANCEL)

    yield generatePdfCancel()
    yield cancel(generator)
  }
}

export function * bulkGeneratePdf( { pdfs, concurrency, sessionId }) {
  while (pdfs.length > 0 ) {
    yield generatePdf({
      pdfs: pdfs.splice(0, concurrency)
    })

    /* Generate download zip url every end of the process (batch of 5)  */
    yield generateDownloadZipUrl(sessionId)
  }

  yield validateDownloadZipUrl()
}

export function * generatePdfCancel () {
  const abortControllers = yield select(getStateAbortControllers)

  abortControllers.map(abortController => {
    abortController.abort()
  })
}
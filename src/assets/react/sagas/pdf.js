/* Dependencies */
import { cancel, delay, fork, put, retry, select, take, takeLatest } from 'redux-saga/effects'

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
import { apiRequestGeneratePdf, apiRequestGeneratePdfZip, apiRequestSessionId } from '../api/pdf'

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

export function * checkGeneratePdfCancel () {
  return yield select(getStateGeneratePdfcancel)
}

export function * requestGeneratePdf (listItem) {
  /* Cancelling a fetch request with AbortController */
  const abortController = new AbortController()
  const data = {
    listItem,
    signal: abortController.signal
  }

  yield put({ type: STORE_ABORT_CONTROLLER, payload: abortController })

  try {
    const response = yield retry(3, 3000, apiRequestGeneratePdf, data)

    if(!response.ok) {
      throw response
    }

    yield put({ type: GENERATE_PDF_SUCCESS, payload: listItem, sessionId: listItem.sessionId })
  } catch (error) {

    switch (error.status) {
      // WIP - still need to integrate remaining status codes from the original plan
      case 400:
        yield put({ type: GENERATE_PDF_WARNING, payload: listItem, sessionId: listItem.sessionId })
        break

      case 412:
        yield put({ type: GENERATE_PDF_WARNING, payload: listItem, sessionId: listItem.sessionId })
        break

      default:
        yield put({ type: GENERATE_PDF_FAILED, payload: listItem, sessionId: listItem.sessionId })
    }
  } finally {
      const selectedEntryIds = yield select(getStateSelectedEntryIds)

      yield put({ type: GENERATE_PDF_COUNTER, payload: selectedEntryIds, sessionId: listItem.sessionId })
  }
}

export function * generatePdf ({ payload }) {
  let { list, sessionId } = payload

  for (let i = 0; i < list.length; i++) {
    const task = yield fork(requestGeneratePdf, list[i])

    if (yield checkGeneratePdfCancel()) {
      return yield cancel(task)
    }
  }

  if( yield checkGeneratePdfCancel() ) {
    return
  }

  yield delay(1000)
}

export function * watchGeneratePDF () {
  while (true) {
    const { payload } = yield take(GENERATE_PDF)
    let generatePdfList = []

    const {
      sessionId,
      concurrency,
      selectedEntryIds,
      pdfList
    } = payload
    const activePdfList = generateActivePdfList(pdfList)

    selectedEntryIds.map(id => {
      activePdfList.map(item => {
        generatePdfList.push({ sessionId, entryId: id, pdfId: item.id, pdfName: item.name })
      })
    })

    while (generatePdfList.length > 0 && !(yield checkGeneratePdfCancel())) {
      yield generatePdf({
        payload: {
          list: generatePdfList.splice(0, concurrency),
          sessionId,
        }
      })

      try {
        const response = yield retry(3, 3000, apiRequestGeneratePdfZip, sessionId)
        const responseBody = yield response.json()

        if (!response.ok || !responseBody.downloadUrl) {
          throw response
        }

        yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl, sessionId: sessionId })
      } catch (error) {
        // To DO
      }
    }
  }
}

export function * generatePdfCancel () {
  const abortControllers = yield select(getStateAbortControllers)

  abortControllers.map(abortController => {
    abortController.abort()
  })
}

export function * watchGeneratePdfCancel () {
  yield takeLatest(GENERATE_PDF_CANCEL, generatePdfCancel)
}

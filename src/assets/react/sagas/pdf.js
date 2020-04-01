/* Dependencies */
import { cancel, cancelled, delay, fork, put, retry, select, take, takeLatest } from 'redux-saga/effects'
import Downloader from 'js-file-downloader'

/* Redux Action Types */
import {
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_PDF,
  GENERATE_PDF_CANCELLED,
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_FAILED,
  GENERATE_SESSION_ID_SUCCESS,
  REQUEST_DOWNLOAD_ZIP
} from '../actionTypes/pdf'
import { DOWNLOAD_ZIP_ATTEMPT } from '../actionTypes/logs'

/* APIs */
import {
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
        retryInterval: payload.retryInterval,
        delayInterval: payload.delayInterval,
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

export function * requestGeneratePdf (listItem, retryInterval, delayInterval) {
  // Cancelling a fetch request with AbortController
  const abortController = new AbortController()
  const data = {
    listItem,
    signal: abortController.signal
  }

  try {
    const response = yield retry(retryInterval, delayInterval, apiRequestGeneratePdf, data)

    if(!response.ok) {
      throw response
    }

    yield put({ type: GENERATE_PDF_SUCCESS, payload: listItem })
  } catch (error) {
    switch (error.status) {
      // WIP - still need to integrate remaining status codes from the original plan
      case 400:
        yield put({ type: GENERATE_PDF_WARNING, payload: listItem })
        break

      case 412:
        yield put({ type: GENERATE_PDF_WARNING, payload: listItem })
        break

      default:
        yield put({ type: GENERATE_PDF_FAILED, payload: listItem })
    }
  } finally {
    if (yield(cancelled())) {
      abortController.abort()

      yield put({ type: GENERATE_PDF_CANCELLED })
    } else {
      const selectedEntryIds = yield select(getStateSelectedEntryIds)

      yield put({ type: GENERATE_PDF_COUNTER, payload: selectedEntryIds })
    }
  }
}

export function * generatePdf ({ payload }) {
  const { list, sessionId, retryInterval, delayInterval } = payload
  const generatePdfCancel = yield select(getStateGeneratePdfcancel)

  for (let i = 0; i < list.length; i++) {
    const task = yield fork(requestGeneratePdf, list[i], retryInterval, delayInterval)

    // Triggered by StepTwo cancel button
    if (generatePdfCancel) {
      return yield cancel(task)
    }
  }

  yield delay(1000)

  try {
    const response = yield retry(3, 3000, apiRequestGeneratePdfZip, sessionId)
    const responseBody = yield response.json()

    if (!response.ok || !responseBody.downloadUrl) {
      throw response
    }

    yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl })
  } catch (error) {
    // To DO
  }
}

export function * watchGeneratePDF () {
  let generatePdfList = []

  while (true) {
    const { payload } = yield take(GENERATE_PDF)
    const {
      sessionId,
      concurrency,
      retryInterval,
      delayInterval,
      selectedEntryIds,
      pdfList
    } = payload
    const activePdfList = generateActivePdfList(pdfList)

    selectedEntryIds.map(id => {
      activePdfList.map(item => {
        generatePdfList.push({ sessionId, entryId: id, pdfId: item.id, pdfName: item.name })
      })
    })

    while (generatePdfList.length > 0) {
      yield generatePdf({
        payload: {
          list: generatePdfList.splice(0, concurrency),
          sessionId,
          retryInterval,
          delayInterval
        }
      })
    }
  }
}

export function * requestDownloadZip ({ payload }) {
  try {
    yield new Downloader({
      url: payload
    })

    // Called when download ended
  } catch(error) {
    // Called when an error occurred
    yield put({ type: DOWNLOAD_ZIP_ATTEMPT })
  }
}

export function * watchRequestDownloadZip () {
  yield takeLatest(REQUEST_DOWNLOAD_ZIP, requestDownloadZip)
}

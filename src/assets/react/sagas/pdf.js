import {
  call,
  cancel,
  cancelled,
  delay,
  fork,
  take,
  takeLatest,
  put,
  retry,
  select
} from 'redux-saga/effects'
import {
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_SUCCESS,
  GENERATE_SESSION_ID_FAILED,
  GENERATE_PDF,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_TOGGLE_CANCEL,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_COUNTER,
  GENERATE_DOWNLOAD_ZIP_URL
} from '../actionTypes/pdf'
import {
  apiRequestSessionId,
  apiRequestGeneratePdf,
  apiRequestGeneratePdfZip
} from '../api/pdf'
import { generateActivePdfList } from '../helpers/generateActivePdfList'

// Selectors
export const getStateSelectedEntryIds = state => state.form.selectedEntryIds
export const getStatePdfList = state => state.pdf.pdfList
export const getStateGeneratePdfcancel = state => state.pdf.generatePdfCancel

export function * generateSessionId (payload) {
  try {
    const result = yield call(apiRequestSessionId, payload)

    yield put({ type: GENERATE_SESSION_ID_SUCCESS, payload: result.sessionId })

    const selectedEntryIds = yield select(getStateSelectedEntryIds)
    const pdfList = yield select(getStatePdfList)

    // Remove 'Toggle All' in the list before processing if exists
    if (pdfList[0]['id'] === '0') {
      pdfList.shift()
    }

    yield put({
      type: GENERATE_PDF,
      payload: {
        sessionId: result.sessionId,
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
    yield retry(retryInterval, delayInterval, apiRequestGeneratePdf, data)

    yield put({ type: GENERATE_PDF_SUCCESS, listItem })
  } catch (error) {
    yield put({ type: GENERATE_PDF_FAILED, listItem })
  } finally {
    if (yield(cancelled())) {
      abortController.abort()

      yield put({ type: GENERATE_PDF_TOGGLE_CANCEL })
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

  const result = yield retry(3, 3000, apiRequestGeneratePdfZip, sessionId)

  yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: result.downloadUrl })
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
        generatePdfList.push({ sessionId, entryId: id, pdfId: item })
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

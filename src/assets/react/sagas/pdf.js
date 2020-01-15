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
  GET_SESSION_ID,
  GET_SESSION_ID_SUCCESS,
  GET_SESSION_ID_FAILED,
  GET_ALL_FORM_ENTRIES,
  GET_ALL_FORM_ENTRIES_SUCCESS,
  GET_ALL_FORM_ENTRIES_FAILED,
  GENERATE_PDF,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_TOGGLE_CANCEL,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_COUNTER,
  DOWNLOAD_ZIP,
  DOWNLOAD_ZIP_SUCCESS,
  DOWNLOAD_ZIP_FAILED
} from '../actionTypes/pdf'
import {
  apiRequestSessionId,
  apiRequestGeneratePdf,
  apiRequestDownloadZip,
  apiRequestAllEntriesId,
  apiRequestGeneratePdfZip
} from '../api/pdf'

// Selectors
export const getStateRequestGeneratePdf = state => state.pdf.requestGeneratePdf
export const getStateGeneratePdfcancel = state => state.pdf.generatePdfCancel
export const getStateSessionId = state => state.pdf.sessionId

export function* getSessionId(payload) {
  try {
    const result = yield call(apiRequestSessionId, payload)

    yield put({ type: GET_SESSION_ID_SUCCESS, payload: result.sessionId })

    const requestGeneratePdf = yield select(getStateRequestGeneratePdf)

    yield put({ type: GENERATE_PDF, payload: requestGeneratePdf })
  } catch (error) {
    console.log('Saga getSessionId error - ', error)
    yield put({ type: GET_SESSION_ID_FAILED, payload: '' })
  }
}

export function* watchGetSessionId() {
  yield takeLatest(GET_SESSION_ID, getSessionId)
}

export function * getAllFormEntries(payload) {
  try {
    const result = yield call(apiRequestAllEntriesId, payload)

    yield put({ type: GET_ALL_FORM_ENTRIES_SUCCESS, payload: result })
  } catch (error) {
    console.log('Saga getAllFormEntries - ', error)
    yield put({ type: GET_ALL_FORM_ENTRIES_FAILED, payload: 'Error occured. Something went wrong..' })
  }
}

export function* watchGetAllFormEntries() {
  yield takeLatest(GET_ALL_FORM_ENTRIES, getAllFormEntries)
}

export function* requestGeneratePdf(payload) {
  // Cancelling a fetch request with AbortController
  const abortController = new AbortController()
  const data = {
    payload,
    signal: abortController.signal
  }

  try {
    yield retry(3, 3000, apiRequestGeneratePdf, data)

    yield put({ type: GENERATE_PDF_SUCCESS, payload })
  } catch (error) {
    yield put({ type: GENERATE_PDF_FAILED, payload: 'Error occured. Something went wrong..' })
  } finally {
    if (yield(cancelled())) {
      abortController.abort()

      yield put({ type: GENERATE_PDF_TOGGLE_CANCEL })
    } else {
      yield put({ type: GENERATE_PDF_COUNTER })
    }
  }
}

export function* generatePdf(data) {
  const generatePdfCancel = yield select(getStateGeneratePdfcancel)

  for (let i = 0; i < data.payload.length; i++) {
    const task = yield fork(requestGeneratePdf, data.payload[i])

    // Triggered by StepTwo cancel button
    if (generatePdfCancel) {
      return yield cancel(task)
    }
  }

  yield delay(1000)

  yield retry(3, 3000, apiRequestGeneratePdfZip, data.sessionId)
}

export function* watchGeneratePDF() {
  let generatePdfList = []

  while (true) {
    const { payload } = yield take(GENERATE_PDF)
    const { sessionId, selectedEntryIds, activePdflist } = payload

    selectedEntryIds.map(id => {
      activePdflist.map(item => {
        generatePdfList.push({ sessionId: sessionId, entryId: id, pdfId: item })
      })
    })

    while(generatePdfList.length > 0) {
      yield generatePdf({ payload: generatePdfList.splice(0, 5), sessionId })
    }
  }
}

export function* downloadZip() {
  const sessionId = yield select(getStateSessionId)

  try {
    const result = yield call(apiRequestDownloadZip, sessionId)

    yield put({ type: DOWNLOAD_ZIP_SUCCESS, payload: result.url })
  } catch(error) {
    console.log('Saga downloadZip error - ', error)
    yield put({ type: DOWNLOAD_ZIP_FAILED, payload: 'Error occured. Something went wrong..' })
  }
}

export function* watchDownloadZip() {
  yield takeLatest(DOWNLOAD_ZIP, downloadZip)
}

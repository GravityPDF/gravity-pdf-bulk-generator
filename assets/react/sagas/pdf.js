/* Dependencies */
import { call, cancel, cancelled, delay, fork, put, retry, select, take, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
/* Redux Action Types */
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
import {
  FATAL_ERROR,
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_PDF,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_COUNTER,
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_SUCCESS,
  STORE_ABORT_CONTROLLER,
} from '../actionTypes/pdf'
import { GENERATE_PDF_FAILED, GENERATE_PDF_SUCCESS, GENERATE_PDF_WARNING } from '../actionTypes/logs'
/* APIs */
import {
  apiRequestDownloadZipFile,
  apiRequestGeneratePdf,
  apiRequestGeneratePdfZip,
  apiRequestSessionId
} from '../api/pdf'
/* Helpers */
import language from '../helpers/language'
import { sprintf } from 'sprintf-js'
import { constructPdfData } from '../helpers/generateActivePdfList'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Selectors */
export const getStateSelectedEntryIds = state => state.form.selectedEntryIds
export const getStatePdfList = state => state.pdf.pdfList
export const getFatalErrorStatus = state => state.pdf.fatalError
export const getStateAbortControllers = state => state.pdf.abortControllers
export const getStateDownloadZipUrl = state => state.pdf.downloadZipUrl

/**
 * A watcher to trigger Step 1 in the Bulk Generator process
 *
 * @since 1.0
 */
export function * watchGenerateSessionId () {
  yield takeLatest(GENERATE_SESSION_ID, generateSessionId)
}

/**
 * Kick off the Bulk Generator Process, generate a Unique Session ID, collect the user configuration and
 * send to the next step (generating the PDFs).
 *
 * @param payload: object
 *
 * @since 1.0
 */
export function * generateSessionId (payload) {
  const { path, concurrency } = payload

  /* Show modal Step2 */
  yield put(push('/step/2'))

  /* If a fatal error is already thrown, exit early */
  if (yield select(getFatalErrorStatus)) {
    return
  }

  try {
    const response = yield retry(3, 100, apiRequestSessionId, path)
    if (!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GENERATE_SESSION_ID_SUCCESS, payload: responseBody.sessionId })

    const selectedEntryIds = yield select(getStateSelectedEntryIds)
    const pdfList = yield select(getStatePdfList)

    /* Remove 'Toggle All' in the list before processing, if exists */
    if (pdfList[0]['id'] === '0') {
      pdfList.shift()
    }

    yield put({
      type: GENERATE_PDF,
      payload: {
        sessionId: responseBody.sessionId,
        concurrency,
        selectedEntryIds,
        pdfList
      }
    })
  } catch (error) {
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Our top-level saga which handles the pre- and post- logic for step 2 / 3 / 4 and
 * triggers `bulkGeneratePdf` to actually do the Bulk Generator processes.
 *
 * This function prepares the PDF object so it includes the appropriate info for the API and handles
 * cancellations.
 *
 * @since 1.0
 */
export function * watchGeneratePDF () {
  while (true) {
    /* Listen to redux action type GENERATE_PDF event */
    const { payload } = yield take(GENERATE_PDF)
    const { sessionId, concurrency, selectedEntryIds, pdfList } = payload
    const pdfs = constructPdfData(selectedEntryIds, pdfList, sessionId)

    /* Yield fork worker saga bulkGeneratePdf */
    const generator = yield fork(bulkGeneratePdf, {
      pdfs,
      concurrency,
      sessionId
    })

    /* Wait for a cancel event and then handle the cancel logic */
    yield take([GENERATE_PDF_CANCEL, RESET_ALL_STATE])
    yield generatePdfCancel()
    yield cancel(generator)
  }
}

/**
 * Handle Step 2/3/4 of the Bulk Generator Process
 *
 * This function calls other functions which process a fixed number of PDFs at a time,
 * zip up those PDFs and return a valid URL, then validate that URL and send the user on
 * their way to download the valid zip.
 *
 * @param pdfs: array
 * @param concurrency: int
 * @param sessionId: string
 *
 * @since 1.0
 */
export function * bulkGeneratePdf ({ pdfs, concurrency, sessionId }) {
  while (pdfs.length > 0) {
    yield generatePdf({
      pdfs: pdfs.splice(0, concurrency)
    })

    yield generateDownloadZipUrl(sessionId)
  }

  /* Skip validation if fatal error generated */
  if (! (yield select(getFatalErrorStatus))) {
    yield validateDownloadZipUrl()
  }
}


/**
 * Created forked processes that'll handle the individual PDF generation.
 *
 * This is an intermediary step that allows a specific number of requests to be made at one time,
 * determined by how many PDFs are included in the array.
 *
 * @param pdfs: array
 *
 * @since 1.0
 */
export function * generatePdf ({ pdfs }) {
  for (let i = 0; i < pdfs.length; i++) {
    yield fork(requestGeneratePdf, pdfs[i])
  }

  /*
   * Prevent the saga from existing until all forked requests are
   * completed AND the delay time has lapsed.
   */
  yield delay(1000)
}

/**
 * Handle the individual PDF generation for the Bulk Generator. This includes calling our API,
 * handling failures, cancellations, and incrementing the counter (if not cancelled).
 *
 * @param pdf: object
 *
 * @since 1.0
 */
export function * requestGeneratePdf (pdf) {
  /*
   * Prepare the data for our API call. We store the AbortController in the
   * Redux state so we can easily cancel ALL running API calls on demand.
   */
  const abortController = new AbortController()
  const data = {
    pdf,
    signal: abortController.signal
  }

  yield put({ type: STORE_ABORT_CONTROLLER, payload: abortController })

  try {
    const response = yield retry(3, 1000, apiRequestGeneratePdf, data)

    if (!response.ok) {
      throw response
    }

    yield put({
      type: GENERATE_PDF_SUCCESS,
      payload: sprintf( language.successMessage, pdf.pdfName, pdf.pdfId, pdf.entryId )
    })
  } catch (error) {
    switch (error.status) {
      case 400:
        yield put({
          type: GENERATE_PDF_WARNING,
          payload: sprintf( language.skippedMessageInactivePdf, pdf.pdfName, pdf.pdfId, pdf.entryId )
        })
        break

      case 403:
        yield put({
          type: GENERATE_PDF_WARNING,
          payload: sprintf( language.skippedMessageInvalidId, pdf.pdfName, pdf.pdfId, pdf.entryId )
        })
        break

      case 412:
        yield put({
          type: GENERATE_PDF_WARNING,
          payload: sprintf( language.skippedMessageConditionalLogic, pdf.pdfName, pdf.pdfId, pdf.entryId )
        })
        break

      default:
        yield put({
          type: GENERATE_PDF_FAILED,
          payload: sprintf( language.errorMessage, pdf.pdfName, pdf.pdfId, pdf.entryId )
        })
    }
  } finally {
    if (!(yield cancelled())) {
      yield put({ type: GENERATE_PDF_COUNTER, payload: yield select(getStateSelectedEntryIds) })
    }
  }
}

/**
 * Call our API and Zip up the PDFs that have been generated so far. If we don't get a valid response,
 * a fatal error will be triggered.
 *
 * @param sessionId: string
 *
 * @since 1.0
 */
export function * generateDownloadZipUrl (sessionId) {
  try {
    const response = yield retry(3, 500, apiRequestGeneratePdfZip, sessionId)
    const responseBody = yield response.json()

    if (!response.ok || !responseBody.downloadUrl) {
      throw response
    }

    yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl })
  } catch (response) {
    if (response.status >= 500) {
      yield put({ type: FATAL_ERROR })
    }
  }
}

/**
 * Make a HEAD API request to validate that the Zip Download URL is still valid before sending the
 * user on there way to actually download their zip package.
 *
 * @since 1.0
 */
export function * validateDownloadZipUrl () {
  const downloadZipUrl = yield select(getStateDownloadZipUrl)

  try {
    if (downloadZipUrl.length === 0) {
      throw {}
    }

    const response = yield call(apiRequestDownloadZipFile, downloadZipUrl)
    if (!response.ok) {
      throw response
    }

    /* Show modal Step3 */
    yield put(push('/step/3'))
  } catch (error) {
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * If a cancel event is triggered we'll abort all the stored 'AbortController's
 *
 * @since 1.0
 */
export function * generatePdfCancel () {
  /* Redux state for abortControllers */
  const abortControllers = yield select(getStateAbortControllers)

  /* AbortController API call for requestGeneratePdf before it has completed */
  abortControllers.map(abortController => {
    abortController.abort()
  })
}

/**
 * Watch for a Fatal Error event and calls the function to handle it
 *
 * @since 1.0
 */
export function * watchFatalError () {
  while (true) {
    yield take(FATAL_ERROR)
    yield put({ type: GENERATE_PDF_CANCEL })
  }
}

/**
 * Watch for router '/' location changed, trigger cancel event and reset 3 of our reducers state
 *
 * @since 1.0
 */
export function * watchResetAllReducers () {
  while (true) {
    const { payload } = yield take('@@router/LOCATION_CHANGE')

    if (payload.location.pathname === '/' && payload.isFirstRendering === false) {
      yield put({ type: RESET_ALL_STATE })
    }
  }
}

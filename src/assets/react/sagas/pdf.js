/* Dependencies */
import { call, cancel, cancelled, delay, fork, put, retry, select, take, takeLatest } from 'redux-saga/effects'
/* Redux Action Types */
import {
  GENERATE_PDF,
  GENERATE_PDF_CANCEL,
  GENERATE_PDF_COUNTER,
  GENERATE_PDF_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_SUCCESS,
  STORE_ABORT_CONTROLLER,
  FATAL_ERROR
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
export const getStateAbortControllers = state => state.pdf.abortControllers
export const getStateDownloadZipUrl = state => state.pdf.downloadZipUrl

/**
 * Worker saga generateSessionId
 *
 * @param payload
 *
 * @since 1.0
 */
export function * generateSessionId (payload) {
  const { path, concurrency, history } = payload

  history.push('/step/2')

  /**
   * Call fetch API 3x
   *
   * In case of failure will try to make another call after delay milliseconds
   */
  try {
    const response = yield retry(3, 3000, apiRequestSessionId, path)

    if (!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GENERATE_SESSION_ID_SUCCESS, payload: responseBody.sessionId })

    /* Redux state for selectedEntryIds & pdfList */
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
        concurrency,
        history,
        selectedEntryIds,
        pdfList
      }
    })
  } catch (error) {
    /* Update redux state fatalError to true */
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Watcher saga watchGenerateSessionId
 *
 * @since 1.0
 */
export function * watchGenerateSessionId () {
  yield takeLatest(GENERATE_SESSION_ID, generateSessionId)
}

/**
 * Worker saga requestGeneratePdf
 *
 * @param pdf
 *
 * @since 1.0
 */
export function * requestGeneratePdf (pdf) {
  /* Cancelling a fetch request with AbortController */
  const abortController = new AbortController()
  const data = {
    pdf,
    signal: abortController.signal
  }

  /* Store abortController into redux state array */
  yield put({ type: STORE_ABORT_CONTROLLER, payload: abortController })

  /**
   * Call fetch API 3x
   *
   * In case of failure will try to make another call after delay milliseconds
   */
  try {
    const response = yield retry(3, 3000, apiRequestGeneratePdf, data)

    if (!response.ok) {
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
      /* Generate download request counter for Step2 */
      yield put({ type: GENERATE_PDF_COUNTER, payload: yield select(getStateSelectedEntryIds) })
    }
  }
}

/**
 * Worker saga generatePdf
 *
 * @param pdfs
 *
 * @since 1.0
 */
export function * generatePdf ({ pdfs }) {

  /* Set individual pdf data request before the actual API call */
  for (let i = 0; i < pdfs.length; i++) {
    yield fork(requestGeneratePdf, pdfs[i])
  }

  yield delay(1000)
}

/**
 * Worker saga validateDownloadZipUrl
 *
 * @since 1.0
 */
export function * validateDownloadZipUrl (history) {
  /* Call fetch API */
  try {
    const downloadZipUrl = yield select(getStateDownloadZipUrl)
    const response = yield call(apiRequestDownloadZipFile, downloadZipUrl)

    if (!response.ok) {
      throw response
    }

    /* Auto download the validated download zip URL */
    window.location.assign(response.url)

    history.push('/step/3')
  } catch (error) {
    /* Update redux state fatalError to true */
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Worker saga generateDownloadZipUrl
 *
 * @param sessionId
 *
 * @since 1.0
 */
export function * generateDownloadZipUrl (sessionId) {
  /**
   * Call fetch API 3x
   *
   * In case of failure will try to make another call after delay milliseconds
   */
  try {
    const response = yield retry(3, 1000, apiRequestGeneratePdfZip, sessionId)
    const responseBody = yield response.json()

    if (!response.ok || !responseBody.downloadUrl) {
      throw response
    }

    yield put({ type: GENERATE_DOWNLOAD_ZIP_URL, payload: responseBody.downloadUrl })
  } catch (error) {
    /* Update redux state fatalError to true */
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Worker saga generatePdfCancel
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
 * Worker saga bulkGeneratePdf
 *
 * @param pdfs
 * @param concurrency
 * @param sessionId
 *
 * @since 1.0
 */
export function * bulkGeneratePdf ({ pdfs, concurrency, sessionId, history }) {
  /* Loop through pdfs array and remove 5 items (splice 5) after every batch of 5 items excecuted */
  while (pdfs.length > 0) {
    yield generatePdf({
      pdfs: pdfs.splice(0, concurrency),
    })

    /* Generate download zip url every end of the process (batch of 5)  */
    yield generateDownloadZipUrl(sessionId)
  }

  /* Validate generated download zip url at the very end of the cycle */
  yield validateDownloadZipUrl(history)
}

/**
 * Watcher saga watchGeneratePDF
 *
 * @since 1.0
 */
export function * watchGeneratePDF () {
  while (true) {
    /* Listen to redux action type GENERATE_PDF event */
    const { payload } = yield take(GENERATE_PDF)
    const {
      sessionId,
      concurrency,
      history,
      selectedEntryIds,
      pdfList
    } = payload
    const pdfs = []
    const activePdfList = generateActivePdfList(pdfList)

    /* Construct content for pdfs array */
    selectedEntryIds.map(id => {
      activePdfList.map(item => {
        pdfs.push({ sessionId, entryId: id, pdfId: item.id, pdfName: item.name })
      })
    })

    /* Yield fork worker saga bulkGeneratePdf */
    const generator = yield fork(bulkGeneratePdf, {
      pdfs,
      concurrency,
      history,
      sessionId
    })

    /* Listen to redux action type GENERATE_PDF_CANCEL event */
    yield take(GENERATE_PDF_CANCEL)

    /* Yield call worker saga generatePdfCancel */
    yield generatePdfCancel()

    /* Cancel the ongoing task for worker saga bulkGeneratePdf */
    yield cancel(generator)
  }
}

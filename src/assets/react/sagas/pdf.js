import { channel  } from 'redux-saga'
import { call, fork, take, takeEvery, takeLatest, put } from 'redux-saga/effects'
import {
  GET_SESSION_ID,
  GET_GENERATE_PDF,
  GET_DOWNLOAD_ZIP,
  GET_ALL_FORM_ENTRIES,
  GENERATE_PDF_ZIP
} from '../actionTypes/pdf'
import {
  getSessionIdSuccess,
  generatePdfSuccess,
  generatePdfCounter,
  getDownloadZipSuccess,
  getAllFormEntriesSuccess,
  generatePdfZip
} from '../actions/pdf'
import {
  apiRequestSessionID,
  apiRequestGeneratePDF,
  apiRequestDownloadZip,
  apiRequestAllEntriesID,
  apiRequestGeneratePdfZip
} from '../api/pdf'

let requestGeneratePDFlist = []
let generatePdfList = []

export function* getSessionId(action) {
  try {
    const result = yield call(apiRequestSessionID, action.payload)

    yield put(getSessionIdSuccess(result.sessionId))
  } catch (error) {
    console.log('Saga requestDownload error - ', error)
  }
}

export function* watchGetSessionId() {
  yield takeLatest(GET_SESSION_ID, getSessionId)
}

export function chunkArray(myArray, chunk_size) {
  let results = []

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size))
  }

  return results
}

export function* getGeneratePdf(chan) {
  while (true) {
    const payload = yield take(chan)

    try {
      const result = yield call(apiRequestGeneratePDF, payload)
      // if (result.status === 200) {
      //   yield put(generatePdfSuccess(payload))
      // } else {
      //   console.log('Saga requestGeneratePDF retry - ', result.status)
      // }

      if (result.status === 200) {
        requestGeneratePDFlist.push(payload)

        if (requestGeneratePDFlist.length === generatePdfList.length) {
          const perBatch = chunkArray(requestGeneratePDFlist, 5)

          for (let i = 0; i < perBatch.length; i++) {
            yield put(generatePdfZip(payload.sessionId))
          }

          requestGeneratePDFlist = []
          generatePdfList = []
        }
      } else {
        console.log('Saga requestGeneratePDF retry - ', result.status)
      }
    } catch (error) {
      console.log('Saga requestGeneratePDF error 3 - ', error)
    } finally {
      yield put(generatePdfCounter())

      // if (requestGeneratePDFlist.length === list.length) {
      //   const perBatch = chunkArray(requestGeneratePDFlist, 5)
      //
      //   for (let i = 0; i < perBatch.length; i++) {
      //     yield put(generatePdfZip(payload.sessionId))
      //   }
      // }
    }
  }
}

export function* watchGetGeneratePDF() {
  const chan = yield call(channel)

  for (let i = 0; i < 5; i++) {
    yield fork(getGeneratePdf, chan)
  }

  while (true) {
    const { payload } = yield take(GET_GENERATE_PDF)
    const { sessionID, selectedEntryIDs, activePDFlist } = payload

    selectedEntryIDs.map(id => {
      activePDFlist.map(item => {
        generatePdfList.push({ sessionId: sessionID, entryId: id, pdfId: item })
      })
    })

    for (let x = 0; x < generatePdfList.length; x++) {
      yield put(chan, generatePdfList[x])
    }
  }
}

export function* requestGeneratePdfZip(action) {
  try {
    const result = yield call(apiRequestGeneratePdfZip, action.payload)
    console.log('Saga requestGeneratePdfZip result - ', result)
  } catch(error) {
    console.log('Saga requestGeneratePdfZip error - ', error)
  }
}

export function* watchGeneratePdfZip() {
  yield takeEvery(GENERATE_PDF_ZIP, requestGeneratePdfZip)
}

export function* getDownloadZip(action) {
  try {
    const result = yield call(apiRequestDownloadZip, action.payload)

    yield put(getDownloadZipSuccess(result.url))
  } catch(error) {
    console.log('Saga requestDownloadZip error - ', error)
  }
}

export function* watchGetDownloadZip() {
  yield takeLatest(GET_DOWNLOAD_ZIP, getDownloadZip)
}

export function * getAllFormEntries(action) {
  try {
    const result = yield call(apiRequestAllEntriesID, action.payload)


    yield put(getAllFormEntriesSuccess(result))
  } catch (error) {
    console.log('Saga getAllFormEntries error - ')
  }
}

export function* watchGetAllFormEntries() {
  yield takeLatest(GET_ALL_FORM_ENTRIES, getAllFormEntries)
}

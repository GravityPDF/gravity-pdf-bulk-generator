import { channel  } from 'redux-saga'
import { call, fork, take, takeEvery, takeLatest, put } from 'redux-saga/effects'
import {
  GET_SESSION_ID,
  GET_GENERATE_PDF,
  GET_DOWNLOAD_ZIP,
  GET_ALL_FORM_ENTRIES,
  GENERATE_PDF_ZIP, RETRY_GENERATE_PDF, GENERATE_PDF_ZIP_RETRY_LIST, GET_GENERATE_PDF_RETRY_LIST, GENERATE_RETRY_PDF
} from '../actionTypes/pdf'
import {
  getSessionIdSuccess,
  getGeneratePdfSuccess,
  getGeneratePdfRetryList,
  generatePdfCounter,
  getDownloadZipSuccess,
  getAllFormEntriesSuccess,
  generatePdfZip,
  generatePdfZipRetryList
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

// export function chunkArray(myArray, chunk_size) {
//   let results = []
//
//   while (myArray.length) {
//     results.push(myArray.splice(0, chunk_size))
//   }
//
//   return results
// }

export function* delay(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}

export function* getGeneratePdf(chan) {
  while (true) {
    const payload = yield take(chan)

    try {
      const result = yield call(apiRequestGeneratePDF, payload)

      if (result.status === 200) {
        requestGeneratePDFlist.push(payload)

        yield call(delay, 1000)

        generatePdfList.pop()

        // Request generate zip by batch of 5 for every successful PDF generated
        if (requestGeneratePDFlist.length === 5) {
          yield put(generatePdfZip(payload.sessionId))

          requestGeneratePDFlist.splice(0, 5)
        }

        // Request generate zip for the remaining successful PDF generated
        if (generatePdfList.length === 0 && requestGeneratePDFlist.length !== 0) {
          yield put(generatePdfZip(payload.sessionId))

          requestGeneratePDFlist.splice(0, requestGeneratePDFlist.length)
        }
      }
    } catch (error) {
      yield put(getGeneratePdfRetryList(payload))
    } finally {
      yield put(generatePdfCounter())
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

export function* getGeneratePdfZip(action) {
  try {
    yield call(apiRequestGeneratePdfZip, action.payload)
  } catch(error) {
    yield put(generatePdfZipRetryList(action.payload))
  }
}

export function* watchGetGeneratePdfZip() {
  yield takeEvery(GENERATE_PDF_ZIP, getGeneratePdfZip)
}

export function* getDownloadZip(action) {
  try {
    const result = yield call(apiRequestDownloadZip, action.payload)

    console.log('Saga getDownloadZip result - ', result)
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

// export function* retryGeneratePdf(chan) {
//   while(true) {
//     const payload = yield take(chan)
//
//     console.log('Saga retryGeneratePdf payload - ', payload)
//   }
// }

export function* watchRetryGeneratePdf() {
  const chan = yield call(channel)

  for (let i = 0; i < 5; i++) {
    yield fork(getGeneratePdf, chan)
  }

  while(true) {
    const { payload } = yield take(GENERATE_RETRY_PDF)
    generatePdfList = payload

    for (let x = 0; x < generatePdfList.length; x++) {
      yield put(chan, generatePdfList[x])
    }
  }
}

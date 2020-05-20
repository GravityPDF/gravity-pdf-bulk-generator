import { call, cancel, cancelled, delay, fork, put, retry, select, take } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  watchGenerateSessionId,
  generateSessionId,
  watchGeneratePDF,
  bulkGeneratePdf,
  generatePdf,
  requestGeneratePdf,
  generateDownloadZipUrl,
  validateDownloadZipUrl,
  watchFatalError,
  watchResetAllReducers,
  getStateSelectedEntryIds,
  getStatePdfList,
  getFatalErrorStatus,
  getStateDownloadZipUrl
} from '../../../../assets/react/sagas/pdf'
import {
  FATAL_ERROR,
  GENERATE_DOWNLOAD_ZIP_URL,
  GENERATE_PDF,
  GENERATE_PDF_COUNTER,
  GENERATE_SESSION_ID,
  GENERATE_SESSION_ID_SUCCESS,
  REMOVE_TOGGLE_ALL
} from '../../../../assets/react/actionTypes/pdf'
import {
  apiRequestDownloadZipFile,
  apiRequestGeneratePdf,
  apiRequestGeneratePdfZip,
  apiRequestSessionId
} from '../../../../assets/react/api/pdf'
import { CANCEL_REQUESTS, RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'
import {
  GENERATE_PDF_FAILED,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING
} from '../../../../assets/react/actionTypes/logs'

describe('/react/sagas/ - pdf.js', () => {
  let payload
  let response
  let responseBody
  let selectedEntriesId
  let pdfList
  let fatalError
  let pdfs
  let pdf
  let concurrency
  let sessionId
  let error
  let downloadZipUrl

  describe('Redux Sagas (pdf) - ', () => {
    describe('Selectors - should check our selectors', () => {
      test('getStateSelectedEntryIds', () => {
        const state = { form: { selectedEntriesId: ['74', '75'] } }

        expect(getStateSelectedEntryIds(state)).toBe(state.form.selectedEntriesId)
      })

      test('getStatePdfList', () => {
        const state = {
          pdf: {
            pdfList: [
              { id: '0', name: 'Toggle All', templateSelected: '', active: false },
              { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
              { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }]
          }
        }

        expect(getStatePdfList(state)).toBe(state.pdf.pdfList)
      })

      test('getFatalErrorStatus', () => {
        const state = { pdf: { fatalError: false } }

        expect(getFatalErrorStatus(state)).toBe(state.pdf.fatalError)
      })

      test('getStateDownloadZipUrl', () => {
        const state = { pdf: { downloadZipUrl: 'https://gravitypdf.com' } }

        expect(getStateDownloadZipUrl(state)).toBe(state.pdf.downloadZipUrl)
      })
    })

    describe('Watcher Saga - watchGenerateSessionId()', () => {
      test('should check this watcher to load generateSessionId saga', () => {
        selectedEntriesId = ['73', '74']
        const gen = watchGenerateSessionId()

        expect(gen.next().value).toEqual(take(GENERATE_SESSION_ID))
        expect(gen.next().value).toEqual(put(push('/step/2')))
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next(selectedEntriesId).value).toEqual(fork(generateSessionId, undefined))
        expect(gen.next().value).toEqual(take(RESET_ALL_STATE))
        expect(gen.next().value).toEqual(cancel())
        expect(gen.next().done).toBeFalsy()
      })

      test('should not load generateSessionId if it doesn\'t met the condition', () => {
        selectedEntriesId = []
        const gen = watchGenerateSessionId()

        expect(gen.next().value).toEqual(take(GENERATE_SESSION_ID))
        expect(gen.next().value).toEqual(put(push('/step/2')))
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next(selectedEntriesId).value).toEqual(take(GENERATE_SESSION_ID))
        expect(gen.next().done).toBeFalsy()
      })
    })

    describe('Worker Saga - generateSessionId()', () => {
      test('should check that saga calls the API apiRequestSessionId', () => {
        response = { ok: true, json: jest.fn() }
        responseBody = { sessionId: '336ac9' }
        selectedEntriesId = ['71', '72']
        pdfList = [{}, {}]
        payload = { path: '/{date_created:format:Y}/{date_created:format:m}/', concurrency: 5 }
        const gen = generateSessionId(payload)

        expect(gen.next().value).toEqual(retry(3, 100, apiRequestSessionId, payload.path))
        gen.next(response)
        expect(gen.next(responseBody).value).toEqual(put({
          type: GENERATE_SESSION_ID_SUCCESS,
          payload: responseBody.sessionId
        }))
        expect(gen.next().value).toEqual(put({ type: REMOVE_TOGGLE_ALL }))
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next(selectedEntriesId).value).toEqual(select(getStatePdfList))
        expect(gen.next(pdfList).value).toEqual(put({
          type: GENERATE_PDF,
          payload: {
            sessionId: responseBody.sessionId,
            concurrency: payload.concurrency,
            selectedEntriesId,
            pdfList
          }
        }))
        expect(gen.next().done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call', () => {
        response = { ok: false }
        payload = { path: '/{date_created:format:Y}/{date_created:format:m}/', concurrency: 5 }
        const gen = generateSessionId(payload)

        expect(gen.next().value).toEqual(retry(3, 100, apiRequestSessionId, payload.path))
        expect(gen.next(response).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })
    })

    describe('Watcher Saga - watchGeneratePDF()', () => {
      test('should check the watcher to loads up the worker saga functions', () => {
        payload = {
          sessionId: '42f6c',
          concurrency: 5,
          selectedEntriesId: ['71'],
          pdfList: [{ id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true }]
        }
        pdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        const gen = watchGeneratePDF()

        expect(gen.next().value).toEqual(take(GENERATE_PDF))
        expect(gen.next({ payload }).value).toEqual(fork(bulkGeneratePdf, {
          pdfs,
          concurrency: payload.concurrency,
          sessionId: payload.sessionId
        }))
        expect(gen.next().value).toEqual(take([CANCEL_REQUESTS, RESET_ALL_STATE]))
        expect(gen.next().value).toEqual(cancel())
        expect(gen.next().done).toBeFalsy()
      })
    })

    describe('Worker Saga - bulkGeneratePdf()', () => {
      test('should check the handling for Step 2/3/4 of the Bulk Generator process logic', () => {
        pdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        concurrency = 5
        sessionId = 'e801d'
        const processPdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        fatalError = false
        const gen = bulkGeneratePdf({ pdfs, concurrency, sessionId })

        expect(gen.next().value).toEqual(generatePdf(processPdfs))
        expect(gen.next().value).toEqual(generateDownloadZipUrl(sessionId))
        expect(gen.next().value).toEqual(select(getFatalErrorStatus))
        expect(gen.next(fatalError).value).toEqual(validateDownloadZipUrl())
        expect(gen.next().done).toBeTruthy()
      })

      test('should skip validation if fatal error generated', () => {
        pdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        concurrency = 5
        sessionId = 'e801d'
        const processPdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        fatalError = true
        const gen = bulkGeneratePdf({ pdfs, concurrency, sessionId })

        expect(gen.next().value).toEqual(generatePdf(processPdfs))
        expect(gen.next().value).toEqual(generateDownloadZipUrl(sessionId))
        expect(gen.next().value).toEqual(select(getFatalErrorStatus))
        expect(gen.next(fatalError).done).toBeTruthy()
      })
    })

    describe('Worker Saga - generatePdf()', () => {
      test('should fork process that handle the individual PDF generation', () => {
        pdfs = [{ entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }]
        const gen = generatePdf(pdfs)

        expect(gen.next().value).toEqual(fork(requestGeneratePdf, pdfs[0]))
        expect(gen.next().value).toEqual(delay(1000))
        expect(gen.next(fatalError).done).toBeTruthy()
      })
    })

    describe('Worker Ssaga - requestGeneratePdf()', () => {
      test('should check that saga calls the API apiRequestGeneratePdf', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: true }
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.next(response).value).toEqual(put({ type: GENERATE_PDF_SUCCESS, payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next().value).toEqual(put({ type: GENERATE_PDF_COUNTER, payload: undefined }))
        expect(gen.next(fatalError).done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: false }
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.next(response).value).toEqual(put({ type: GENERATE_PDF_FAILED, payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next().value).toEqual(put({ type: GENERATE_PDF_COUNTER, payload: undefined }))
        expect(gen.next(fatalError).done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call (error: 400)', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: false }
        error = { status: 400 }
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.throw(error).value).toEqual(put({ type: GENERATE_PDF_WARNING, payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next().value).toEqual(put({ type: GENERATE_PDF_COUNTER, payload: undefined }))
        expect(gen.next(fatalError).done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call (error: 403)', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: false }
        error = { status: 403 }
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.throw(error).value).toEqual(put({ type: 'GENERATE_PDF_WARNING', payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next().value).toEqual(put({ type: GENERATE_PDF_COUNTER, payload: undefined }))
        expect(gen.next(fatalError).done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call (error: 412)', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: false }
        error = { status: 412 }
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.throw(error).value).toEqual(put({ type: 'GENERATE_PDF_WARNING', payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next().value).toEqual(select(getStateSelectedEntryIds))
        expect(gen.next().value).toEqual(put({ type: GENERATE_PDF_COUNTER, payload: undefined }))
        expect(gen.next(fatalError).done).toBeTruthy()
      })

      test('should check that saga handles correctly the finally block (cancelled)', () => {
        pdf = { entryId: '71', pdfId: '5e12a', pdfName: 'templateA', sessionId: '42f6c' }
        response = { ok: true }
        const cancelledState = true
        const gen = requestGeneratePdf(pdf)

        expect(gen.next().value).toEqual(retry(3, 1000, apiRequestGeneratePdf, pdf))
        expect(gen.next(response).value).toEqual(put({ type: GENERATE_PDF_SUCCESS, payload: '' }))
        expect(gen.next().value).toEqual(cancelled())
        expect(gen.next(cancelledState).done).toBeTruthy()
      })
    })

    describe('Workder Saga - generateDownloadZipUrl()', () => {
      test('should check that saga calls the API apiRequestGeneratePdfZip', () => {
        sessionId = 'e801d'
        response = { ok: true, json: jest.fn() }
        responseBody = { downloadUrl: 'http://gravitypdf.com' }
        const gen = generateDownloadZipUrl(sessionId)

        expect(gen.next().value).toEqual(retry(3, 500, apiRequestGeneratePdfZip, sessionId))
        gen.next(response)
        expect(gen.next(responseBody).value).toEqual(put({
          type: GENERATE_DOWNLOAD_ZIP_URL,
          payload: responseBody.downloadUrl
        }))
        expect(gen.next().done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call (erro: = 500)', () => {
        sessionId = 'e801d'
        response = { ok: false, json: jest.fn(), status: 500 }
        responseBody = {}
        const gen = generateDownloadZipUrl(sessionId)

        expect(gen.next().value).toEqual(retry(3, 500, apiRequestGeneratePdfZip, sessionId))
        gen.next(response)
        expect(gen.next(response).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call (erro: > 500)', () => {
        sessionId = 'e801d'
        response = { ok: false, json: jest.fn(), status: 502 }
        const gen = generateDownloadZipUrl(sessionId)

        expect(gen.next().value).toEqual(retry(3, 500, apiRequestGeneratePdfZip, sessionId))
        gen.next(response)
        expect(gen.next(response).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })
    })

    describe('Worker Saga - validateDownloadZipUrl()', () => {
      test('should check that saga calls the API apiRequestDownloadZipFile', () => {
        downloadZipUrl = 'https://gravitypdf.com'
        response = { ok: true }
        const gen = validateDownloadZipUrl()

        expect(gen.next().value).toEqual(select(getStateDownloadZipUrl))
        expect(gen.next(downloadZipUrl).value).toEqual(call(apiRequestDownloadZipFile, downloadZipUrl))
        expect(gen.next(response).value).toEqual(put(push('/step/3')))
        expect(gen.next().done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call', () => {
        downloadZipUrl = 'https://gravitypdf.com'
        response = { ok: false }
        const gen = validateDownloadZipUrl()

        expect(gen.next().value).toEqual(select(getStateDownloadZipUrl))
        expect(gen.next(downloadZipUrl).value).toEqual(call(apiRequestDownloadZipFile, downloadZipUrl))
        expect(gen.next(response).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })

      test('should check that if a downloadZipUrl is empty, throw error', () => {
        downloadZipUrl = ''
        const gen = validateDownloadZipUrl()

        expect(gen.next().value).toEqual(select(getStateDownloadZipUrl))
        expect(gen.next(downloadZipUrl).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })
    })

    describe('Watcher Saga - watchFatalError()', () => {
      test('should Watch for a fatal error event and handle our fatal error and cancel logic', () => {
        const gen = watchFatalError()

        expect(gen.next().value).toEqual(take(FATAL_ERROR))
        expect(gen.next().value).toEqual(put({ type: CANCEL_REQUESTS }))
        expect(gen.next().done).toBeFalsy()
      })
    })

    describe('Watcher Saga - watchResetAllReducers()', () => {
      test('should watch for router \'/\' location changed, trigger cancel event and reset 3 of our reducers state', () => {
        payload = { location: { pathname: '/' }, isFirstRendering: false }
        const gen = watchResetAllReducers()

        expect(gen.next().value).toEqual(take('@@router/LOCATION_CHANGE'))
        expect(gen.next({ payload }).value).toEqual(put({ type: RESET_ALL_STATE }))
        expect(gen.next().done).toBeFalsy()
      })

      test('should not call RESET_ALL_STATE if condition fails', () => {
        payload = { location: { pathname: '/step/3' }, isFirstRendering: false }
        const gen = watchResetAllReducers()

        expect(gen.next().value).toEqual(take('@@router/LOCATION_CHANGE'))
        expect(gen.next({ payload }).value).toEqual(take('@@router/LOCATION_CHANGE'))
        expect(gen.next({ payload }).done).toBeFalsy()
      })
    })
  })
})

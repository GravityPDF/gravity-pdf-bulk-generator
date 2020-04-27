import {
  GENERATE_PDF_LIST_SUCCESS,
  TOGGLE_PDF_STATUS,
  GENERATE_SESSION_ID
} from '../../../../assets/react/actionTypes/pdf'
import { generatePdfListSuccess, togglePdfStatus, generateSessionId } from '../../../../assets/react/actions/pdf'

describe('/react/actions/ - pdf.js', () => {
  let data
  let results

  describe('Redux Actions (pdf) - ', () => {
    test('generatePdfListSuccess - check if it returns the correct action', () => {
      data = [
        { id: '5e12aa36690bd', name: 'First PDF template', templateSelected: 'blank-slate', active: true },
        { id: '5e2e14bdf0149', name: 'Certificate of Completion', templateSelected: 'rubix', active: true }
      ]
      results = generatePdfListSuccess(data)

      expect(results.type).toEqual(GENERATE_PDF_LIST_SUCCESS)
      expect(results.payload).toBeInstanceOf(Array)
      expect(results.payload).toEqual(data)
    })

    test('togglePdfStatus - check if it returns the correct action', () => {
      data = 2
      results = togglePdfStatus(data)

      expect(results.type).toEqual(TOGGLE_PDF_STATUS)
      expect(results.payload).toBe(data)
    })

    test('generateSessionId - check if it returns the correct action', () => {
      results = generateSessionId('path', 5)

      expect(results.type).toEqual(GENERATE_SESSION_ID)
      expect(results.path).toBe('path')
      expect(results.concurrency).toBe(5)
    })
  })
})

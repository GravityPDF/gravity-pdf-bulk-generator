import {
  PROCEED_STEP_1,
  PROCESS_CHECKBOX,
  GET_SELECTED_ENTRIES_ID
} from '../../../../assets/react/actionTypes/form'
import {
  proceedStep1,
  processCheckbox,
  getSelectedEntriesId
} from '../../../../assets/react/actions/form'

describe('/react/actions/ - form.js', () => {
  let results

  describe('Redux Actions (form) - ', () => {
    test('proceedStep1 - check if it returns the correct action', () => {
      results = proceedStep1()

      expect(results.type).toEqual(PROCEED_STEP_1)
    })

    test('processCheckbox - check if it returns the correct action', () => {
      results = processCheckbox(['1', '2'])

      expect(results.type).toEqual(PROCESS_CHECKBOX)
      expect(results.payload).toBeInstanceOf(Array)
      expect(results.payload).toEqual(['1', '2'])
    })

    test('getSelectedEntryIds - check if it returns the correct action', () => {
      results = getSelectedEntriesId('123', { s: 'abc', field_id: '2' })

      expect(results.type).toEqual(GET_SELECTED_ENTRIES_ID)
      expect(results.formId).toBe('123')
      expect(results.filterData).toBeInstanceOf(Object)
      expect(results.filterData).toEqual({ s: 'abc', field_id: '2' })
    })
  })
})

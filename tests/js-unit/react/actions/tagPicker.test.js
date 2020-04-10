import { UPDATE_DIRECTORY_STRUCTURE } from '../../../../assets/react/actionTypes/tagPicker'
import { updateDirectoryStructure } from '../../../../assets/react/actions/tagPicker'

describe('/react/actions/ - tagPicker.js', () => {

  let data
  let results

  describe('Redux Actions (tagPicker) - ', () => {

    test('updateDirectoryStructure - check if it returns the correct action', () => {
      data = '/path/'
      results = updateDirectoryStructure(data)

      expect(results.type).toEqual(UPDATE_DIRECTORY_STRUCTURE)
      expect(results.payload).toBe(data)
    })
  })
})

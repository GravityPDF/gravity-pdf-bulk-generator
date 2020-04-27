import { all, call } from 'redux-saga/effects'
import { watchProceedStep1, watchGetSelectedEntriesId } from '../../../../assets/react/sagas/form'
import {
  watchGenerateSessionId,
  watchGeneratePDF,
  watchFatalError,
  watchResetAllReducers
} from '../../../../assets/react/sagas/pdf'
import rootSaga from '../../../../assets/react/sagas'

describe('/react/sagas/ - index.js', () => {
  describe('Redux Sagas (rootSaga) - ', () => {
    test('should check generator function that watch all the watcher sagas and run them in parallel', () => {
      const gen = rootSaga()

      expect(gen.next().value).toEqual(all([
        call(watchProceedStep1),
        call(watchGetSelectedEntriesId),
        call(watchGenerateSessionId),
        call(watchGeneratePDF),
        call(watchFatalError),
        call(watchResetAllReducers)
      ]))
    })
  })
})

import { all } from 'redux-saga/effects'
import {
  watchGetSelectedEntryIds
} from './form'
import {
  watchGenerateSessionId,
  watchGeneratePDF
} from './pdf'

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 */
export default function * rootSaga () {
  yield all([
    watchGetSelectedEntryIds(),
    watchGenerateSessionId(),
    watchGeneratePDF()
  ])
}

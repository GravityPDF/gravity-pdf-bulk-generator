import { all } from 'redux-saga/effects'
import {
  watchGetAllFormEntries,
  watchGetSessionId,
  watchGeneratePDF,
  watchDownloadZip
} from './pdf'

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 */
export default function * rootSaga () {
  yield all([
    watchGetAllFormEntries(),
    watchGetSessionId(),
    watchGeneratePDF(),
    watchDownloadZip()
  ])
}

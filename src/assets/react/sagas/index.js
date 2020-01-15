import { all } from 'redux-saga/effects'
import {
  watchGetSessionId,
  watchGetGeneratePDF,
  watchGetDownloadZip,
  watchGetAllFormEntries,
  watchGeneratePdfZip
} from './pdf'

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 */
export default function * rootSaga () {
  yield all([
    watchGetSessionId(),
    watchGetGeneratePDF(),
    watchGetDownloadZip(),
    watchGetAllFormEntries(),
    watchGeneratePdfZip()
  ])
}

import { all } from 'redux-saga/effects'
import {
  watchGetSessionId,
  watchGetGeneratePDF,
  watchRetryGeneratePdf,
  watchGetDownloadZip,
  watchGetAllFormEntries,
  watchGetGeneratePdfZip
} from './pdf'

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 */
export default function * rootSaga () {
  yield all([
    watchGetSessionId(),
    watchGetGeneratePDF(),
    watchRetryGeneratePdf(),
    watchGetDownloadZip(),
    watchGetAllFormEntries(),
    watchGetGeneratePdfZip()
  ])
}

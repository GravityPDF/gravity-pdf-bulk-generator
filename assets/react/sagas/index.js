/* Dependencies */
import { all, call } from 'redux-saga/effects'
/* Redux Sagas */
import { watchProceedStep1, watchGetSelectedEntriesId } from './form'
import { watchGenerateSessionId, watchGeneratePDF, watchFatalError, watchResetAllReducers } from './pdf'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 *
 * @since 1.0
 */
export default function * rootSaga () {
  yield all([
    call(watchProceedStep1),
    call(watchGetSelectedEntriesId),
    call(watchGenerateSessionId),
    call(watchGeneratePDF),
    call(watchFatalError),
    call(watchResetAllReducers)
  ])
}

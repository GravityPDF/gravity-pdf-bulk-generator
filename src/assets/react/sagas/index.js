/* Dependencies */
import { all } from 'redux-saga/effects'

/* Sagas */
import { watchGetSelectedEntryIds } from './form'
import { watchGenerateSessionId, watchGeneratePDF } from './pdf'

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
    watchGetSelectedEntryIds(),
    watchGenerateSessionId(),
    watchGeneratePDF()
  ])
}

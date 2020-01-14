import { all } from 'redux-saga/effects'

/**
 * Generator function that watch all the watcher sagas and run them in parallel
 */
export default function * rootSaga () {
  yield all([])
}

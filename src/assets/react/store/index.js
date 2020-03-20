/* Dependencies */
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

/* Redux Saga */
import rootSaga from '../sagas'

/* Redux Reducers */
import rootReducers from '../reducers/index'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Initialize Saga Middleware */
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)
const enhancers = [middlewareEnhancer]
/* Initialize Redux dev tools */
const composedEnhancers = composeWithDevTools(...enhancers)
/* Create our store and enable composedEnhancers */
const store = createStore(
  rootReducers,
  composedEnhancers
)

/* Run Saga Middleware */
sagaMiddleware.run(rootSaga)

/**
 * Holds the whole redux state tree of the application
 *
 * @returns {store: object}
 *
 * @since 1.0
 */
export function getStore () {
  return store
}

/* Dependencies */
import { createMemoryHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
/* Redux Saga */
import rootSaga from '../sagas'
/* Redux Reducers */
import createRootReducer from '../reducers/index'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

export const history = createMemoryHistory()

/* Initialize Saga Middleware */
const sagaMiddleware = createSagaMiddleware()
const middlewares = [routerMiddleware(history), sagaMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)
const enhancers = [middlewareEnhancer]
/* Initialize Redux dev tools */
const composedEnhancers = composeWithDevTools(...enhancers)

/**
 * Holds the whole redux state tree of the application
 *
 * @param preloadedState
 *
 * @returns { store: object }
 *
 * @since 1.0
 */
export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composedEnhancers
  )

  /* Run Saga Middleware */
  sagaMiddleware.run(rootSaga)

  return store
}

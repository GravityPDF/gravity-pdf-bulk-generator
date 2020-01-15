import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import tagPickerReducer from '../reducers/tagPickerReducer'
import pdfReducer from '../reducers/pdfReducer'
import rootSaga from '../sagas'

/* Combine our Redux Reducers */
const reducers = setupReducers()
/* Initialize Saga Middleware */
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)
const enhancers = [middlewareEnhancer]
/* Initialize Redux dev tools */
const composedEnhancers = composeWithDevTools(...enhancers)
/* Create our store and enable composedEnhancers */
const store = createStore(
  reducers,
  composedEnhancers
)

/* Run Saga Middleware */
sagaMiddleware.run(rootSaga)

export function getStore () {
  return store
}

/**
 * Combine our Redux reducers for use in a single store
 * If you want to add new top-level keys to our store, this is the place
 *
 * @returns {Function}
 */
export function setupReducers () {
  return combineReducers({
    tagPicker: tagPickerReducer,
    pdf: pdfReducer
  })
}

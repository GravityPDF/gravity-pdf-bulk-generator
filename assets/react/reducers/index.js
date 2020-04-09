/* Dependencies */
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
/* Redux Reducers */
import formReducer from './formReducer'
import tagPickerReducer from './tagPickerReducer'
import pdfReducer from './pdfReducer'
import logsReducer from './logsReducer'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Combine our Redux reducers for use in a single store.
 * If you want to add new top-level keys to our store, this is the place.
 *
 * @since 1.0
 */
const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  tagPicker: tagPickerReducer,
  pdf: pdfReducer,
  logs: logsReducer
})

export default createRootReducer

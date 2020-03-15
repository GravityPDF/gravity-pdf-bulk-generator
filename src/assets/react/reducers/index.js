import { combineReducers } from 'redux'
import formReducer from './formReducer'
import tagPickerReducer from './tagPickerReducer'
import pdfReducer from './pdfReducer'

/**
 * Combine our Redux reducers for use in a single store
 * If you want to add new top-level keys to our store, this is the place
 *
 * @since 1.0
 */
export default combineReducers({
  form: formReducer,
  tagPicker: tagPickerReducer,
  pdf: pdfReducer
})

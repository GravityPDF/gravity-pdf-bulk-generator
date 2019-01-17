import React from 'react'

import { createStore, combineReducers } from 'redux'
import tagPickerReducer from '../reducers/tagPickerReducer'
import pdfReducer from '../reducers/pdfReducer'

/* Combine our Redux Reducers */
const reducers = setupReducers()

/* Create our store and enable the Redux dev tools, if they exist */
const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export function getStore () {
  return store
}

export function setupReducers () {
  return combineReducers({
    tagPicker: tagPickerReducer,
    pdf: pdfReducer,
  })
}
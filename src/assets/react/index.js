/* Dependencies */
import React from 'react'
import { render } from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

/* Redux store */
import { getStore } from './store'

/* Components */
import BulkGenerator from './bulkGenerator'

/* Styles */
import '../scss/main.scss'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * The JS entry point for Webpack
 *
 * @since 1.0
 */
const entryList = document.querySelector('#entry_list_form')
const bulkActionOptions = document.querySelectorAll('.alignleft.actions.bulkactions')

/* Initialize to load Bulk Generator */
if (entryList !== null && bulkActionOptions.length !== 0) {
  const container = document.createElement('div')
  /* Initialize popup contianer */
  container.id = 'gfpdf-bulk-generator-container'

  entryList.appendChild(container)
  loadBulkGenerator(container)
}

/**
 * Mount our Bulk Generator UI on the DOM
 *
 * @param container
 *
 * @since 1.0
 */
export default function loadBulkGenerator (container) {
  const store = getStore()

  render(
    <Provider store={store}>
      <Router>
        <BulkGenerator />
      </Router>
    </Provider>,
    container
  )
}

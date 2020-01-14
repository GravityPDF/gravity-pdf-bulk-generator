import React from 'react'
import { render } from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getStore } from './store'
import BulkGenerator from './bulkGenerator'

const entryList = document.querySelector('#entry_list_form')
const container = document.createElement('div')
container.id = 'gfpdf-bulk-generator-container'

export default function loadBulkGenerator () {
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

// Initialize to load Bulk Generator
if (entryList !== null) {
  // Top Bulk Action SelectBox & Apply Button
  const topBulkDropdownSelect = document.querySelector('#bulk-action-selector-top')
  const topBulkApplyButton = document.querySelector('#doaction')

  // Bottom Bulk Action SelectBox & Apply Button
  const bottomBulkDropdownSelect = document.querySelector('#bulk-action-selector-bottom')
  const bottomBulkApplyButton = document.querySelector('#doaction2')

  if (
    topBulkDropdownSelect !== null && topBulkApplyButton !== null ||
    bottomBulkDropdownSelect !== null && bottomBulkApplyButton !== null
  ) {
    entryList.appendChild(container)
    loadBulkGenerator()
  }
}

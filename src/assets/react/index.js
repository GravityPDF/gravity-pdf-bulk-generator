import React from 'react'
import { render } from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getStore } from './store'
import BulkGenerator from './BulkGenerator'
import '../scss/main.scss'

const entryList = document.querySelector('#entry_list_form')
const bulkActionOptions = document.querySelectorAll('.alignleft.actions.bulkactions')
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
if (entryList !== null && bulkActionOptions.length !== 0) {
  entryList.appendChild(container)
  loadBulkGenerator()
}

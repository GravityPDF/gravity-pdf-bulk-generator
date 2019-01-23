import React from 'react'
import {initilize} from './app'

const entryList = document.querySelector('#entry_list_form')
const bulkSelectorButton = document.querySelectorAll('#entry_list_form .bulkactions .button')

const container = document.createElement('div')
container.id = 'gfpdf-bulk-generator-container'
entryList.appendChild(container)

/* Handle the bulk selector click event */
document.addEventListener('click', event => {

  const bulkSelectorButtonArray = Array.from(bulkSelectorButton)
  if (bulkSelectorButtonArray.indexOf(event.target) === -1) {
    return false
  }

  /* Ensure the correct bulk selector is set to 'download_pdf' */
  const bulkSelector = event.target.id === 'doaction' ?
    document.querySelector('#bulk-action-selector-top') :
    document.querySelector('#bulk-action-selector-bottom')

  if (bulkSelector.value !== 'download_pdf') {
    return false
  }

  event.preventDefault()

  /* Get all the entry IDs*/
  const entryIds = []
  if (document.querySelector('#all_entries').value == 1) {
    console.log('@TODO: get all entry ids. Need to pass id, s, operator, filter, and field_id')
  } else {
    document.querySelectorAll('#entry_list_form input[name=\'entry[]\']:checked').forEach(item => {
      entryIds.push(item.value)
    })
  }

  /* @TODO - push entry IDs to redux */
  initilize(container)
})

/* @TODO - THIS IS TMP SO WE DON"T HAVE TO CLICK BULK ACTIONS DURING TESTING */
initilize(container)
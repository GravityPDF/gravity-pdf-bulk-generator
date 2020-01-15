import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PopUp from './Components/PopUp'
import {
  getFormData,
  selectDownloadPdf,
  deSelectDownloadPdf,
  toggleModal,
  singleCheckboxEntry,
  allCheckboxEntry,
  getAllFormEntries,
  togglePopupSelectAllEntries
} from './actions/pdf'

class BulkGenerator extends React.Component {

  componentDidMount () {
    // Request for Form data
    this.getFormData()

    // Event listener for Bulk Action Option selectBox
    this.bulkActionDropdownOptions()

    // Event listener for the Apply Button
    this.bulkApplyButtons()

    // Event listener for Entries individual checkbox
    this.individualCheckbox()

    // Event listener for Entries select all page checkbox
    this.selectAllPageCheckbox()
  }

  componentDidUpdate (prevProps) {
    const { selectedAllIDs, popupSelectAllEntries } = this.props.pdf.formEntries

    selectedAllIDs && !popupSelectAllEntries && this.toggleSelectAllEntries()
    selectedAllIDs && popupSelectAllEntries && this.toggleSelectAllEntries()
  }

  toggleSelectAllEntries = () => {
    const { formID } = this.props.pdf.formEntries
    const popupSelectAllEntriesOption = document.querySelector('#gform-select-all-message a')

    if (popupSelectAllEntriesOption) {
      popupSelectAllEntriesOption.addEventListener('click', () => {
        if (popupSelectAllEntriesOption.innerText.includes('Select all')) {
          this.props.getAllFormEntries(formID)
        }

        this.props.togglePopupSelectAllEntries()
      })
    }
  }

  getFormData = () => {
    // Global variable to get Form Data
    const formData = GPDF_BULK_GENERATOR

    this.props.getFormData(formData)
  }

  bulkActionDropdownOptions = () => {
    [
      document.querySelector('#bulk-action-selector-top'),
      document.querySelector('#bulk-action-selector-bottom')
    ].forEach(e => {
      e.addEventListener('change', e => {
        const id = e.target.id

        e.target.value === 'download_pdf' ? this.props.selectDownloadPdf(id) : this.props.deSelectDownloadPdf(id)
      })
    })
  }

  bulkApplyButtons = () => {
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        const id = e.target.id
        const { topBulkDownloadPdfSelected, bottomBulkDownloadPdfSelected } = this.props.pdf.formActions
        const { selectedEntryIDs } = this.props.pdf.formEntries

        // Check if 'Download PDF' is selected at top Bulk Actions Select box
        id === 'doaction' && topBulkDownloadPdfSelected && selectedEntryIDs.length !== 0 && (
          this.props.toggleModal(),
          this.props.history.push('/step/1')
        )

        // Check if 'Download PDF' is selected at bottom Bulk Actions Select box
        id === 'doaction2' && bottomBulkDownloadPdfSelected && selectedEntryIDs.length !== 0 && (
          this.props.toggleModal(),
          this.props.history.push('/step/1')
        )
      })
    })
  }

  individualCheckbox = () => {
    const totalEntries = document.querySelectorAll('.gform_list_checkbox').length

    document.querySelectorAll('[data-wp-lists="list:gf_entry"]')[0].addEventListener('change', e => {
      this.props.singleCheckboxEntry(e.target.value, totalEntries)
    })
  }

  selectAllPageCheckbox = () => {
    [
      document.querySelector('#cb-select-all-1'),
      document.querySelector('#cb-select-all-2')
    ].forEach(e => {
      e.addEventListener('change', () => {
        const ids = []
        const checkboxes = document.querySelectorAll('.gform_list_checkbox')
        checkboxes.forEach(e => ids.push(e.getAttribute('value')))

        this.props.allCheckboxEntry(ids)
      })
    })
  }

  render () {
    return (
      <PopUp {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  pdf: state.pdf
})

export default withRouter(connect(mapStateToProps, {
  getFormData,
  selectDownloadPdf,
  deSelectDownloadPdf,
  toggleModal,
  singleCheckboxEntry,
  allCheckboxEntry,
  getAllFormEntries,
  togglePopupSelectAllEntries
})(BulkGenerator))

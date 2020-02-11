import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PopUp from './components/PopUp'
import {
  getFormData,
  toggleModal,
  singleCheckboxEntry,
  allCheckboxEntry,
  getAllFormEntries,
  togglePopupSelectAllEntries
} from './actions/pdf'
import { processFormEntriesAndFilters } from './helpers/processFormEntriesAndFilters'

class BulkGenerator extends React.Component {

  static propTypes = {
    modal: PropTypes.bool.isRequired,
    formEntries: PropTypes.shape({
      formId: PropTypes.string.isRequired,
      selectedAllIds: PropTypes.bool.isRequired,
      popupSelectAllEntries: PropTypes.bool.isRequired,
      selectedEntryIds: PropTypes.array.isRequired
    }).isRequired,
    getFormData: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    singleCheckboxEntry: PropTypes.func.isRequired,
    allCheckboxEntry: PropTypes.func.isRequired,
    getAllFormEntries: PropTypes.func.isRequired,
    togglePopupSelectAllEntries: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    formActions: {
      topBulkDownloadPdfSelected: false,
      bottomBulkDownloadPdfSelected: false
    }
  }

  componentDidMount () {
    // Request form data
    this.getFormData()

    // Event listener for bulk action options
    this.bulkActionDropdownListener()

    // Event listener for apply button
    this.bulkApplyButtonListener()

    // Event listener for individual checkbox entries
    this.individualCheckboxListener()

    // Event listener for select all page checkbox entries
    this.selectAllPageCheckboxListener()
  }

  componentDidUpdate (prevProps) {
    // Event listener for popup toggle select all entries
    this.toggleSelectAllEntriesListener(prevProps)
  }

  toggleSelectAllEntriesListener = (prevProps) => {
    const { selectedAllIds, popupSelectAllEntries, formId } = this.props.formEntries
    const popupSelectAllEntriesOption = document.querySelector('#gform-select-all-message a')

    if (popupSelectAllEntriesOption) {
      popupSelectAllEntriesOption.addEventListener('click', () => {
        if (popupSelectAllEntriesOption.innerText.includes('Select all')) {
          const filterData = processFormEntriesAndFilters()

          if (prevProps.formEntries.selectedAllIds !== selectedAllIds) {
            this.props.getAllFormEntries(formId, filterData)
          }
        } else {
          if (prevProps.formEntries.popupSelectAllEntries !== popupSelectAllEntries) {
            this.props.togglePopupSelectAllEntries()
          }
        }
      })
    }
  }

  getFormData = () => {
    // Global variable to get Form Data
    const formData = GPDF_BULK_GENERATOR

    this.props.getFormData(formData)
  }

  bulkActionDropdownListener = () => {
    [
      document.querySelector('#bulk-action-selector-top'),
      document.querySelector('#bulk-action-selector-bottom')
    ].forEach(e => {
      e.addEventListener('change', e => {
        const id = e.target.id

        e.target.value === 'download_pdf' ? this.selectDownloadPdf(id) : this.deSelectDownloadPdf(id)
      })
    })
  }

  selectDownloadPdf = id => {
    if (id === 'bulk-action-selector-top') {
      this.setState({
        formActions: {
          ...this.state.formActions,
          topBulkDownloadPdfSelected: true
        }
      })
    } else {
      this.setState({
        formActions: {
          ...this.state.formActions,
          bottomBulkDownloadPdfSelected: true
        }
      })
    }
  }

  deSelectDownloadPdf = id => {
    if (id === 'bulk-action-selector-top') {
      this.setState({
        formActions: {
          ...this.state.formActions,
          topBulkDownloadPdfSelected: false
        }
      })
    } else {
      this.setState({
        formActions: {
          ...this.state.formActions,
          bottomBulkDownloadPdfSelected: false
        }
      })
    }
  }

  bulkApplyButtonListener = () => {
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        const id = e.target.id
        const { topBulkDownloadPdfSelected, bottomBulkDownloadPdfSelected } = this.state.formActions
        const { selectedEntryIds } = this.props.formEntries

        // Check if 'Download PDF' is selected at top Bulk Actions Select box
        if (id === 'doaction' && topBulkDownloadPdfSelected && selectedEntryIds.length !== 0) {
          this.props.toggleModal()
          this.props.history.push('/step/1')
        }

        // Check if 'Download PDF' is selected at bottom Bulk Actions Select box
        if (id === 'doaction2' && bottomBulkDownloadPdfSelected && selectedEntryIds.length !== 0) {
          this.props.toggleModal()
          this.props.history.push('/step/1')
        }
      })
    })
  }

  individualCheckboxListener = () => {
    const totalEntries = document.querySelectorAll('.gform_list_checkbox').length

    document.querySelectorAll('[data-wp-lists="list:gf_entry"]')[0].addEventListener('change', e => {
      this.props.singleCheckboxEntry(e.target.value, totalEntries)
    })
  }

  selectAllPageCheckboxListener = () => {
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
    const { modal, history } = this.props

    return (
      <PopUp modal={modal} history={history} />
    )
  }
}

const mapStateToProps = state => ({
  modal: state.pdf.modal,
  formEntries: state.pdf.formEntries

})

export default withRouter(connect(mapStateToProps, {
  getFormData,
  toggleModal,
  singleCheckboxEntry,
  allCheckboxEntry,
  getAllFormEntries,
  togglePopupSelectAllEntries
})(BulkGenerator))

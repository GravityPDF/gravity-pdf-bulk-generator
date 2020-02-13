import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PopUp from './components/PopUp'
import { processCheckbox, getSelectedEntryIds } from './actions/form'
import { generatePdfListSuccess, toggleModal } from './actions/pdf'
import { processFormEntriesAndFilters } from './helpers/processFormEntriesAndFilters'

class BulkGenerator extends React.Component {

  static propTypes = {
    generatePdfListSuccess: PropTypes.func.isRequired,
    selectedEntryIds: PropTypes.array.isRequired,
    processCheckbox: PropTypes.func.isRequired,
    getSelectedEntryIds: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    modal: PropTypes.bool.isRequired
  }

  state = {
    formId: ''
  }

  componentDidMount () {
    // Request form data
    this.getFormData()

    // Form action event listener
    this.formActionsListener()
  }

  getFormData = () => {
    // Global variable to get Form Data
    const formData = GPDF_BULK_GENERATOR

    this.setState({ formId: formData.form_id })

    this.generatePdfList(formData.pdfs)
  }

  generatePdfList = (pdfs) => {
    const list = []

    Object.entries(pdfs).map(item => {
      list.push({ id: item[0], name: item[1].name, templateSelected: item[1].template, active: false })
    })

    // Generate PDF list and assign it into its own reducer
    this.props.generatePdfListSuccess(list)
  }

  formActionsListener = () => {
    // Bulk apply button listener
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        const ids = document.getElementsByName('entry[]')

        this.processCheckbox(ids)

        const id = e.target.id
        const topDropdownOption = document.querySelector('#bulk-action-selector-top').value
        const buttomDropdownOption = document.querySelector('#bulk-action-selector-bottom').value
        const { selectedEntryIds } = this.props

        this.processApplyButton(id, topDropdownOption, buttomDropdownOption, selectedEntryIds)
      })
    })
  }

  processCheckbox = (ids) => {
    this.props.processCheckbox(ids)
  }

  processApplyButton = (id, topDropdownOption, buttomDropdownOption, selectedEntryIds) => {
    // Check if 'Download PDF' is selected at the top bulk action select box
    if (id === 'doaction' && topDropdownOption === 'download_pdf' && selectedEntryIds.length !== 0) {
      this.processEntryIds(selectedEntryIds)
    }

    // Check if 'Download PDF' is selected at the bottom bulk action select box
    if (id === 'doaction2' && buttomDropdownOption === 'download_pdf' && selectedEntryIds.length !== 0) {
      this.processEntryIds(selectedEntryIds)
    }
  }

  processEntryIds = (selectedEntryIds) => {
    const popupSelectAllEntries = document.querySelector('#gform-select-all-message a')

    // Check if popup select all entries is selected
    if (popupSelectAllEntries) {
      this.checkPopupSelectAllEntries(popupSelectAllEntries)
    }

    // If popup select all entries is not selected
    if (selectedEntryIds.length > 0 && !popupSelectAllEntries) {
      this.prcessRequestData()
    }
  }

  checkPopupSelectAllEntries = (popupSelectAllEntries) => {
    if (popupSelectAllEntries.text === 'Clear selection') {
      const { formId } = this.state
      const currentUrl = window.location.search
      const filterData = processFormEntriesAndFilters(currentUrl)

      this.props.getSelectedEntryIds(formId, filterData)

      this.prcessRequestData()
    } else {
      this.prcessRequestData()
    }
  }

  prcessRequestData = () => {
    const { toggleModal, history } = this.props

    toggleModal()
    history.push('/step/1')
  }

  render () {
    const { modal, history } = this.props

    return (
      <PopUp modal={modal} history={history} />
    )
  }
}

const mapStateToProps = state => ({
  formId: state.form.formId,
  generatedPdfList: state.form.generatedPdfList,
  selectedEntryIds: state.form.selectedEntryIds,
  modal: state.pdf.modal,
  formEntries: state.pdf.formEntries

})

export default withRouter(connect(mapStateToProps, {
  processCheckbox,
  getSelectedEntryIds,
  generatePdfListSuccess,
  toggleModal
})(BulkGenerator))

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PopUp from './components/PopUp/PopUp'
import { processCheckbox, getSelectedEntryIds } from './actions/form'
import {
  generatePdfListSuccess,
  toggleModal,
  generatePdfCancelled
} from './actions/pdf'
import { parseUrlForSearchParameters } from './helpers/parseUrlForSearchParameters'

class BulkGenerator extends React.Component {

  static propTypes = {
    generatePdfCancel: PropTypes.bool.isRequired,
    downloadPercentage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    generatePdfListSuccess: PropTypes.func.isRequired,
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
    this.setGlobalState()

    // Form action event listener
    this.setEventListeners()
  }

  componentDidUpdate (prevProps) {
    const { generatePdfCancel, downloadPercentage, history } = this.props

    // Set setGlobalState if cancelled at Step 2
    if (prevProps.location.pathname === '/step/2'  && prevProps.generatePdfCancel !== generatePdfCancel) {
      this.setGlobalState()
    }

    // Set setGlobalState after a successful download and modal closed at Step 3
    if (prevProps.location.pathname === '/step/3' && downloadPercentage === 0) {
      history.push('/')

      this.setGlobalState()
    }
  }

  setGlobalState = () => {
    // Global variable to get Form Data
    const { form_id, pdfs } = GPDF_BULK_GENERATOR

    this.setState({ formId: form_id })

    this.setPdfListState(pdfs)
  }

  setPdfListState = (pdfs) => {
    const pdfsArray = Object.entries(pdfs)
    let list

    // Check if there is more than 1 pdf template
    if (pdfsArray.length > 1) {
      list = this.generatePdfList(pdfsArray)

      // Add 'Toggle All' in the list
      list.unshift({ id: '0', name: 'Toggle All', templateSelected: '', active: false })
    } else {
      // Set active true by default if there's only 1 pdf template
      list = this.generatePdfList(pdfsArray, true)
    }

    // Generate PDF list and assign it into its own reducer
    this.props.generatePdfListSuccess(list)
  }

  generatePdfList = (pdfs, active) => {
    const list = []

    pdfs.map(item => {
      list.push({
        id: item[0],
        name: item[1].name,
        templateSelected: item[1].template,
        active: active ? true : false
      })
    })

    return list
  }

  setEventListeners = () => {
    // Bulk apply button listener
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        const ids = document.querySelectorAll('input[name="entry[]"]:checked')

        // dropdown is previous element to both selectors
        if( ids.length === 0 || e.target.previousElementSibling.value !== 'download_pdf' ) {
          return
        }

        this.props.processCheckbox(ids)
        this.processEntryIds()
      })
    })
  }

  processEntryIds = () => {
    const popupSelectAllEntries = document.getElementById('all_entries').value
    // Check if popup select all entries is selected
    if (popupSelectAllEntries === '1') {
      this.checkPopupSelectAllEntries()
    }

    this.processRequestData()
  }

  checkPopupSelectAllEntries = () => {
      const { formId } = this.state
      const filterData = parseUrlForSearchParameters(window.location.search)

      this.props.getSelectedEntryIds(formId, filterData)
  }

  processRequestData = () => {
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
  formEntries: state.pdf.formEntries,
  generatePdfCancel: state.pdf.generatePdfCancel,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

export default withRouter(connect(mapStateToProps, {
  processCheckbox,
  getSelectedEntryIds,
  generatePdfListSuccess,
  toggleModal,
  generatePdfCancelled
})(BulkGenerator))

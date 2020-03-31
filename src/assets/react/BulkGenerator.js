/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

/* Redux Actions */
import { processCheckbox, getSelectedEntryIds } from './actions/form'
import { generatePdfListSuccess, toggleModal } from './actions/pdf'

/* Components */
import PopUp from './components/PopUp/PopUp'

/* Helpers */
import { parseUrlForSearchParameters } from './helpers/parseUrlForSearchParameters'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * BulkGenerator Component
 *
 * @since 1.0
 */
class BulkGenerator extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
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

  /**
   * Initialize component state
   *
   * @type {formId: string}
   *
   * @since 1.0
   */
  state = {
    formId: ''
  }

  /**
   * On mount, call function setEventListener()
   *
   * @since 1.0
   */
  componentDidMount () {
    /* Form action event listener */
    this.setEventListener()
  }

  /**
   * On update, call functions based on conditions
   *
   * @param prevProps
   *
   * @since 1.0
   */
  componentDidUpdate (prevProps) {
    /* Call function deselectCheckbox() */
    if (prevProps.location.pathname === '/step/2' && !this.props.modal) {
      this.deselectCheckbox()
    }
  }

  /**
   * Set global state and local formId state
   *
   * @since 1.0
   */
  setGlobalState = () => {
    /* Global variable to get Form Data */
    const { form_id, pdfs } = GPDF_BULK_GENERATOR

    this.setState({ formId: form_id })

    this.setPdfListState(pdfs)
  }

  /**
   * Process PDF list state and add 'Toggle All' option in the list
   *
   * @param pdfs
   *
   * @since 1.0
   */
  setPdfListState = (pdfs) => {
    const pdfsArray = Object.entries(pdfs)
    let list

    /* Check if there is more than 1 pdf template */
    if (pdfsArray.length > 1) {
      list = this.generatePdfList(pdfsArray, true)

      /* Add 'Toggle All' in the list */
      list.unshift({ id: '0', name: 'Toggle All', templateSelected: '', active: true })
    } else {
      /* Set active true by default if there's only 1 pdf template */
      list = this.generatePdfList(pdfsArray, true)
    }

    /* Generate PDF list and assign it into its own reducer */
    this.props.generatePdfListSuccess(list)
  }

  /**
   * Generate PDF array list
   *
   * @param pdfs
   * @param active
   *
   * @returns {list: array}
   *
   * @since 1.0
   */
  generatePdfList = (pdfs, active) => {
    const list = []

    pdfs.map(item => {
      /* Push data into array list */
      list.push({
        id: item[0],
        name: item[1].name,
        templateSelected: item[1].template,
        active: active ? true : false
      })
    })

    return list
  }

  /**
   * Set event listener for bulk apply buttons
   *
   * @since 1.0
   */
  setEventListener = () => {
    /* Bulk apply buttons listener */
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        const ids = document.querySelectorAll('input[name="entry[]"]:checked')

        /* Check for both selectors dropdown value */
        if (ids.length === 0 || e.target.previousElementSibling.value !== 'download_pdf') {
          return false
        }

        /* Set global state and add 'Toggle All' option in the list */
        this.setGlobalState()

        /* Redux action */
        this.props.processCheckbox(ids)
        this.processEntryIds()
      })
    })
  }

  /**
   * Process entry IDs request
   *
   * @since 1.0
   */
  processEntryIds = () => {
    const popupSelectAllEntries = document.getElementById('all_entries').value
    /* Check if popup select all entries is selected */
    if (popupSelectAllEntries === '1') {
      this.checkPopupSelectAllEntries()
    }

    this.processRequestData()
  }

  /**
   * Process if Pop-up select all entries is selected
   *
   * @since 1.0
   */
  checkPopupSelectAllEntries = () => {
    const { formId } = this.state
    /* Process search request filters through URL data*/
    const filterData = parseUrlForSearchParameters(window.location.search)

    /* Redux action */
    this.props.getSelectedEntryIds(formId, filterData)
  }

  /**
   * Push to Step1
   *
   * @since 1.0
   */
  processRequestData = () => {
    const { toggleModal, history } = this.props

    toggleModal()
    history.push('/step/1')
  }

  /**
   * Deselect checkbox after cancellation on Step2
   *
   * @since 1.0
   */
  deselectCheckbox = () => {
    document.querySelector('#cb-select-all-1').click()
  }

  /**
   * Display BulkGenerator UI
   *
   * @returns {BulkGenerator: component}
   *
   * @since 1.0
   */
  render () {
    const { modal, history } = this.props

    return (
      <PopUp modal={modal} history={history} />
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns {modal: boolean, generatePdfCancel: function,
 * downloadPercentage: number, downloadZipUrl: *string}
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  modal: state.pdf.modal,
  generatePdfCancel: state.pdf.generatePdfCancel,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default withRouter(connect(mapStateToProps, {
  processCheckbox,
  getSelectedEntryIds,
  generatePdfListSuccess,
  toggleModal
})(BulkGenerator))

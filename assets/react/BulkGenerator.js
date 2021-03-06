/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
/* Redux Actions */
import { proceedStep1, processCheckbox, getSelectedEntriesId } from './actions/form'
import { generatePdfListSuccess } from './actions/pdf'
/* Components */
import PopUp from './components/PopUp/PopUp'
/* Helpers */
import { parseUrlForSearchParameters } from './helpers/parseUrlForSearchParameters'
import language from './helpers/language'

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
export class BulkGenerator extends React.Component {
  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    proceedStep1: PropTypes.func.isRequired,
    generatePdfListSuccess: PropTypes.func.isRequired,
    processCheckbox: PropTypes.func.isRequired,
    getSelectedEntriesId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    modal: PropTypes.bool.isRequired
  }

  /**
   * Initialize component state
   *
   * @type { formId }
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
   * @param prevProps: object
   *
   * @since 1.0
   */
  componentDidUpdate (prevProps) {
    /* Check modal state */
    if (!this.props.modal && prevProps.modal) {
      this.deselectCheckboxes()
    }
  }

  /**
   * Set global state and local formId state
   *
   * @since 1.0
   */
  setGlobalState = () => {
    /* Global variable to get Form Data */
    const { formId, pdfs } = GPDF_BULK_GENERATOR

    this.setState({ formId: formId })

    this.setPdfListState(pdfs)
  }

  /**
   * Process PDF list state and add 'Toggle All' option in the list
   *
   * @param pdfs: object
   *
   * @since 1.0
   */
  setPdfListState = (pdfs) => {
    let list

    /* Check if there is more than 1 pdf template */
    if (pdfs.length > 1) {
      list = this.generatePdfList(pdfs)

      /* Add 'Toggle All' in the list */
      list.unshift({ id: '0', name: language.toggleAll, templateSelected: '', active: false })
    } else {
      /* Set active true by default if there's only 1 pdf template */
      list = this.generatePdfList(pdfs, true)
    }

    /* Generate PDF list and assign it into its own reducer */
    this.props.generatePdfListSuccess(list)

    return list
  }

  /**
   * Generate PDF array list
   *
   * @param pdfs: array
   * @param active: boolean
   *
   * @returns { list: array }
   *
   * @since 1.0
   */
  generatePdfList = (pdfs, active) => {
    const list = []

    pdfs.map(item => {
      /* Push data into array list */
      list.push({
        id: item.id,
        name: item.name,
        templateSelected: item.template,
        active: !!active
      })
    })

    return list
  }

  /**
   * Set event listener for bulk apply buttons and call our redux action processCheckbox
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
        const ids = document.querySelectorAll('input[name="entry[]"]:checked')

        /* Check for both selectors dropdown value */
        if (ids.length === 0 || e.target.previousElementSibling.value !== 'download_pdf') {
          return false
        }

        e.preventDefault()

        /* Set global state and add 'Toggle All' option in the list */
        this.setGlobalState()

        this.props.proceedStep1()

        const popupSelectAllEntries = document.getElementById('all_entries').value

        /* Check if popup 'select all entries' is selected */
        if (popupSelectAllEntries === '1') {
          return this.processAllEntriesId()
        }

        this.props.processCheckbox(ids)
      })
    })
  }

  /**
   * Call our redux action getSelectedEntriesId and process form all entries ID
   *
   * @since 1.0
   */
  processAllEntriesId = () => {
    const { formId } = this.state
    /* Process search request filters through URL data */
    const filterData = parseUrlForSearchParameters(window.location.search)

    this.props.getSelectedEntriesId(formId, filterData)
  }

  /**
   * Deselect checkboxes after modal has been closed
   *
   * @since 1.0
   */
  deselectCheckboxes = () => {
    const selectAllCheckbox = document.getElementById('cb-select-all-1')
    if (selectAllCheckbox.checked) {
      selectAllCheckbox.click()
      document.getElementById('all_entries').value = false
      return
    }

    document.querySelectorAll('input[name="entry[]"]').forEach(item => {
      item.checked = false
    })
  }

  /**
   * Display BulkGenerator UI
   *
   * @returns { BulkGenerator: component }
   *
   * @since 1.0
   */
  render () {
    const { modal, history } = this.props

    return (
      <PopUp data-test='component-BulkGenerator' modal={modal} history={history} />
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns { modal: boolean, downloadZipUrl: string }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  modal: state.pdf.modal,
  downloadZipUrl: state.pdf.downloadZipUrl
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default withRouter(connect(mapStateToProps, {
  proceedStep1,
  processCheckbox,
  getSelectedEntriesId,
  generatePdfListSuccess
})(BulkGenerator))

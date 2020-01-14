import React from 'react'
import { connect } from 'react-redux'
import PopUp from './components/PopUp'
import { downloadPDFSelected, handleModal } from './actions/pdf'
import { withRouter } from 'react-router-dom'
import { singleCheckboxEntry, allCheckboxEntry } from './actions/pdf'

class BulkGenerator extends React.Component {

  componentDidMount () {
    // Event listener for Bulk Action SelectBox
    this.bulkDropdownSelect()

    // Event listener for the Apply Button
    this.bulkApplyButton()

    // Event listener for Entries individual checkbox
    this.checkbox()

    // Event listener for Select all entries checkbox
    this.checkboxSelectAllListener()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('componentDidUpdate - ')
  }

  bulkDropdownSelect = e => {
    [
      document.querySelector('#bulk-action-selector-top'),
      document.querySelector('#bulk-action-selector-bottom')
    ].forEach(e => {
      e.addEventListener('change', e => {
        e.target.value === 'download_pdf' && this.props.downloadPDFSelected()
      })
    })
  }

  bulkApplyButton = e => {
    [
      document.querySelector('#doaction'),
      document.querySelector('#doaction2')
    ].forEach(e => {
      e.addEventListener('click', e => {
        e.preventDefault()

        if (this.props.downloadPDF) {
          this.props.handleModal()
          this.props.history.push('/step/1')
        }
      })
    })
  }

  checkbox = e => {
    const totalEntries = document.querySelectorAll('.gform_list_checkbox').length

    document.querySelectorAll('[data-wp-lists="list:gf_entry"]')[0].addEventListener('change', e => {
      this.props.singleCheckboxEntry(e.target.value, totalEntries)
    })

  }

  checkboxSelectAllListener = e => {
    [
      document.querySelector('#cb-select-all-1'),
      document.querySelector('#cb-select-all-2')
    ].forEach(e => {
      e.addEventListener('change', e => {
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
  downloadPDF: state.pdf.downloadPDFSelected,
  modal: state.pdf.modal
})

export default withRouter(connect(mapStateToProps, {
  downloadPDFSelected,
  handleModal,
  singleCheckboxEntry,
  allCheckboxEntry
})(BulkGenerator))

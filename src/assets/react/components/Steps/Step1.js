import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import {
  generateActivePdfList,
  getSessionId,
  togglePdfStatus,
  toggleModal,
} from '../../actions/pdf'
import Step1Body from './Step1Body'
import ProgressBar from '../ProgressBar'
import { stripForwardSlashes } from '../../helpers/stripForwardSlashes'
import { cancelButton } from '../../helpers/cancelButton'

class Step1 extends React.Component {

  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    directoryStructure: PropTypes.string.isRequired,
    pdfList: PropTypes.array.isRequired,
    generatePdfCancel: PropTypes.bool.isRequired,
    updateDirectoryStructure: PropTypes.func.isRequired,
    generateActivePdfList: PropTypes.func.isRequired,
    getSessionId: PropTypes.func.isRequired,
    togglePdfStatus: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
  }

  componentWillUnmount() {
    document.removeEventListener('focus', this.handleFocus, true)
  }

  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  build = e => {
    e.preventDefault()

    const { directoryStructure, pdfList } = this.props
    const activePdfList = []
    // Set register API concurrency
    const concurrency = 5
    // Strip out forward slashes before passing to path
    const path = stripForwardSlashes(directoryStructure)

    pdfList.map(item => {
      item.active && activePdfList.push(item.id)
    })

    if (activePdfList.length === 0) {
      alert('Please specify at least one PDF you would like to generate for the selected entries.')
    } else {
      // Generate active PDF list
      this.props.generateActivePdfList(activePdfList)

      // Generate session ID and PDF
      this.props.getSessionId(path, concurrency)

      // Push history
      this.props.history.push('/step/2')
    }
  }

  tagSelect = tag => {
    const { directoryStructure } = this.props

    this.props.updateDirectoryStructure(directoryStructure + tag + '/')
  }

  tagDeselect = tag => {
    const { directoryStructure } = this.props

    this.props.updateDirectoryStructure(directoryStructure.replace(tag + '/', ''))
  }

  render () {
    const {
      pdfList,
      togglePdfStatus,
      directoryStructure,
      updateDirectoryStructure,
      tags,
      toggleModal,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <button
          className='close-button'
          onClick={e => cancelButton({ e, toggleModal, history })}>
          <span className='screen-reader-text'>Close dialog</span>
        </button>

        <ProgressBar step={1} />

        <Step1Body
          pdfList={pdfList}
          togglePdfStatus={togglePdfStatus}
          directoryStructure={directoryStructure}
          updateDirectoryStructure={updateDirectoryStructure}
          tags={tags}
          tagSelect={this.tagSelect}
          tagDeselect={this.tagDeselect} />

        <footer>
          <button
            className='button button-primary button-large'
            onClick={this.build}>
            Build
          </button>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  tags: state.tagPicker.tags,
  directoryStructure: state.tagPicker.directoryStructure,
  pdfList: state.pdf.pdfList,
  generatePdfCancel: state.pdf.generatePdfCancel
})

export default connect(mapStateToProps, {
  updateDirectoryStructure,
  generateActivePdfList,
  getSessionId,
  togglePdfStatus,
  toggleModal
})(Step1)

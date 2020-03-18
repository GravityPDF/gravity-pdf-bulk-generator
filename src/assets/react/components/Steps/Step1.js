import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import {
  generateSessionId,
  togglePdfStatus,
  toggleModal
} from '../../actions/pdf'
import Step1Body from './Step1Body'
import ProgressBar from '../ProgressBar/ProgressBar'
import { stripForwardSlashes } from '../../helpers/stripForwardSlashes'
import { cancelButton } from '../../helpers/cancelButton'

class Step1 extends React.Component {

  static propTypes = {
    directoryStructure: PropTypes.string.isRequired,
    pdfList:  PropTypes.array.isRequired,
    generateSessionId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    updateDirectoryStructure: PropTypes.func.isRequired,
    togglePdfStatus: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleModal: PropTypes.func.isRequired
  }

  state = {
    concurrency: 5,
    retryInterval: 3,
    delayInterval: 3000
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

    const { concurrency, retryInterval, delayInterval } = this.state
    const { directoryStructure, pdfList } = this.props

    // Generate active PDF list
    const activePdfList = []
    pdfList.map(item => {
      item.active && activePdfList.push(item.id)
    })

    // Check if there's an active PDF selected
    if (activePdfList.length === 0) {
      alert('Please select at least one PDF you would like to generate for this entries.')
    } else {
      // Strip out forward slashes before passing to path
      const path = stripForwardSlashes(directoryStructure)

      // Generate session ID and PDF
      this.props.generateSessionId(path, concurrency, retryInterval, delayInterval)
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
          className='gfpdf-close-button'
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
            className='gfpdf-button build'
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
  generateSessionId,
  togglePdfStatus,
  toggleModal
})(Step1)

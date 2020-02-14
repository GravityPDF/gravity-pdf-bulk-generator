import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toggleModal, resetPdfState } from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step3 extends React.Component {

  static propTypes = {
    downloadPercentage: PropTypes.number.isRequired,
    sessionId: PropTypes.string.isRequired,
    downloadZipUrl: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired,
    resetPdfState: PropTypes.func.isRequired,
    resetTagPickerState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.requestDownloadZipUrl()

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

  requestDownloadZipUrl = () => {
    const { downloadZipUrl } = this.props

    window.location.assign(downloadZipUrl)
  }

  render () {
    const {
      downloadZipUrl,
      toggleModal,
      resetTagPickerState,
      resetPdfState,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <button
          className='close-button'
          onClick={e => cancelButton({ e, toggleModal, resetTagPickerState, resetPdfState, history })}>
          <span className='screen-reader-text'>Close dialog</span>
        </button>

        <ProgressBar step={3} />

        <section id='gfpdf-step-3' className='gfpdf-step'>
          <h2>Your PDFs are ready and the download will begin shortly.</h2>

          <p>
            The zip file contains the PDFs for your selected entries. <a href={downloadZipUrl} download>Click here if
            the download does not
            start automatically</a>.
          </p>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sessionId: state.pdf.sessionId,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

export default connect(mapStateToProps, {
  toggleModal,
  resetTagPickerState,
  resetPdfState
})(Step3)

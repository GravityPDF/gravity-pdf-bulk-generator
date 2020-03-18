import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toggleModal, resetPdfState } from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import {
  toggleSuccess,
  toggleErrors,
  toggleWarnings
} from '../../actions/logs'
import ProgressBar from '../ProgressBar/ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'
import Step3Body from './Step3Body'

class Step3 extends React.Component {

  static propTypes = {
    sessionId: PropTypes.string.isRequired,
    success: PropTypes.bool.isRequired,
    errors: PropTypes.bool.isRequired,
    warnings: PropTypes.bool.isRequired,
    toggleSuccess: PropTypes.func.isRequired,
    toggleErrors: PropTypes.func.isRequired,
    toggleWarnings: PropTypes.func.isRequired,
    generatePdfSuccess: PropTypes.arrayOf(PropTypes.object).isRequired,
    generatePdfFailed: PropTypes.arrayOf(PropTypes.object).isRequired,
    generatePdfWarning: PropTypes.arrayOf(PropTypes.object).isRequired,
    downloadPercentage: PropTypes.number.isRequired,
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
      success,
      errors,
      warnings,
      toggleSuccess,
      toggleErrors,
      toggleWarnings,
      generatePdfSuccess,
      generatePdfFailed,
      generatePdfWarning,
      toggleModal,
      resetTagPickerState,
      resetPdfState,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <button
          className='gfpdf-close-button'
          onClick={e => cancelButton({ e, toggleModal, resetTagPickerState, resetPdfState, history })}>
          <span className='screen-reader-text'>Close dialog</span>
        </button>

        <ProgressBar step={3} />

        <Step3Body
          downloadZipUrl={downloadZipUrl}
          success={success}
          errors={errors}
          warnings={warnings}
          toggleSuccess={toggleSuccess}
          toggleErrors={toggleErrors}
          toggleWarnings={toggleWarnings}
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sessionId: state.pdf.sessionId,
  success: state.logs.success,
  errors: state.logs.errors,
  warnings: state.logs.warnings,
  generatePdfSuccess: state.pdf.generatePdfSuccess,
  generatePdfFailed: state.pdf.generatePdfFailed,
  generatePdfWarning: state.pdf.generatePdfWarning,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

export default connect(mapStateToProps, {
  toggleModal,
  resetTagPickerState,
  resetPdfState,
  toggleSuccess,
  toggleErrors,
  toggleWarnings
})(Step3)

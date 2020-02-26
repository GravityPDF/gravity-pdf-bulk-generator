import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toggleModal, generatePdfCancel } from '../../actions/pdf'
import {
  toggleSuccess,
  toggleErrors,
  toggleWarnings
} from '../../actions/logs'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'
import Step2Body from './Step2Body'

class Step2 extends React.Component {

  static propTypes = {
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
    generatePdfCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
  }

  componentDidUpdate (prevProps) {
    this.checkDownloadPercentage(prevProps)
  }

  componentWillUnmount () {
    document.removeEventListener('focus', this.handleFocus, true)
  }

  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  checkDownloadPercentage = (prevProps) => {
    const {
      generatePdfSuccess,
      downloadPercentage,
      downloadZipUrl,
      history
    } = this.props

    if (generatePdfSuccess.length > 0 && downloadPercentage === 100 && prevProps.downloadZipUrl !== downloadZipUrl) {
      setTimeout(() => history.push('/step/3'), 1000)
    }
  }

  render () {
    const {
      success,
      errors,
      warnings,
      toggleSuccess,
      toggleErrors,
      toggleWarnings,
      generatePdfSuccess,
      generatePdfFailed,
      generatePdfWarning,
      downloadPercentage,
      toggleModal,
      generatePdfCancel,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <ProgressBar step={2} />

        <Step2Body
          downloadPercentage={downloadPercentage}
          success={success}
          errors={errors}
          warnings={warnings}
          toggleSuccess={toggleSuccess}
          toggleErrors={toggleErrors}
          toggleWarnings={toggleWarnings}
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning} />

        <footer>
          <button
            className={downloadPercentage === 100 ? 'gfpdf-button cancel hide' : 'gfpdf-button cancel'}
            onClick={e => cancelButton({
              e,
              toggleModal,
              downloadPercentage,
              generatePdfCancel,
              history
            })}>
            Cancel
          </button>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
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
  generatePdfCancel,
  toggleSuccess,
  toggleErrors,
  toggleWarnings
})(Step2)

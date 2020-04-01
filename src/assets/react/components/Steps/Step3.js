/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Redux Actions */
import { resetPdfState, toggleModal } from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import { toggleErrors, toggleSuccess, toggleWarnings } from '../../actions/logs'
/* Components */
import ProgressBar from '../ProgressBar/ProgressBar'
import Step3Body from './Step3Body'
/* Helpers */
import { cancelButton } from '../../helpers/cancelButton'

/**
 * Step3 Component
 *
 * @since 1.0
 */
class Step3 extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
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

  /**
   * On mount, call function requestDownloadZipUrl() and add focus event to document
   *
   * @since 1.0
   */
  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
  }

  /**
   * Cleanup our document event listeners
   *
   * @since 1.0
   */
  componentWillUnmount () {
    document.removeEventListener('focus', this.handleFocus, true)
  }

  /**
   * When a focus event is fired and it's not apart of any DOM elements in our
   * container we will focus the container instead. In most cases this keeps the focus from
   * jumping outside our Template Container and allows for better keyboard navigation.
   *
   * @param e
   *
   * @since 1.0
   */
  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  /**
   * Display Step3 UI
   *
   * @returns {Step3: component}
   *
   * @since 1.0
   */
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

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns {sessionId: string, success: boolean, errors: boolean, warnings: boolean,
 * generatePdfSuccess: array of objects, generatePdfFailed: array of objects,
 * generatePdfWarning: array of objects, downloadPercentage: number,
 * downloadZipUrl: string}
 *
 * @since 1.0
 */
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

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default connect(mapStateToProps, {
  toggleModal,
  resetTagPickerState,
  resetPdfState,
  toggleSuccess,
  toggleErrors,
  toggleWarnings
})(Step3)

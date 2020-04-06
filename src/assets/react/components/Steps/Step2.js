/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Redux Actions */
import { generatePdfCancel, toggleModal } from '../../actions/pdf'
import { toggleErrors, toggleSuccess, toggleWarnings } from '../../actions/logs'
/* Components */
import ProgressBar from '../ProgressBar/ProgressBar'
import Step2Body from './Step2Body'
import FatalError from '../FatalError/FatalError'
/* Helpers */
import { cancelButton } from '../../helpers/cancelButton'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Step2 Component
 *
 * @since 1.0
 */
class Step2 extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
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
    fatalError: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  /**
   * On mount, Add focus event to document and call function errorHandling()
   *
   * @since 1.0
   */
  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)

    /* Verify that there's no fatal error */
    if (this.props.fatalError.verifyProcess) {
      this.errorHandling()
    }
  }

  /**
   * On update, call function errorHandling()
   *
   * @param prevPros
   *
   * @since 1.0
   */
  componentDidUpdate (prevPros) {
    /* Verify that there's no fatal error */
    if (prevPros.fatalError.verifyProcess !== this.props.fatalError.verifyProcess) {
      this.errorHandling()
    }
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
   * Check for fatal error
   *
   * @returns { generatePdfCancel: redux action | history: push history }
   *
   * @since 1.0
   */
  errorHandling = () => {
    const { generatePdfCancel, history } = this.props

    if (this.props.fatalError.fatalError) {
      return generatePdfCancel()
    }

    /* Proceed to Step3 */
    return history.push('/step/3')
  }

  /**
   * Display Step2 UI
   *
   * @returns { Step2: component }
   *
   * @since 1.0
   */
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
    const { fatalError } = this.props.fatalError

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <ProgressBar step={2} />

        {!fatalError && <Step2Body
          downloadPercentage={downloadPercentage}
          success={success}
          errors={errors}
          warnings={warnings}
          toggleSuccess={toggleSuccess}
          toggleErrors={toggleErrors}
          toggleWarnings={toggleWarnings}
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning} />}

        {
          fatalError &&
          <FatalError
            pluginUrl={GPDF_BULK_GENERATOR.plugin_url}
            adminUrl={GPDF_BULK_GENERATOR.admin_url} />
        }

        <footer>
          <button
            className='button cancel'
            onClick={e => cancelButton({
              e,
              toggleModal,
              fatalError,
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

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns { success: boolean, errors: boolean, warnings: boolean,
 * generatePdfSuccess: array of objects, generatePdfFailed: array of objects,
 * generatePdfWarning: array of objects, downloadPercentage: number,
 * downloadZipUrl: string, fatalError: object }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  success: state.logs.success,
  errors: state.logs.errors,
  warnings: state.logs.warnings,
  generatePdfSuccess: state.pdf.generatePdfSuccess,
  generatePdfFailed: state.pdf.generatePdfFailed,
  generatePdfWarning: state.pdf.generatePdfWarning,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl,
  fatalError: state.pdf.fatalError
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default connect(mapStateToProps, {
  toggleModal,
  generatePdfCancel,
  toggleSuccess,
  toggleErrors,
  toggleWarnings
})(Step2)

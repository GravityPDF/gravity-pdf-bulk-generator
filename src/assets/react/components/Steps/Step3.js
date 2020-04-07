/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Redux Actions */
import { toggleModal, resetPdfState } from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import { resetLogsState } from '../../actions/logs'
/* Components */
import ProgressBar from '../ProgressBar/ProgressBar'
import Step3Body from './Step3Body'
/* Helpers */
import { cancelButton } from '../../helpers/cancelButton'
import language from '../../helpers/language'

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
    downloadZipUrl: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired,
    resetTagPickerState: PropTypes.func.isRequired,
    resetPdfState: PropTypes.func.isRequired,
    resetLogsState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  /**
   * On mount, call function requestDownloadZipUrl and add focus event to document
   *
   * @since 1.0
   */
  componentDidMount () {
    this.requestDownloadZipUrl()

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
   * Auto download the generated PDF zip file
   *
   * @since 1.0
   */
  requestDownloadZipUrl = () => {
    window.location.assign(this.props.downloadZipUrl)
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
   * @returns { Step3: component }
   *
   * @since 1.0
   */
  render () {
    const {
      downloadZipUrl,
      toggleModal,
      resetTagPickerState,
      resetPdfState,
      resetLogsState,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <button
          className='gfpdf-close-button'
          onClick={e => cancelButton({
            e, toggleModal, resetTagPickerState, resetPdfState, resetLogsState, history
          })}>
          <span className='screen-reader-text'>{language.stepCloseDialog}</span>
        </button>

        <ProgressBar step={3} />

        <Step3Body downloadZipUrl={downloadZipUrl} />
      </div>
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns { downloadZipUrl: string }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
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
  resetLogsState
})(Step3)

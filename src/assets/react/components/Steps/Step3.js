import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getDownloadZip,
  toggleModal,
  resetPdfState
} from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step3 extends React.Component {

  static propTypes = {
    downloadPercentage: PropTypes.number.isRequired,
    downloadZipUrl: PropTypes.string.isRequired,
    getDownloadZip: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    resetPdfState: PropTypes.func.isRequired,
    resetTagPickerState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.requestDownloadZipUrl()
  }

  // componentDidUpdate (prevProps) {
  //   this.requestAutoZipDownload(prevProps)
  // }

  requestDownloadZipUrl = () => {
    const { downloadPercentage } = this.props

    if (downloadPercentage === 100) {
      this.props.getDownloadZip()
    }
  }

  // requestAutoZipDownload = (prevProps) => {
  //   const { downloadZipUrl } = this.props
  //
  //   if (prevProps.downloadZipUrl !== downloadZipUrl) {
  //     window.location.assign(downloadZipUrl)
  //   }
  // }

  render () {
    const {
      downloadZipUrl,
      toggleModal,
      resetTagPickerState,
      resetPdfState,
      history
    } = this.props

    return (
      <Fragment>
        <ProgressBar step={3} />

        <section id='gfpdf-step-3' className='gfpdf-step'>
          <h2>Your PDFs are ready and the download will begin shortly.</h2>

          <p>
            The zip file contains the PDFs for your selected entries. <a href={downloadZipUrl} download>Click here if
            the download does not
            start automatically</a>.
          </p>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={e => cancelButton({ e, step: 3, toggleModal, resetTagPickerState, resetPdfState, history })}>
            Close
          </button>
        </footer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

export default connect(mapStateToProps, {
  getDownloadZip,
  toggleModal,
  resetTagPickerState,
  resetPdfState
})(Step3)

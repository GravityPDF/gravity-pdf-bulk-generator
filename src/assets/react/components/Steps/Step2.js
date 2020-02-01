import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { CircularProgressbar } from 'react-circular-progressbar'
import {
  getGeneratePdf,
  generateDownloadPercentage,
  toggleModal,
  generateRetryPdf
} from '../../actions/pdf'
import LoadingDots from '../LoadingDots'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step2 extends React.Component {

  componentDidMount () {
    setTimeout(() => this.checkSessionID(), 1000)
  }

  componentDidUpdate (prevProps) {
    const {
      requestDownloadList,
      generatePdfCounter,
      generatePdfRetryList,
      generatePdfRetryAttempt,
      downloadPercentage
    } = this.props.pdf

    // if (prevProps.pdf.generatePdfCounter !== generatePdfCounter) {
    //   this.props.generateDownloadPercentage(generatePdfCounter)
    // }

    if (
      generatePdfCounter === requestDownloadList.length &&
      generatePdfRetryList.length > 0 && generatePdfRetryAttempt !== 0
    ) {
      this.props.generateRetryPdf(generatePdfRetryList)
    }

    // if (generatePdfRetryList.length === 0 && downloadPercentage === 100) {
    //   setTimeout(() => this.props.history.push('/step/3'), 100)
    // }
  }

  checkSessionID = () => {
    const { activePDFlist, sessionID } = this.props.pdf
    const { selectedEntryIDs } = this.props.pdf.formEntries
    const data = {
      sessionID,
      selectedEntryIDs,
      activePDFlist
    }

    if (sessionID !== null) {
      this.props.getGeneratePdf(data)
    }
  }

  render () {
    const { history, toggleModal } = this.props
    const { downloadPercentage } = this.props.pdf

    return (
      <Fragment>
        <ProgressBar step={2} />

        <section id='gfpdf-step-2' className='gfpdf-step'>
          <CircularProgressbar
            value={downloadPercentage}
            text={`${downloadPercentage}%`} />

          <h2>Building your PDFs<LoadingDots /></h2>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={e => cancelButton(e, { history, toggleModal })}>
            Cancel
          </button>
        </footer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  pdf: state.pdf
})

export default connect(mapStateToProps, {
  getGeneratePdf,
  generateDownloadPercentage,
  toggleModal,
  generateRetryPdf
})(Step2)

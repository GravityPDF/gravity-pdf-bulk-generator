import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { getDownloadZip, toggleModal } from '../../actions/pdf'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step3 extends React.Component {

  componentDidMount () {
    const { downloadPercentage, sessionID } = this.props.pdf

    if (downloadPercentage === 100) {
      // this.props.getDownloadZip(sessionID)
    }
  }

  componentDidUpdate (prevProps) {
    const { downloadZipUrl } = this.props.pdf

    if (prevProps.pdf.downloadZipUrl !== downloadZipUrl) {
      window.location.assign(downloadZipUrl)
    }
  }

  render () {
    const { history, toggleModal } = this.props
    const { downloadZipUrl } = this.props.pdf

    return (
      <Fragment>
        <ProgressBar step={3} />

        <section id='gfpdf-step-3' className='gfpdf-step'>
          <h2>Your PDFs are ready and the download will begin shortly.</h2>

          <p>
            The zip file contains the PDFs for your selected entries. <a href={downloadZipUrl} download>Click here if the download does not
            start automatically</a>.
          </p>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={e => cancelButton(e, { history, toggleModal })}>
            Close
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
  getDownloadZip,
  toggleModal
})(Step3)

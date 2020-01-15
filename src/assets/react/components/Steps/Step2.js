import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgressbar } from 'react-circular-progressbar'
import { toggleModal, generatePdfCancel } from '../../actions/pdf'
import LoadingDots from '../LoadingDots'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step2 extends React.Component {

  static propTypes = {
    generatePdFailed: PropTypes.string.isRequired,
    downloadPercentage: PropTypes.number.isRequired,
    toggleModal: PropTypes.func.isRequired,
    generatePdfCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidUpdate () {
    this.checkDownloadPercentage()
  }

  checkDownloadPercentage = () => {
    const { generatePdFailed, downloadPercentage, history } = this.props

    if (generatePdFailed === '' && downloadPercentage === 100) {
      setTimeout(() => history.push('/step/3'), 1000)
    }
  }

  render () {
    const {
      downloadPercentage,
      toggleModal,
      generatePdfCancel,
      history
    } = this.props

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
            onClick={e => cancelButton({ e, step: 2, toggleModal, generatePdfCancel, history })}>
            Cancel
          </button>
        </footer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  generatePdFailed: state.pdf.generatePdFailed,
  downloadPercentage: state.pdf.downloadPercentage

})

export default connect(mapStateToProps, { toggleModal, generatePdfCancel })(Step2)

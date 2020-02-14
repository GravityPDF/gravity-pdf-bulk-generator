import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgressbar } from 'react-circular-progressbar'
import { toggleModal, generatePdfCancel } from '../../actions/pdf'
import LoadingDots from '../LoadingDots'
import ProgressBar from '../ProgressBar'
import { cancelButton } from '../../helpers/cancelButton'

class Step2 extends React.Component {

  static propTypes = {
    generatePdFailed: PropTypes.array.isRequired,
    downloadPercentage: PropTypes.number.isRequired,
    downloadZipUrl: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired,
    generatePdfCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
  }

  componentDidUpdate () {
    this.checkDownloadPercentage()
  }

  componentWillUnmount() {
    document.removeEventListener('focus', this.handleFocus, true)
  }

  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  checkDownloadPercentage = () => {
    const { downloadPercentage, downloadZipUrl, history } = this.props

    if (downloadPercentage === 100 && downloadZipUrl !== '') {
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
      <div ref={node => this.container = node} tabIndex='-1'>
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
            onClick={e => cancelButton({ e, toggleModal, generatePdfCancel, history })}>
            Cancel
          </button>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  generatePdFailed: state.pdf.generatePdFailed,
  downloadPercentage: state.pdf.downloadPercentage,
  downloadZipUrl: state.pdf.downloadZipUrl
})

export default connect(mapStateToProps, { toggleModal, generatePdfCancel })(Step2)

import React from 'react'
import { connect } from 'react-redux'
import ProgressBar from '../ProgressBar'

class Step3 extends React.Component {
  close = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/')
  }

  render () {

    return (
      <>
        <ProgressBar step={3} />

        <section id="gfpdf-step-3" className="gfpdf-step">
          <h2>Your PDFs are ready and the download will begin shortly.</h2>

          <p>The zip file contains the PDFs for your selected entries. <a href="#">Click here if the download does not start automatically</a>.</p>
        </section>

        <footer>
          <button className="button button-large" onClick={this.close}>Close</button>
        </footer>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const MapStateToProps = (state) => {
  return {}
}

export default connect(MapStateToProps, mapDispatchToProps)(Step3)

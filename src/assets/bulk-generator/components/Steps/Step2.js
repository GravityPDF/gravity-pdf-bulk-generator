import React from 'react'
import { connect } from 'react-redux'
import ProgressBar from '../ProgressBar'
import CircularProgressbar from 'react-circular-progressbar'
import LoadingDots from '../LoadingDots'
import './Step2.scss'

class Step2 extends React.Component {
  cancel = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/')
  }

  constructor (props) {
    super(props)

    this.state = {
      percentage: 0
    }
  }

  render () {
    const {percentage} = this.state

    setTimeout(() => this.setState({percentage: percentage + 1}), 200)

    return (
      <>
        <ProgressBar step={2} />

        <section id="gfpdf-step-2" className="gfpdf-step">
          <CircularProgressbar
            percentage={percentage}
            text={`${percentage}%`}
          />

          <h2>Building your PDFs<LoadingDots /></h2>
        </section>

        <footer>
          <button className="button button-large" onClick={this.cancel}>Cancel</button>
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

export default connect(MapStateToProps, mapDispatchToProps)(Step2)

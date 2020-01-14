import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ProgressBar from '../ProgressBar'
import { CircularProgressbar } from 'react-circular-progressbar'
import LoadingDots from '../LoadingDots'
import { disableModal } from '../../actions/pdf'
import { incrementPercentage } from '../../actions/tagPicker'
import './Step2.scss'

class Step2 extends React.Component {

  componentDidUpdate () {
    if (this.props.percentage >= 100) {
      this.props.history.push('/step/3')
    }
  }

  cancel = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/')
    this.props.disableModal()
  }

  render () {
    const { percentage } = this.props

    if (percentage <= 100) {
      setTimeout(() => this.props.incrementPercentage(), 200)
    }

    return (
      <Fragment>
        <ProgressBar step={2} />

        <section id='gfpdf-step-2' className='gfpdf-step'>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`} />

          <h2>Building your PDFs<LoadingDots /></h2>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={this.cancel}>
            Cancel
          </button>
        </footer>
      </Fragment>
    )
  }
}

const MapStateToProps = state => ({
  percentage: state.tagPicker.percentage
})

export default connect(MapStateToProps, { disableModal, incrementPercentage })(Step2)

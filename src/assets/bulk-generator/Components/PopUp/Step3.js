import React from 'react'
import { connect } from 'react-redux'
import ProgressBar from '../ProgressBar'

class Step3 extends React.Component {
  cancel = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/step/2')
  }

  render () {
    return (
      <>
        <ProgressBar step={3} />

        <section className="gfpdf-step">
          <h3>Step 3</h3>
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

export default connect(MapStateToProps, mapDispatchToProps)(Step3)

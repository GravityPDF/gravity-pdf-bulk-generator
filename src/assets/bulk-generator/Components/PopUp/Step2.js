import React from 'react'
import { connect } from 'react-redux'
import ProgressBar from './ProgressBar'

class Step2 extends React.Component {
  cancel = event => {
    event.stopPropagation()
    this.props.history.push('/step/1')
  }

  next = event => {
    event.stopPropagation()
    this.props.history.push('/step/3')
  }

  render () {
    return (
      <>
        <ProgressBar step={2} />

        <section className="gfpdf-step">
            <h3>Step 2</h3>
        </section>

        <footer>
          <button className="button button-large" onClick={this.cancel}>Cancel</button>

          <button className="button button-large" onClick={this.next}>Next</button>
        </footer>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

const MapStateToProps = (state) => {
  return {

  }
}

export default connect(MapStateToProps, mapDispatchToProps)(Step2)

import React from 'react'
import { Route } from 'react-router-dom'
import Steps from './Steps'
import posed, { PoseGroup } from 'react-pose'
import './PopUp.scss'

const Fade = posed.div({
  enter: {
    opacity: 1,
    transition: {
      duration: 200
    }
  },
  exit: {opacity: 0}
})

const SlideDown = posed.div({
  enter: {
    y: 0,
    transition: {
      duration: 5000,
      ease: [0.215, 0.61, 0.355, 1],
    }
  },
  exit: {
    y: '-100%',
    transition: {
      duration: 5000,
      ease: [0.215, 0.61, 0.355, 1],
    }
  }
})

class PopUp extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      initial: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({initial: false})
    }
  }

  render () {
    const currentLocation = this.props.location.pathname.split('/')[1]

    if (this.state.initial) {
      return null
    }

    return (
      <PoseGroup flipMove={false}>
        <Fade key={'overlay-' + currentLocation}>
          <Route key="overlay" path="/step" render={() => <div id="gfpdf-bulk-generator-overlay" />} />
        </Fade>

        <SlideDown key={'steps-' + currentLocation} id="gfpdf-bulk-generator-popup">
          <Route key="steps" path="/step/:stepId"
                 render={props => <Steps {...props} container={this.props.container} />} />
        </SlideDown>
      </PoseGroup>
    )
  }
}

export default PopUp


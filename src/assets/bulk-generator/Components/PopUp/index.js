import React from 'react'
import { Route } from 'react-router-dom'
import Steps from './Steps'
import posed, { PoseGroup } from 'react-pose'
import './PopUp.scss'

const Fade = posed.div({
  enter: {
    opacity: 1,
    transition: {
      duration: 150
    }
  },
  exit: {opacity: 0}
})

const SlideDown = posed.div({
  enter: {
    y: 0,
    transition: {
      duration: 750,
      ease: [0.215, 0.61, 0.355, 1],
    }
  },
  exit: {
    y: '-100%',
    transition: {
      duration: 350,
      ease: [0.215, 0.61, 0.355, 1],
    }
  }
})

class PopUp extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      isVisible: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location !== nextProps.location && this.getCurrentLocation(nextProps.location) === 'step') {
      this.setState({isVisible: true})
    } else {
      this.setState({isVisible: false})
    }
  }

  getCurrentLocation (newLocation = null) {
    if (newLocation === null) {
      return this.props.location.pathname.split('/')[1]
    } else {
      return newLocation.pathname.split('/')[1]
    }
  }

  render () {
    const location = this.getCurrentLocation()

    return (
      <PoseGroup flipMove={false}>
        {this.state.isVisible && [
          <Fade key={'overlay-' + location}>
            <Route key="overlay" path="/step" render={() => <div id="gfpdf-bulk-generator-overlay" />} />
          </Fade>,

          <SlideDown key={'steps-' + location} id="gfpdf-bulk-generator-popup">
            <Route key="steps" path="/step/:stepId"
                   render={props => <Steps {...props} container={this.props.container} />} />
          </SlideDown>
        ]}
      </PoseGroup>
    )
  }
}

export default PopUp


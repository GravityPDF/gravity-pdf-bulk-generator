import React from 'react'
import { Route } from 'react-router-dom'
import Steps from './Steps'
import { Overlay } from './Overlay'
import { Fade, SlideDown } from './animations'
import { PoseGroup } from 'react-pose'
import './PopUp.scss'

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
            <Route key="overlay" path="/step" component={Overlay} />
          </Fade>,

          <SlideDown key={'steps-' + location} id="gfpdf-bulk-generator-popup">
            <Route key="steps" path="/step/:stepId" component={Steps} />
          </SlideDown>
        ]}
      </PoseGroup>
    )
  }
}

export default PopUp


import React from 'react'
import { Route } from 'react-router-dom'
import Steps from '../Steps/Steps'
import { Overlay } from './Overlay'
import { Fade, SlideDown } from './animations'
import { PoseGroup } from 'react-pose'
import './PopUp.scss'

class PopUp extends React.Component {

  render () {
    return (
      <PoseGroup flipMove={false}>
        {this.props.modal && [
          <Fade key='fade'>
            <Route
              key='overlay'
              path='/step'
              component={Overlay} />
          </Fade>,

          <SlideDown
            key='slidedown'
            id='gfpdf-bulk-generator-popup'>
            <Route
              key='steps'
              path='/step/:stepId'
              component={Steps} />
          </SlideDown>
        ]}
      </PoseGroup>
    )
  }
}

export default PopUp


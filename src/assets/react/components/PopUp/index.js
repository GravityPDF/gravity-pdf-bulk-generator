import React from 'react'
import { Route } from 'react-router-dom'
import { PoseGroup } from 'react-pose'
import { Fade, SlideDown } from './animations'
import { Overlay } from './Overlay'
import Steps from '../Steps/Steps'

class PopUp extends React.Component {

  render () {
    return (
      <PoseGroup flipMove={false}>
        {this.props.pdf.modal && [
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

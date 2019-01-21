import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Step1 from './Step1'
import Step2 from './Step2'
import posed, { PoseGroup } from 'react-pose'

const SlideRight = posed.div({
  enter: {
    x: 0
  },
  exit: {
    x: '-100%'
  }
})

class Steps extends React.Component {

  render () {
    return (
      <>
        <header>
          <h2>PDF Bulk Download</h2>
        </header>

        <PoseGroup>
          <SlideRight key={this.props.location.key}>
            <Switch>
              <Route path="/step/1" component={Step1} key="step1" />
              <Route path="/step/2" component={Step2} key="step2" />
            </Switch>
          </SlideRight>
        </PoseGroup>
      </>
    )
  }
}

export default Steps

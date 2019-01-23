import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

class Steps extends React.Component {

  render () {
    return (
      <>
        <header>
          <h2>PDF Bulk Download</h2>
        </header>

        <Switch>
          <Route path="/step/1" component={Step1} />
          <Route path="/step/2" component={Step2} />
          <Route path="/step/3" component={Step3} />
        </Switch>
      </>
    )
  }
}

export default Steps

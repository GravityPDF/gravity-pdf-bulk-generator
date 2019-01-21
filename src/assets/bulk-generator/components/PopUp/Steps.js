import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Step1 from './Step1'
import Step2 from './Step2'

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
        </Switch>
      </>
    )
  }
}

export default Steps

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Step1 from './Step1'

class Steps extends React.Component {

  render () {
    return (
      <div id="gfpdf-bulk-generator-popup">
        <header>
          <h2>PDF Bulk Download</h2>
        </header>

        <Switch>
          <Route path="/step/1" render={props => (<Step1 {...props} container={this.props.container} />)} />
        </Switch>
      </div>
    )
  }
}

export default Steps

import React from 'react'
import './PopUp.scss'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import Step1 from './Step1'

class PopUp extends React.Component {
  render () {
    return (
      <>
        <div id="gfpdf-bulk-generator-overlay"></div>

        <Router>
          <div id="gfpdf-bulk-generator-popup">

            <header>
              <h2>PDF Bulk Download</h2>
            </header>

            <ProgressBar />

            <Switch>
              <Route path="/" component={Step1} />
            </Switch>
          </div>
        </Router>
      </>
    )
  }
}

export default PopUp

import React from 'react'
import './PopUp.scss'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import Step1 from './Step1'

class Index extends React.Component {
  render () {
    return (
      <>
        <div id="gfpdf-bulk-generator-overlay"></div>

        <Router>
          <div id="gfpdf-bulk-generator-popup">

            <header>
              <h2>PDF Bulk Download</h2>
            </header>

            <ol className="gfpdf-progress-steps">
              <li className="active">Configure</li>
              <li>Create</li>
              <li>Compress</li>
              <li>Download</li>
            </ol>

            <Switch>
              <Route path="/" component={Step1} />
            </Switch>
          </div>
        </Router>
      </>
    )
  }
}

export default Index

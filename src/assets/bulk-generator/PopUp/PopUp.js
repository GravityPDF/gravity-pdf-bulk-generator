import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import './PopUp.scss'
import Switch from '../Switch/Switch.js'

class PopUp extends React.Component {
  cancel = event => {
    unmountComponentAtNode(this.props.container)
    event.stopPropagation()
  }

  render () {
    return (
      <>
        <div id="gfpdf-bulk-generator-overlay"></div>

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

          <section className="gfpdf-step">
            <div className="gfpdf-settings-group">
              <h3>Select PDFs</h3>

              <p>Specify which PDFs you would like to generate for the selected entries.</p>

              <ol className="gfpdf-toggle-list">
                <li>
                  <label>Certificate of Completion <span>(ID: 1234567)</span></label>

                  <Switch screenReaderLabel="Label" />
                </li>

                <li>
                  <label>Certificate of Completion <span>ID: 1234567</span></label>

                  <Switch screenReaderLabel="Label" />
                </li>
              </ol>
            </div>

            <div className="gfpdf-settings-group">
              <h3>Directory Structure</h3>

              <p>Specify the directory structure to use for the PDFs of the selected entries. Merge tags are supported.</p>

              <input type="text" name="gfpdf-directory-structure" value="/{entry_id}/" className="regular-text code" />

              <p>Common tags:</p>

              <div className="gfpdf-tags">
                <button type="button" className="button button-secondary active" data-tag="{entry_id}">Entry ID</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Year</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Month</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Day</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Hour</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Minute</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">User Login</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">User Email</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">User Display Name</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Payment Status</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Payment Method</button>
                <button type="button" className="button button-secondary" data-tag="{entry_id}">Transaction Type</button>
              </div>
            </div>
          </section>

          <footer>
            <button className="button button-large" onClick={this.cancel}>Cancel</button>

            <button className="button button-primary button-large">Build</button>
          </footer>
        </div>
      </>
    )
  }
}

export default PopUp

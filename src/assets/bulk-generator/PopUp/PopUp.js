import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import './PopUp.scss'

class PopUp extends React.Component {
  close = event => {
    unmountComponentAtNode(this.props.container)
    event.stopPropagation()
  }

  render () {
    return (
      <>
        <div id="gfpdf-bulk-generator-overlay" onClick={this.close}></div>
        <div id="gfpdf-bulk-generator-popup">

          <div id="gfpdf-bulk-generator-close"><a href="#" onClick={this.close}>
            <span className="dashicons dashicons-no-alt"></span>
            <span className="screen-reader-text">Close</span>
          </a></div>

          <ol className="gfpdf-progress-steps">
            <li className="active">Configure</li>
            <li>Create</li>
            <li>Compress</li>
            <li>Download</li>
          </ol>
        </div>
      </>
    )
  }
}

export default PopUp

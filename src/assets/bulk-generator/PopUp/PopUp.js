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
          <div id="gfpdf-bulk-generator-close"><a href="#" onClick={this.close}>Close</a></div>

          <div className="accordion-title">1. Select</div>
          <div className="accordion-title">2. Create</div>
          <div className="accordion-title">3. Compress</div>
          <div className="accordion-title">4. Download</div>
        </div>
      </>
    )
  }
}

export default PopUp

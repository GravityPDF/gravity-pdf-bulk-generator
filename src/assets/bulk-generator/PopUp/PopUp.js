import React from 'react'
import './PopUp.scss'

class PopUp extends React.Component {
  render () {
    return (
      <>
        Close

        <div className="accordion-title">1. Select</div>
        <div className="accordion-title">2. Create</div>
        <div className="accordion-title">3. Compress</div>
        <div className="accordion-title">4. Download</div>
      </>
    )
  }
}

export default PopUp

import React, { Component } from 'react'
import Switch from 'react-switch'

export default class MaterialDesignSwitch extends Component {
  constructor () {
    super()
    this.state = {checked: false}
  }

  handleChange = checked => {
    this.setState({checked})
  }

  render () {
    return (
      <Switch
        checked={this.state.checked}
        onChange={this.handleChange}
        offColor="#AAA"
        onColor="#5BC236"
        uncheckedIcon={false}
        height={26}
        width={52}
        className="gfpdf-switch"
        aria-label={this.props.screenReaderLabel}
      />
    )
  }
}
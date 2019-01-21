import React from 'react'
import PopUp from './components/PopUp'
import { MemoryRouter as Router, withRouter } from 'react-router-dom'
import { render } from 'react-dom'
import Provider from 'react-redux/es/components/Provider'
import { getStore } from './store'

export class Entry extends React.Component {
  componentWillMount () {
    this.props.history.push('/step/1')
  }

  render () {
    return (
      <PopUp {...this.props} />
    )
  }
}

export function initilize (container) {
  const store = getStore()
  const LoadApp = withRouter(Entry)

  render(
    <Provider store={store}>
      <Router>
        <LoadApp />
      </Router>
    </Provider>,
    container
  )
}
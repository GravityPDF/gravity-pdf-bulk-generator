import React from 'react'
import './PopUp.scss'
import { Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Steps from './Steps'

class PopUp extends React.Component {

  constructor (props) {
    super(props)
    props.history.push('/step/1')
  }

  render () {
    return (
      <>
        <Route exact path="/" component={null} />

        <TransitionGroup component={null}>
          <CSSTransition key={this.props.location.pathname} timeout={1000} classNames="slide-down">
            <Route path="/step/:stepId" render={props => (<Steps {...props} container={this.props.container} />)} />
          </CSSTransition>
        </TransitionGroup>
      </>
    )
  }
}

export default PopUp

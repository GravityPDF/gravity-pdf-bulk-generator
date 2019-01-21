import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import posed, { PoseGroup } from 'react-pose'

const SlideRight = posed.div({
  enter: {
    x: 0,
    transition: {
      duration: 3000
    }
  },
  exit: {
    transition: {
      duration: 3000,
      delay: 1000
    },
    x: (props) => {
      console.log(props)
      return id === currentRoute ? '100%' : '-100%'
    },
  }
})

class Steps extends React.Component {

  render () {

    const routes = [
      {'path': '/step/1', 'component': Step1, 'key': 'step1'},
      {'path': '/step/2', 'component': Step2, 'key': 'step2'},
      {'path': '/step/3', 'component': Step3, 'key': 'step3'},
    ]

    return (
      <>
        <header>
          <h2>PDF Bulk Download</h2>
        </header>

        <PoseGroup id="gfpdf-bulk-generator-popup-inner">
          <SlideRight key={this.props.location.key} currentRoute={this.props.location.pathname}>
            {routes.map(item => <Route path={item.path} component={item.component} key={item.key} id={item.key} />)}
          </SlideRight>
        </PoseGroup>
      </>
    )
  }
}

export default Steps

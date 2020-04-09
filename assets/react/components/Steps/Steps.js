/* Dependencies */
import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
/* Components */
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
/* Helpers */
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Steps Component
 *
 * @since 1.0
 */
class Steps extends React.Component {

  /**
   * Display Steps UI
   *
   * @returns { Steps: component }
   *
   * @since 1.0
   */
  render () {
    return (
      <Fragment>
        <header>
          <h2>{language.stepTitle}</h2>
        </header>

        <Switch>
          <Route path='/step/1' component={Step1} />
          <Route path='/step/2' component={Step2} />
          <Route path='/step/3' component={Step3} />
        </Switch>
      </Fragment>
    )
  }
}

export default Steps

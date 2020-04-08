/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Components */
import InfoBox from './InfoBox'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

class Logs extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    generatePdfSuccess: PropTypes.arrayOf(PropTypes.object).isRequired,
    generatePdfWarning: PropTypes.arrayOf(PropTypes.object).isRequired,
    generatePdfFailed: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  /**
   * Initialize component state
   *
   * @type { success: boolean, errors: boolean, warnings: boolean }
   *
   * @since 1.0
   */
  state = {
    success: false,
    errors: false,
    warnings: false
  }

  /**
   * Toggle success log state
   *
   * @since 1.0
   */
  toggleSuccess = () => {
    this.setState({ success: !this.state.success })
  }

  /**
   * Toggle errors log state
   *
   * @since 1.0
   */
  toggleErrors = () => {
    this.setState({ errors: !this.state.errors })
  }

  /**
   * Toggle warnings log state
   *
   * @since 1.0
   */
  toggleWarnings = () => {
    this.setState({ warnings: !this.state.warnings })
  }

  /**
   * Display Logs UI
   *
   * @returns { Logs: component }
   *
   * @since 1.0
   */
  render() {
    const { success, errors, warnings } = this.state
    const { generatePdfSuccess, generatePdfFailed, generatePdfWarning } = this.props

    return (
      <div className='logs'>
        {
          /* Display success logs */
          generatePdfSuccess.length > 0 && (
            <div className='log-box'>
              <InfoBox
                title='Success'
                state={success}
                toggle={this.toggleSuccess}
                list={generatePdfSuccess} />
            </div>
          )
        }

        {
          /* Display errors/failed logs */
          generatePdfFailed.length > 0 && (
            <div className='log-box'>
              <InfoBox
                title='Errors'
                state={errors}
                toggle={this.toggleErrors}
                list={generatePdfFailed} />
            </div>
          )
        }

        {
          /* Display warning logs */
          generatePdfWarning.length > 0 && (
            <div className='log-box'>
              <InfoBox
                title='Warnings'
                state={warnings}
                toggle={this.toggleWarnings}
                list={generatePdfWarning} />
            </div>
          )
        }
      </div>
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns { generatePdfSuccess: array of objects, generatePdfFailed: array of objects,
 * generatePdfWarning: array of objects }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  generatePdfSuccess: state.logs.generatePdfSuccess,
  generatePdfFailed: state.logs.generatePdfFailed,
  generatePdfWarning: state.logs.generatePdfWarning
})

export default connect(mapStateToProps, {})(Logs)

/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * TagPicker Component
 *
 * @since 1.0
 */
class TagPicker extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    onSelectCallback: PropTypes.func.isRequired,
    onDeselectCallback: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired
  }

  /**
   * Initialize component state
   *
   * @param props
   *
   * @since 1.0
   */
  constructor (props) {
    super(props)

    this.state = {
      selectedTags: this.getActiveTags(this.props.inputValue)
    }
  }

  /**
   * On update, set new state for selectedTags
   *
   * @param prevProps
   *
   * @since 1.0
   */
  componentDidUpdate (prevProps) {
    const { inputValue } = this.props

    if (prevProps.inputValue !== inputValue) {
      this.setState({ selectedTags: this.getActiveTags(inputValue) })
    }
  }

  /**
   * Get selected active tags and store it into an array
   *
   * @param value
   *
   * @returns {selectedTags: array}
   *
   * @since 1.0
   */
  getActiveTags = (value) => {
    const selectedTags = []
    const { tags } = this.props

    tags.map((tag) => {
      /* Perform a check and store data into an array */
      if (value.match('/' + this.escapeRegexString(tag.id) + '/') !== null) {
        selectedTags.push(tag.id)
      }
    })

    return selectedTags
  }

  /**
   * Perform escape regex string operation (removing special characters)
   *
   * @param string
   *
   * @returns {result: string}
   *
   * @since 1.0
   */
  escapeRegexString = (string) => {
    /* See https://stackoverflow.com/a/6969486/1614565 */
    const result = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    return result
  }

  /**
   * Common tags event click listener
   *
   * @param tag
   * @param e
   *
   * @returns {onDeselectCallback: function, onSelectCallback: function}
   *
   * @since 1.0
   */
  tagClicked = (tag, e) => {
    const { onSelectCallback, onDeselectCallback } = this.props

    /* Check class if contain the text 'active' */
    if (e.target.classList.contains('active')) {
      return onDeselectCallback(tag.id)
    }

    return onSelectCallback(tag.id)
  }

  /**
   * Display TagPicker UI
   *
   * @returns {TagPicker: component}
   *
   * @since 1.0
   */
  render () {
    const { selectedTags } = this.state
    const { tags } = this.props

    return (
      <div className='gfpdf-tags'>
        {
          tags.map((tag, index) => {
            const isActive = selectedTags.indexOf(tag.id) !== -1 ? ' active' : ''
            const classes = 'button tag-picker' + isActive

            return (
              <button
                key={index}
                type='button'
                className={classes}
                onClick={(e) =>
                  this.tagClicked(tags[index], e)}>
                {tag.label}
              </button>
            )
          })
        }
      </div>
    )
  }
}

export default TagPicker

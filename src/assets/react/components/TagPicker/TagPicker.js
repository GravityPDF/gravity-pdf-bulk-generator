import React from 'react'
import PropTypes from 'prop-types'

class TagPicker extends React.Component {

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

  constructor (props) {
    super(props)

    this.state = {
      selectedTags: this.getActiveTags(this.props.inputValue)
    }
  }

  componentDidUpdate (prevProps) {
    const { inputValue } = this.props

    if (prevProps.inputValue !== inputValue) {
      this.setState({ selectedTags: this.getActiveTags(inputValue) })
    }
  }

  getActiveTags = (value) => {
    const selectedTags = []
    const { tags } = this.props

    tags.map((tag) => {
      if (value.match('/' + this.escapeRegexString(tag.id) + '/') !== null) {
        selectedTags.push(tag.id)
      }
    })

    return selectedTags
  }

  escapeRegexString = (string) => {
    /* See https://stackoverflow.com/a/6969486/1614565 */
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  tagClicked = (tag, e) => {
    const { onSelectCallback, onDeselectCallback } = this.props

    if (e.target.classList.contains('active')) {
      onDeselectCallback(tag.id)
    } else {
      onSelectCallback(tag.id)
    }
  }

  render () {
    const { selectedTags } = this.state
    const { tags } = this.props

    return (
      <div className='gfpdf-tags'>
        {
          tags.map((tag, index) => {
            const isActive = selectedTags.indexOf(tag.id) !== -1 ? ' active' : ''
            const classes = 'button button-secondary' + isActive

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

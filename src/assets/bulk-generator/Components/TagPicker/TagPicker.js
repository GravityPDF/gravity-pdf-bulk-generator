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
      selectedTags: this.getActiveTags(props.inputValue)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.inputValue !== this.props.inputValue) {
      this.setState({selectedTags: this.getActiveTags(nextProps.inputValue)})
    }
  }

  getActiveTags = (value) => {
    const selectedTags = []
    this.props.tags.map((tag) => {
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
    if (e.target.classList.contains('active')) {
      this.props.onDeselectCallback(tag.id)
    } else {
      this.props.onSelectCallback(tag.id)
    }
  }

  render () {

    return (
      <div className="gfpdf-tags">
        {
          this.props.tags.map((tag, index) => {
            const isActive = this.state.selectedTags.indexOf(tag.id) !== -1 ? ' active' : ''
            const classes = 'button button-secondary' + isActive

            return <button key={index} type="button" className={classes} onClick={(e) => this.tagClicked(this.props.tags[index], e)}>{tag.label}</button>
          })
        }
      </div>
    )
  }
}

export default TagPicker

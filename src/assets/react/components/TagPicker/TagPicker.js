import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getActiveTags } from '../../actions/tagPicker'

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

  componentDidMount () {
    this.props.getActiveTags(this.props.inputValue)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.inputValue !== this.props.inputValue) {
      this.props.getActiveTags(this.props.inputValue)
    }
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
      <div className='gfpdf-tags'>
        {
          this.props.tags.map((tag, index) => {
            const isActive = this.props.selectedTags.indexOf(tag.id) !== -1 ? ' active' : ''
            const classes = 'button button-secondary' + isActive

            return (
              <button
                key={index}
                type='button'
                className={classes}
                onClick={(e) =>
                  this.tagClicked(this.props.tags[index], e)}>
                {tag.label}
              </button>
            )
          })
        }
      </div>
    )
  }
}

const MapStateToProps = state => ({
  selectedTags: state.tagPicker.selectedTags
})

export default connect(MapStateToProps, { getActiveTags })(TagPicker)

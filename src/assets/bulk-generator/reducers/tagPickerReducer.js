import {
  UPDATE_DIRECTORY_STRUCTURE,
  GET_ACTIVE_TAGS,
  INCREMENT_PERCENRAGE
} from '../actionTypes/tagPicker'

export const initialState = {
  tags: [
    { id: '{entry_id}', label: 'Entry ID' },
    { id: '{date_created:format:Y}', label: 'Year' },
    { id: '{date_created:format:m}', label: 'Month' },
    { id: '{date_created:format:d}', label: 'Day' },
    { id: '{date_created:format:H}', label: 'Hour' },
    { id: '{date_created:format:i}', label: 'Minute' },
    { id: '{created_by:user_login}', label: 'User Login' },
    { id: '{created_by:user_email}', label: 'User Email' },
    { id: '{created_by:display_name}', label: 'User Display Name' },
    { id: '{entry:payment_status}', label: 'Payment Status' },
  ],
  directoryStructure: '/{entry_id}/',
  selectedTags: [],
  percentage: 0
}

export default function (state = initialState, action) {

  switch (action.type) {

    case UPDATE_DIRECTORY_STRUCTURE:
      return {
        ...state,
        directoryStructure: action.directoryStructure
      }

    case GET_ACTIVE_TAGS: {
      const selectedTags = []

      function escapeRegexString (string) {
        /* See https://stackoverflow.com/a/6969486/1614565 */
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      }

      state.tags.map(tag => {
        if (action.payload.match('/' + escapeRegexString(tag.id) + '/') !== null) {
          selectedTags.push(tag.id)
        }
      })

      return {
        ...state,
        selectedTags: selectedTags
      }
    }

    case INCREMENT_PERCENRAGE:
      let percentage = state.percentage + 1

      return {
        ...state,
        percentage: percentage
      }

  }

  return state
}

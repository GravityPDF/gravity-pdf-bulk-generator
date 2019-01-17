import {
  UPDATE_DIRECTORY_STRUCTURE,
} from '../actionTypes/tagPicker'

export const initialState = {
  tags: [
    {id: '{entry_id}', label: 'Entry ID'},
    {id: '{date_created:format:Y}', label: 'Year'},
    {id: '{date_created:format:m}', label: 'Month'},
    {id: '{date_created:format:d}', label: 'Day'},
    {id: '{date_created:format:H}', label: 'Hour'},
    {id: '{date_created:format:i}', label: 'Minute'},
    {id: '{created_by:user_login}', label: 'User Login'},
    {id: '{created_by:user_email}', label: 'User Email'},
    {id: '{created_by:display_name}', label: 'User Display Name'},
    {id: '{entry:payment_status}', label: 'Payment Status'},
  ],
  directoryStructure: '/{entry_id}/',
}

export default function (state = initialState, action) {

  switch (action.type) {

    case UPDATE_DIRECTORY_STRUCTURE:
      return {
        ...state,
        directoryStructure: action.directoryStructure
      }
  }

  return state
}
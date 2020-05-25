import React from 'react'
import { mount } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import ListContainer from '../../../../../assets/react/components/Logs/ListContainer'

describe('/react/components/Logs/ - ListContainer.js', () => {
  let wrapper
  let component

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = mount(<ListContainer logs={['', '', '']} className='text' />)
      component = findByTestAttr(wrapper, 'component-ListContainer')
    })

    test('renders <ListContainer /> component', () => {
      expect(component.length).toBe(1)
    })

    test('renders <List /> component', () => {
      expect(component.find('Memo(List)').length).toBe(3)
    })
  })
})

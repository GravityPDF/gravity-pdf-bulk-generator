import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import List from '../../../../../assets/react/components/Logs/List'

describe('/react/components/Logs/ - List.js', () => {
  let wrapper
  let component

  describe('Renders main component - ', () => {
    test('renders <List /> component', () => {
      wrapper = shallow(<List log='Text' title='Success' />)
      component = findByTestAttr(wrapper, 'component-List')

      expect(component.length).toBe(1)
      expect(component.text()).toContain('Text')
    })
  })
})

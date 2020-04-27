import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import LoadingDots from '../../../../../assets/react/components/LoadingDots/LoadingDots'

describe('/react/components/LoadingDots/ - LoadingDots.js', () => {
  let wrapper
  let component

  describe('Renders main component - ', () => {
    test('renders <LoadingDots /> component', () => {
      wrapper = shallow(<LoadingDots />)
      component = findByTestAttr(wrapper, 'component-LoadingDots')

      expect(component.length).toBe(1)
      expect(component.text()).toBe('...')
    })
  })
})

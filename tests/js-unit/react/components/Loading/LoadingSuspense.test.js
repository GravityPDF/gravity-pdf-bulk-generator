import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import LoadingSuspense from '../../../../../assets/react/components/Loading/LoadingSuspense'

describe('/react/components/Loading/ - LoadingSuspense.js', () => {
  let wrapper
  let component

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(<LoadingSuspense />)
      component = findByTestAttr(wrapper, 'component-LoadingSuspense')
    })

    test('renders <LoadingSuspense /> component', () => {
      expect(component.length).toBe(1)
    })

    test('renders <LoadingDots /> component', () => {
      expect(component.find('LoadingDots').length).toBe(1)
    })
  })
})

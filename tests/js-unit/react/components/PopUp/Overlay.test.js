import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { Overlay } from '../../../../../assets/react/components/PopUp/Overlay'

describe('/react/components/PopUp/ - Overlay.js', () => {

  let wrapper
  let component

  describe('Renders main component - ', () => {

    test('renders <Overlay /> component', () => {
      wrapper = shallow(<Overlay />)
      component = findByTestAttr(wrapper, 'component-Overlay')

      expect(component.length).toBe(1)
    })
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import ListToggle from '../../../../../assets/react/components/ListToggle/ListToggle'

describe('/react/components/ListToggle/ - ListToggle.js', () => {

  let wrapper
  let component
  const pdfList = [
    { id: '5e12aa36690bd', name: 'templateA', templateSelected: 'blank-slate', active: false },
    { id: '5e2e14d4f1601', name: 'templateB', templateSelected: 'blank-slate', active: false }
  ]
  // Mocked functions
  const togglePdfStatusMock = jest.fn()

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(<ListToggle items={pdfList} onChange={togglePdfStatusMock} />)
      component = findByTestAttr(wrapper, 'component-ListToggle')
    })

    test('renders <ListToggle /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('li').length).toBe(2)
      expect(component.find('label').length).toBe(2)
    })

    test('check toggle switch click and onChange event', () => {
      component.find('label').at(0).simulate('click')

      expect(togglePdfStatusMock).toHaveBeenCalledTimes(1)
    })

    test('renders <Switch /> component', () => {
      expect(component.find('ToggleSwitch').length).toBe(2)
    })
  })
})

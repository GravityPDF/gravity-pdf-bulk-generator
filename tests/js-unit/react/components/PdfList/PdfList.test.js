import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import PdfList from '../../../../../assets/react/components/PdfList/PdfList'

describe('/react/components/PdfList/ - PdfList.js', () => {
  let wrapper
  let component
  const data = {
    items: [
      { id: '5e12aa36690bd', name: 'templateA', templateSelected: 'blank-slate', active: false },
      { id: '5e2e14d4f1601', name: 'templateB', templateSelected: 'blank-slate', active: false }
    ],
    onChange: jest.fn(),
    screenReaderLabel: 'label'
  }
  const index = 1
  const style = {}

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(<PdfList data={data} index={index} style={style} />)
      component = findByTestAttr(wrapper, 'component-PdfList')
    })

    test('renders <PdfList /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('label').length).toBe(1)
    })

    test('check toggle switch onClick event', () => {
      component.find('label').simulate('click', index)

      expect(data.onChange).toHaveBeenCalledTimes(1)
    })

    test('check toggle switch onChange event', () => {
      component.find('lazy').simulate('change', index)

      expect(data.onChange).toHaveBeenCalledTimes(1)
    })

    test('renders lazy load <Switch /> component', () => {
      expect(component.find('Suspense').length).toBe(1)
      expect(component.find('lazy').length).toBe(1)
      expect(Object.keys(wrapper.find('lazy').props()).length).toBe(8)
    })
  })
})

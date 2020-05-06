import React from 'react'
import { mount } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import PdfListContainer from '../../../../../assets/react/components/PdfList/PdfListContainer'

describe('/react/components/PdfListContainer/ - PdfListContainer.js', () => {
  let wrapper
  let component
  const items = [
    { id: '5e12aa36690bd', name: 'templateA', templateSelected: 'blank-slate', active: false },
    { id: '5e2e14d4f1601', name: 'templateB', templateSelected: 'blank-slate', active: false }
  ]
  // Mocked functions
  const onChangeMock = jest.fn()

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = mount(
        <PdfListContainer items={items} onChange={onChangeMock} />
      )
      component = findByTestAttr(wrapper, 'component-PdfListContainer')
    })

    test('renders <PdfListContainer /> component', () => {
      expect(component.length).toBe(1)
    })

    test('renders <PdfList /> component', () => {
      expect(component.find('Memo(PdfList)').length).toBe(2)
    })
  })
})

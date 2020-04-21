import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import Step1Body from '../../../../../assets/react/components/Steps/Step1Body'

describe('/react/components/Steps/ - Step1Body.js', () => {
  let wrapper
  let component
  const pdfList = [{ id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false }]
  const directoryStructure = '/{date_created:format:Y}/{date_created:format:m}/'
  const tags = [{ id: '{entry_id}', label: 'Entry ID' }]
  // Mocked functions
  const togglePdfStatusMock = jest.fn()
  const updateDirectoryStructureMock = jest.fn()
  const tagSelectMock = jest.fn()
  const tagDeselectMock = jest.fn()

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Step1Body
          pdfList={pdfList}
          togglePdfStatus={togglePdfStatusMock}
          directoryStructure={directoryStructure}
          updateDirectoryStructure={updateDirectoryStructureMock}
          tags={tags}
          tagSelect={tagSelectMock}
          tagDeselect={tagDeselectMock}
        />
      )
      component = findByTestAttr(wrapper, 'component-Step1Body')
    })

    test('renders <Step1Body /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('h3').length).toBe(2)
      expect(component.find('p').length).toBe(3)
    })

    test('renders <ListToggle /> component', () => {
      expect(component.find('ListToggle').length).toBe(1)
    })

    test('renders <TagInput /> component', () => {
      expect(component.find('TagInput').length).toBe(1)
    })

    test('renders <TagPicker /> component', () => {
      expect(component.find('TagPicker').length).toBe(1)
    })
  })
})

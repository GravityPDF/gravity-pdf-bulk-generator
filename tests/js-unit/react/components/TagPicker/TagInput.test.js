import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import TagInput from '../../../../../assets/react/components/TagPicker/TagInput'

describe('/react/components/TagPicker/ - TagInput.js', () => {

  let wrapper
  let component
  let e
  const value = '/value'
  // Mocked functions
  const onChangeMock = jest.fn()

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(<TagInput value={value} onChange={onChangeMock} />)
      component = findByTestAttr(wrapper, 'component-TagInput')
    })

    test('renders <TagInput /> component', () => {
      expect(component.length).toBe(1)
    })

    test('should call onChange prop', () => {
      e = { preventDefault () {}, target: { value: 'the-value' } }
      component.find('input').simulate('change', e)

      expect(onChangeMock).toHaveBeenCalledTimes(1)
    })
  })
})

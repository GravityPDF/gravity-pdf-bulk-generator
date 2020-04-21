import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import TagPicker from '../../../../../assets/react/components/TagPicker/TagPicker'

describe('/react/components/TagPicker/ - TagPicker.js', () => {
  let wrapper
  let component
  let e
  let inst
  let escapeRegexStringMock
  let getActiveTags
  let tagClicked
  const tags = [{ id: '{entry_id}', label: 'Entry ID' }]
  const inputValue = '/{entry_id}/'
  // Mocked functions
  const onSelectCallbackMock = jest.fn()
  const onDeselectCallbackMock = jest.fn()

  describe('Lifecycle methods - ', () => {
    let prevProps
    let updateSelectedTags

    beforeEach(() => {
      wrapper = shallow(
        <TagPicker
          tags={tags}
          onSelectCallback={onSelectCallbackMock}
          onDeselectCallback={onDeselectCallbackMock}
          inputValue={inputValue}
        />
      )
      inst = wrapper.instance()
    })

    test('componentDidUpdate() - On update, set new state for selectedTags', () => {
      prevProps = { inputValue: '/{date_created:format:Y}/{date_created:format:m}/' }
      updateSelectedTags = jest.spyOn(inst, 'updateSelectedTags')
      inst.componentDidUpdate(prevProps)

      expect(updateSelectedTags).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component methods - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <TagPicker
          tags={tags}
          onSelectCallback={onSelectCallbackMock}
          onDeselectCallback={onDeselectCallbackMock}
          inputValue={inputValue}
        />
      )
      inst = wrapper.instance()
    })

    test('getActiveTags() -  Get selected active tags and store it into an array', () => {
      escapeRegexStringMock = jest.spyOn(inst, 'escapeRegexString')
      inst.getActiveTags(inputValue)

      expect(escapeRegexStringMock).toHaveBeenCalledTimes(1)
    })

    test('updateSelectedTags() - Update selectedTags state (condition: true)', () => {
      const prevInputValue = '/{date_created:format:Y}/{date_created:format:m}/'
      getActiveTags = jest.spyOn(inst, 'getActiveTags')
      inst.updateSelectedTags(prevInputValue)

      expect(getActiveTags).toHaveBeenCalledTimes(1)
      expect(wrapper.state('selectedTags')).toEqual(['{entry_id}'])
    })

    test('updateSelectedTags() - Update selectedTags state (condition: false)', () => {
      const prevInputValue = '/{entry_id}/'
      getActiveTags = jest.spyOn(inst, 'getActiveTags')
      inst.updateSelectedTags(prevInputValue)

      expect(getActiveTags).toHaveBeenCalledTimes(0)
    })

    test('tagClicked() - Common tags event click listener for active', () => {
      e = { target: { classList: ['active'] } }
      inst.tagClicked(tags, e)

      expect(onDeselectCallbackMock).toHaveBeenCalledTimes(1)
    })

    test('tagClicked() - Common tags event click listener for inactive', () => {
      e = { target: { classList: [] } }
      inst.tagClicked(tags, e)

      expect(onSelectCallbackMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <TagPicker
          tags={tags}
          onSelectCallback={onSelectCallbackMock}
          onDeselectCallback={onDeselectCallbackMock}
          inputValue={inputValue}
        />
      )
      component = findByTestAttr(wrapper, 'component-TagPicker')
    })

    test('renders <TagPicker /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('button').length).toBe(1)
    })

    test('check tag picker button click', () => {
      e = { target: { classList: ['active'] } }
      inst = wrapper.instance()
      tagClicked = jest.spyOn(inst, 'tagClicked')
      component.find('button').simulate('click', e)

      expect(tagClicked).toHaveBeenCalledTimes(1)
    })
  })
})

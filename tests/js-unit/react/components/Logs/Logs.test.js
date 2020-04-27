import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { Logs } from '../../../../../assets/react/components/Logs/Logs'

describe('/react/components/Logs/ - Logs.js', () => {
  let wrapper
  let component
  let inst
  let generatePdfSuccess = [{}]
  let generatePdfFailed = [{}]
  let generatePdfWarning = [{}]

  describe('Component methods - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Logs
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning}
        />
      )
      inst = wrapper.instance()
    })

    test('toggleSuccess() - Toggle success log state', () => {
      inst.toggleSuccess()

      expect(wrapper.state('success')).toBe(true)
      expect(wrapper.state('errors')).toBe(false)
      expect(wrapper.state('warnings')).toBe(false)
    })

    test('toggleErrors() - Toggle errors log state', () => {
      inst.toggleErrors()

      expect(wrapper.state('success')).toBe(false)
      expect(wrapper.state('errors')).toBe(true)
      expect(wrapper.state('warnings')).toBe(false)
    })

    test('toggleWarnings() - Toggle warnings log state', () => {
      inst.toggleWarnings()

      expect(wrapper.state('success')).toBe(false)
      expect(wrapper.state('errors')).toBe(false)
      expect(wrapper.state('warnings')).toBe(true)
    })
  })

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Logs
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning}
        />
      )
    })

    test('renders <Logs /> component', () => {
      component = findByTestAttr(wrapper, 'component-Logs')

      expect(component.length).toBe(1)
    })

    test('renders success <InfoBox /> component', () => {
      generatePdfSuccess = [{}, {}]
      wrapper = shallow(
        <Logs
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning}
        />
      )
      component = findByTestAttr(wrapper, 'component-success-InfoBox')

      expect(component.length).toBe(1)
    })

    test('renders errors/failed <InfoBox /> component', () => {
      generatePdfFailed = [{}, {}]
      wrapper = shallow(
        <Logs
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning}
        />
      )
      component = findByTestAttr(wrapper, 'component-failed-InfoBox')

      expect(component.length).toBe(1)
    })

    test('renders warnings <InfoBox /> component', () => {
      generatePdfWarning = [{}, {}]
      wrapper = shallow(
        <Logs
          generatePdfSuccess={generatePdfSuccess}
          generatePdfFailed={generatePdfFailed}
          generatePdfWarning={generatePdfWarning}
        />
      )
      component = findByTestAttr(wrapper, 'component-warning-InfoBox')

      expect(component.length).toBe(1)
    })
  })
})

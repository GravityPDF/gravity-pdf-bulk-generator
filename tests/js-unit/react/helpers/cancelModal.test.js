import { cancelModal } from '../../../../assets/react/helpers/cancelModal'

describe('/react/helpers/ - cancelModal.js', () => {
  let history
  const e = { preventDefault () {} }
  const fatalError = false

  test('should check current step path and fire confirm alert', () => {
    history = { location: { pathname: '/step/2' }, push: jest.fn() }
    jest.spyOn(window, 'confirm').mockImplementation(() => {})
    cancelModal({ e, fatalError, history })

    expect(window.confirm).toHaveBeenCalledTimes(1)
  })

  test('should fire history.push', () => {
    history = { location: { pathname: '/step/3' }, push: jest.fn() }
    cancelModal({ e, fatalError, history })

    expect(history.push).toHaveBeenCalledTimes(1)
  })
})

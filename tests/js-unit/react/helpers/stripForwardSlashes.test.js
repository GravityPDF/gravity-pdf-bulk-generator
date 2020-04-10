import { stripForwardSlashes } from '../../../../assets/react/helpers/stripForwardSlashes'

describe('/react/helpers/ - stripForwardSlashes.js', () => {

  test('should strip out forward slashes \'/\' in a string', () => {
    expect(stripForwardSlashes('//{date_creat///ed:format:Y}///{date_created:format//:/m}/')).toBe('/{date_created:format:Y}/{date_created:format:m}/')
  })

  test('should return the string as is if it does not match the pattern', () => {
    expect(stripForwardSlashes('/path')).toBe('/path')
  })
})

import { stripOutSlashes } from '../../../../assets/react/helpers/stripOutSlashes'

describe('/react/helpers/ - stripForwardSlashes.js', () => {

  test('should strip out forward slashes \'/\' in a string', () => {
    expect(stripOutSlashes('//{date_creat///ed:format:Y}///{date_created:format//:/m}/')).toBe('/{date_created:format:Y}/{date_created:format:m}')
  })

  test('should return the string as is if it does not match the pattern', () => {
    expect(stripOutSlashes('/path')).toBe('/path')
  })
})

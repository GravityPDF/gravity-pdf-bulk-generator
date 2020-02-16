// Cookie Authentication
const nonce = GPDF_BULK_GENERATOR.nonce

export const apiRequestAllEntriesId = async ({ formId, filterData }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/search/${formId}/entries`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(filterData)
  })

  const result = await response.json()

  return result
}

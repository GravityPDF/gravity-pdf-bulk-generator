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

export const apiRequestSessionId = async ({ path, concurrency }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/register`

  const response  = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ 'path': path, 'concurrency': concurrency })
  })

  const result = await response.json()

  return result
}

export const apiRequestGeneratePdf = async ({ payload, signal }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/create`

  const response = await fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(payload)
  })

  const result = await response

  return result
}

export const apiRequestGeneratePdfZip = async sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/zip/${sessionId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    }
  })

  const result = await response

  return result
}

export const apiRequestDownloadZip = async sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/download/${sessionId}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/zip',
      'X-WP-Nonce': nonce
    }
  })

  const result = await response

  return result
}

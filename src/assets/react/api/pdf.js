export const apiRequestSessionID = async path => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/register`

  const response  = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'path': path, 'concurrency': '5' })
  })

  const result = await response.json()

  return result
}

export const apiRequestGeneratePDF = async data => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/create`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const result = await response

  return result
}

export const apiRequestDownloadZip = async sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/download/${sessionId}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Disposition': 'attachment; filename="archive.zip"',
      'Content-Type': 'application/zip'
    }
  })

  const result = await response

  return result
}

export const apiRequestAllEntriesID = async formID => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/search/${formID}/entries`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await response.json()

  return result
}

export const apiRequestGeneratePdfZip = async sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/zip/${sessionId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await response

  return result
}

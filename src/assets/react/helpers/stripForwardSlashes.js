export function stripForwardSlashes(directoryStructure) {
  const matchPattern = directoryStructure.match(/\{(.*?)\}/g)
  const structureArray = []

  if (matchPattern) {
    matchPattern.map(item => {
      structureArray.push('/' + item.replace(/[/]/g, ''))
    })

    return structureArray.join('') + '/'
  }

  return directoryStructure
}

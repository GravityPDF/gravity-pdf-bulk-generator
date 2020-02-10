export function stripForwardSlashes(directoryStructure) {
  const matchPattern = directoryStructure.match(/\{(.*?)\}/g)
  const structureArray = []

  matchPattern.map(item => {
    structureArray.push('/' + item.replace(/[/]/g, ''))
  })

  return structureArray.join('') + '/'
}

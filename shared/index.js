//
// Files in this directory are the only code shared between both client and server.
// As such, code here should remain very simple. Constants. Stateless methods. Nothing too fancy.
//

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

// adapted from https://stackoverflow.com/a/1203361
function getExtension (filename) {
  // console.log(`getExtension: filename is ${filename} with type ${typeof filename}`)
  return filename.split('.').pop()
}

export { snooze, getExtension }

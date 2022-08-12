
const EMAIL_REGEX = /^[A-Z\d][A-Z\d._%+-]*@[A-Z\d.-]+\.[A-Z]{2,6}$/i

function isExactRegexMatch (value, regex) {
  const match = value.match(regex)
  return match && match.length === 1 && match[0].length === value.length
}

function isValidEmail (value) {
  return isExactRegexMatch(value, EMAIL_REGEX)
}

// find valid emails in some muck
// if muck is a string, it is split into tokens: whitespace, commas and angle-brackets. it is now an array
// when muck is an array, things that are not email addresses are filtered out
// when muck is neither a string nor an array, an empty array is returned
function findValidEmails (muck, splitOn = /[\s,<>]+/g) {
  const list = (typeof muck === 'string')
    ? muck.split(splitOn)
    : Array.isArray(muck)
      ? muck
      : []
  return list.filter(e => isValidEmail(e))
}

export {
  EMAIL_REGEX,
  isExactRegexMatch, isValidEmail, findValidEmails
}

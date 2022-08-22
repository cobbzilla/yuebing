const vv = require('vee-validate')

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

const VALIDATIONS = {
  email: {
    required: true,
    min: 2,
    max: 100,
    email: true,
    checkOnUpdate: false
  },
  password: {
    required: true,
    min: 8,
    max: 100,
    checkOnUpdate: false
  },
  firstName: {
    required: false,
    min: 2,
    max: 100
  },
  lastName: {
    required: false,
    min: 2,
    max: 100
  },
  locale: {
    required: true
  }
}

function validate (thing, isUpdate = false, rules = VALIDATIONS) {
  const errors = {}
  for (const field in Object.keys(thing)) {
    if (rules[field]) {
      if (isUpdate && rules[field].checkOnUpdate && rules[field].checkOnUpdate === false) {
        continue
      }
      const fieldErrors = vv.validate(thing[field], rules[field])
      if (fieldErrors) {
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(...fieldErrors)
      }
    }
  }
  return errors
}

const RULE_FIELDS = ['min', 'max', 'required', 'email', 'integer', 'one_of']
function condenseFieldRules (fieldValidations) {
  let result = ''
  for (const rule of RULE_FIELDS) {
    if (fieldValidations[rule]) {
      if (result.length > 0) {
        result += '|'
      }
      result += rule + ':' + fieldValidations[rule]
    }
  }
  return result
}

function condensedRules () {
  const condensed = {}
  for (const field of Object.keys(VALIDATIONS)) {
    condensed[field] = condenseFieldRules(VALIDATIONS[field])
  }
  return condensed
}

module.exports = {
  EMAIL_REGEX,
  isExactRegexMatch,
  isValidEmail,
  findValidEmails,
  validate,
  condensedRules
}

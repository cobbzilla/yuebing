const vv = require('vee-validate')

const EMAIL_REGEX = /^[A-Z\d][A-Z\d._%+-]*@[A-Z\d.-]+\.[A-Z]{2,6}$/i

// Sometimes we need regex validation and the regex contains a pipe character.
// The pipe breaks vee-validation rule parsing, so we use these custom rules.
const REGEX_VALIDATORS = {
  url: /^(https?):\/\/[-a-zA-Z\d+&@#/%?=~_|!:,.;]*[-a-zA-Z\d+&@#/%=~_|]$/,
  host: /([A-Zd]{1,63}|[A-Zd][A-Zd-]{0,61}[A-Zd])(.([A-Zd]{1,63}|[A-Zd][A-Zd-]{0,61}[A-Zd]))*/
}

function extendVee (vee) {
  for (const field of Object.keys(REGEX_VALIDATORS)) {
    vv.extend(field, {
      getMessage (field, val) { return 'invalid' },
      validate (value, field) {
        if (!field) {
          console.warn('validate: no field provided, returning true')
          return true
        }
        try {
          return REGEX_VALIDATORS[field].test(value)
        } catch (e) {
          console.error(`validate(field=${field}) error: ${e}`)
          return false
        }
      }
    })
  }
}

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

const RULE_FIELDS = ['min', 'max', 'required', 'integer', 'email']
RULE_FIELDS.push(...Object.keys(REGEX_VALIDATORS))

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
  REGEX_VALIDATORS,
  isExactRegexMatch,
  extendVee,
  isValidEmail,
  findValidEmails,
  validate,
  condensedRules
}

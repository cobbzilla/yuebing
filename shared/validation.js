const vv = require('vee-validate')
const rules = require('vee-validate/dist/rules')

const EMAIL_REGEX = /^[A-Z\d][A-Z\d._%+-]*@[A-Z\d.-]+\.[A-Z]{2,6}$/i

const URL_PART_REGEX = /[A-Z\d.-_]+/i

// we exclude some legal path chars that might be useful for injection attacks
const PATH_REGEX = /[A-Z\d-._()+=:@/]*/i

// Sometimes we need regex validation and the regex contains a pipe character.
// The pipe breaks vee-validation rule parsing, so we use these custom rules.
const REGEX_VALIDATORS = {
  locale: /[a-z]{2}_[A-Z]{2}/,
  host: /([A-Z\d]{1,63}|[A-Z\d][A-Z\d-]{0,61}[A-Z\d])(.([A-Z\d]{1,63}|[A-Z\d][A-Z\d-]{0,61}[A-Z\d]))*/i,
  url: /^https?:\/\/[A-Z\d]+(\.[-A-Z\d]+)+(:\d{2,5})?(\/[A-Z\d.+&@#/%=~_|]*)?$/i,
  source: URL_PART_REGEX,
  path: PATH_REGEX
}

function extendVee () {
  for (const [rule, validation] of Object.entries(rules)) {
    // noinspection TypeScriptValidateTypes
    vv.extend(rule, Object.assign({}, { ...validation }, { message: rule }))
  }

  for (const ruleName of Object.keys(REGEX_VALIDATORS)) {
    vv.extend(ruleName, {
      message (field, val) { return 'invalid' },
      validate (value, field) {
        if (!field) {
          console.warn('validate: no field provided, returning true')
          return true
        }
        try {
          return REGEX_VALIDATORS[ruleName].test(value)
        } catch (e) {
          console.warn(`validate(field=${field}) error: ${e}`)
          return false
        }
      }
    })
  }
}
extendVee()

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
  },
  source: {
    required: true,
    source: true,
    min: 3,
    max: 100
  },
  encryptionKey: {
    required: true,
    min: 16,
    max: 1024
  },
  encryptionIV: {
    min: 16,
    max: 1024
  },
  readPath: {
    path: true,
    max: 1024
  },
  writePath: {
    path: true,
    max: 1024
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

const RULE_FIELDS = [
  'min', 'max', 'min_value', 'max_value', 'required', 'integer', 'email'
]
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

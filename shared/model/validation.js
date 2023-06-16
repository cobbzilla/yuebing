const vv = require('vee-validate')
const rules = require('vee-validate/dist/rules')

const EMAIL_REGEX = /^[A-Z\d][A-Z\d._%+-]*@[A-Z\d.-]+\.[A-Z]{2,24}$/i

// const URL_PART_REGEX = /[A-Z\d._-]+/i

// we exclude some legal path chars that might be useful for injection attacks
const PATH_REGEX = /[A-Z\d-._()+=:@/]*/i

// Sometimes we need regex validation and the regex contains a pipe character.
// The pipe breaks vee-validation rule parsing, so we use these custom rules.
const REGEX_VALIDATORS = {
  locale: /^[a-z]{2,3}(_[A-Z]{2,3})?$/,
  username: /^[A-Z][A-Z\d-._]+$/i,
  email: EMAIL_REGEX,
  host: /^([A-Z\d]{1,63}|[A-Z\d][A-Z\d-]{0,61}[A-Z\d])(.([A-Z\d]{1,63}|[A-Z\d][A-Z\d-]{0,61}[A-Z\d]))*$/i,
  url: /^https?:\/\/[A-Z\d]+(\.[-A-Z\d]+)+(:\d{2,5})?(\/[A-Z\d.+&@#/%=~_|]*)?$/i,
  raw_hex: /^[\dA-F]+$/i,
  hex: /^(0x)?[\dA-F]+$/i,
  volume: /^[A-Z\d._-]+$/i,
  local_path: /^[A-Z\d ()=.,_+@/-]+$/i,
  file_mode: /^[01][0-7]{3}$/,
  aws_key: /^AKIA[A-Z\d]{16}$/,
  aws_secret: /^[A-Z\d/+=]{40}$/,
  s3_bucket: /^[a-z\d.-]{3,63}$/,
  b2_bucket: /$[a-z\d-]{6,63}$/i,
  path: PATH_REGEX
}

function extendVee () {
  for (const [rule, validation] of Object.entries(rules)) {
    // noinspection TypeScriptValidateTypes
    vv.extend(rule, Object.assign({}, { ...validation }, { message: rule }))
  }

  for (const ruleName of Object.keys(REGEX_VALIDATORS)) {
    vv.extend(ruleName, {
      message () { return 'invalid' },
      validate (value, field) {
        if (!field) {
          // console.warn('validate: no field provided, returning true')
          return true
        }
        try {
          return REGEX_VALIDATORS[ruleName].test(value)
        } catch (e) {
          // console.warn(`validate(field=${field}) error: ${e}`)
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
  username: {
    required: true,
    min: 2,
    max: 100,
    username: true,
    checkOnUpdate: false
  },
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
  readPath: {
    path: true,
    max: 1024
  },
  writePath: {
    path: true,
    max: 1024
  }
}

async function validate (thing, isUpdate = false, rules = VALIDATIONS) {
  const errors = {}
  for (const field of Object.keys(thing)) {
    if (rules[field]) {
      if (isUpdate && rules[field].checkOnUpdate && rules[field].checkOnUpdate === false) {
        continue
      }
      const fieldErrors = await vv.validate(thing[field], rules[field])
      if (fieldErrors && !fieldErrors.valid && fieldErrors.errors && Array.isArray(fieldErrors.errors) && fieldErrors.errors.length > 0) {
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(...fieldErrors.errors)
      }
    }
  }
  return errors
}

const NUMERIC_RULE_FIELDS = ['min', 'max', 'min_value', 'max_value']
const RULE_FIELDS = [...NUMERIC_RULE_FIELDS, 'required', 'integer', 'email']
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

function condensedRules (rules = VALIDATIONS) {
  const condensed = {}
  for (const field of Object.keys(rules)) {
    condensed[field] = condenseFieldRules(rules[field])
  }
  return condensed
}

function expandedRules (condensed) {
  const expanded = {}
  for (const field of Object.keys(condensed)) {
    expanded[field] = Object.assign({}, condensed[field])
    delete expanded[field].rules
    if ('rules' in condensed[field] && typeof condensed[field].rules === 'string') {
      for (const rulePart of condensed[field].rules.split('|')) {
        const colonPos = rulePart.indexOf(':')
        if (colonPos > 0 && colonPos < rulePart.length - 1) {
          const ruleName = rulePart.substring(0, colonPos)
          const ruleValue = rulePart.substring(colonPos + 1)
          expanded[field][ruleName] = NUMERIC_RULE_FIELDS.includes(ruleName) ? parseInt(ruleValue) : ruleValue
        } else if (colonPos === -1) {
          expanded[field][rulePart] = true
        }
      }
    }
  }
  return expanded
}

module.exports = {
  EMAIL_REGEX,
  REGEX_VALIDATORS,
  isValidEmail,
  findValidEmails,
  validate,
  condensedRules,
  expandedRules
}

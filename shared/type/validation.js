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

module.exports = {
  EMAIL_REGEX,
  REGEX_VALIDATORS,
  isValidEmail,
  findValidEmails
}

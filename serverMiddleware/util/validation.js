function addValidationError (errors, field, error) {
  if (!(field in Object.keys(errors))) {
    errors[field] = []
  }
  errors[field].push(error)
}

function validateField (obj, field, validation, errors) {
  const fieldValue = obj[field]
  const fieldPresent = typeof fieldValue === 'string' && fieldValue.trim().length > 0

  if (validation.required && !fieldPresent) {
    addValidationError(errors, field, `${field} is required`)
  }
  if (fieldPresent) {
    if (validation.min && fieldValue.trim().length < validation.min) {
      addValidationError(errors, field, `${field} is too short (min ${validation.min})`)
    } else if (validation.max && fieldValue.trim().length > validation.max) {
      addValidationError(errors, field, `${field} is too long (max ${validation.max})`)
    }
  }
  // console.log(`validated ${field} with value ${fieldValue} and errors = ${JSON.stringify(errors)}`)
  return errors
}

function validateObject (obj, validations) {
  // console.log(`validateObject: starting with obj=${JSON.stringify(obj)} validations=${JSON.stringify(validations)}`)
  const errors = {}
  Object.keys(validations).forEach((field) => {
    console.log(`validateObject: examining field ${field}, validations[${field}] = ${JSON.stringify(validations[field])}`)
    validateField(obj, field, validations[field], errors)
  })
  return errors
}

export { validateObject }

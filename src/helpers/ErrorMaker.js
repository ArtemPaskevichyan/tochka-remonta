const ERROR_CODES = {
    emailValidationFailed: 432,
    passwordValidationFailed: 433,
}

function createError(message, code) {
    var error = Error()
    error.message = message
    error.code = code
    return error
}
export { createError, ERROR_CODES }
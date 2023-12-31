const yup = require('yup')
const BaseError = require('../utils/baseError')
const ValidationError = require('mongoose')

const errorHandler = (err, req, res) => {
  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(undefined, err.message))
  }

  if (err instanceof yup.ValidationError) {
    const param = Object.keys(err.details[0])[0]
    const msg = err.details[0][param]
    return res.status(err.statusCode).json(createErrorResponse(param, msg))
  }

  if (err instanceof SyntaxError) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(undefined, err.message))
  }

  if (err instanceof ValidationError) {
    const param = err.fields[0]
    const msg = err.errors[0].message
    return res.status(400).json(createErrorResponse(param, msg))
  }

  return res.status(500).json(createErrorResponse(undefined, err.message))
}

const createErrorResponse = (param, message) => ({
  message,
  param
})

const ErrorHandler = (err, req, res) => {
  const errStatus = err.statusCode || 500
  const errMsg = err.message || 'Something went wrong'
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg
  })
}

const pageNotFoundHandler = (req, res) =>
  res.status(404).json(createErrorResponse(undefined, 'Route not found'))

module.exports = { errorHandler, pageNotFoundHandler, ErrorHandler }

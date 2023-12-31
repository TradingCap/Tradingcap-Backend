var express = require('express')
var router = express.Router()
const { validate } = require('express-yup')
const authValidator = require('../../validations/authValidation')
const authController = require('../../controllers/authController')

router.post(
  '/sign-up',
  validate(authValidator.signupSchema),
  authController.signup
)

router.post(
  '/sign-in',
  validate(authValidator.signinSchema),
  authController.signin
)

router.post('/sign-out', authController.signout)

router.post(
  '/send-email-comfirmation',
  validate(authValidator.sendEmailConfirmation),
  authController.sendEmailConfirmation
)

router.post(
  '/send-password-reset',
  validate(authValidator.sendPasswordResetOtp),
  authController.sendPasswordResetOtp
)

router.post(
  '/resend-password-reset',
  validate(authValidator.sendPasswordResetOtp),
  authController.resendPasswordResetOtp
)

router.post(
  '/verify-reset-password',
  validate(authValidator.verifyResetPassword),
  authController.verifyResetPassword
)

router.put(
  '/update-password',
  validate(authValidator.updatePassword),
  authController.updatePassword
)

router.post(
  '/verify-email-confirmation',
  validate(authValidator.verifyEmailConfirmation),
  authController.verifyEmailConfirmation
)

module.exports = router

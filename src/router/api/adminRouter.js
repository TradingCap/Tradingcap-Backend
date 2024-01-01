var express = require('express')
var router = express.Router()
const { validate } = require('express-yup')
const adminValidator = require('../../validations/adminVallidation')
const adminController = require('../../controllers/adminController')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post(
  '/sign-up',
  validate(adminValidator.signupSchema),
  adminController.signup
)

router.post(
  '/sign-in',
  validate(adminValidator.signinSchema),
  adminController.signin
)

router.get(
  '/get-user-payment/:transactionId',
  authMiddleware.verifyAdmin,
  adminController.getUserPayment
)

router.put(
  '/update-payment/:transactionId',
  authMiddleware.verifyAdmin,
  adminController.updateUser
)

module.exports = router
